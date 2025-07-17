"""
Medicare API Service for Angular Frontend Integration
This file provides TypeScript service examples for connecting the Angular frontend to the FastAPI backend
"""

from typing import Dict, Any

# Angular Service Template for Laboratory
LABORATORY_SERVICE_TS = """
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LabTest {
  name: string;
  category: string;
  turnaround: string;
  location: string;
  price: number;
}

export interface TestRequest {
  testName: string;
  patientId: string;
  referringDoctor: string;
  gender: string;
  collectionDate: string;
  preferredTime: string;
  clinicalInfo: string;
  id?: string;
  status?: string;
  created_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LaboratoryService {
  private apiUrl = 'http://localhost:8000/api/laboratory';

  constructor(private http: HttpClient) { }

  // Get all laboratory tests
  getTests(): Observable<LabTest[]> {
    return this.http.get<LabTest[]>(`${this.apiUrl}/tests`);
  }

  // Search tests
  searchTests(query: string, category?: string, location?: string): Observable<LabTest[]> {
    let params = `?q=${query}`;
    if (category) params += `&category=${category}`;
    if (location) params += `&location=${location}`;
    return this.http.get<LabTest[]>(`${this.apiUrl}/tests/search${params}`);
  }

  // Get test categories
  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/tests/categories`);
  }

  // Get test locations
  getLocations(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/tests/locations`);
  }

  // Submit test request
  submitTestRequest(request: TestRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/requests`, request);
  }

  // Upload referral file
  uploadReferral(requestId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/requests/${requestId}/upload-referral`, formData);
  }

  // Get all test requests
  getTestRequests(): Observable<TestRequest[]> {
    return this.http.get<TestRequest[]>(`${this.apiUrl}/requests`);
  }
}
"""

# Angular Service Template for Pharmacy
PHARMACY_SERVICE_TS = """
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Medicine {
  name: string;
  category: string;
  manufacturer: string;
  expires: string;
  price: number;
  stock: number;
  status: string;
}

export interface MedicineOrder {
  medicineName: string;
  quantity: number;
  patientId: string;
  prescriptionId: string;
  address: string;
  notes: string;
  id?: string;
  status?: string;
  created_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PharmacyService {
  private apiUrl = 'http://localhost:8000/api/pharmacy';

  constructor(private http: HttpClient) { }

  // Get all medicines
  getMedicines(): Observable<Medicine[]> {
    return this.http.get<Medicine[]>(`${this.apiUrl}/medicines`);
  }

  // Search medicines
  searchMedicines(query: string, category?: string, availability?: string): Observable<Medicine[]> {
    let params = `?q=${query}`;
    if (category) params += `&category=${category}`;
    if (availability) params += `&availability=${availability}`;
    return this.http.get<Medicine[]>(`${this.apiUrl}/medicines/search${params}`);
  }

  // Get medicine categories
  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/medicines/categories`);
  }

  // Submit medicine order
  submitOrder(order: MedicineOrder): Observable<any> {
    return this.http.post(`${this.apiUrl}/orders`, order);
  }

  // Upload prescription file
  uploadPrescription(orderId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/orders/${orderId}/upload-prescription`, formData);
  }

  // Get all orders
  getOrders(): Observable<MedicineOrder[]> {
    return this.http.get<MedicineOrder[]>(`${this.apiUrl}/orders`);
  }
}
"""

def save_angular_services():
    """Save Angular service templates to files"""
    with open("angular_laboratory_service.ts", "w") as f:
        f.write(LABORATORY_SERVICE_TS)
    
    with open("angular_pharmacy_service.ts", "w") as f:
        f.write(PHARMACY_SERVICE_TS)

if __name__ == "__main__":
    save_angular_services()
    print("Angular service templates created successfully!")
