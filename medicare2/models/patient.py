from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class Report(BaseModel):
    name: str
    type: str
    date: str
    file_id: Optional[str] = None
    fileType: str = "pdf"  # Default to PDF
    description: Optional[str] = None

class PatientRecord(BaseModel):
    visitDate: str
    visitTime: str
    condition: str
    doctor: str
    prescription: Optional[str] = None
    status: str

class PatientCreate(BaseModel):
    patientName: str
    condition: str
    doctor: str
    lastVisit: str
    lastVisitTime: str
    status: str
    prescription: Optional[str] = None

class Patient(PatientCreate):
    id: str
    reports: List[Report] = []
    previousRecords: List[PatientRecord] = []

class PatientUpdate(BaseModel):
    patientName: Optional[str] = None
    condition: Optional[str] = None
    doctor: Optional[str] = None
    lastVisit: Optional[str] = None
    lastVisitTime: Optional[str] = None
    status: Optional[str] = None
    prescription: Optional[str] = None