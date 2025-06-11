import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AppointmentService, Appointment } from '../services/appointment.service';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-my-appointments',
  templateUrl: './my-appointments.component.html',
  styleUrls: ['./my-appointments.component.scss'],
  standalone: true,
  imports: [CommonModule, HttpClientModule]
})
export class MyAppointmentsComponent implements OnInit, OnDestroy {
  appointments: Appointment[] = [];
  isLoading = false;
  private subscription?: Subscription;
  constructor(
    private router: Router,
    private appointmentService: AppointmentService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
  }
  loadAppointments(): void {
    // Check if user is logged in
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/signin']);
      return;
    }

    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser || !currentUser.id) {
      this.router.navigate(['/signin']);
      return;
    }

    this.isLoading = true;
    this.subscription = this.appointmentService.getPatientAppointments(currentUser.id).subscribe({
      next: (appointments) => {
        this.appointments = appointments;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading appointments:', error);
        this.isLoading = false;
      }
    });
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
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
      if (appointment.id) {
        this.appointmentService.cancelAppointment(appointment.id).subscribe({
          next: () => {
            alert('Appointment cancelled successfully!');
            this.loadAppointments(); // Reload appointments
          },
          error: (error) => {
            console.error('Error cancelling appointment:', error);
            alert('Failed to cancel appointment. Please try again.');
          }
        });
      }
    }
  }
}