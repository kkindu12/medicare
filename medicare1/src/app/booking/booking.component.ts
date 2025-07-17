import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../services/appointment.service';

interface Doctor {
  id: number;
  name: string;
  specialty: string;
}

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
  imports: [CommonModule, FormsModule]
})
export class BookingComponent implements OnInit {
  doctors: Doctor[] = [
    { id: 1, name: 'John Smith', specialty: 'Cardiology' },
    { id: 2, name: 'Sarah Johnson', specialty: 'Pediatrics' },
    { id: 3, name: 'Michael Brown', specialty: 'Dermatology' },
    { id: 4, name: 'Emily Davis', specialty: 'Neurology' }
  ];

  availableTimes: string[] = [
    '09:00 AM', '10:00 AM', '11:00 AM',
    '02:00 PM', '03:00 PM', '04:00 PM'
  ];

  booking: Booking = {
    doctor: '',
    date: '',
    time: '',
    reason: ''
  };

  constructor(
    private router: Router,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('date') as HTMLInputElement;
    if (dateInput) {
      dateInput.min = today;
    }
  }

  onSubmit(): void {
    const selectedDoctor = this.doctors.find(d => d.id.toString() === this.booking.doctor);
    
    if (!selectedDoctor) {
      alert('Please select a doctor');
      return;
    }

    const newAppointment = {
      doctorName: selectedDoctor.name,
      doctorSpecialty: selectedDoctor.specialty,
      date: this.booking.date,
      time: this.booking.time,
      reason: this.booking.reason,
      status: 'scheduled' as const
    };

    this.appointmentService.addAppointment(newAppointment);
    alert('Appointment booked successfully!');
    this.router.navigate(['/my-appointments']);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  goToMyAppointments(): void {
    this.router.navigate(['/my-appointments']);
  }
} 