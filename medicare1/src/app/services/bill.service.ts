import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BillItem {
  description: string;
  amount: number;
}

export interface Bill {
  id?: string;
  billNumber: string;
  patientId: string;
  patientName: string;
  billItems: BillItem[];
  totalAmount: number;
  createdAt: string;
  status: 'pending' | 'paid' | 'overdue';
}

export interface BillCreate {
  billNumber: string;
  patientId: string;
  patientName: string;
  billItems: BillItem[];
  totalAmount: number;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BillService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  createBill(bill: BillCreate): Observable<Bill> {
    return this.http.post<Bill>(`${this.apiUrl}/bills`, bill);
  }

  getAllBills(): Observable<Bill[]> {
    return this.http.get<Bill[]>(`${this.apiUrl}/bills`);
  }

  getPatientBills(patientId: string): Observable<Bill[]> {
    return this.http.get<Bill[]>(`${this.apiUrl}/bills/patient/${patientId}`);
  }

  getBill(billId: string): Observable<Bill> {
    return this.http.get<Bill>(`${this.apiUrl}/bills/${billId}`);
  }

  updateBillStatus(billId: string, status: string): Observable<Bill> {
    return this.http.put<Bill>(`${this.apiUrl}/bills/${billId}`, { status });
  }

  deleteBill(billId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/bills/${billId}`);
  }
}
