from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from .user import User

class Medication(BaseModel):
    name: str
    dosage: str
    frequency: str
    startDate: str
    endDate: str

class Report(BaseModel):
    name: str
    type: str
    date: str
    file_id: Optional[str] = None
    fileType: str = "pdf"  # Default to PDF
    description: Optional[str] = None

class PatientRecordBase(BaseModel):
    visitDate: str
    visitTime: str
    condition: str
    doctor: str
    prescription: Optional[str] = None
    status: str
    medications: Optional[List[Medication]] = []

class PatientRecordCreate(PatientRecordBase):
    patientId: str

class PatientRecord(PatientRecordBase):
    id: str
    patientId: str

class PatientRecordUpdate(BaseModel):
    visitDate: Optional[str] = None
    visitTime: Optional[str] = None
    condition: Optional[str] = None
    doctor: Optional[str] = None
    prescription: Optional[str] = None
    status: Optional[str] = None
    patientName: Optional[str] = None
    medications: Optional[List[Medication]] = None

class PatientRecordWithUser(BaseModel):
    id: str
    patientId: str
    visitDate: str
    visitTime: str
    condition: str
    doctor: str
    prescription: Optional[str] = None
    status: str
    medications: Optional[List[Medication]] = []
    labTest: Optional[List[str]] = []
    medicine: Optional[List[MedicineDetails]] = []
    user: Optional[User] = None  # Include patient user data
    doctorUser: Optional[User] = None  # Include doctor user data
    isEdited: Optional[bool] = False
    editedBy: Optional[str] = None  # Doctor ID who edited
    editedByName: Optional[str] = None  # Doctor name who edited
    editedAt: Optional[str] = None  # Timestamp of edit
