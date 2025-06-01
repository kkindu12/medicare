from fastapi import APIRouter, HTTPException, UploadFile, File, Request
from models.patient import Patient, PatientCreate, PatientUpdate, Report
from models.patientRecord import PatientRecord, PatientRecordCreate, PatientRecordUpdate, Medication
from services.database import get_db, get_fs
from services.dropboxService import upload_file_to_dropbox
from bson import ObjectId
from typing import List
from datetime import datetime

router = APIRouter()

@router.post("/patientRecords")
async def create_patient_record(record: PatientRecordCreate):
    record_dict = record.dict()
    result = get_db().patientRecords.insert_one(record_dict)
    return {"id": str(result.inserted_id)}

@router.get("/patientRecords", response_model=List[PatientRecord])
async def get_patient_records():
    print("🔍 GET /patientRecords endpoint hit!")  # Debug logging
    records = []
    for record in get_db().patientRecords.find():
        record["id"] = str(record["_id"])
        record.pop("_id")
        records.append(PatientRecord(**record))
    print(f"📊 Found {len(records)} patient records")  # Debug logging
    return records

@router.get("/patientRecords/{record_id}", response_model=PatientRecord)
async def get_patient_record(record_id: str):
    print(f"🔍 GET /patientRecords/{record_id} endpoint hit!")  # Debug logging
    record = get_db().patientRecords.find_one({"_id": ObjectId(record_id)})
    if not record:
        raise HTTPException(status_code=404, detail="Patient record not found")
    record["id"] = str(record["_id"])
    record.pop("_id")
    return PatientRecord(**record)

@router.put("/patientRecords/{record_id}", response_model=PatientRecord)
async def update_patient_record(record_id: str, record_update: PatientRecordUpdate):
    print(f"🔄 PUT /patientRecords/{record_id} endpoint hit!")  # Debug logging
    update_data = {k: v for k, v in record_update.dict().items() if v is not None}
    if update_data:
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
    print(f"🗑️ DELETE /patientRecords/{record_id} endpoint hit!")  # Debug logging
    result = get_db().patientRecords.delete_one({"_id": ObjectId(record_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Patient record not found")
    return {"message": "Patient record deleted"}

# Get patient records by patient name
@router.get("/patientRecords/byPatient/{patient_name}", response_model=List[PatientRecord])
async def get_records_by_patient(patient_name: str):
    print(f"🔍 GET /patientRecords/byPatient/{patient_name} endpoint hit!")  # Debug logging
    records = []
    for record in get_db().patientRecords.find({"patientName": patient_name}):
        record["id"] = str(record["_id"])
        record.pop("_id")
        records.append(PatientRecord(**record))
    print(f"📊 Found {len(records)} records for patient {patient_name}")  # Debug logging
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

    print("✅ Patient created:", patient_dict)  # For console logging

    return patient_dict

@router.get("/patients", response_model=List[Patient])
async def get_patients():
    print("🔍 GET /patients endpoint hit!")  # Debug logging
    patients = []
    for patient in get_db().patients.find():
        patient["id"] = str(patient["_id"])
        patient.pop("_id")
        patients.append(Patient(**patient))
    print(f"📊 Found {len(patients)} patients")  # Debug logging
    return patients

@router.get("/patients/{patient_id}", response_model=Patient)
async def get_patient(patient_id: str):
    print(f"🔍 GET /patients/{patient_id} endpoint hit!")  # Debug logging
    patient = get_db().patients.find_one({"_id": ObjectId(patient_id)})
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    patient["id"] = str(patient["_id"])
    patient.pop("_id")
    return Patient(**patient)

@router.put("/patients/{patient_id}", response_model=Patient)
async def update_patient(patient_id: str, patient_update: PatientUpdate):
    print(f"🔄 PUT /patients/{patient_id} endpoint hit!")  # Debug logging
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
    print(f"🗑️ DELETE /patients/{patient_id} endpoint hit!")  # Debug logging
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

@router.post("/patients/upload-to-dropbox")
async def upload_to_dropbox(file: UploadFile = File(...)):
    result = upload_file_to_dropbox(file)

    if "error" in result:
        raise HTTPException(status_code=500, detail=f"Dropbox upload failed: {result['error']}")

    return {
        "dropbox_path": result["path"]
    }

@router.get("/patients/getPatientRecords/{patient_id}", response_model=List[str])
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