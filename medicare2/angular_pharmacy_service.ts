
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
