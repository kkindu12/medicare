from fastapi import APIRouter, HTTPException, UploadFile, File
from models.patient import Patient, PatientCreate, PatientUpdate, Report
from services.database import get_db, get_fs
from services.dropboxService import upload_file_to_dropbox
from bson import ObjectId
from typing import List
from datetime import datetime
import mimetypes

router = APIRouter()

@router.post("/patients", response_model=Patient)
async def create_patient(patient: PatientCreate):
    patient_dict = patient.dict()
    patient_dict["reports"] = []
    patient_dict["previousRecords"] = []
    result = get_db().patients.insert_one(patient_dict)
    patient_dict["id"] = str(result.inserted_id)
    return patient_dict

@router.get("/patients", response_model=List[Patient])
async def get_patients():
    patients = []
    for patient in get_db().patients.find():
        patient["id"] = str(patient["_id"])
        patient.pop("_id")
        patient.pop("reports", None)
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

@router.post("/patients/upload-to-dropbox")
async def upload_to_dropbox(file: UploadFile = File(...)):
    result = upload_file_to_dropbox('1212',file)

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