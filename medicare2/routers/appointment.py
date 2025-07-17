from fastapi import APIRouter, HTTPException, Query
from models.appointment import Appointment, AppointmentCreate, AppointmentUpdate, AppointmentReschedule
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

# Doctor-specific endpoints
@router.get("/appointments/doctor/{doctor_id}", response_model=List[Appointment])
async def get_doctor_appointments(doctor_id: str, status: str = Query(None)):
    """Get appointments for a specific doctor, optionally filtered by status"""
    query = {"doctor_id": doctor_id}
    if status:
        query["status"] = status
    
    appointments = []
    for appointment in get_db().appointments.find(query):
        appointment["id"] = str(appointment["_id"])
        appointment.pop("_id")
        appointments.append(Appointment(**appointment))
    return appointments

@router.put("/appointments/{appointment_id}/approve", response_model=Appointment)
async def approve_appointment(appointment_id: str):
    """Approve an appointment and notify the patient"""
    # Update appointment status to approved
    result = get_db().appointments.update_one(
        {"_id": ObjectId(appointment_id)}, 
        {"$set": {"status": "approved"}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    # Get updated appointment
    appointment = get_db().appointments.find_one({"_id": ObjectId(appointment_id)})
    appointment["id"] = str(appointment["_id"])
    appointment.pop("_id")
      # Create notification for patient
    notification_data = {
        "userId": appointment["patient_id"],
        "title": "Appointment Approved",
        "message": f"Your appointment with Dr. {appointment['doctor_name']} on {appointment['appointment_date']} at {appointment['appointment_time']} has been approved.",
        "type": "appointment_approved",
        "relatedRecordId": appointment_id,
        "read": False,
        "createdAt": datetime.now().isoformat()
    }
    get_db().notifications.insert_one(notification_data)
    
    return Appointment(**appointment)

@router.put("/appointments/{appointment_id}/reject", response_model=Appointment)
async def reject_appointment(appointment_id: str, rejection_data: dict):
    """Reject an appointment with a reason and notify the patient"""
    rejection_reason = rejection_data.get("rejection_reason", "No reason provided")
    
    # Update appointment status to rejected with reason
    result = get_db().appointments.update_one(
        {"_id": ObjectId(appointment_id)}, 
        {"$set": {"status": "rejected", "rejection_reason": rejection_reason}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    # Get updated appointment
    appointment = get_db().appointments.find_one({"_id": ObjectId(appointment_id)})
    appointment["id"] = str(appointment["_id"])
    appointment.pop("_id")
      # Create notification for patient
    notification_data = {
        "userId": appointment["patient_id"],
        "title": "Appointment Rejected",
        "message": f"Your appointment with Dr. {appointment['doctor_name']} on {appointment['appointment_date']} at {appointment['appointment_time']} has been rejected. Reason: {rejection_reason}",
        "type": "appointment_rejected",
        "relatedRecordId": appointment_id,
        "read": False,
        "createdAt": datetime.now().isoformat()
    }
    get_db().notifications.insert_one(notification_data)
    
    return Appointment(**appointment)

@router.put("/appointments/{appointment_id}/reschedule", response_model=Appointment)
async def reschedule_appointment(appointment_id: str, reschedule_data: AppointmentReschedule):
    """Reschedule an appointment with a reason and notify the doctor"""
    
    # First, get the current appointment to save to history
    current_appointment = get_db().appointments.find_one({"_id": ObjectId(appointment_id)})
    if not current_appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    # Create history entry for the current appointment details
    history_entry = {
        "appointment_date": current_appointment["appointment_date"],
        "appointment_time": current_appointment["appointment_time"],
        "reschedule_reason": reschedule_data.reschedule_reason,
        "rescheduled_at": datetime.now().isoformat()
    }
    
    # Get existing history or initialize empty list
    existing_history = current_appointment.get("reschedule_history", [])
    existing_history.append(history_entry)
    
    # Update appointment with new details and add history
    update_data = {
        "doctor_id": reschedule_data.doctor_id,
        "doctor_name": reschedule_data.doctor_name,
        "doctor_specialty": reschedule_data.doctor_specialty,
        "appointment_date": reschedule_data.appointment_date,
        "appointment_time": reschedule_data.appointment_time,
        "reason": reschedule_data.reason,
        "reschedule_reason": reschedule_data.reschedule_reason,
        "status": "pending",  # Reset status to pending for doctor approval
        "reschedule_history": existing_history
    }
    
    result = get_db().appointments.update_one(
        {"_id": ObjectId(appointment_id)}, 
        {"$set": update_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    # Get updated appointment
    appointment = get_db().appointments.find_one({"_id": ObjectId(appointment_id)})
    appointment["id"] = str(appointment["_id"])
    appointment.pop("_id")
    
    # Create notification for doctor about rescheduled appointment
    notification_data = {
        "userId": appointment["doctor_id"],
        "title": "Appointment Rescheduled",
        "message": f"Patient {appointment['patient_name']} has rescheduled their appointment to {appointment['appointment_date']} at {appointment['appointment_time']}. Reason: {reschedule_data.reschedule_reason}",
        "type": "appointment_rescheduled",
        "relatedRecordId": appointment_id,
        "read": False,
        "createdAt": datetime.now().isoformat()
    }
    get_db().notifications.insert_one(notification_data)
    
    return Appointment(**appointment)