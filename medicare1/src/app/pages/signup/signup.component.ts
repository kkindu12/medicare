import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import {SignupService} from '../../services/signupService/signup.service';
import { User, DoctorDetails } from '../../emr/models/User';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {  
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  phoneNumber: string = '';  role: string = 'patient';
  // Doctor-specific fields
  usualStartingTime: string = '09:00';
  usualEndingTime: string = '17:00';
  experience: number = 5;
  highestQualifications: string = 'MBBS';
  registrationNumber: string = '1234567890';
  registrationAuthority: string = 'Medical Council of India';
  registrationDate: string = '2020-01-01';
  feeForAppointment: number = 500;
  error: string = '';
  
  constructor(private router: Router, private http: HttpClient, private signupService : SignupService) {}
  
  onSubmit() {
    this.error = '';
    
    if (!this.firstName || !this.lastName || !this.email || !this.password || !this.confirmPassword) {
      this.error = 'Please fill in all required fields.';
      return;
    }
    
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(this.email)) {
      this.error = 'Please enter a valid email address.';
      return;
    }    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match.';
      return;
    }    // Validate doctor fields if role is doctor
    if (this.role === 'doctor') {
      if (!this.usualStartingTime || !this.usualEndingTime || this.experience < 0 || 
          !this.highestQualifications || !this.registrationNumber || 
          !this.registrationAuthority || !this.registrationDate || this.feeForAppointment <= 0) {
        this.error = 'Please fill in all doctor registration fields with valid values.';
        return;
      }
    }

    const newUser: User = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phoneNumber: this.phoneNumber, 
      password: this.password, 
      role: !(this.role == "patient") ? true : false  
    };

    // Add doctor details if the role is doctor
    if (this.role === 'doctor') {
      newUser.doctorDetails = {
        usualStartingTime: this.usualStartingTime,
        usualEndingTime: this.usualEndingTime,
        experience: this.experience,
        highestQualifications: this.highestQualifications,
        registrationNumber: this.registrationNumber,
        registrationAuthority: this.registrationAuthority,
        registrationDate: this.registrationDate,
        feeForAppointment: this.feeForAppointment
      };
    }

    this.signupService.addUser(newUser).subscribe({
      next: () => {
        alert('User created successfully');
        this.router.navigate(['/signin']);
      },
      error: () => {
        alert('User creation failed');
      }
    });
  }
}
