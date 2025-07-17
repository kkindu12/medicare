from pymongo import MongoClient, errors
from gridfs import GridFS
from dotenv import load_dotenv
import os

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME")

try:
    client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)  
    client.admin.command('ping')
except errors.ServerSelectionTimeoutError as err:
    raise SystemExit(1)

db = client[DATABASE_NAME]
fs = GridFS(db)
patients_collection = db["patients"]
user_collection = db["users"]

def get_db():
    return db

def get_fs():
    return fs
