from beanie import Document, Link
from datetime import datetime
from typing import Optional, List
from models.user import User

class Doctor(Document):
    user: Link[User]  # Link to the user account
    specialty: str
    location: str
    rating: float = 0.0
    is_available: bool = True
    consultation_fee: float
    experience_years: int
    education: List[str] = []  # List of degrees/qualifications
    languages: List[str] = []  # Languages spoken
    created_at: datetime = datetime.utcnow()
    updated_at: datetime = datetime.utcnow()

    class Settings:
        name = "doctors"
        indexes = [
            "specialty",
            "location",
            "is_available",
            "rating"
        ]

    class Config:
        schema_extra = {
            "example": {
                "user": "user_id",
                "specialty": "Cardiology",
                "location": "Colombo",
                "rating": 4.5,
                "is_available": True,
                "consultation_fee": 5000.00,
                "experience_years": 10,
                "education": ["MBBS", "MD in Cardiology"],
                "languages": ["English", "Sinhala", "Tamil"]
            }
        } 