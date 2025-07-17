import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppointmentService, Appointment } from '../services/appointment.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reception-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reception-dashboard.component.html',
  styleUrls: ['./reception-dashboard.component.scss']
})
export class ReceptionDashboardComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private appointmentService: AppointmentService
  ) {}

  // Subscriptions
  private appointmentSubscription?: Subscription;
  private todayAppointmentSubscription?: Subscription;

  // Loading states
  isLoadingAppointments = false;
  appointmentError: string | null = null;

  // Appointment data from backend
  allAppointments: Appointment[] = [];
  todayAppointments: Appointment[] = [];
  appointmentFilter: 'today' | 'all' = 'today';

  ngOnInit(): void {
    this.loadAppointments();
    this.loadTodayAppointments();
  }

  ngOnDestroy(): void {
    if (this.appointmentSubscription) {
      this.appointmentSubscription.unsubscribe();
    }
    if (this.todayAppointmentSubscription) {
      this.todayAppointmentSubscription.unsubscribe();
    }
  }

  // Load all appointments from backend
  loadAppointments(): void {
    this.isLoadingAppointments = true;
    this.appointmentError = null;

    this.appointmentSubscription = this.appointmentService.getAppointments().subscribe({
      next: (appointments) => {
        this.allAppointments = appointments;
        this.isLoadingAppointments = false;
      },
      error: (error) => {
        console.error('Error loading appointments:', error);
        this.appointmentError = 'Failed to load appointments. Please try again.';
        this.isLoadingAppointments = false;
      }
    });
  }

  // Load today's appointments
  loadTodayAppointments(): void {
    this.todayAppointmentSubscription = this.appointmentService.getTodayAppointments().subscribe({
      next: (appointments) => {
        this.todayAppointments = appointments;
      },
      error: (error) => {
        console.error('Error loading today\'s appointments:', error);
      }
    });
  }

  // Refresh appointments data
  refreshAppointments(): void {
    this.appointmentService.loadAppointments();
    this.loadAppointments();
    this.loadTodayAppointments();
  }

  // Get filtered appointments based on current filter
  getFilteredAppointments(): Appointment[] {
    return this.appointmentFilter === 'today' ? this.todayAppointments : this.allAppointments;
  }

  // Set appointment filter
  setAppointmentFilter(filter: 'today' | 'all'): void {
    this.appointmentFilter = filter;
  }

  // Patient management properties
  showAddPatientForm = false;
  patientFirstName = '';
  patientLastName = '';
  patientEmail = '';
  patientPhoneNumber = '';
  patientDOB = '';
  patientGender = '';
  patientAddress = '';
  patientError = '';

  // Doctor management properties
  doctorFilter: 'available' | 'all' = 'available';
  allDoctors = [
    { name: 'John Smith', specialty: 'Cardiology', availableTime: '10:00 AM - 12:00 PM', available: true },
    { name: 'Sarah Johnson', specialty: 'Pediatrics', availableTime: '02:00 PM - 04:00 PM', available: true },
    { name: 'Emily Davis', specialty: 'Neurology', availableTime: '09:00 AM - 11:00 AM', available: true },
    { name: 'Michael Brown', specialty: 'Orthopedics', availableTime: '01:00 PM - 03:00 PM', available: false },
    { name: 'Jessica Lee', specialty: 'Dermatology', availableTime: '11:00 AM - 01:00 PM', available: false }
  ];

  get availableDoctors() {
    return this.allDoctors.filter(doc => doc.available);
  }

  // UI state properties
  showDoctorAvailability = false;
  showAppointmentTabs = false;
  activeTab: 'today' | 'all' = 'today';
  selectedAction = 'book';
  actions = ['book', 'edit', 'cancel'];

  // Method to handle appointment management actions
  proceedWithAction(): void {
    switch (this.selectedAction) {
      case 'book':
        console.log('Booking appointment...');
        // Navigate to booking component or open modal
        break;
      case 'edit':
        console.log('Editing appointment...');
        // Navigate to edit appointment
        break;
      case 'cancel':
        console.log('Canceling appointment...');
        // Handle appointment cancellation
        break;
      default:
        console.log('Unknown action');
    }
  }


  // Method to handle patient registration
  addNewPatient(): void {
    this.router.navigate(['/add-patient']);
  }

  // Method to handle bill generation
  generateBill(): void {
    this.router.navigate(['/create-bill']);
  }

  submitNewPatient(): void {
    this.patientError = '';
    if (!this.patientFirstName || !this.patientLastName || !this.patientEmail || !this.patientPhoneNumber || !this.patientDOB || !this.patientGender) {
      this.patientError = 'Please fill in all required fields.';
      return;
    }
    // Here you would send the patient data to the backend
    console.log('Patient added:', {
      firstName: this.patientFirstName,
      lastName: this.patientLastName,
      email: this.patientEmail,
      phoneNumber: this.patientPhoneNumber,
      dob: this.patientDOB,
      gender: this.patientGender,
      address: this.patientAddress
    });
    // Reset form and hide
    this.showAddPatientForm = false;
    this.patientFirstName = '';
    this.patientLastName = '';
    this.patientEmail = '';
    this.patientPhoneNumber = '';
    this.patientDOB = '';
    this.patientGender = '';
    this.patientAddress = '';
    this.patientError = '';
  }

  cancelAddPatient(): void {
    this.showAddPatientForm = false;
    this.patientError = '';
  }

  // Method to view doctor availability
  viewDoctorAvailability(): void {
    console.log('Viewing doctor availability...');
    // Navigate to doctor availability view
  }

  // Method to view today's appointments
  viewTodayAppointments(): void {
    // Navigate to the appointments view
    window.location.href = '/my-appointments';
  }

  // Method to generate bill
  // (Removed duplicate, now handled above)
}