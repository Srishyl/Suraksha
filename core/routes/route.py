from fastapi import APIRouter, Depends, HTTPException, File, Form, UploadFile
from datetime import datetime
import uuid
from database import contacts_collection, alerts_collection
import os
from security import get_current_user
import shutil
from config import config

router = APIRouter()

@router.post("/contacts")
def save_contacts(
    payload: dict,
    current_user=Depends(get_current_user)
):
    user_id = str(current_user["_id"])

    # Remove existing contacts for user
    contacts_collection.delete_many({"user_id": user_id})

    for c in payload.get("contacts", []):
        c["_id"] = str(uuid.uuid4())
        c["user_id"] = user_id
        contacts_collection.insert_one(c)

    return {"success": True}


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


@router.post("/upload_video")
def upload_video(
    video: UploadFile = File(...),
    location: str = Form(...),
    risk_level: str = Form(""),
    current_user=Depends(get_current_user)
):
    user_id = str(current_user["_id"])

    # Validate extension
    ext = video.filename.split(".")[-1].lower()
    if ext not in config.ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="File type not allowed")

    # Validate size
    max_size = config.MAX_FILE_SIZE_MB * 1024 * 1024
    video.file.seek(0, os.SEEK_END)
    size = video.file.tell()
    video.file.seek(0)

    if size > max_size:
        raise HTTPException(status_code=400, detail="File too large")

    # Ensure upload dir exists
    os.makedirs(config.UPLOAD_DIR, exist_ok=True)

    filename = f"{uuid.uuid4()}_{video.filename}"
    path = os.path.join(config.UPLOAD_DIR, filename)

    with open(path, "wb") as f:
        shutil.copyfileobj(video.file, f)

    alerts_collection.insert_one({
        "_id": str(uuid.uuid4()),
        "user_id": user_id,
        "video_path": path,
        "location": location,
        "risk_level": risk_level,
        "timestamp": datetime.utcnow()
    })

    return {"success": True, "video_path": path}
