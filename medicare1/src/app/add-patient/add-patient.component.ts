import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-patient',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.scss']
})
export class AddPatientComponent {
  firstName = '';
  lastName = '';
  email = '';
  phoneNumber = '';
  dob = '';
  gender = '';
  address = '';
  error = '';

  constructor(private router: Router) {}

  submitPatient() {
    this.error = '';
    if (!this.firstName || !this.lastName || !this.email || !this.phoneNumber || !this.dob || !this.gender) {
      this.error = 'Please fill in all required fields.';
      return;
    }
    // Here you would send the patient data to the backend
    console.log('Patient added:', {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phoneNumber: this.phoneNumber,
      dob: this.dob,
      gender: this.gender,
      address: this.address
    });
    // Reset form
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.phoneNumber = '';
    this.dob = '';
    this.gender = '';
    this.address = '';
    this.error = '';
    alert('Patient registered successfully!');
  }

  goToDashboard() {
    this.router.navigate(['/reception']);
  }
}
