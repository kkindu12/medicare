import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Appointment {
  id: number;
  doctorName: string;
  doctorSpecialty: string;
  date: string;
  time: string;
  reason: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private appointments = new BehaviorSubject<Appointment[]>([]);
  private nextId = 1;

  constructor() {
    // Load initial appointments
    const initialAppointments: Appointment[] = [
      {
        id: 1,
        doctorName: 'John Smith',
        doctorSpecialty: 'Cardiology',
        date: '2025-06-11',
        time: '10:00 AM',
        reason: 'Regular checkup',
        status: 'scheduled'
      },
      {
        id: 2,
        doctorName: 'Sarah Johnson',
        doctorSpecialty: 'Pediatrics',
        date: '2025-06-15',
        time: '02:00 PM',
        reason: 'Follow-up consultation',
        status: 'scheduled'
      }
    ];
    this.appointments.next(initialAppointments);
    this.nextId = initialAppointments.length + 1;
  }

  getAppointments(): Observable<Appointment[]> {
    return this.appointments.asObservable();
  }

  addAppointment(appointment: Omit<Appointment, 'id'>): void {
    const currentAppointments = this.appointments.value;
    const newAppointment = {
      ...appointment,
      id: this.nextId++
    };
    this.appointments.next([...currentAppointments, newAppointment]);
  }

  cancelAppointment(id: number): void {
    const currentAppointments = this.appointments.value;
    const updatedAppointments = currentAppointments.filter(app => app.id !== id);
    this.appointments.next(updatedAppointments);
  }

  updateAppointmentStatus(id: number, status: 'scheduled' | 'completed' | 'cancelled'): void {
    const currentAppointments = this.appointments.value;
    const updatedAppointments = currentAppointments.map(app => 
      app.id === id ? { ...app, status } : app
    );
    this.appointments.next(updatedAppointments);
  }

  rescheduleAppointment(id: number, newDate: string, newTime: string, reason: string): void {
    const currentAppointments = this.appointments.value;
    const updatedAppointments = currentAppointments.map(app => 
      app.id === id ? { 
        ...app, 
        date: newDate,
        time: newTime,
        reason: reason
      } : app
    );
    this.appointments.next(updatedAppointments);
  }
} 