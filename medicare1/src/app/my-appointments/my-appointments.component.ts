import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppointmentService, Appointment } from '../services/appointment.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-my-appointments',
  templateUrl: './my-appointments.component.html',
  styleUrls: ['./my-appointments.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class MyAppointmentsComponent implements OnInit, OnDestroy {
  appointments: Appointment[] = [];
  private subscription: Subscription;

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
    // Here you would typically open a rescheduling modal or navigate to a rescheduling page
    console.log('Rescheduling appointment:', appointment);
    alert('Rescheduling functionality will be implemented soon!');
  }

  cancelAppointment(appointment: Appointment): void {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      this.appointmentService.cancelAppointment(appointment.id);
      alert('Appointment cancelled successfully!');
    }
  }
} 