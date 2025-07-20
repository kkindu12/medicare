from fastapi import APIRouter, HTTPException, UploadFile, File, Request
from models.patient import Patient, PatientCreate, PatientUpdate, Report
from models.patientRecord import PatientRecord, PatientRecordCreate, PatientRecordUpdate, Medication, PatientRecordWithUser
from models.notification import CreateNotificationRequest
from services.database import get_db, get_fs
from services.dropboxService import upload_file_to_dropbox, get_dropbox_auth_url, complete_dropbox_auth, refresh_dropbox_token, test_dropbox_connection, list_dropbox_files
from bson import ObjectId
from typing import List
from datetime import datetime
import uuid
import requests
from services.dropboxService import upload_file_to_dropbox_simple

router = APIRouter()

@router.post("/patientRecords")
async def create_patient_record(record: PatientRecordCreate):
    print(f"Creating patient record for patient: {record.patientId}")
    db = get_db()
    record_dict = record.dict()
    result = db.patientRecords.insert_one(record_dict)
    record_id = str(result.inserted_id)
    print(f"Patient record created with ID: {record_id}")
    
    # Create notification for the patient
    try:
        # Get patient information
        patient = db.users.find_one({"_id": ObjectId(record.patientId)})
        if patient:
            patient_name = f"{patient.get('firstName', '')} {patient.get('lastName', '')}"
            print(f"Found patient: {patient_name}")
            
            # Get doctor information if available
            doctor_name = record.doctor
            
            # Create more descriptive notification
            notification_id = str(uuid.uuid4())
            current_time = datetime.now().isoformat()
            
            notification_doc = {
                "_id": notification_id,
                "userId": record.patientId,
                "title": "New Medical Record Added",
                "message": f"Dr. {doctor_name} added a medical record on {datetime.now().strftime('%B %d, %Y at %I:%M %p')}. Condition: {record.condition}",
                "type": "medical_record",                "relatedRecordId": record_id,
                "createdAt": current_time,
                "read": False,
                "createdBy": None,  # We could add doctor ID if available
                "createdByName": doctor_name
            }
            
            notification_result = db.notifications.insert_one(notification_doc)
            print(f"Notification created with ID: {notification_result.inserted_id}")
            print(f"Notification details: {notification_doc}")
            
            # Trigger immediate SSE update for real-time notifications
            try:
                sse_response = requests.post(f"http://localhost:8000/api/sse/trigger/{record.patientId}", timeout=1)
                print(f"SSE trigger response: {sse_response.json()}")
            except Exception as sse_error:
                print(f"SSE trigger failed (non-critical): {sse_error}")
        else:
            print(f"Patient not found with ID: {record.patientId}")
    except Exception as e:
        print(f"Error creating notification: {str(e)}")
        import traceback
        traceback.print_exc()
        # Don't fail the record creation if notification fails
    
    return {"id": record_id}

@router.get("/patientRecords", response_model=List[PatientRecordWithUser])
async def get_patient_records():
    records = []
    db = get_db()
    for record in db.patientRecords.find():
        record["id"] = str(record["_id"])
        record.pop("_id")
        
        try:
            patient_user = db.users.find_one({"_id": ObjectId(record["patientId"])})
            if patient_user:
                # Add user data to the record
                patient_user["id"] = str(patient_user["_id"])
                patient_user.pop("_id")
                record["user"] = patient_user
            else:
                record["user"] = None
        except Exception as e:
            record["user"] = None
        
        records.append(record)
    
    return records

@router.get("/patientRecords/{record_id}", response_model=PatientRecord)
async def get_patient_record(record_id: str):
    record = get_db().patientRecords.find_one({"_id": ObjectId(record_id)})
    if not record:
        raise HTTPException(status_code=404, detail="Patient record not found")
    record["id"] = str(record["_id"])
    record.pop("_id")
    return PatientRecord(**record)

