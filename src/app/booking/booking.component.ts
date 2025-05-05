import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Doctor {
  name: string;
  specialty: string;
  location: string;
  rating: number;
  type: string;
}

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent {
  activeTab = 'find';
  search = '';
  selectedSpecialty = '';
  selectedLocation = '';
  selectedTime = '';

  specialties = ['Cardiologist', 'Dermatologist', 'Pediatrician'];
  locations = ['Colombo', 'Kandy', 'Galle'];
  timeSlots = ['Morning', 'Afternoon', 'Evening'];

  doctors: Doctor[] = [
    { name: 'Dr. Samantha Kumara', specialty: 'Cardiologist', location: 'Colombo', rating: 4.5, type: 'Cardiologist' },
    { name: 'Dr. Piyal Kodikara', specialty: 'Dermatologist', location: 'Kandy', rating: 4.8, type: 'Dermatologist' },
    { name: 'Dr. Sunil Jayathilake', specialty: 'Pediatrician', location: 'Galle', rating: 4.7, type: 'Pediatrician' }
  ];

  get filteredDoctors() {
    return this.doctors.filter(doc =>
      (this.selectedSpecialty ? doc.specialty === this.selectedSpecialty : true) &&
      (this.selectedLocation ? doc.location === this.selectedLocation : true) &&
      (this.search ?
        doc.name.toLowerCase().includes(this.search.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(this.search.toLowerCase()) ||
        doc.location.toLowerCase().includes(this.search.toLowerCase())
        : true)
    );
  }

  setTab(tab: string) {
    this.activeTab = tab;
  }

  clearFilters() {
    this.selectedSpecialty = '';
    this.selectedLocation = '';
    this.selectedTime = '';
    this.search = '';
  }

  appointment = {
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    department: '',
    reason: ''
  };

  departments = [
    'General Medicine',
    'Cardiology',
    'Orthopedics',
    'Pediatrics',
    'Dermatology',
    'Neurology',
    'Gynecology'
  ];

  onSubmit() {
    console.log('Appointment booked:', this.appointment);
    // Here you would typically send the data to your backend
    alert('Appointment booked successfully!');
  }
} 