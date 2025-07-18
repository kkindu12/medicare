from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class BillItem(BaseModel):
    description: str
    amount: float

class Bill(BaseModel):
    id: Optional[str] = None
    billNumber: str
    patientId: str
    patientName: str
    billItems: List[BillItem]
    totalAmount: float
    createdAt: datetime
    status: str = "pending"  # pending, paid, overdue

class BillCreate(BaseModel):
    billNumber: str
    patientId: str
    patientName: str
    billItems: List[BillItem]
    totalAmount: float
    status: str = "pending"

class BillUpdate(BaseModel):
    status: Optional[str] = None
