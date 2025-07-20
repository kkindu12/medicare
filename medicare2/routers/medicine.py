from fastapi import APIRouter, HTTPException, UploadFile, File
from models.medicine import Medicine
from services.database import get_db, get_fs
from services.dropboxService import upload_file_to_dropbox
from bson import ObjectId
from typing import List
from datetime import datetime
import mimetypes

router = APIRouter()

@router.get("/medicines", response_model=List[Medicine])
async def get_medicines():
    medicines = []
    for medicine in get_db().medicines.find():
        medicine["id"] = str(medicine["_id"])
        medicine.pop("_id")
        medicines.append(Medicine(**medicine))
    return medicines