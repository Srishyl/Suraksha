from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from database import users_collection
import uuid
from models import RegisterUser, LoginUser
from security import hash_password
from security import verify_password, create_access_token


router=APIRouter()

@router.post("/register")
def register(user: RegisterUser):
    if users_collection.find_one({"email": user.email}):
        return {"success": False, "message": "Email already exists"}

    user_id = str(uuid.uuid4())
    users_collection.insert_one({
        "_id": user_id,
        "name": user.name,
        "email": user.email,
        "password": hash_password(user.password)
    })

    return {"success": True, "user_id": user_id}



@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = users_collection.find_one({"email": form_data.username})

    if not user or not verify_password(form_data.password, user["password"]):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    token = create_access_token({"sub": user["_id"]})

    return {
        "access_token": token,
        "token_type": "bearer"
    }
