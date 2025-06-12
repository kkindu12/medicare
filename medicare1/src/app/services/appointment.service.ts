import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Appointment {
  id?: string;
  doctor_id: string;
  doctor_name: string;
  doctor_specialty: string;
  patient_id: string;
  patient_name: string;
  appointment_date: string;
  appointment_time: string;
  reason: string;
  status: string;
  rejection_reason?: string;
  created_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = environment.apiUrl;
  private appointments = new BehaviorSubject<Appointment[]>([]);

  constructor(private http: HttpClient) {
    this.loadAppointments();
  }

  private loadAppointments(): void {
    // For now, keep some initial mock data
    const initialAppointments: Appointment[] = [];
    this.appointments.next(initialAppointments);
  }

  getAppointments(): Observable<Appointment[]> {
    return this.appointments.asObservable();
  }

  getPatientAppointments(patientId: string): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/api/appointments/patient/${patientId}`);
  }

  createAppointment(appointment: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.apiUrl}/api/appointments`, appointment);
  }
  addAppointment(appointmentData: {
    doctor_id: string;
    doctor_name: string;
    doctor_specialty: string;
    appointment_date: string;
    appointment_time: string;
    reason: string;
    patient_id: string;
    patient_name: string;
  }): Observable<Appointment> {
    const appointment: Appointment = {
      ...appointmentData,
      status: 'pending'
    };

    // Add to backend and return the Observable
    return this.createAppointment(appointment);
  }

  cancelAppointment(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/appointments/${id}`);
  }  updateAppointmentStatus(id: string, status: string): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.apiUrl}/api/appointments/${id}`, { status });
  }

  // Doctor-specific methods
  getDoctorAppointments(doctorId: string, status?: string): Observable<Appointment[]> {
    const params = status ? `?status=${status}` : '';
    return this.http.get<Appointment[]>(`${this.apiUrl}/api/appointments/doctor/${doctorId}${params}`);
  }

  approveAppointment(appointmentId: string): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.apiUrl}/api/appointments/${appointmentId}/approve`, {});
  }
  rejectAppointment(appointmentId: string, rejectionReason: string): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.apiUrl}/api/appointments/${appointmentId}/reject`, {
      rejection_reason: rejectionReason
    });
  }
}