import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-appointment-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent],
  templateUrl: './appointment-booking.component.html',
  styleUrls: ['./appointment-booking.component.css']
})
export class AppointmentBookingComponent {
  selectedDate: string = '';
  selectedTime: string = '';
  selectedDoctor: string = '';
  patientName: string = '';
  patientEmail: string = '';
  patientPhone: string = '';

  doctors = [
    { id: 1, name: 'Dr. Samantha Kumara', specialty: 'Cardiologist', location: 'Colombo', rating: 4.5 },
    { id: 2, name: 'Dr. Piyal Kodikara', specialty: 'Dermatologist', location: 'Kandy', rating: 4.8 },
    { id: 3, name: 'Dr. Sunil Jayathilake', specialty: 'Pediatrician', location: 'Galle', rating: 4.7 }
  ];

  timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM',
    '02:00 PM', '03:00 PM', '04:00 PM'
  ];

  onSubmit() {
    // Handle form submission
    console.log('Appointment booked:', {
      date: this.selectedDate,
      time: this.selectedTime,
      doctor: this.selectedDoctor,
      patientName: this.patientName,
      patientEmail: this.patientEmail,
      patientPhone: this.patientPhone
    });
  }
}
