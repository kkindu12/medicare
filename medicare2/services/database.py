from pymongo import MongoClient, errors
from gridfs import GridFS
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Get variables
MONGODB_URI = os.getenv("MONGODB_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME")

# Attempt connection
try:
    client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
    client.admin.command('ping')  # Ping the server to confirm connection
    print("✅ Connected to MongoDB Atlas successfully.")
except errors.ServerSelectionTimeoutError as err:
    print("❌ Failed to connect to MongoDB Atlas:", err)
    raise SystemExit(1)

# Access database and GridFS
db = client[DATABASE_NAME]
fs = GridFS(db)
patients_collection = db["patients"]

# Utility functions to get db and fs
def get_db():
    return db

def get_fs():
    return fs
