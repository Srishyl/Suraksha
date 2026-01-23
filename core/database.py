from pymongo import MongoClient
from config import config

client = MongoClient(config.MONGO_URI)
db = client[config.DB_NAME]

users_collection = db.users
contacts_collection = db.emergency_contacts
alerts_collection = db.alerts
