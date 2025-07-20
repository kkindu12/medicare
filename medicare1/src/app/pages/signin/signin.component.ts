import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SigninService } from '../../services/signinService/signin.service';
import { AlertService } from '../../shared/alert/alert.service';

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

  constructor(
    private router: Router, 
    private signinService: SigninService,
    private alertService: AlertService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  onSubmit() {
    this.error = '';    if (!this.email || !this.password) {
      this.error = "Email and password are required.";
      return;
    }    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(this.email)) {
      this.error = "Please enter a valid email address.";
      return;
    }if (this.email && this.password &&  this.email.trim() !== '' && this.password.trim() !== '') {
      this.signinService.GetUser({ email: this.email, password: this.password }).subscribe({        next: (response) => { 
          if (response) {
            // Store user data in sessionStorage (only in browser)
            if (isPlatformBrowser(this.platformId) && typeof sessionStorage !== 'undefined') {
              sessionStorage.setItem('user', JSON.stringify(response));
            }

            this.alertService.showSuccess('Login Successful', 'Welcome back! Redirecting to your dashboard...');

            if(response.role) {
              // role = true means doctor, redirect to doctor dashboard
              this.router.navigate(['/doctor-dashboard']);
            }
            else {
              // role = false means patient, redirect to patient dashboard
              if(response.firstName.trim() === '_Receptionist' ) {
                this.router.navigate(['/reception']);
              }
              else{
                this.router.navigate(['/patient-dashboard']);
              }
            }
          } else {
            this.error = "Invalid email or password.";
            this.alertService.showError('Login Failed', 'Invalid email or password.');
          }
        },
        error: (error) => {
          if (error.status === 401) {
            this.error = "Invalid email or password. Please check your credentials.";
            this.alertService.showError('Login Failed', 'Invalid email or password. Please check your credentials.');
          } else if (error.status === 404) {
            this.error = "User not found. Please check your email address.";
            this.alertService.showError('Login Failed', 'User not found. Please check your email address.');
          } else if (error.status === 0) {
            this.error = "Cannot connect to server. Please try again later.";
            this.alertService.showError('Connection Error', 'Cannot connect to server. Please try again later.');
          } else {
            this.error = "Login failed. Please try again.";
            this.alertService.showError('Login Failed', 'Login failed. Please try again.');
          }
        }      });
    } else {
      this.alertService.showError('Validation Error', 'Invalid email or password.');
    }
  }
}
