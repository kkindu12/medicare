from beanie import Document, Link
from datetime import datetime
from typing import Optional
from models.user import User
from models.doctor import Doctor
from schemas.appointment import AppointmentStatus

class Appointment(Document):
    """Appointment model for MongoDB"""
    doctor: Link[Doctor]
    patient: Link[User]
    appointment_date: datetime
    status: AppointmentStatus = AppointmentStatus.PENDING
    notes: Optional[str] = None
    created_at: datetime = datetime.utcnow()
    updated_at: datetime = datetime.utcnow()

    class Settings:
        """MongoDB collection settings"""
        name = "appointments"
        indexes = [
            "doctor",
            "patient",
            "appointment_date",
            "status",
            [("doctor", "appointment_date")],  # Compound index for doctor availability queries
            [("patient", "appointment_date")]  # Compound index for patient appointment queries
        ]

    class Config:
        """Example schema for documentation"""
        schema_extra = {
            "example": {
                "doctor": "507f1f77bcf86cd799439012",
                "patient": "507f1f77bcf86cd799439013",
                "appointment_date": "2024-03-20T14:30:00Z",
                "status": "pending",
                "notes": "Regular checkup",
                "created_at": "2024-03-15T10:00:00Z",
                "updated_at": "2024-03-15T10:00:00Z"
            }
        } 