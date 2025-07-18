from fastapi import APIRouter, HTTPException
from models.bill import Bill, BillCreate, BillUpdate
from services.database import get_db
from bson import ObjectId
from typing import List
from datetime import datetime

router = APIRouter()

@router.post("/bills", response_model=Bill)
async def create_bill(bill: BillCreate):
    bill_dict = bill.dict()
    bill_dict["createdAt"] = datetime.now()
    result = get_db().bills.insert_one(bill_dict)
    bill_dict["id"] = str(result.inserted_id)
    return Bill(**bill_dict)

@router.get("/bills", response_model=List[Bill])
async def get_all_bills():
    bills = []
    for bill in get_db().bills.find():
        bill["id"] = str(bill["_id"])
        bill.pop("_id")
        bills.append(Bill(**bill))
    return bills

@router.get("/bills/patient/{patient_id}", response_model=List[Bill])
async def get_patient_bills(patient_id: str):
    bills = []
    for bill in get_db().bills.find({"patientId": patient_id}):
        bill["id"] = str(bill["_id"])
        bill.pop("_id")
        bills.append(Bill(**bill))
    return bills

@router.get("/bills/{bill_id}", response_model=Bill)
async def get_bill(bill_id: str):
    bill = get_db().bills.find_one({"_id": ObjectId(bill_id)})
    if not bill:
        raise HTTPException(status_code=404, detail="Bill not found")
    bill["id"] = str(bill["_id"])
    bill.pop("_id")
    return Bill(**bill)

@router.put("/bills/{bill_id}", response_model=Bill)
async def update_bill(bill_id: str, bill_update: BillUpdate):
    update_data = {k: v for k, v in bill_update.dict().items() if v is not None}
    if update_data:
        result = get_db().bills.update_one(
            {"_id": ObjectId(bill_id)}, {"$set": update_data}
        )
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Bill not found")
    
    bill = get_db().bills.find_one({"_id": ObjectId(bill_id)})
    bill["id"] = str(bill["_id"])
    bill.pop("_id")
    return Bill(**bill)

@router.delete("/bills/{bill_id}")
async def delete_bill(bill_id: str):
    result = get_db().bills.delete_one({"_id": ObjectId(bill_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Bill not found")
    return {"message": "Bill deleted successfully"}
