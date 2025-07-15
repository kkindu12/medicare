import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: boolean;
  doctorDetails?: {
    usualStartingTime: string;
    usualEndingTime: string;
    experience: number;
    highestQualifications: string;
    registrationNumber: string;
    registrationAuthority: string;
    registrationDate: string;
    feeForAppointment: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.apiUrl}/api/users/doctors`);
  }

  getDoctor(id: string): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.apiUrl}/api/users/${id}`);
  }
}
