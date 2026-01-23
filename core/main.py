from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.user import router as user_router
from routes.route import router as main_router
from config import config

app = FastAPI(title=config.APP_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)



@app.get("/")
def root():
    return {"message": "Safety Guardian API running"}

app.include_router(user_router)
app.include_router(main_router)
