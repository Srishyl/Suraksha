from pymongo import MongoClient
import certifi

uri = "mongodb+srv://root:root@savesome.uva7hsb.mongodb.net/?appName=SaveSome"

print(f"Connecting to: {uri} using certifi")

try:
    client = MongoClient(uri, tlsCAFile=certifi.where())
    client.admin.command('ismaster')
    print("MongoDB connection successful with certifi!")
except Exception as e:
    print(f"MongoDB connection failed: {e}")
