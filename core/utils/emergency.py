import uuid, datetime, json
from database import users_collection, contacts_collection, alerts_collection
from geopy.geocoders import Nominatim
from config import config
import logging
import smtplib
from email.message import EmailMessage
import mimetypes

logger = logging.getLogger(__name__)

def get_address(lat, lon):
    try:
        geo = Nominatim(user_agent="safety_guardian")
        loc = geo.reverse(f"{lat}, {lon}")
        return loc.address if loc else "Unknown"
    except:
        return "Unknown"
    

def send_email_with_attachment(to_email, subject, body, attachment_path):
    msg = EmailMessage()
    msg["From"] = config.EMAIL_SENDER
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.set_content(body)

    if attachment_path:
        mime_type, _ = mimetypes.guess_type(attachment_path)
        mime_type, mime_subtype = mime_type.split("/")

        with open(attachment_path, "rb") as f:
            msg.add_attachment(
                f.read(),
                maintype=mime_type,
                subtype=mime_subtype,
                filename=attachment_path.split("/")[-1]
            )

    with smtplib.SMTP(config.SMTP_SERVER, config.SMTP_PORT) as server:
        server.starttls()
        server.login(config.EMAIL_SENDER, config.EMAIL_PASSWORD)
        server.send_message(msg)


def notify_contacts(user_id, contacts, video_path, address, risk_level):
    from twilio.rest import Client

    client = Client(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN)

    for c in contacts:
        # 📧 Email
        if c.get("email"):
            try:
                send_email_with_attachment(
                    to_email=c["email"],
                    subject=f"🚨 Emergency Alert ({risk_level})",
                    body=f"User is in danger at {address}",
                    attachment_path=video_path
                )
            except Exception as e:
                logger.error(f"Email failed for {c['email']}: {e}")

        # 📞 Call
        if c.get("phone"):
            try:
                client.calls.create(
                    to=c["phone"],
                    from_=config.TWILIO_PHONE_NUMBER,
                    twiml=f"""
                    <Response>
                        <Say voice="alice">
                            Emergency alert. Location is {address}.
                        </Say>
                    </Response>
                    """
                )
            except Exception as e:
                logger.error(f"Call failed for {c['phone']}: {e}")


def handle_emergency(
    user_id,
    risk_level,
    location,
    background_tasks,
    video_path=None,
    keywords=None
):
    user = users_collection.find_one({"_id": user_id})
    if not user:
        return {"success": False, "message": "User not found"}

    contacts = list(contacts_collection.find({"user_id": user_id}))
    address = get_address(location["latitude"], location["longitude"])

    alert_id = str(uuid.uuid4())

    # ✅ Save alert immediately
    alerts_collection.insert_one({
        "_id": alert_id,
        "user_id": user_id,
        "risk_level": risk_level,
        "location": location,
        "address": address,
        "video_path": video_path,
        "keywords": keywords or [],
        "timestamp": datetime.datetime.utcnow()
    })

    # 🔥 Run notifications in background
    background_tasks.add_task(
        notify_contacts,
        user_id,
        contacts,
        video_path,
        address,
        risk_level
    )

    return {
        "success": True,
        "alert_id": alert_id,
        "actions": ["Notifications queued"]
    }
