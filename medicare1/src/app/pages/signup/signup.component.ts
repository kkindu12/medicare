import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import {SignupService} from '../../services/signupService/signup.service';
import { User } from '../../emr/models/User';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  firstName: string = '';
  lastName: string = '';  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  phoneNumber: string = '';
  role: string = 'patient';
  specialty: string = ''; 
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
    }
    
    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match.';
      return;
    }

    const newUser: User = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phoneNumber: this.phoneNumber, 
      password: this.password, 
      role: !(this.role == "patient") ? true : false  
    };

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
