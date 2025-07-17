import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AppointmentService, Appointment } from '../services/appointment.service';
import { DoctorService, Doctor } from '../services/doctorService/doctor.service';
import { AuthService } from '../services/auth.service';
import { AlertService } from '../shared/alert/alert.service';
import { NotificationService } from '../services/notification.service';

interface RescheduleData {
  doctor: string;
  date: string;
  time: string;
  reschedule_reason: string;
}

@Component({
  selector: 'app-reschedule-appointment',
  templateUrl: './reschedule-appointment.component.html',
  styleUrls: ['./reschedule-appointment.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule]
})
export class RescheduleAppointmentComponent implements OnInit {
  doctors: Doctor[] = [];
  isLoading = false;
  error: string | null = null;
  appointmentId: string | null = null;
  originalAppointment: Appointment | null = null;

  availableTimes: string[] = [
    '09:00 AM', '10:00 AM', '11:00 AM',
    '02:00 PM', '03:00 PM', '04:00 PM'
  ];

  rescheduleData: RescheduleData = {
    doctor: '',
    date: '',
    time: '',
    reschedule_reason: ''
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private appointmentService: AppointmentService,
    private doctorService: DoctorService,
    private authService: AuthService,
    private alertService: AlertService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    // Check if user is logged in
    if (!this.authService.isLoggedIn()) {
      this.alertService.showWarning('Authentication Required', 'Please log in to reschedule an appointment');
      this.router.navigate(['/signin']);
      return;
    }

    // Check if user is a patient
    if (!this.authService.isPatient()) {
      this.alertService.showWarning('Access Denied', 'Only patients can reschedule appointments');
      this.router.navigate(['/doctor-dashboard']);
      return;
    }

    // Get appointment ID from route parameters
    this.appointmentId = this.route.snapshot.paramMap.get('id');
    if (!this.appointmentId) {
      this.alertService.showError('Invalid Request', 'Appointment ID not found');
      this.router.navigate(['/patient-dashboard']);
      return;
    }

    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('date') as HTMLInputElement;
    if (dateInput) {
      dateInput.min = today;
    }
    
    // Load doctors and original appointment
    this.loadDoctors();
    this.loadOriginalAppointment();
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
  }

  loadOriginalAppointment(): void {
    if (!this.appointmentId) return;

    this.appointmentService.getAppointmentById(this.appointmentId).subscribe({
      next: (appointment: Appointment) => {
        this.originalAppointment = appointment;
        // Pre-fill form with original appointment data
        this.rescheduleData.doctor = appointment.doctor_id;
        this.rescheduleData.date = appointment.appointment_date;
        this.rescheduleData.time = appointment.appointment_time;
      },
      error: (error: any) => {
        console.error('Error loading appointment:', error);
        this.alertService.showError('Error', 'Failed to load appointment details');
        this.router.navigate(['/patient-dashboard']);
      }
    });
  }

  onSubmit(): void {
    if (!this.appointmentId || !this.originalAppointment) {
      this.alertService.showError('Error', 'Original appointment data not found');
      return;
    }

    const selectedDoctor = this.doctors.find(d => d.id === this.rescheduleData.doctor);
    if (!selectedDoctor) {
      this.alertService.showWarning('Missing Information', 'Please select a doctor');
      return;
    }

    if (!this.rescheduleData.reschedule_reason.trim()) {
      this.alertService.showWarning('Missing Information', 'Please provide a reason for rescheduling');
      return;
    }

    // Get current user from auth service
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser || !currentUser.id) {
      this.alertService.showWarning('Authentication Required', 'Please log in to reschedule an appointment');
      this.router.navigate(['/signin']);
      return;
    }

    const rescheduleRequest = {
      appointment_id: this.appointmentId,
      doctor_id: selectedDoctor.id,
      doctor_name: `${selectedDoctor.firstName} ${selectedDoctor.lastName}`,
      doctor_specialty: selectedDoctor.doctorDetails?.highestQualifications || 'General Practice',
      patient_id: currentUser.id,
      patient_name: `${currentUser.firstName} ${currentUser.lastName}`,
      appointment_date: this.rescheduleData.date,
      appointment_time: this.rescheduleData.time,
      reason: this.originalAppointment.reason,
      reschedule_reason: this.rescheduleData.reschedule_reason
    };

    // Show loading state
    this.isLoading = true;

    this.appointmentService.rescheduleAppointment(this.appointmentId, rescheduleRequest).subscribe({
      next: (updatedAppointment: Appointment) => {
        // Create notification for the doctor about the rescheduled appointment
        const notificationRequest = {
          userId: selectedDoctor.id, // Doctor will receive the notification
          title: 'Appointment Rescheduled',
          message: `${currentUser.firstName} ${currentUser.lastName} has rescheduled their appointment to ${this.rescheduleData.date} at ${this.rescheduleData.time}. Reason: ${this.rescheduleData.reschedule_reason}`,
          type: 'appointment' as const,
          relatedRecordId: updatedAppointment.id,
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
            // Don't show error to user as reschedule was successful
          }
        });

        this.isLoading = false;
        this.alertService.showSuccess('Appointment Rescheduled', 'Your appointment has been rescheduled successfully!');
        // Navigate to patient dashboard appointments tab
        this.router.navigate(['/patient-dashboard'], { 
          queryParams: { tab: 'appointments' } 
        });
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('Error rescheduling appointment:', error);
        this.alertService.showError('Reschedule Failed', 'Failed to reschedule appointment. Please try again.');
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
