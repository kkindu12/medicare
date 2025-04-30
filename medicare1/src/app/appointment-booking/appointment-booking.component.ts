import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  location: string;
  availableSlots: string[];
}

@Component({
  selector: 'app-appointment-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './appointment-booking.component.html',
  styleUrls: ['./appointment-booking.component.css']
})
export class AppointmentBookingComponent {
  selectedSpecialty: string = '';
  selectedLocation: string = '';
  selectedDate: string = '';
  selectedTime: string = '';
  searchResults: Doctor[] = [];
  bookedAppointments: any[] = [];

  specialties: string[] = [
    'Cardiology',
    'Dermatology',
    'Neurology',
    'Pediatrics',
    'Orthopedics'
  ];

  locations: string[] = [
    'Colombo',
    'Galle',
    'Matara',
    'Kandy',
    'Gampaha'
  ];

  doctors: Doctor[] = [
    {
      id: 1,
      name: 'Dr. Smith',
      specialty: 'Cardiology',
      location: 'Colombo',
      availableSlots: ['09:00', '10:00', '11:00']
    },
    {
      id: 2,
      name: 'Dr. Johnson',
      specialty: 'Dermatology',
      location: 'Galle',
      availableSlots: ['14:00', '15:00', '16:00']
    },
    {
      id: 3,
      name: 'Dr. Williams',
      specialty: 'Neurology',
      location: 'Kandy',
      availableSlots: ['10:00', '11:00', '13:00']
    }
  ];

  searchDoctors() {
    this.searchResults = this.doctors.filter(doctor => {
      const matchesSpecialty = !this.selectedSpecialty || doctor.specialty === this.selectedSpecialty;
      const matchesLocation = !this.selectedLocation || doctor.location === this.selectedLocation;
      return matchesSpecialty && matchesLocation;
    });
  }

  bookAppointment(doctor: Doctor, time: string) {
    const appointment = {
      doctor: doctor.name,
      specialty: doctor.specialty,
      location: doctor.location,
      date: this.selectedDate,
      time: time
    };
    this.bookedAppointments.push(appointment);
    alert('Appointment booked successfully!');
  }

  cancelAppointment(index: number) {
    this.bookedAppointments.splice(index, 1);
    alert('Appointment cancelled successfully!');
  }

  rescheduleAppointment(index: number) {
    // For demo purposes, we'll just remove the old appointment
    this.bookedAppointments.splice(index, 1);
    alert('Please book a new appointment to reschedule');
  }
} 