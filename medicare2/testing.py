from pymongo import MongoClient
import certifi
from dotenv import load_dotenv
import os

load_dotenv()
MONGODB_URI = os.getenv("MONGODB_URI")

try:
    client = MongoClient(MONGODB_URI, tlsCAFile=certifi.where())
    client.admin.command("ping")
    print("✅ Connection OK")
except Exception as e:
    print("❌ Connection failed:", e)
