import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  // Form fields
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  
  // Form state
  isLoading: boolean = false;
  error: string = '';
  success: string = '';
  
  // Password visibility toggles
  showCurrentPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;
  
  // Password strength indicator
  passwordStrength: string = '';
  passwordStrengthClass: string = '';
  
  // Current user data
  currentUser: any = null;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    const userStr = sessionStorage.getItem('user');
    if (userStr) {
      this.currentUser = JSON.parse(userStr);
    } else {
      // Redirect to signin if no user found
      this.router.navigate(['/signin']);
    }
  }

  togglePasswordVisibility(field: string): void {
    switch(field) {
      case 'current':
        this.showCurrentPassword = !this.showCurrentPassword;
        break;
      case 'new':
        this.showNewPassword = !this.showNewPassword;
        break;
      case 'confirm':
        this.showConfirmPassword = !this.showConfirmPassword;
        break;
    }
  }

  checkPasswordStrength(): void {
    const password = this.newPassword;
    let score = 0;
    
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    switch(score) {
      case 0:
      case 1:
        this.passwordStrength = 'Very Weak';
        this.passwordStrengthClass = 'text-danger';
        break;
      case 2:
        this.passwordStrength = 'Weak';
        this.passwordStrengthClass = 'text-warning';
        break;
      case 3:
        this.passwordStrength = 'Fair';
        this.passwordStrengthClass = 'text-info';
        break;
      case 4:
        this.passwordStrength = 'Good';
        this.passwordStrengthClass = 'text-success';
        break;
      case 5:
        this.passwordStrength = 'Strong';
        this.passwordStrengthClass = 'text-success fw-bold';
        break;
    }
  }

  onSubmit(): void {
    this.error = '';
    this.success = '';
    
    // Validation
    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.error = 'All fields are required.';
      return;
    }
    
    if (this.newPassword.length < 8) {
      this.error = 'New password must be at least 8 characters long.';
      return;
    }
    
    if (this.newPassword !== this.confirmPassword) {
      this.error = 'New password and confirmation do not match.';
      return;
    }
    
    if (this.currentPassword === this.newPassword) {
      this.error = 'New password must be different from current password.';
      return;
    }
    
    this.isLoading = true;
    
    const changePasswordData = {
      userId: this.currentUser.id,
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    };

    // Make API call to change password
    this.http.put('http://localhost:8000/api/users/change-password', changePasswordData)
      .subscribe({
        next: (response: any) => {
          this.success = 'Password changed successfully! You will be redirected to sign in.';
          this.isLoading = false;
          
          // Clear form
          this.currentPassword = '';
          this.newPassword = '';
          this.confirmPassword = '';
          this.passwordStrength = '';
          
          // Redirect to signin after 3 seconds
          setTimeout(() => {
            sessionStorage.removeItem('user');
            this.router.navigate(['/signin']);
          }, 3000);
        },
        error: (error) => {
          console.error('Error changing password:', error);
          if (error.status === 401) {
            this.error = 'Current password is incorrect.';
          } else if (error.status === 400) {
            this.error = error.error?.detail || 'Invalid password requirements.';
          } else {
            this.error = 'Failed to change password. Please try again.';
          }
          this.isLoading = false;
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/settings']);
  }

  getUserDisplayName(): string {
    if (this.currentUser?.firstName && this.currentUser?.lastName) {
      return `${this.currentUser.firstName} ${this.currentUser.lastName}`;
    }
    return this.currentUser?.email || 'User';
  }
}
