import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AppointmentService } from '../services/appointment.service';
import { DoctorService, Doctor } from '../services/doctorService/doctor.service';
import { AuthService } from '../services/auth.service';

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
    private authService: AuthService
  ) {}  ngOnInit(): void {
    // Check if user is logged in
    if (!this.authService.isLoggedIn()) {
      alert('Please log in to book an appointment');
      this.router.navigate(['/signin']);
      return;
    }

    // Check if user is a patient
    if (!this.authService.isPatient()) {
      alert('Only patients can book appointments');
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
      alert('Please select a doctor');
      return;
    }

    // Get current user from auth service
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser || !currentUser.id) {
      alert('Please log in to book an appointment');
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
    this.isLoading = true;    this.appointmentService.addAppointment(newAppointment).subscribe({
      next: (createdAppointment) => {
        this.isLoading = false;
        alert('Appointment booked successfully!');
        // Navigate to patient dashboard appointments tab
        this.router.navigate(['/patient-dashboard'], { 
          queryParams: { tab: 'appointments' } 
        });
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error booking appointment:', error);
        alert('Failed to book appointment. Please try again.');
      }
    });
  }
  goBack(): void {
    this.router.navigate(['/patient-dashboard']);
  }

  goToMyAppointments(): void {
    this.router.navigate(['/my-appointments']);
  }
}