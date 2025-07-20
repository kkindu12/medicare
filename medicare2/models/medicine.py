from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class Medicine(BaseModel):
    id: Optional[str]
    name: str
    description: str
    dosage: str
    sideEffects: str
    manufacturer: str
    expiryDate: datetime
    stock: int
    price: str
