from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, date
import uuid
import aiofiles
import os
import json

router = APIRouter()

# Pydantic models for Pharmacy
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

# Sample medicines data
MEDICINES = [
    {
        "name": "Amoxicillin 500mg",
        "category": "Antibiotics",
        "manufacturer": "GSK",
        "expires": "Dec 2025",
        "price": 12.50,
        "stock": 120,
        "status": "In Stock"
    },
    {
        "name": "Lisinopril 20mg",
        "category": "Cardiovascular",
        "manufacturer": "Novartis",
        "expires": "Oct 2025",
        "price": 22.75,
        "stock": 15,
        "status": "Low Stock"
    },
    {
        "name": "Metformin 850mg",
        "category": "Antidiabetics",
        "manufacturer": "Pfizer",
        "expires": "Nov 2025",
        "price": 18.30,
        "stock": 78,
        "status": "In Stock"
    },
    {
        "name": "Vitamin D3 1000 IU",
        "category": "Vitamins & Supplements",
        "manufacturer": "Bayer",
        "expires": "Jan 2026",
        "price": 15.99,
        "stock": 200,
        "status": "In Stock"
    },
    {
        "name": "Ibuprofen 400mg",
        "category": "Analgesics",
        "manufacturer": "Roche",
        "expires": "Sep 2025",
        "price": 9.25,
        "stock": 8,
        "status": "Low Stock"
    },
    {
        "name": "Losartan 50mg",
        "category": "Antihypertensives",
        "manufacturer": "Merck",
        "expires": "Mar 2026",
        "price": 19.25,
        "stock": 65,
        "status": "In Stock"
    },
    {
        "name": "Insulin Glargine 100 U/mL",
        "category": "Antidiabetics",
        "manufacturer": "Sanofi",
        "expires": "Sep 2025",
        "price": 140.25,
        "stock": 12,
        "status": "Low Stock"
    },
    {
        "name": "Atorvastatin 40mg",
        "category": "Cardiovascular",
        "manufacturer": "Pfizer",
        "expires": "Aug 2025",
        "price": 32.80,
        "stock": 45,
        "status": "In Stock"
    },
    {
        "name": "Cetirizine 10mg",
        "category": "Antihistamines",
        "manufacturer": "GSK",
        "expires": "Feb 2026",
        "price": 14.25,
        "stock": 88,
        "status": "In Stock"
    },
    {
        "name": "Paracetamol 500mg",
        "category": "Analgesics",
        "manufacturer": "Sanofi",
        "expires": "Feb 2026",
        "price": 7.00,
        "stock": 200,
        "status": "In Stock"
    },
    {
        "name": "Amlodipine 5mg",
        "category": "Antihypertensives",
        "manufacturer": "Pfizer",
        "expires": "Dec 2025",
        "price": 16.50,
        "stock": 100,
        "status": "In Stock"
    },
    {
        "name": "Levothyroxine 50mcg",
        "category": "Thyroid Medications",
        "manufacturer": "AbbVie",
        "expires": "Jan 2026",
        "price": 20.00,
        "stock": 30,
        "status": "Low Stock"
    },
    {
        "name": "Simvastatin 20mg",
        "category": "Cardiovascular",
        "manufacturer": "Merck",
        "expires": "Mar 2026",
        "price": 18.75,
        "stock": 50,
        "status": "In Stock"
    },
    {
        "name": "Prednisolone 5mg",
        "category": "Anti-inflammatory",
        "manufacturer": "Pfizer",
        "expires": "Apr 2026",
        "price": 18.50,
        "stock": 25,
        "status": "Low Stock"
    },
    {
        "name": "Ranitidine 150mg",
        "category": "Antacids",
        "manufacturer": "GSK",
        "expires": "May 2026",
        "price": 10.00,
        "stock": 150,
        "status": "In Stock"
    }
]

# In-memory storage for medicine orders (in production, use a database)
medicine_orders_db = []

@router.get("/medicines", response_model=List[Medicine])
async def get_all_medicines():
    """Get all available medicines"""
    return MEDICINES

