import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, of } from 'rxjs';
import { map } from 'rxjs/operators';

export interface AppointmentHistory {
  appointment_date: string;
  appointment_time: string;
  reschedule_reason?: string;
  rescheduled_at: string;
}

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
  reschedule_reason?: string;
  created_at?: string;
  reschedule_history?: AppointmentHistory[];
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = 'http://localhost:8000/api/appointments';
  private appointments = new BehaviorSubject<Appointment[]>([]);

  constructor(private http: HttpClient) {
    this.loadAppointments();
  }

  // Load all appointments from backend
  loadAppointments(): void {
    this.http.get<Appointment[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error loading appointments:', error);
        return of([]); // Return empty array on error
      })
    ).subscribe(appointments => {
      this.appointments.next(appointments);
    });
  }

  // Get all appointments
  getAppointments(): Observable<Appointment[]> {
    return this.appointments.asObservable();
  }

  // Get today's appointments only
  getTodayAppointments(): Observable<Appointment[]> {
    const today = new Date().getDate(); // Gets today's numerical date (18)
    return this.getAppointments().pipe(
      map(appointments => {
        const todayApps = appointments.filter(app => {
          const appointmentDay = new Date(app.appointment_date).getDate();
          return appointmentDay === today;
        });
        return todayApps;
      })
    );
  }

  getPatientAppointments(patientId: string): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/patient/${patientId}`);
  }

  createAppointment(appointment: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>(this.apiUrl, appointment);
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
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  
  updateAppointmentStatus(id: string, status: string): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.apiUrl}/${id}`, { status });
  }

  // Doctor-specific methods
  getDoctorAppointments(doctorId: string, status?: string): Observable<Appointment[]> {
    const params = status ? `?status=${status}` : '';
    return this.http.get<Appointment[]>(`${this.apiUrl}/doctor/${doctorId}${params}`);
  }

  approveAppointment(appointmentId: string): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.apiUrl}/${appointmentId}/approve`, {});
  }
  
  rejectAppointment(appointmentId: string, rejectionReason: string): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.apiUrl}/${appointmentId}/reject`, {
      rejection_reason: rejectionReason
    });
  }

  getAppointmentById(appointmentId: string): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.apiUrl}/${appointmentId}`);
  }

  rescheduleAppointment(appointmentId: string, rescheduleData: {
    appointment_id: string;
    doctor_id: string;
    doctor_name: string;
    doctor_specialty: string;
    patient_id: string;
    patient_name: string;
    appointment_date: string;
    appointment_time: string;
    reason: string;
    reschedule_reason: string;
  }): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.apiUrl}/${appointmentId}/reschedule`, rescheduleData);
  }
}