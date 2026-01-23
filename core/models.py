from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict

class RegisterUser(BaseModel):
    name: str
    email: EmailStr
    password: str

class LoginUser(BaseModel):
    email: EmailStr
    password: str

class EmergencyContact(BaseModel):
    name: str
    phone: Optional[str]
    email: Optional[EmailStr]
    is_primary: bool = False

class Location(BaseModel):
    latitude: float
    longitude: float

class AlertRequest(BaseModel):
    user_id: str
    risk_level: str
    location: Location
    video_path: Optional[str]
    keywords: List[str] = []
