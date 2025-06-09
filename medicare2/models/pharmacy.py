from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Pharmacy Models
class Medicine(BaseModel):
    name: str
    category: str
    manufacturer: str
    expires: str
    price: float
    stock: int
    status: str

class MedicineOrder(BaseModel):
    medicineName: str
    quantity: int
    patientId: str
    prescriptionId: str
    address: str
    notes: str
    id: Optional[str] = None
    status: Optional[str] = "pending"
    created_at: Optional[datetime] = None

class MedicineOrderResponse(BaseModel):
    id: str
    medicineName: str
    quantity: int
    patientId: str
    prescriptionId: str
    address: str
    notes: str
    status: str
    created_at: datetime
    prescription_file: Optional[str] = None
    total_price: Optional[float] = None
