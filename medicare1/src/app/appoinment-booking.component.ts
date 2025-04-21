import { Component } from '@angular/core';


@Component({
  selector: 'app-appointment-booking',
  templateUrl: './appointment-booking.component.html',
  styleUrls: ['./appointment-booking.component.css'],
  standalone: true  // Make it standalone
})
export class AppointmentBookingComponent {
  specialties = ['Cardiologist', 'Dermatologist', 'Pediatrician', 'Neurologist'];
  locations = ['New York', 'Los Angeles', 'Chicago'];
  doctors = [
    { name: 'Dr. John Doe', specialty: 'Cardiologist', location: 'New York', rating: 4.5, availableSlots: ['10:00 AM', '02:00 PM'] },
    { name: 'Dr. Jane Smith', specialty: 'Dermatologist', location: 'Los Angeles', rating: 4.8, availableSlots: ['11:00 AM', '01:00 PM'] },
    { name: 'Dr. Sarah Lee', specialty: 'Pediatrician', location: 'Chicago', rating: 4.7, availableSlots: ['09:00 AM', '03:00 PM'] }
  ];
  selectedDoctor: any;
  selectedSlot: string = '';
  patientName: string = '';
  patientEmail: string = '';
  patientPhone: string = '';

  onDoctorSelect(doctor: any) {
    this.selectedDoctor = doctor;
  }

  onSlotSelect(slot: string) {
    this.selectedSlot = slot;
  }

  bookAppointment() {
    alert('Appointment booked successfully!');
  }
}


