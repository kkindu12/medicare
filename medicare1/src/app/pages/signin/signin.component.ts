import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SigninService } from '../../services/signinService/signin.service';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent {
  email: string = '';
  password: string = '';
  error: string = '';

  constructor(private router: Router, private signinService : SigninService) {}

  onSubmit() {
    this.error = '';    if (!this.email || !this.password) {
      this.error = "Email and password are required.";
      return;
    }    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(this.email)) {
      this.error = "Please enter a valid email address.";
      return;
    }if (this.email && this.password &&  this.email.trim() !== '' && this.password.trim() !== '') {
      this.signinService.GetUser({ email: this.email, password: this.password }).subscribe({
        next: (response) => { 
          if (response) {            sessionStorage.setItem('user', JSON.stringify(response));
            if(response.role) {
              // role = true means doctor, redirect to EMR
              this.router.navigate(['/emr']);
            }
            else {
              // role = false means patient, redirect to patient dashboard
              this.router.navigate(['/patient-dashboard']);
            }
          } else {
            this.error = "Invalid email or password.";
          }
        },
        error: (error) => {          console.error('Signin error:', error);
          if (error.status === 401) {
            this.error = "Invalid email or password. Please check your credentials.";
          } else if (error.status === 404) {
            this.error = "User not found. Please check your email address.";
          } else if (error.status === 0) {
            this.error = "Cannot connect to server. Please try again later.";
          } else {
            this.error = "Login failed. Please try again.";
          }
        }      });
    } else {
      alert("Invalid email or password.");
    }
  }
}
