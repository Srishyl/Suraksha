from fastapi import APIRouter, Depends, HTTPException, File, Form, UploadFile
from datetime import datetime
import uuid
from database import contacts_collection, alerts_collection
import os
from models import EmergencyContactsPayload
import uuid
from security import get_current_user
from utils.emergency import handle_emergency
from utils.audio import calculate_final_risk, detect_scream
import json
import shutil
from config import config

router = APIRouter()

@router.post("/emergency")
def add_emergency_contacts(
    payload: EmergencyContactsPayload,
    current_user=Depends(get_current_user)
):
    user_id = str(current_user["_id"])

    for contact in payload.contacts:
        data = contact.model_dump(exclude_unset=True)

        # Identify contact uniquely (phone OR email)
        query = {
            "user_id": user_id,
            "$or": [
                {"phone": data.get("phone")},
                {"email": data.get("email")}
            ]
        }

        existing = contacts_collection.find_one(query)

        # Enforce only one primary contact
        if data.get("is_primary"):
            contacts_collection.update_many(
                {"user_id": user_id},
                {"$set": {"is_primary": False}}
            )

        if existing:
            contacts_collection.update_one(
                {"_id": existing["_id"]},
                {"$set": data}
            )
        else:
            contacts_collection.insert_one({
                "_id": str(uuid.uuid4()),
                "user_id": user_id,
                **data
            })

    return {"success": True}

@router.get("/contacts")
def get_emergency_contacts(
    current_user=Depends(get_current_user)
):
    user_id = str(current_user["_id"])

    contacts = list(
        contacts_collection.find(
            {"user_id": user_id},
            {"_id": 0, "user_id": 0}
        )
    )

    return {
        "count": len(contacts),
        "contacts": contacts
    }


@router.get("/alerts")
def get_alerts(
    current_user=Depends(get_current_user)
):
    user_id = str(current_user["_id"])

    alerts = list(
        alerts_collection.find(
            {"user_id": user_id},
            {"_id": 1, "risk_level": 1, "timestamp": 1}
        )
    )

    return {"success": True, "alerts": alerts}


@router.post("/alerts")
def create_alert(
    video: UploadFile = File(None),
    audio: UploadFile = File(None),
    location: str = Form(...),  # JSON string
    risk_level: str = Form(""),  # optional override
    current_user=Depends(get_current_user)
):
    user_id = str(current_user["_id"])
    
    video_path = None
    audio_path = None

    # ---------- Save video ----------
    os.makedirs(config.UPLOAD_DIR, exist_ok=True)
    
    if video:
        video_name = f"{uuid.uuid4()}_{video.filename}"
        video_path = os.path.join(config.UPLOAD_DIR, video_name)

        with open(video_path, "wb") as f:
            shutil.copyfileobj(video.file, f)

    # ---------- Save audio ----------
    if audio:
        audio_name = f"{uuid.uuid4()}_{audio.filename}"
        audio_path = os.path.join(config.UPLOAD_DIR, audio_name)

        with open(audio_path, "wb") as f:
            shutil.copyfileobj(audio.file, f)

    # ---------- Parse location ----------
    try:
        location_data = json.loads(location)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid location")

    # ---------- Audio-based risk analysis ----------
    detected_risk = "RISK" # Default low risk if no audio
    scream_detected = False
    
    if audio_path:
        try:
            detected_risk = calculate_final_risk(audio_path)
            scream_detected = detect_scream(audio_path)
        except Exception as e:
            print(f"Error processing audio: {e}")

    # Allow manual risk override only if provided
    final_risk = risk_level.upper() if risk_level else detected_risk

    # ---------- Handle emergency ----------
    result = handle_emergency(
        user_id=user_id,
        risk_level=final_risk,
        location=location_data,
        video_path=video_path,
        keywords=[],  # no longer used, kept for compatibility
    )

    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])

    return {
        "success": True,
        "alert_id": result["alert_id"],
        "risk_level": final_risk,
        "scream_detected": scream_detected,
        "actions": result["actions"]
    }
