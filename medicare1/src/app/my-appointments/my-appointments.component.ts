import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AppointmentService, Appointment } from '../services/appointment.service';
import { AuthService } from '../services/auth.service';
import { AlertService } from '../shared/alert/alert.service';
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
  private subscription?: Subscription;  constructor(
    private router: Router,
    private appointmentService: AppointmentService,
    private authService: AuthService,
    private alertService: AlertService
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
    if (!appointment.id) {
      this.alertService.showError('Error', 'Cannot reschedule appointment without ID');
      return;
    }
    
    // Navigate to reschedule appointment page with appointment ID
    this.router.navigate(['/reschedule-appointment', appointment.id]);
  }
  async cancelAppointment(appointment: Appointment): Promise<void> {
    const confirmed = await this.alertService.showConfirm(
      'Cancel Appointment', 
      'Are you sure you want to cancel this appointment?',
      'Yes, Cancel',
      'Keep Appointment'
    );
    
    if (confirmed && appointment.id) {
      this.appointmentService.cancelAppointment(appointment.id).subscribe({
        next: () => {
          this.alertService.showSuccess('Appointment Cancelled', 'Your appointment has been cancelled successfully!');
          this.loadAppointments(); // Reload appointments
        },
        error: (error) => {
          console.error('Error cancelling appointment:', error);
          this.alertService.showError('Cancellation Failed', 'Failed to cancel appointment. Please try again.');
        }
      });
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}