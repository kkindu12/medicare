from fastapi import APIRouter, HTTPException
from models.appointment import Appointment, AppointmentCreate, AppointmentUpdate
from services.database import get_db
from bson import ObjectId
from typing import List
from datetime import datetime

router = APIRouter()

@router.post("/appointments", response_model=Appointment)
async def create_appointment(appointment: AppointmentCreate):
    appointment_dict = appointment.dict()
    appointment_dict["created_at"] = datetime.now().isoformat()
    
    result = get_db().appointments.insert_one(appointment_dict)
    appointment_dict["id"] = str(result.inserted_id)
    
    return appointment_dict

@router.get("/appointments", response_model=List[Appointment])
async def get_appointments():
    appointments = []
    for appointment in get_db().appointments.find():
        appointment["id"] = str(appointment["_id"])
        appointment.pop("_id")
        appointments.append(Appointment(**appointment))
    return appointments

@router.get("/appointments/patient/{patient_id}", response_model=List[Appointment])
async def get_patient_appointments(patient_id: str):
    appointments = []
    for appointment in get_db().appointments.find({"patient_id": patient_id}):
        appointment["id"] = str(appointment["_id"])
        appointment.pop("_id")
        appointments.append(Appointment(**appointment))
    return appointments

@router.get("/appointments/{appointment_id}", response_model=Appointment)
async def get_appointment(appointment_id: str):
    appointment = get_db().appointments.find_one({"_id": ObjectId(appointment_id)})
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    appointment["id"] = str(appointment["_id"])
    appointment.pop("_id")
    return Appointment(**appointment)

@router.put("/appointments/{appointment_id}", response_model=Appointment)
async def update_appointment(appointment_id: str, appointment_update: AppointmentUpdate):
    update_data = {k: v for k, v in appointment_update.dict().items() if v is not None}
    if update_data:
        result = get_db().appointments.update_one(
            {"_id": ObjectId(appointment_id)}, {"$set": update_data}
        )
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Appointment not found")
    
        appointment = get_db().appointments.find_one({"_id": ObjectId(appointment_id)})
    appointment["id"] = str(appointment["_id"])
    appointment.pop("_id")
    return Appointment(**appointment)

@router.delete("/appointments/{appointment_id}")
async def delete_appointment(appointment_id: str):
    result = get_db().appointments.delete_one({"_id": ObjectId(appointment_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return {"message": "Appointment deleted"}