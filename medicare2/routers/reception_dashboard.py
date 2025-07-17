from fastapi import APIRouter, Depends
from typing import List
from datetime import date
from services.database import get_db
from sqlalchemy.orm import Session
from models.appointment import Appointment
from models.user import User

router = APIRouter(
    prefix="/reception-dashboard",
    tags=["Reception Dashboard"]
)

@router.get("/appointments", response_model=List[dict])
def get_all_appointments(db: Session = Depends(get_db)):
    appointments = db.query(Appointment).all()
    return [a.to_dict() for a in appointments]

@router.get("/appointments/today", response_model=List[dict])
def get_today_appointments(db: Session = Depends(get_db)):
    today = date.today().isoformat()
    appointments = db.query(Appointment).filter(Appointment.date == today).all()
    return [a.to_dict() for a in appointments]

@router.get("/doctors", response_model=List[dict])
def get_all_doctors(db: Session = Depends(get_db)):
    doctors = db.query(User).filter(User.role == 'doctor').all()
    return [d.to_dict() for d in doctors]

@router.get("/doctors/available", response_model=List[dict])
def get_available_doctors(db: Session = Depends(get_db)):
    # Example: filter by availability flag or schedule
    doctors = db.query(User).filter(User.role == 'doctor', User.available == True).all()
    return [d.to_dict() for d in doctors]