@router.get("/medicines/search")
async def search_medicines(
    query: Optional[str] = None,
    category: Optional[str] = None,
    availability: Optional[str] = None,
    manufacturer: Optional[str] = None
):
    """Search medicines by query, category, availability, or manufacturer"""
    filtered_medicines = MEDICINES.copy()
    
    if query:
        query = query.lower()
        filtered_medicines = [
            medicine for medicine in filtered_medicines
            if query in medicine["name"].lower() or 
               query in medicine["category"].lower() or 
               query in medicine["manufacturer"].lower()
        ]
    
    if category:
        filtered_medicines = [
            medicine for medicine in filtered_medicines
            if category.lower() in medicine["category"].lower()
        ]
    
    if availability:
        status_filter = ""
        if availability == "in-stock":
            status_filter = "In Stock"
        elif availability == "low-stock":
            status_filter = "Low Stock"
        elif availability == "out-of-stock":
            status_filter = "Out of Stock"
        
        if status_filter:
            filtered_medicines = [
                medicine for medicine in filtered_medicines
                if medicine["status"] == status_filter
            ]
    
    if manufacturer:
        filtered_medicines = [
            medicine for medicine in filtered_medicines
            if manufacturer.lower() in medicine["manufacturer"].lower()
        ]
    
    return filtered_medicines

@router.get("/medicines/categories")
async def get_medicine_categories():
    """Get all unique medicine categories"""
    categories = list(set(medicine["category"] for medicine in MEDICINES))
    return sorted(categories)

@router.get("/medicines/manufacturers")
async def get_medicine_manufacturers():
    """Get all unique medicine manufacturers"""
    manufacturers = list(set(medicine["manufacturer"] for medicine in MEDICINES))
    return sorted(manufacturers)

@router.get("/medicines/low-stock")
async def get_low_stock_medicines():
    """Get all medicines with low stock"""
    low_stock_medicines = [
        medicine for medicine in MEDICINES
        if medicine["status"] == "Low Stock"
    ]
    return low_stock_medicines

@router.get("/medicines/{medicine_name}")
async def get_medicine_by_name(medicine_name: str):
    """Get specific medicine details by name"""
    for medicine in MEDICINES:
        if medicine["name"].lower() == medicine_name.lower():
            return medicine
    raise HTTPException(status_code=404, detail="Medicine not found")

@router.post("/orders", response_model=MedicineOrderResponse)
async def create_medicine_order(order: MedicineOrder):
    """Create a new medicine order"""
    # Generate unique ID and timestamp
    order_id = str(uuid.uuid4())
    created_at = datetime.now()
    
    # Find medicine to calculate total price
    medicine = None
    for med in MEDICINES:
        if med["name"] == order.medicineName:
            medicine = med
            break
    
    if not medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")
    
    # Check stock availability
    if medicine["stock"] < order.quantity:
        raise HTTPException(
            status_code=400, 
            detail=f"Insufficient stock. Available: {medicine['stock']}, Requested: {order.quantity}"
        )
    
    # Calculate total price
    total_price = medicine["price"] * order.quantity
    
    # Create the medicine order with additional metadata
    medicine_order_data = {
        "id": order_id,
        "medicineName": order.medicineName,
        "quantity": order.quantity,
        "patientId": order.patientId,
        "prescriptionId": order.prescriptionId,
        "address": order.address,
        "notes": order.notes,
        "status": "pending",
        "created_at": created_at,
        "prescription_file": None,
        "total_price": total_price
    }
    
    # Store in memory (use database in production)
    medicine_orders_db.append(medicine_order_data)
    
    # Update medicine stock (in a real system, this would be handled more carefully)
    medicine["stock"] -= order.quantity
    if medicine["stock"] <= 10:  # Low stock threshold
        medicine["status"] = "Low Stock"
    if medicine["stock"] == 0:
        medicine["status"] = "Out of Stock"
    
    return medicine_order_data

