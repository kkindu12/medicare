import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

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
  role: string = 'patient'; // Default role
  specialty: string = ''; // For doctors
  error: string = '';
  
  constructor(private router: Router, private http: HttpClient) {}
  
  onSubmit() {
    // Reset error
    this.error = '';
    
    // Validate required fields
    if (!this.firstName || !this.lastName || !this.email || !this.password || !this.confirmPassword) {
      this.error = 'Please fill in all required fields.';
      return;
    }
    
    // Validate email format
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(this.email)) {
      this.error = 'Please enter a valid email address.';
      return;
    }
    
    // Validate password match
    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match.';
      return;
    }
    
    // Prepare signup data
    const signupData = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      phoneNumber: this.phoneNumber,
      role: this.role,
      specialty: this.specialty
    };
    
    // In a real app, you'd send this to your backend server
    // For demo, just log and navigate to signin
    console.log('Signup data:', signupData);
    
    // Navigate to sign-in page after successful signup
    // In a real app, you'd wait for API response before redirecting
    setTimeout(() => {
      this.router.navigate(['/signin']);
    }, 1000);
  }
}
