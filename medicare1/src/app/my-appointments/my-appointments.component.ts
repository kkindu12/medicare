import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppointmentService, Appointment } from '../services/appointment.service';
import { Subscription } from 'rxjs';
import { RescheduleModalComponent } from '../reschedule-modal/reschedule-modal.component';

@Component({
  selector: 'app-my-appointments',
  templateUrl: './my-appointments.component.html',
  styleUrls: ['./my-appointments.component.scss'],
  standalone: true,
  imports: [CommonModule, RescheduleModalComponent]
})
export class MyAppointmentsComponent implements OnInit, OnDestroy {
  appointments: Appointment[] = [];
  private subscription: Subscription;
  showRescheduleModal = false;
  selectedAppointment: Appointment | null = null;

  constructor(
    private router: Router,
    private appointmentService: AppointmentService
  ) {
    this.subscription = this.appointmentService.getAppointments().subscribe(
      appointments => this.appointments = appointments
    );
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  goToBooking(): void {
    this.router.navigate(['/booking']);
  }

  rescheduleAppointment(appointment: Appointment): void {
    this.selectedAppointment = appointment;
    this.showRescheduleModal = true;
  }

  handleReschedule(data: { id: number; date: string; time: string; reason: string }): void {
    this.appointmentService.rescheduleAppointment(
      data.id,
      data.date,
      data.time,
      data.reason
    );
    this.showRescheduleModal = false;
    this.selectedAppointment = null;
    alert('Appointment rescheduled successfully!');
  }

  closeRescheduleModal(): void {
    this.showRescheduleModal = false;
    this.selectedAppointment = null;
  }

  cancelAppointment(appointment: Appointment): void {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      this.appointmentService.cancelAppointment(appointment.id);
      alert('Appointment cancelled successfully!');
    }
  }
} 