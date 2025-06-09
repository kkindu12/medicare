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
  }

  private loadUserData(): void {
    if (isPlatformBrowser(this.platformId)) {
      const userStr = sessionStorage.getItem('user');
      if (userStr) {
        this.currentUser = JSON.parse(userStr);
        this.firstName = this.currentUser.firstName || '';
        this.lastName = this.currentUser.lastName || '';
        this.email = this.currentUser.email || '';
        this.phoneNumber = this.currentUser.phoneNumber || '';
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

    this.isLoading = true;

    const updateData = {
      firstName: this.firstName.trim(),
      lastName: this.lastName.trim(),
      email: this.email.trim(),
      phoneNumber: this.phoneNumber.trim()
    };

    this.http.put(`http://localhost:8000/users/${this.currentUser.id}`, updateData)
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
  }
  getUserRole(): string {
    return this.currentUser?.role ? 'Doctor' : 'Patient';
  }

  goBack(): void {
    this.router.navigate(['/patient-dashboard']);
  }
}
