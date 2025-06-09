#!/usr/bin/env python3
"""
Test script for Medicare FastAPI backend
Tests all major endpoints to ensure they're working correctly
"""

import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"

def test_endpoint(endpoint, method="GET", data=None, files=None):
    """Test an API endpoint and return the result"""
    try:
        url = f"{BASE_URL}{endpoint}"
        
        if method == "GET":
            response = requests.get(url)
        elif method == "POST":
            if files:
                response = requests.post(url, data=data, files=files)
            else:
                response = requests.post(url, json=data)
        elif method == "PUT":
            response = requests.put(url, json=data)
        elif method == "DELETE":
            response = requests.delete(url)
        
        print(f"✅ {method} {endpoint} - Status: {response.status_code}")
        if response.status_code != 200:
            print(f"   Error: {response.text}")
        return response
    except Exception as e:
        print(f"❌ {method} {endpoint} - Error: {str(e)}")
        return None

def main():
    """Run all API tests"""
    print("🧪 Testing Medicare FastAPI Backend")
    print("=" * 50)
    
    # Test root endpoint
    print("\n📍 Testing Root Endpoints:")
    test_endpoint("/")
    test_endpoint("/health")
      # Test Laboratory endpoints
    print("\n🔬 Testing Laboratory Endpoints:")
    test_endpoint("/api/laboratory/tests")
    test_endpoint("/api/laboratory/requests")
    test_endpoint("/api/laboratory/tests/categories")
    test_endpoint("/api/laboratory/tests/locations")
    
    # Test a sample test request
    test_request_data = {
        "testName": "Complete Blood Count (CBC)",
        "patientId": "P001",
        "referringDoctor": "Dr. Smith",
        "gender": "Male",
        "collectionDate": "2025-06-08",
        "preferredTime": "10:00 AM",
        "clinicalInfo": "Routine checkup"
    }
    test_endpoint("/api/laboratory/requests", "POST", test_request_data)
    
    # Test Pharmacy endpoints
    print("\n💊 Testing Pharmacy Endpoints:")
    test_endpoint("/api/pharmacy/medicines")
    test_endpoint("/api/pharmacy/orders")
    
    # Test a sample medicine order
    order_data = {
        "medicineName": "Amoxicillin 500mg",
        "quantity": 2,
        "patientId": "P001",
        "prescriptionId": "RX001",
        "address": "123 Main St",
        "notes": "Take with food"
    }
    test_endpoint("/api/pharmacy/orders", "POST", order_data)
    
    print("\n🎉 API Testing Complete!")
    print("Check the results above for any errors.")

if __name__ == "__main__":
    main()
