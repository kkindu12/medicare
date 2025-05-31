from fastapi import APIRouter, HTTPException, UploadFile, File
from models.patient import Patient, PatientCreate, PatientUpdate, Report
from models.user import User, UserCreate, UserUpdate
from services.database import get_db, get_fs
from services.dropboxService import upload_file_to_dropbox
from bson import ObjectId
from typing import List
from datetime import datetime
import mimetypes

router = APIRouter()

@router.post("/users", response_model=User)
async def create_user(user: UserCreate):
    user_dict = user.dict()
    
    # Optional: Check if user already exists
    existing_user = get_db().users.find_one({"email": user_dict["email"]})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    result = get_db().users.insert_one(user_dict)
    user_dict["id"] = str(result.inserted_id)

    print("✅ User created:", user_dict)  # For console logging

    return user_dict

@router.get("/users", response_model=List[User])
async def get_users():
    print("🔍 GET /users endpoint hit!")  # Debug logging
    users = []
    for user in get_db().users.find():
        user["id"] = str(user["_id"])
        user.pop("_id")
        users.append(User(**user))
    print(f"📊 Found {len(users)} users")  # Debug logging
    return users

@router.get("/users/{user_id}", response_model=User)
async def get_user(user_id: str):
    print(f"🔍 GET /users/{user_id} endpoint hit!")  # Debug logging
    user = get_db().users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user["id"] = str(user["_id"])
    user.pop("_id")
    return User(**user)

@router.put("/users/{user_id}", response_model=User)
async def update_user(user_id: str, user_update: UserUpdate):
    print(f"🔄 PUT /users/{user_id} endpoint hit!")  # Debug logging
    update_data = {k: v for k, v in user_update.dict().items() if v is not None}
    if update_data:
        result = get_db().users.update_one(
            {"_id": ObjectId(user_id)}, {"$set": update_data}
        )
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="User not found")
    user = get_db().users.find_one({"_id": ObjectId(user_id)})
    user["id"] = str(user["_id"])
    user.pop("_id")
    return User(**user)

@router.delete("/users/{user_id}")
async def delete_user(user_id: str):
    print(f"🗑️ DELETE /users/{user_id} endpoint hit!")  # Debug logging
    result = get_db().users.delete_one({"_id": ObjectId(user_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted"}

@router.post("/users/{patient_id}/reports")
async def upload_report(patient_id: str, name: str, type: str, description: str = None, file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    file_id = get_fs().put(await file.read(), filename=file.filename)
    
    report = Report(
        name=name,
        type=type,
        date=datetime.now().strftime("%Y-%m-%d"),
        file_id=str(file_id),
        fileType="pdf",
        description=description
    )
    
    result = get_db().patients.update_one(
        {"_id": ObjectId(patient_id)},
        {"$push": {"reports": report.dict()}}
    )
    
    if result.matched_count == 0:
        get_fs().delete(file_id)
        raise HTTPException(status_code=404, detail="Patient not found")
    
    return report

@router.get("/users/{patient_id}/reports/{file_id}", response_model=None)
async def get_report(patient_id: str, file_id: str):
    try:
        file_data = get_fs().get(ObjectId(file_id)).read()
        return {
            "content": file_data,
            "content_type": "application/pdf"
        }
    except:
        raise HTTPException(status_code=404, detail="File not found")

@router.delete("/users/{patient_id}/reports/{file_id}")
async def delete_report(patient_id: str, file_id: str):
    result = get_db().patients.update_one(
        {"_id": ObjectId(patient_id)},
        {"$pull": {"reports": {"file_id": file_id}}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Patient not found")
    get_fs().delete(ObjectId(file_id))
    return {"message": "Report deleted"}

@router.post("/users/upload-to-dropbox")
async def upload_to_dropbox(file: UploadFile = File(...)):
    result = upload_file_to_dropbox(file)

    if "error" in result:
        raise HTTPException(status_code=500, detail=f"Dropbox upload failed: {result['error']}")

    return {
        "dropbox_path": result["path"]
    }

@router.get("/users/getPatientRecords/{patient_id}", response_model=List[str])
async def get_patient_reports(patient_id: str):
    db = get_db()
    try:
        patient = db.patients.find_one({"_id": ObjectId(patient_id)})
        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found")
        
        # Return only the reports array
        return patient.get("reports", [])
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))