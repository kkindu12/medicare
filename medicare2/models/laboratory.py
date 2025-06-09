from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Laboratory Models
class LabTest(BaseModel):
    name: str
    category: str
    turnaround: str
    location: str
    price: float

class TestRequest(BaseModel):
    testName: str
    patientId: str
    referringDoctor: str
    gender: str
    collectionDate: str
    preferredTime: str
    clinicalInfo: str
    id: Optional[str] = None
    status: Optional[str] = "pending"
    created_at: Optional[datetime] = None

class TestRequestResponse(BaseModel):
    id: str
    testName: str
    patientId: str
    referringDoctor: str
    gender: str
    collectionDate: str
    preferredTime: str
    clinicalInfo: str
    status: str
    created_at: datetime
    referral_file: Optional[str] = None
