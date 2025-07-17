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

# Pydantic models for Laboratory
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

# Sample laboratory tests data
LAB_TESTS = [
    {
        "name": "Complete Blood Count (CBC)",
        "category": "Blood Tests",
        "turnaround": "Same Day",
        "location": "Main Laboratory",
        "price": 45.00
    },
    {
        "name": "Lipid Profile",
        "category": "Blood Tests",
        "turnaround": "24 Hours",
        "location": "Outpatient Center",
        "price": 65.00
    },
    {
        "name": "Urinalysis",
        "category": "Urine Tests",
        "turnaround": "Same Day",
        "location": "Main Laboratory",
        "price": 35.00
    },
    {
        "name": "Thyroid Function Test",
        "category": "Blood Tests",
        "turnaround": "48 Hours",
        "location": "Reference Lab",
        "price": 85.00
    },
    {
        "name": "Comprehensive Metabolic Panel",
        "category": "Blood Tests",
        "turnaround": "24 Hours",
        "location": "Main Laboratory",
        "price": 105.00
    },
    {
        "name": "HbA1c",
        "category": "Blood Tests",
        "turnaround": "24 Hours",
        "location": "Outpatient Center",
        "price": 55.00
    },
    {
        "name": "Vitamin D Level",
        "category": "Blood Tests",
        "turnaround": "48 Hours",
        "location": "Reference Lab",
        "price": 75.00
    },
    {
        "name": "Basic Metabolic Panel",
        "category": "Blood Tests",
        "turnaround": "Same Day",
        "location": "Main Laboratory",
        "price": 50.00
    },
    {
        "name": "Liver Function Tests",
        "category": "Blood Tests",
        "turnaround": "24 Hours",
        "location": "Main Laboratory",
        "price": 60.00
    },
    {
        "name": "Urine Culture",
        "category": "Microbiology",
        "turnaround": "24 Hours",
        "location": "Main Laboratory",
        "price": 70.00
    },
    {
        "name": "Complete Urine Analysis",
        "category": "Urine Tests",
        "turnaround": "Same Day",
        "location": "Main Laboratory",
        "price": 30.00
    },
    {
        "name": "Blood Type & Crossmatch",
        "category": "Blood Tests",
        "turnaround": "24 Hours",
        "location": "Main Laboratory",
        "price": 120.00
    },
    {
        "name": "Pregnancy Test (Urine)",
        "category": "Urine Tests",
        "turnaround": "Same Day",
        "location": "Outpatient Center",
        "price": 100.00
    },
    {
        "name": "Coagulation Panel (PT/INR)",
        "category": "Blood Tests",
        "turnaround": "48 Hours",
        "location": "Reference Lab",
        "price": 90.00
    },
    {
        "name": "Strep A Rapid Test",
        "category": "Microbiology",
        "turnaround": "48 Hours",
        "location": "Main Laboratory",
        "price": 50.00
    }
]

# In-memory storage for test requests (in production, use a database)
test_requests_db = []

@router.get("/tests", response_model=List[LabTest])
async def get_all_tests():
    """Get all available laboratory tests"""
    return LAB_TESTS

@router.get("/tests/search")
async def search_tests(
    query: Optional[str] = None,
    category: Optional[str] = None,
    location: Optional[str] = None
):
    """Search laboratory tests by query, category, or location"""
    filtered_tests = LAB_TESTS.copy()
    
    if query:
        query = query.lower()
        filtered_tests = [
            test for test in filtered_tests
            if query in test["name"].lower() or 
               query in test["category"].lower() or 
               query in test["location"].lower()
        ]
    
    if category:
        filtered_tests = [
            test for test in filtered_tests
            if category.lower() in test["category"].lower()
        ]
    
    if location:
        filtered_tests = [
            test for test in filtered_tests
            if location.lower() in test["location"].lower()
        ]
    
    return filtered_tests

@router.get("/tests/categories")
async def get_test_categories():
    """Get all unique test categories"""
    categories = list(set(test["category"] for test in LAB_TESTS))
    return sorted(categories)

@router.get("/tests/locations")
async def get_test_locations():
    """Get all unique test locations"""
    locations = list(set(test["location"] for test in LAB_TESTS))
    return sorted(locations)

@router.get("/tests/{test_name}")
async def get_test_by_name(test_name: str):
    """Get specific test details by name"""
    for test in LAB_TESTS:
        if test["name"].lower() == test_name.lower():
            return test
    raise HTTPException(status_code=404, detail="Test not found")

@router.post("/requests", response_model=TestRequestResponse)
async def create_test_request(request: TestRequest):
    """Create a new test request"""
    # Generate unique ID and timestamp
    request_id = str(uuid.uuid4())
    created_at = datetime.now()
    
    # Create the test request with additional metadata
    test_request_data = {
        "id": request_id,
        "testName": request.testName,
        "patientId": request.patientId,
        "referringDoctor": request.referringDoctor,
        "gender": request.gender,
        "collectionDate": request.collectionDate,
        "preferredTime": request.preferredTime,
        "clinicalInfo": request.clinicalInfo,
        "status": "pending",
        "created_at": created_at,
        "referral_file": None
    }
    
    # Store in memory (use database in production)
    test_requests_db.append(test_request_data)
    
    return test_request_data

@router.post("/requests/{request_id}/upload-referral")
async def upload_referral(
    request_id: str,
    file: UploadFile = File(...)
):
    """Upload doctor's referral for a test request"""
    # Find the test request
    test_request = None
    for req in test_requests_db:
        if req["id"] == request_id:
            test_request = req
            break
    
    if not test_request:
        raise HTTPException(status_code=404, detail="Test request not found")
    
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
    filename = f"{request_id}_referral{file_extension}"
    file_path = f"uploads/referrals/{filename}"
    
    async with aiofiles.open(file_path, 'wb') as f:
        await f.write(content)
    
    # Update test request with file path
    test_request["referral_file"] = filename
    
    return {
        "message": "Referral uploaded successfully",
        "filename": filename,
        "file_size": len(content)
    }

@router.get("/requests", response_model=List[TestRequestResponse])
async def get_all_test_requests():
    """Get all test requests"""
    return test_requests_db

@router.get("/requests/{request_id}", response_model=TestRequestResponse)
async def get_test_request(request_id: str):
    """Get specific test request by ID"""
    for request in test_requests_db:
        if request["id"] == request_id:
            return request
    raise HTTPException(status_code=404, detail="Test request not found")

@router.put("/requests/{request_id}/status")
async def update_test_request_status(request_id: str, status: str):
    """Update test request status"""
    valid_statuses = ["pending", "confirmed", "in_progress", "completed", "cancelled"]
    if status not in valid_statuses:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
        )
    
    for request in test_requests_db:
        if request["id"] == request_id:
            request["status"] = status
            return {"message": f"Status updated to {status}", "request": request}
    
    raise HTTPException(status_code=404, detail="Test request not found")

@router.delete("/requests/{request_id}")
async def delete_test_request(request_id: str):
    """Delete a test request"""
    global test_requests_db
    
    for i, request in enumerate(test_requests_db):
        if request["id"] == request_id:
            deleted_request = test_requests_db.pop(i)
            
            # Delete associated referral file if exists
            if deleted_request.get("referral_file"):
                file_path = f"uploads/referrals/{deleted_request['referral_file']}"
                if os.path.exists(file_path):
                    os.remove(file_path)
            
            return {"message": "Test request deleted successfully"}
    
    raise HTTPException(status_code=404, detail="Test request not found")
