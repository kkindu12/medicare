import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface AppointmentHistory {
  appointment_date: string;
  appointment_time: string;
  reschedule_reason?: string;
  rescheduled_at: string;
}

export interface AppointmentCard {
  id?: string;
  doctor_id?: string;
  doctor_name: string;
  doctor_specialty: string;
  patient_id?: string;
  patient_name?: string;
  appointment_date: string;
  appointment_time: string;
  reason?: string;
  status: string;
  created_at?: string;
  reschedule_history?: AppointmentHistory[];
}

@Component({
  selector: 'app-appointment-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointment-card.component.html',
  styleUrl: './appointment-card.component.scss'
})
export class AppointmentCardComponent {
  @Input() appointment!: AppointmentCard;
  @Output() reschedule = new EventEmitter<AppointmentCard>();
  @Output() cancel = new EventEmitter<AppointmentCard>();

  onReschedule() {
    this.reschedule.emit(this.appointment);
  }

  onCancel() {
    this.cancel.emit(this.appointment);
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-warning text-dark';
      case 'confirmed':
        return 'bg-success';
      case 'completed':
        return 'bg-info';
      case 'cancelled':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }

  getStatusIcon(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bi-clock';
      case 'confirmed':
        return 'bi-check-circle';
      case 'completed':
        return 'bi-check-circle-fill';
      case 'cancelled':
        return 'bi-x-circle';
      default:
        return 'bi-circle';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatTime(timeString: string): string {
    // If time is already formatted (e.g., "10:00 AM"), return as is
    if (timeString.includes('AM') || timeString.includes('PM')) {
      return timeString;
    }
    
    // Otherwise, try to format it
    try {
      const time = new Date(`1970-01-01T${timeString}`);
      return time.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return timeString;
    }
  }

  canReschedule(): boolean {
    return this.appointment.status.toLowerCase() === 'pending';
  }

  canCancel(): boolean {
    return this.appointment.status.toLowerCase() === 'pending' || 
           this.appointment.status.toLowerCase() === 'confirmed';
  }
}
