from pymongo import MongoClient
from config import config
import certifi

client = MongoClient(config.MONGO_URI, tlsCAFile=certifi.where())
db = client[config.DB_NAME]

users_collection = db.users
contacts_collection = db.emergency_contacts
alerts_collection = db.alerts
