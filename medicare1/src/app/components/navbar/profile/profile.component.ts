import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  // View/Edit mode toggle
  isEditMode: boolean = false;

  // User data
  currentUser: any = null;
  // Form fields
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phoneNumber: string = '';
  dateOfBirth: string = '';
  gender: string = '';
  address: string = '';
  emergencyContactName: string = '';
  emergencyContactPhone: string = '';
  
  // Doctor-specific fields
  usualStartingTime: string = '';
  usualEndingTime: string = '';
  experience: number = 0;
  highestQualifications: string = '';
  registrationNumber: string = '';
  registrationAuthority: string = '';
  registrationDate: string = '';
  feeForAppointment: number = 0;
    // Form state
  isLoading: boolean = false;
  error: string = '';
  success: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }  private loadUserData(): void {
    if (isPlatformBrowser(this.platformId)) {
      const userStr = sessionStorage.getItem('user');
      if (userStr) {
        this.currentUser = JSON.parse(userStr);
        console.log('Profile - Current user data:', this.currentUser); // Debug log
        console.log('Profile - Doctor details:', this.currentUser.doctorDetails); // Debug log
        
        this.firstName = this.currentUser.firstName || '';
        this.lastName = this.currentUser.lastName || '';
        this.email = this.currentUser.email || '';
        this.phoneNumber = this.currentUser.phoneNumber || '';
        this.dateOfBirth = this.currentUser.dateOfBirth || '';
        this.gender = this.currentUser.gender || '';        this.address = this.currentUser.address || '';
        this.emergencyContactName = this.currentUser.emergencyContactName || '';
        this.emergencyContactPhone = this.currentUser.emergencyContactPhone || '';
        
        // Load doctor-specific fields if user is a doctor
        if (this.currentUser.role && this.currentUser.doctorDetails) {
          console.log('Loading doctor details...', this.currentUser.doctorDetails); // Debug log
          this.usualStartingTime = this.currentUser.doctorDetails.usualStartingTime || '';
          this.usualEndingTime = this.currentUser.doctorDetails.usualEndingTime || '';
          this.experience = this.currentUser.doctorDetails.experience || 0;
          this.highestQualifications = this.currentUser.doctorDetails.highestQualifications || '';
          this.registrationNumber = this.currentUser.doctorDetails.registrationNumber || '';
          this.registrationAuthority = this.currentUser.doctorDetails.registrationAuthority || '';
          this.registrationDate = this.currentUser.doctorDetails.registrationDate || '';
          this.feeForAppointment = this.currentUser.doctorDetails.feeForAppointment || 0;
        } else {
          console.log('No doctor details found or user is not a doctor'); // Debug log
        }
      } else {
        // If no user data, redirect to signin
        this.router.navigate(['/signin']);
      }
    }
  }
  toggleEditMode(): void {
    if (this.isEditMode) {
      // Cancel edit - reload original data
      this.loadUserData();
      this.error = '';
      this.success = '';
    }
    this.isEditMode = !this.isEditMode;
  }
  onSubmit(): void {
    this.error = '';
    this.success = '';

    // Validate required fields
    if (!this.firstName.trim() || !this.lastName.trim() || !this.email.trim()) {
      this.error = 'First name, last name, and email are required.';
      return;
    }

    // Validate email format
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(this.email)) {
      this.error = 'Please enter a valid email address.';
      return;
    }

    this.isLoading = true;    const updateData = {
      firstName: this.firstName.trim(),
      lastName: this.lastName.trim(),
      email: this.email.trim(),
      phoneNumber: this.phoneNumber.trim(),
      dateOfBirth: this.dateOfBirth.trim(),
      gender: this.gender.trim(),
      address: this.address.trim(),
      emergencyContactName: this.emergencyContactName.trim(),
      emergencyContactPhone: this.emergencyContactPhone.trim(),
      ...(this.currentUser.role && {
        doctorDetails: {
          usualStartingTime: this.usualStartingTime.trim(),
          usualEndingTime: this.usualEndingTime.trim(),
          experience: this.experience,
          highestQualifications: this.highestQualifications.trim(),
          registrationNumber: this.registrationNumber.trim(),
          registrationAuthority: this.registrationAuthority.trim(),
          registrationDate: this.registrationDate.trim(),
          feeForAppointment: this.feeForAppointment
        }
      })
    };

    this.http.put(`http://localhost:8000/api/users/${this.currentUser.id}`, updateData)
      .subscribe({
        next: (response: any) => {
          // Update session storage with new data
          const updatedUser = {
            ...this.currentUser,
            ...updateData
          };
          if (isPlatformBrowser(this.platformId)) {
            sessionStorage.setItem('user', JSON.stringify(updatedUser));
          }
          this.currentUser = updatedUser;
            this.success = 'Profile updated successfully!';
          this.isEditMode = false;
          this.isLoading = false;
          
          // Clear success message after 3 seconds
          setTimeout(() => {
            this.success = '';
          }, 3000);
        },
        error: (error) => {
          console.error('Error updating profile:', error);
          this.error = error.error?.detail || 'Failed to update profile. Please try again.';
          this.isLoading = false;
        }
      });
  }

  getUserDisplayName(): string {
    if (this.currentUser?.firstName && this.currentUser?.lastName) {
      return `${this.currentUser.firstName} ${this.currentUser.lastName}`;
    }
    return this.currentUser?.email || 'User';
  }  getUserRole(): string {
    return this.currentUser?.role ? 'Doctor' : 'Patient';
  }

  isDoctor(): boolean {
    return this.currentUser?.role === true;
  }

  goBack(): void {
    // Navigate to appropriate dashboard based on user role
    if (this.currentUser?.role) {
      // User role is true for doctors
      this.router.navigate(['/doctor-dashboard']);
    } else {
      // User role is false for patients
      this.router.navigate(['/patient-dashboard']);
    }
  }
}
