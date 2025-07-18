import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppointmentService, Appointment } from '../services/appointment.service';
import { PatientService } from '../services/patientService/patient.service';
import { UserService } from '../services/userService/user.service';
import { DoctorService, Doctor } from '../services/doctorService/doctor.service';
import { Patient } from '../emr/models';
import { Subscription } from 'rxjs';

// Interface for basic patient registration data
export interface RegisteredPatient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender?: string;
}

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
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private userService: UserService,
    private doctorService: DoctorService
  ) {}

  // Subscriptions
  private appointmentSubscription?: Subscription;
  private todayAppointmentSubscription?: Subscription;
  private patientSubscription?: Subscription;
  private doctorSubscription?: Subscription;

  // Loading states
  isLoadingAppointments = false;
  appointmentError: string | null = null;
  isLoadingPatients = false;
  patientError: string | null = null;
  isLoadingDoctors = false;
  doctorError: string | null = null;

  // Appointment data from backend
  allAppointments: Appointment[] = [];
  todayAppointments: Appointment[] = [];
  appointmentFilter: 'today' | 'all' = 'today';

  // Patient data from backend
  allPatients: RegisteredPatient[] = [];

  // Doctor data from backend
  allDoctors: Doctor[] = [];
  doctorFilter: 'available' | 'all' = 'available';

  ngOnInit(): void {
    this.loadAppointments();
    this.loadTodayAppointments();
    this.loadPatients();
    this.loadDoctors();
  }

  ngOnDestroy(): void {
    if (this.appointmentSubscription) {
      this.appointmentSubscription.unsubscribe();
    }
    if (this.todayAppointmentSubscription) {
      this.todayAppointmentSubscription.unsubscribe();
    }
    if (this.patientSubscription) {
      this.patientSubscription.unsubscribe();
    }
    if (this.doctorSubscription) {
      this.doctorSubscription.unsubscribe();
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

  // Load all patients from backend
  loadPatients(): void {
    this.isLoadingPatients = true;
    this.patientError = null;

    this.patientSubscription = this.userService.getAllUsers().subscribe({
      next: (users) => {
        // Convert users to RegisteredPatient format, filtering out doctors/staff if needed
        this.allPatients = users
          .filter(user => !user.role) // Filter out admin/doctor users (role = false means regular users/patients)
          .map(user => ({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            gender: user.gender || 'Not specified'
          }));
        this.isLoadingPatients = false;
      },
      error: (error) => {
        console.error('Error loading patients:', error);
        this.patientError = 'Failed to load patients. Please try again.';
        this.isLoadingPatients = false;
      }
    });
  }

  // Load all doctors from backend
  loadDoctors(): void {
    this.isLoadingDoctors = true;
    this.doctorError = null;

    this.doctorSubscription = this.doctorService.getDoctors().subscribe({
      next: (doctors) => {
        this.allDoctors = doctors;
        this.isLoadingDoctors = false;
      },
      error: (error) => {
        console.error('Error loading doctors:', error);
        this.doctorError = 'Failed to load doctors. Please try again.';
        this.isLoadingDoctors = false;
      }
    });
  }

  // Refresh appointments data
  refreshAppointments(): void {
    this.appointmentService.loadAppointments();
    this.loadAppointments();
    this.loadTodayAppointments();
  }

  // Refresh patients data
  refreshPatients(): void {
    this.loadPatients();
  }

  // Refresh doctors data
  refreshDoctors(): void {
    this.loadDoctors();
  }

  // Check if doctor is currently available based on current time
  isDoctorAvailableNow(doctor: Doctor): boolean {
    if (!doctor.doctorDetails?.usualStartingTime || !doctor.doctorDetails?.usualEndingTime) {
      return false;
    }

    const currentTime = new Date();
    const currentTimeString = currentTime.toTimeString().slice(0, 5); // Format: "HH:MM"
    
    const startTime = doctor.doctorDetails.usualStartingTime;
    const endTime = doctor.doctorDetails.usualEndingTime;
    
    return currentTimeString >= startTime && currentTimeString <= endTime;
  }

  // Get available doctors based on current time
  get availableDoctors(): Doctor[] {
    return this.allDoctors.filter(doctor => this.isDoctorAvailableNow(doctor));
  }

  // Get filtered doctors based on current filter
  getFilteredDoctors(): Doctor[] {
    return this.doctorFilter === 'available' ? this.availableDoctors : this.allDoctors;
  }

  // Set doctor filter
  setDoctorFilter(filter: 'available' | 'all'): void {
    this.doctorFilter = filter;
  }

  // Format doctor time for display
  formatDoctorTime(doctor: Doctor): string {
    if (!doctor.doctorDetails?.usualStartingTime || !doctor.doctorDetails?.usualEndingTime) {
      return 'Time not set';
    }
    return `${doctor.doctorDetails.usualStartingTime} - ${doctor.doctorDetails.usualEndingTime}`;
  }

  // Get doctor full name
  getDoctorFullName(doctor: Doctor): string {
    return `Dr. ${doctor.firstName} ${doctor.lastName}`;
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
    this.patientError = null;
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
    this.patientError = null;
  }

  cancelAddPatient(): void {
    this.showAddPatientForm = false;
    this.patientError = null;
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