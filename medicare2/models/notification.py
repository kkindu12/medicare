from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Notification(BaseModel):
    id: Optional[str] = None
    userId: str  # The patient who should receive the notification
    title: str
    message: str
    type: str  # 'medical_record', 'appointment', 'prescription', 'lab_result', 'general'
    relatedRecordId: Optional[str] = None  # If related to a medical record
    createdAt: Optional[str] = None
    read: bool = False
    createdBy: Optional[str] = None  # Doctor ID who created the notification
    createdByName: Optional[str] = None  # Doctor name who created the notification

class CreateNotificationRequest(BaseModel):
    userId: str
    title: str
    message: str
    type: str
    relatedRecordId: Optional[str] = None
    createdBy: Optional[str] = None
    createdByName: Optional[str] = None
