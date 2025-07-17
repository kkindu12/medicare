import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../components/navbar/navbar.component';

@Component({
  selector: 'app-reception-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './reception-dashboard.component.html',
  styleUrls: ['./reception-dashboard.component.scss']
})
export class ReceptionDashboardComponent {
  constructor(private router: Router) {}

  showAddPatientForm = false;
  // Patient form fields
  patientFirstName = '';
  patientLastName = '';
  patientEmail = '';
  patientPhoneNumber = '';
  patientDOB = '';
  patientGender = '';
  patientAddress = '';
  patientError = '';
  doctorFilter: 'available' | 'all' = 'available';
  allDoctors = [
    { name: 'John Smith', specialty: 'Cardiology', availableTime: '10:00 AM - 12:00 PM', available: true },
    { name: 'Sarah Johnson', specialty: 'Pediatrics', availableTime: '02:00 PM - 04:00 PM', available: true },
    { name: 'Emily Davis', specialty: 'Neurology', availableTime: '09:00 AM - 11:00 AM', available: true },
    { name: 'Michael Brown', specialty: 'Orthopedics', availableTime: '01:00 PM - 03:00 PM', available: false },
    { name: 'Jessica Lee', specialty: 'Dermatology', availableTime: '11:00 AM - 01:00 PM', available: false }
  ];
  appointmentFilter: 'today' | 'all' = 'today';
  showDoctorAvailability = false;
  get availableDoctors() {
    return this.allDoctors.filter(doc => doc.available);
  }
  showAppointmentTabs = false;
  activeTab: 'today' | 'all' = 'today';
  selectedAction = 'book';
  actions = ['book', 'edit', 'cancel'];

  showTodayAppointments = false;
  allAppointments = [
    {
      doctorName: 'John Smith',
      doctorSpecialty: 'Cardiology',
      date: new Date().toISOString().split('T')[0],
      time: '10:00 AM',
      reason: 'Regular checkup',
      status: 'Scheduled'
    },
    {
      doctorName: 'Sarah Johnson',
      doctorSpecialty: 'Pediatrics',
      date: new Date().toISOString().split('T')[0],
      time: '02:00 PM',
      reason: 'Follow-up',
      status: 'Pending'
    },
    {
      doctorName: 'Emily Davis',
      doctorSpecialty: 'Neurology',
      date: '2025-07-16',
      time: '11:00 AM',
      reason: 'Consultation',
      status: 'Completed'
    }
  ];

  get todayAppointments() {
    const today = new Date().toISOString().split('T')[0];
    return this.allAppointments.filter(app => app.date === today);
  }

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