import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Appointment {
  id: string;
  doctor: any;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  date: string;
  timeSlot: string;
  status: 'booked' | 'cancelled' | 'rescheduled';
}

@Component({
  selector: 'app-appointment-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './appointment-booking.component.html',
  styleUrls: ['./appointment-booking.component.css']
})
export class AppointmentBookingComponent {
  specialties = ['Cardiologist', 'Dermatologist', 'Pediatrician', 'Neurologist'];
  locations = ['Colombo', 'Matara', 'Galle', 'Kandy', 'Gampaha', 'Kurunagala'];
  timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM'];
  
  doctors = [
    { 
      name: 'Dr. Samantha Kumara', 
      specialty: 'Cardiologist', 
      location: 'Colombo', 
      rating: 4.5, 
      availableSlots: ['10:00 AM', '02:00 PM'],
      experience: '15 years',
      education: 'MD, University of Colombo'
    },
    { 
      name: 'Dr. Piyal Kodikara', 
      specialty: 'Dermatologist', 
      location: 'Kandy', 
      rating: 4.8, 
      availableSlots: ['11:00 AM', '01:00 PM'],
      experience: '12 years',
      education: 'MD, University of Peradeniya'
    },
    { 
      name: 'Dr. Sunil Jayathilake', 
      specialty: 'Pediatrician', 
      location: 'Galle', 
      rating: 4.7, 
      availableSlots: ['09:00 AM', '03:00 PM'],
      experience: '10 years',
      education: 'MD, University of Ruhuna'
    },
    { 
      name: 'Dr. Mohommed Nishmi', 
      specialty: 'Neurologist', 
      location: 'Colombo', 
      rating: 4.9, 
      availableSlots: ['09:00 AM', '11:00 AM'],
      experience: '18 years',
      education: 'MD, University of Colombo'
    },
    { 
      name: 'Dr. Kusal Mendis', 
      specialty: 'Cardiologist', 
      location: 'Matara', 
      rating: 4.6, 
      availableSlots: ['10:00 AM', '03:00 PM'],
      experience: '14 years',
      education: 'MD, University of Ruhuna'
    }
  ];

  selectedSpecialty: string = '';
  selectedLocation: string = '';
  selectedTimeSlot: string = '';
  selectedDoctor: any = null;
  patientName: string = '';
  patientEmail: string = '';
  patientPhone: string = '';
  searchQuery: string = '';
  selectedDate: string = '';
  viewMode: 'search' | 'book' | 'manage' = 'search';
  
  appointments: Appointment[] = [];
  selectedAppointment: Appointment | null = null;
  newTimeSlot: string = '';
  newDate: string = '';

  filteredDoctors = this.doctors;

  filterDoctors() {
    this.filteredDoctors = this.doctors.filter(doctor => {
      const matchesSpecialty = !this.selectedSpecialty || doctor.specialty === this.selectedSpecialty;
      const matchesLocation = !this.selectedLocation || doctor.location === this.selectedLocation;
      const matchesTimeSlot = !this.selectedTimeSlot || doctor.availableSlots.includes(this.selectedTimeSlot);
      const matchesSearch = !this.searchQuery || 
        doctor.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        doctor.location.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      return matchesSpecialty && matchesLocation && matchesTimeSlot && matchesSearch;
    });
  }

  onDoctorSelect(doctor: any) {
    this.selectedDoctor = doctor;
    this.viewMode = 'book';
  }

  clearFilters() {
    this.selectedSpecialty = '';
    this.selectedLocation = '';
    this.selectedTimeSlot = '';
    this.searchQuery = '';
    this.filterDoctors();
  }

  bookAppointment() {
    if (this.selectedDoctor && this.selectedTimeSlot && this.patientName && this.patientEmail && this.patientPhone && this.selectedDate) {
      const newAppointment: Appointment = {
        id: Math.random().toString(36).substr(2, 9),
        doctor: this.selectedDoctor,
        patientName: this.patientName,
        patientEmail: this.patientEmail,
        patientPhone: this.patientPhone,
        date: this.selectedDate,
        timeSlot: this.selectedTimeSlot,
        status: 'booked'
      };
      
      this.appointments.push(newAppointment);
      alert('Appointment booked successfully!');
      this.resetForm();
      this.viewMode = 'search';
    } else {
      alert('Please fill in all required fields');
    }
  }

  viewAppointments() {
    this.viewMode = 'manage';
  }

  cancelAppointment(appointment: Appointment) {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      appointment.status = 'cancelled';
      alert('Appointment cancelled successfully!');
    }
  }

  rescheduleAppointment(appointment: Appointment) {
    this.selectedAppointment = appointment;
    this.newTimeSlot = '';
    this.newDate = '';
  }

  confirmReschedule() {
    if (this.selectedAppointment && this.newTimeSlot && this.newDate) {
      this.selectedAppointment.timeSlot = this.newTimeSlot;
      this.selectedAppointment.date = this.newDate;
      this.selectedAppointment.status = 'rescheduled';
      alert('Appointment rescheduled successfully!');
      this.selectedAppointment = null;
    } else {
      alert('Please select both new date and time slot');
    }
  }

  private resetForm() {
    this.selectedDoctor = null;
    this.patientName = '';
    this.patientEmail = '';
    this.patientPhone = '';
    this.selectedTimeSlot = '';
    this.selectedDate = '';
  }
}