@router.post("/orders/{order_id}/upload-prescription")
async def upload_prescription(
    order_id: str,
    file: UploadFile = File(...)
):
    """Upload prescription for a medicine order"""
    # Find the medicine order
    medicine_order = None
    for order in medicine_orders_db:
        if order["id"] == order_id:
            medicine_order = order
            break
    
    if not medicine_order:
        raise HTTPException(status_code=404, detail="Medicine order not found")
    
    # Validate file
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded")
    
    # Check file size (5MB limit)
    content = await file.read()
    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size must be less than 5MB")
    
    # Check file type
    allowed_types = ["application/pdf", "image/jpeg", "image/jpg", "image/png", "image/gif"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400, 
            detail="Please select a valid file format (PDF, JPG, JPEG, PNG, GIF)"
        )
    
    # Save file
    file_extension = os.path.splitext(file.filename)[1]
    filename = f"{order_id}_prescription{file_extension}"
    file_path = f"uploads/prescriptions/{filename}"
    
    async with aiofiles.open(file_path, 'wb') as f:
        await f.write(content)
    
    # Update medicine order with file path
    medicine_order["prescription_file"] = filename
    
    return {
        "message": "Prescription uploaded successfully",
        "filename": filename,
        "file_size": len(content)
    }

@router.get("/orders", response_model=List[MedicineOrderResponse])
async def get_all_medicine_orders():
    """Get all medicine orders"""
    return medicine_orders_db

@router.get("/orders/{order_id}", response_model=MedicineOrderResponse)
async def get_medicine_order(order_id: str):
    """Get specific medicine order by ID"""
    for order in medicine_orders_db:
        if order["id"] == order_id:
            return order
    raise HTTPException(status_code=404, detail="Medicine order not found")

@router.put("/orders/{order_id}/status")
async def update_medicine_order_status(order_id: str, status: str):
    """Update medicine order status"""
    valid_statuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]
    if status not in valid_statuses:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
        )
    
    for order in medicine_orders_db:
        if order["id"] == order_id:
            order["status"] = status
            return {"message": f"Status updated to {status}", "order": order}
    
    raise HTTPException(status_code=404, detail="Medicine order not found")

@router.delete("/orders/{order_id}")
async def delete_medicine_order(order_id: str):
    """Delete a medicine order"""
    global medicine_orders_db
    
    for i, order in enumerate(medicine_orders_db):
        if order["id"] == order_id:
            deleted_order = medicine_orders_db.pop(i)
            
            # Restore medicine stock if order was cancelled
            if deleted_order["status"] in ["pending", "confirmed"]:
                for medicine in MEDICINES:
                    if medicine["name"] == deleted_order["medicineName"]:
                        medicine["stock"] += deleted_order["quantity"]
                        if medicine["stock"] > 10:
                            medicine["status"] = "In Stock"
                        break
            
            # Delete associated prescription file if exists
            if deleted_order.get("prescription_file"):
                file_path = f"uploads/prescriptions/{deleted_order['prescription_file']}"
                if os.path.exists(file_path):
                    os.remove(file_path)
            
            return {"message": "Medicine order deleted successfully"}
    
    raise HTTPException(status_code=404, detail="Medicine order not found")

@router.get("/inventory/summary")
async def get_inventory_summary():
    """Get inventory summary statistics"""
    total_medicines = len(MEDICINES)
    in_stock = len([m for m in MEDICINES if m["status"] == "In Stock"])
    low_stock = len([m for m in MEDICINES if m["status"] == "Low Stock"])
    out_of_stock = len([m for m in MEDICINES if m["status"] == "Out of Stock"])
    
    total_value = sum(medicine["price"] * medicine["stock"] for medicine in MEDICINES)
    
    return {
        "total_medicines": total_medicines,
        "in_stock": in_stock,
        "low_stock": low_stock,
        "out_of_stock": out_of_stock,
        "total_inventory_value": round(total_value, 2),
        "categories": len(set(medicine["category"] for medicine in MEDICINES)),
        "manufacturers": len(set(medicine["manufacturer"] for medicine in MEDICINES))
    }
