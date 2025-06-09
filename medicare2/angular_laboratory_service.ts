
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
