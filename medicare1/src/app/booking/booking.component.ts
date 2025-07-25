import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AppointmentService } from '../services/appointment.service';
import { DoctorService, Doctor } from '../services/doctorService/doctor.service';
import { AuthService } from '../services/auth.service';
import { AlertService } from '../shared/alert/alert.service';
import { NotificationService } from '../services/notification.service';

interface Booking {
  doctor: string;
  date: string;
  time: string;
  reason: string;
}

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule]
})
export class BookingComponent implements OnInit {
  doctors: Doctor[] = [];
  isLoading = false;
  error: string | null = null;

  availableTimes: string[] = [
    '09:00 AM', '10:00 AM', '11:00 AM',
    '02:00 PM', '03:00 PM', '04:00 PM'
  ];

  booking: Booking = {
    doctor: '',
    date: '',
    time: '',
    reason: ''
  };  constructor(
    private router: Router,
    private appointmentService: AppointmentService,
    private doctorService: DoctorService,
    private authService: AuthService,
    private alertService: AlertService,
    private notificationService: NotificationService
  ) {}ngOnInit(): void {
    // Check if user is logged in
    if (!this.authService.isLoggedIn()) {
      this.alertService.showWarning('Authentication Required', 'Please log in to book an appointment');
      this.router.navigate(['/signin']);
      return;
    }

    // Check if user is a patient
    if (!this.authService.isPatient()) {
      this.alertService.showWarning('Access Denied', 'Only patients can book appointments');
      this.router.navigate(['/doctor-dashboard']);
      return;
    }

    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('date') as HTMLInputElement;
    if (dateInput) {
      dateInput.min = today;
    }
    
    // Load doctors from backend
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.isLoading = true;
    this.error = null;
    
    this.doctorService.getDoctors().subscribe({
      next: (doctors) => {
        this.doctors = doctors;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading doctors:', error);
        this.error = 'Failed to load doctors. Please try again.';
        this.isLoading = false;
      }
    });
  }  onSubmit(): void {
    const selectedDoctor = this.doctors.find(d => d.id === this.booking.doctor);
      if (!selectedDoctor) {
      this.alertService.showWarning('Missing Information', 'Please select a doctor');
      return;
    }

    // Get current user from auth service
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser || !currentUser.id) {
      this.alertService.showWarning('Authentication Required', 'Please log in to book an appointment');
      this.router.navigate(['/signin']);
      return;
    }

    const newAppointment = {
      doctor_id: selectedDoctor.id,
      doctor_name: `${selectedDoctor.firstName} ${selectedDoctor.lastName}`,
      doctor_specialty: selectedDoctor.doctorDetails?.highestQualifications || 'General Practice',
      patient_id: currentUser.id,
      patient_name: `${currentUser.firstName} ${currentUser.lastName}`,
      appointment_date: this.booking.date,
      appointment_time: this.booking.time,
      reason: this.booking.reason    };

    // Show loading state
    this.isLoading = true;    this.appointmentService.addAppointment(newAppointment).subscribe({      next: (createdAppointment) => {
        // Create notification for the doctor about the new appointment
        const notificationRequest = {
          userId: selectedDoctor.id, // Doctor will receive the notification
          title: 'New Appointment Request',
          message: `${currentUser.firstName} ${currentUser.lastName} has booked an appointment for ${this.booking.date} at ${this.booking.time}`,
          type: 'appointment' as const,
          relatedRecordId: createdAppointment.id,
          createdBy: currentUser.id,
          createdByName: `${currentUser.firstName} ${currentUser.lastName}`
        };

        // Send notification to doctor
        this.notificationService.createNotification(notificationRequest).subscribe({
          next: (notification) => {
            console.log('✅ Notification sent to doctor:', notification);
          },
          error: (notificationError) => {
            console.error('❌ Failed to send notification to doctor:', notificationError);
            // Don't show error to user as appointment was successful
          }
        });

        this.isLoading = false;
        this.alertService.showSuccess('Appointment Booked', 'Your appointment has been booked successfully!');
        // Navigate to patient dashboard appointments tab
        this.router.navigate(['/patient-dashboard'], { 
          queryParams: { tab: 'appointments' } 
        });
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error booking appointment:', error);
        this.alertService.showError('Booking Failed', 'Failed to book appointment. Please try again.');
      }
    });
  }
  goBack(): void {
    this.router.navigate(['/patient-dashboard']);
  }
  goToMyAppointments(): void {
    this.router.navigate(['/patient-dashboard'], { 
      queryParams: { tab: 'appointments' } 
    });
  }
}