from fastapi import APIRouter, HTTPException, UploadFile, File
from models.labTest import LabTest
from services.database import get_db, get_fs
from bson import ObjectId
from typing import List
import mimetypes

router = APIRouter()

@router.get("/labTests", response_model=List[LabTest])
async def get_labTests():
    labTests = []
    for labTest in get_db().labTests.find():
        labTest["id"] = str(labTest["_id"])
        labTest.pop("_id")
        labTests.append(LabTest(**labTest))
    return labTests