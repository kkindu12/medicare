from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class DoctorBase(BaseModel):
    specialty: str
    location: str
    consultation_fee: float
    experience_years: int
    education: List[str] = []
    languages: List[str] = []

class DoctorCreate(DoctorBase):
    pass

class DoctorUpdate(DoctorBase):
    is_available: Optional[bool] = None
    rating: Optional[float] = None

class DoctorResponse(DoctorBase):
    id: str
    user_id: str
    rating: float
    is_available: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class DoctorSearch(BaseModel):
    specialty: Optional[str] = None
    location: Optional[str] = None
    min_rating: Optional[float] = None
    max_fee: Optional[float] = None
    language: Optional[str] = None 