from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from datetime import datetime
from models.appointment import Appointment
from models.doctor import Doctor
from models.user import User
from schemas.appointment import AppointmentCreate, AppointmentResponse
from routers.user import get_current_user

router = APIRouter()

@router.get("/appointments", response_model=List[AppointmentResponse])
async def get_appointments(
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100
):
    """Get all appointments for the current user"""
    appointments = await Appointment.find(
        Appointment.patient.id == current_user.id
    ).skip(skip).limit(limit).to_list()
    return appointments

@router.get("/appointments/{appointment_id}", response_model=AppointmentResponse)
async def get_appointment(
    appointment_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get a specific appointment by ID"""
    appointment = await Appointment.get(appointment_id)
    
    if not appointment or appointment.patient.id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found"
        )
    return appointment

@router.post("/appointments", response_model=AppointmentResponse)
async def create_appointment(
    appointment: AppointmentCreate,
    current_user: User = Depends(get_current_user)
):
    """Create a new appointment"""
    # Check if doctor exists
    doctor = await Doctor.get(appointment.doctor_id)
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor not found"
        )
    
    # Check if doctor is available
    if not doctor.is_available:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Doctor is not available"
        )
    
    # Check if appointment time is in the future
    if appointment.appointment_date <= datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Appointment date must be in the future"
        )
    
    # Check for conflicting appointments
    existing_appointment = await Appointment.find_one(
        Appointment.doctor.id == appointment.doctor_id,
        Appointment.appointment_date == appointment.appointment_date,
        Appointment.status != "cancelled"
    )
    
    if existing_appointment:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Time slot is already booked"
        )
    
    # Create new appointment
    db_appointment = Appointment(
        doctor=doctor,
        patient=current_user,
        appointment_date=appointment.appointment_date,
        status="scheduled"
    )
    await db_appointment.insert()
    return db_appointment

@router.put("/appointments/{appointment_id}", response_model=AppointmentResponse)
async def update_appointment(
    appointment_id: str,
    appointment: AppointmentCreate,
    current_user: User = Depends(get_current_user)
):
    """Update an existing appointment"""
    db_appointment = await Appointment.get(appointment_id)
    
    if not db_appointment or db_appointment.patient.id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found"
        )
    
    # Check if new appointment time is in the future
    if appointment.appointment_date <= datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Appointment date must be in the future"
        )
    
    # Check for conflicting appointments
    existing_appointment = await Appointment.find_one(
        Appointment.doctor.id == appointment.doctor_id,
        Appointment.appointment_date == appointment.appointment_date,
        Appointment.id != appointment_id,
        Appointment.status != "cancelled"
    )
    
    if existing_appointment:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Time slot is already booked"
        )
    
    # Update appointment
    doctor = await Doctor.get(appointment.doctor_id)
    db_appointment.doctor = doctor
    db_appointment.appointment_date = appointment.appointment_date
    db_appointment.updated_at = datetime.utcnow()
    
    await db_appointment.save()
    return db_appointment

@router.delete("/appointments/{appointment_id}")
async def delete_appointment(
    appointment_id: str,
    current_user: User = Depends(get_current_user)
):
    """Delete an appointment"""
    db_appointment = await Appointment.get(appointment_id)
    
    if not db_appointment or db_appointment.patient.id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found"
        )
    
    await db_appointment.delete()
    return {"message": "Appointment deleted successfully"} 