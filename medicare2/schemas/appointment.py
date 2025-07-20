from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime
from enum import Enum

class AppointmentStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"
    COMPLETED = "completed"

class AppointmentBase(BaseModel):
    """Base schema for appointment data"""
    appointment_date: datetime = Field(..., description="Date and time of the appointment")
    status: AppointmentStatus = Field(default=AppointmentStatus.PENDING, description="Current status of the appointment")
    notes: Optional[str] = Field(None, description="Additional notes for the appointment")

    @validator('appointment_date')
    def validate_appointment_date(cls, v):
        """Validate that appointment date is in the future"""
        if v < datetime.utcnow():
            raise ValueError("Appointment date must be in the future")
        return v

class AppointmentCreate(AppointmentBase):
    """Schema for creating a new appointment"""
    doctor_id: str = Field(..., description="ID of the doctor")

class AppointmentUpdate(BaseModel):
    """Schema for updating an existing appointment"""
    appointment_date: Optional[datetime] = Field(None, description="New date and time of the appointment")
    status: Optional[AppointmentStatus] = Field(None, description="New status of the appointment")
    notes: Optional[str] = Field(None, description="Updated notes for the appointment")

    @validator('appointment_date')
    def validate_appointment_date(cls, v):
        """Validate that appointment date is in the future"""
        if v and v < datetime.utcnow():
            raise ValueError("Appointment date must be in the future")
        return v

class AppointmentResponse(AppointmentBase):
    """Schema for appointment response"""
    id: str = Field(..., description="Unique identifier for the appointment")
    doctor_id: str = Field(..., description="ID of the doctor")
    patient_id: str = Field(..., description="ID of the patient")
    created_at: datetime = Field(..., description="When the appointment was created")
    updated_at: datetime = Field(..., description="When the appointment was last updated")

    class Config:
        """Pydantic config"""
        schema_extra = {
            "example": {
                "id": "507f1f77bcf86cd799439011",
                "doctor_id": "507f1f77bcf86cd799439012",
                "patient_id": "507f1f77bcf86cd799439013",
                "appointment_date": "2024-03-20T14:30:00Z",
                "status": "pending",
                "notes": "Regular checkup",
                "created_at": "2024-03-15T10:00:00Z",
                "updated_at": "2024-03-15T10:00:00Z"
            }
        } 