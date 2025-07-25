from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class DoctorDetails(BaseModel):
    usualStartingTime: str
    usualEndingTime: str
    experience: int
    highestQualifications: str
    registrationNumber: str
    registrationAuthority: str
    registrationDate: str
    feeForAppointment: int

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

class UserCreate(BaseModel):
    firstName: str
    lastName: str
    email: str
    phoneNumber: str
    password: str
    dateOfBirth: Optional[str] = None
    gender: Optional[str] = None
    address: Optional[str] = None
    emergencyContactName: Optional[str] = None
    emergencyContactPhone: Optional[str] = None
    role: bool = False  # Default to False for non-admin users
    doctorDetails: Optional[DoctorDetails] = None

class User(UserCreate):
    id: str

class UserLoginResponse(BaseModel):
    id: str
    firstName: str
    lastName: str
    email: str
    phoneNumber: str
    dateOfBirth: Optional[str] = None
    gender: Optional[str] = None
    address: Optional[str] = None
    emergencyContactName: Optional[str] = None
    emergencyContactPhone: Optional[str] = None
    role: bool
    doctorDetails: Optional[DoctorDetails] = None

class UserLogin(BaseModel):
    email: str
    password: str

class UserUpdate(BaseModel):
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    email: Optional[str] = None
    phoneNumber: Optional[str] = None
    dateOfBirth: Optional[str] = None
    gender: Optional[str] = None
    address: Optional[str] = None
    emergencyContactName: Optional[str] = None
    emergencyContactPhone: Optional[str] = None
    password: Optional[str] = None
    role: Optional[bool] = None
    doctorDetails: Optional[DoctorDetails] = None