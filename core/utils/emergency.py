import uuid, datetime, json
from database import users_collection, contacts_collection, alerts_collection
from geopy.geocoders import Nominatim

def get_address(lat, lon):
    try:
        geo = Nominatim(user_agent="safety_guardian")
        loc = geo.reverse(f"{lat}, {lon}")
        return loc.address if loc else "Unknown"
    except:
        return "Unknown"

def handle_emergency(user_id, risk_level, location, video_path=None, keywords=None):
    user = users_collection.find_one({"_id": user_id})
    if not user:
        return {"success": False, "message": "User not found"}

    contacts = list(contacts_collection.find({"user_id": user_id}))
    address = get_address(location["latitude"], location["longitude"])

    actions = []

    for c in contacts:
        if c.get("email"):
            actions.append(f"Email sent to {c['name']}")
        if c.get("phone"):
            actions.append(f"SMS sent to {c['name']}")

    alert_id = str(uuid.uuid4())

    alerts_collection.insert_one({
        "_id": alert_id,
        "user_id": user_id,
        "risk_level": risk_level,
        "location": location,
        "address": address,
        "video_path": video_path,
        "keywords": keywords or [],
        "actions": actions,
        "timestamp": datetime.datetime.utcnow()
    })

    return {"success": True, "alert_id": alert_id, "actions": actions}