@router.put("/patientRecords/{record_id}", response_model=PatientRecord)
async def update_patient_record(record_id: str, record_update: PatientRecordUpdate):
    update_data = {k: v for k, v in record_update.dict().items() if v is not None}
    
    # If this is an edit, add edit tracking fields
    if update_data:
        # Mark as edited if not already marked
        if 'isEdited' not in update_data:
            update_data['isEdited'] = True
        
        # Set edit timestamp
        if 'editedAt' not in update_data:
            update_data['editedAt'] = datetime.now().isoformat()
        
        result = get_db().patientRecords.update_one(
            {"_id": ObjectId(record_id)}, {"$set": update_data}
        )
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Patient record not found")
    
    record = get_db().patientRecords.find_one({"_id": ObjectId(record_id)})
    record["id"] = str(record["_id"])
    record.pop("_id")
    return PatientRecord(**record)

@router.delete("/patientRecords/{record_id}")
async def delete_patient_record(record_id: str):
    result = get_db().patientRecords.delete_one({"_id": ObjectId(record_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Patient record not found")
    return {"message": "Patient record deleted"}

# Get patient records by patient name
@router.get("/patientRecords/byPatient/{patient_name}", response_model=List[PatientRecord])
async def get_records_by_patient(patient_name: str):
    records = []
    for record in get_db().patientRecords.find({"patientName": patient_name}):
        record["id"] = str(record["_id"])
        record.pop("_id")
        records.append(PatientRecord(**record))
    return records

# Original patient endpoints (keeping existing functionality)
@router.post("/patients", response_model=Patient)
async def create_patient(patient: PatientCreate):
    patient_dict = patient.dict()
    
    # Optional: Check if patient already exists
    existing_patient = get_db().patients.find_one({"patientName": patient_dict["patientName"]})
    if existing_patient:
        raise HTTPException(status_code=400, detail="Patient already exists")
    
    result = get_db().patients.insert_one(patient_dict)
    patient_dict["id"] = str(result.inserted_id)

    return patient_dict

@router.get("/patients", response_model=List[Patient])
async def get_patients():
    patients = []
    for patient in get_db().patients.find():
        patient["id"] = str(patient["_id"])
        patient.pop("_id")
        patients.append(Patient(**patient))
    return patients

@router.get("/patients/{patient_id}", response_model=Patient)
async def get_patient(patient_id: str):
    patient = get_db().patients.find_one({"_id": ObjectId(patient_id)})
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    patient["id"] = str(patient["_id"])
    patient.pop("_id")
    return Patient(**patient)

@router.put("/patients/{patient_id}", response_model=Patient)
async def update_patient(patient_id: str, patient_update: PatientUpdate):
    update_data = {k: v for k, v in patient_update.dict().items() if v is not None}
    if update_data:
        result = get_db().patients.update_one(
            {"_id": ObjectId(patient_id)}, {"$set": update_data}
        )
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Patient not found")
    patient = get_db().patients.find_one({"_id": ObjectId(patient_id)})
    patient["id"] = str(patient["_id"])
    patient.pop("_id")
    return Patient(**patient)

@router.delete("/patients/{patient_id}")
async def delete_patient(patient_id: str):
    result = get_db().patients.delete_one({"_id": ObjectId(patient_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Patient not found")
    return {"message": "Patient deleted"}

@router.post("/patients/{patient_id}/reports")
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

@router.get("/patients/{patient_id}/reports/{file_id}", response_model=None)
async def get_report(patient_id: str, file_id: str):
    try:
        file_data = get_fs().get(ObjectId(file_id)).read()
        return {
            "content": file_data,
            "content_type": "application/pdf"
        }
    except:
        raise HTTPException(status_code=404, detail="File not found")

@router.delete("/patients/{patient_id}/reports/{file_id}")
async def delete_report(patient_id: str, file_id: str):
    result = get_db().patients.update_one(
        {"_id": ObjectId(patient_id)},
        {"$pull": {"reports": {"file_id": file_id}}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Patient not found")
    get_fs().delete(ObjectId(file_id))
    return {"message": "Report deleted"}

@router.post("/patientRecords/upload-to-dropbox/{patient_record_id}")
async def upload_to_dropbox(patient_record_id: str, file: UploadFile = File(...)):
    
    result = upload_file_to_dropbox_simple(patient_record_id, file)

    if "error" in result:
        raise HTTPException(status_code=500, detail=f"Dropbox upload failed: {result['error']}")
    return {
        "dropbox_path": result["path"],
        "message": result.get("message", "File uploaded successfully")
    }

@router.get("/patients/getPatientRecords/{patient_id}", response_model=List[PatientRecordWithUser])
async def get_patient_reports(patient_id: str):
    records = []
    db = get_db()
    
    try:
        # Find patient records filtered by patientId
        for record in db.patientRecords.find({"patientId": patient_id}):
            # Convert MongoDB ObjectId to string for the record
            record["id"] = str(record["_id"])
            record.pop("_id")
            
            # Get patient user data based on patientId
            try:
                patient_user = db.users.find_one({"_id": ObjectId(record["patientId"])})
                if patient_user:
                    # Add patient user data to the record
                    patient_user["id"] = str(patient_user["_id"])
                    patient_user.pop("_id")
                    record["user"] = patient_user
                else:
                    record["user"] = None
            except Exception as e:
                record["user"] = None
              # Get doctor user data by doctor name
            try:
                doctor_name_parts = record["doctor"].split(" ")
                if len(doctor_name_parts) >= 2:
                    first_name = doctor_name_parts[0]
                    last_name = " ".join(doctor_name_parts[1:])
                    doctor_user = db.users.find_one({
                        "firstName": first_name,
                        "lastName": last_name,
                        "role": True  # true means doctor
                    })
                    if doctor_user:
                        # Add doctor user data to the record
                        doctor_user["id"] = str(doctor_user["_id"])
                        doctor_user.pop("_id")
                        record["doctorUser"] = doctor_user
                    else:
                        record["doctorUser"] = None
            except Exception as e:
                record["doctorUser"] = None
            
            records.append(record)
        
        return records
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Dropbox Authentication and File Management Endpoints

@router.get("/dropbox/auth-url")
async def get_dropbox_authorization_url():
    """Get Dropbox OAuth2 authorization URL"""
    return get_dropbox_auth_url()

@router.post("/dropbox/complete-auth")
async def complete_dropbox_authorization(auth_code: str):
    """Complete Dropbox OAuth2 flow with authorization code"""
    return complete_dropbox_auth(auth_code)

@router.post("/dropbox/refresh-token")
async def refresh_dropbox_access_token(refresh_token: str = None):
    """Refresh Dropbox access token using refresh token"""
    return refresh_dropbox_token(refresh_token)

@router.get("/dropbox/test")
async def test_dropbox():
    """Test Dropbox connection status"""
    return test_dropbox_connection()

# Test Dropbox connection endpoint
@router.get("/test-dropbox")
async def test_dropbox():
    from services.dropboxService import test_dropbox_connection
    
    result = test_dropbox_connection()
    
    if result.get("status") == "error":
        raise HTTPException(status_code=500, detail=result)
    
    return result

@router.get("/patientRecords/getPatientReports/{patient_record_id}")
async def get_dropbox_files_for_patient(patient_record_id: str):
    """Get list of files from Dropbox for a specific patient record"""
    result = list_dropbox_files(patient_record_id)
    
    if "error" in result:
        raise HTTPException(status_code=500, detail=f"Failed to get files: {result['error']}")
    
    filenames = [file["name"] for file in result.get("files", [])]
    
    return {
        "patient_record_id": patient_record_id,
        "filenames": filenames,
        "count": len(filenames)
    }

@router.get("/dropbox/files")
async def get_all_dropbox_files():
    """Get list of all files from Dropbox medicare_uploads folder"""
    result = list_dropbox_files()
    
    if "error" in result:
        raise HTTPException(status_code=500, detail=f"Failed to get files: {result['error']}")
    
    filenames = [file["name"] for file in result.get("files", [])]
    
    return {
        "filenames": filenames,
        "count": len(filenames),
        "files_with_details": result.get("files", [])
    }