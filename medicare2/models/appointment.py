from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class Appointment(BaseModel):
    id: Optional[str] = None
    doctor_id: str
    doctor_name: str
    doctor_specialty: str
    patient_id: str
    patient_name: str
    appointment_date: str
    appointment_time: str
    reason: str
    status: str = "pending"
    rejection_reason: Optional[str] = None
    created_at: Optional[str] = None

class AppointmentCreate(BaseModel):
    doctor_id: str
    doctor_name: str
    doctor_specialty: str
    patient_id: str
    patient_name: str
    appointment_date: str
    appointment_time: str
    reason: str
    status: str = "pending"

class AppointmentUpdate(BaseModel):
    status: Optional[str] = None
    reason: Optional[str] = None
    rejection_reason: Optional[str] = None