import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  // Accessibility settings
  fontSize: string = 'medium';
  colorScheme: string = 'light';
  
  // Security settings
  sessionTimeout: number = 30;
  
  // Current user data
  currentUser: any = null;
  
  // UI state
  success: string = '';
  error: string = '';
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadUserSettings();
  }

  loadUserData(): void {
    const userStr = sessionStorage.getItem('user');
    if (userStr) {
      this.currentUser = JSON.parse(userStr);
    }
  }
  loadUserSettings(): void {
    // Load user settings from API or localStorage
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      Object.assign(this, settings);
    }
    
    // Apply accessibility settings on load
    setTimeout(() => {
      this.applyAccessibilitySettings();
    }, 100);
  }

  onAccessibilitySettingsSubmit(): void {
    this.saveSettings('Accessibility settings updated successfully');
    this.applyAccessibilitySettings();
  }
  onSecuritySettingsSubmit(): void {
    this.saveSettings('Security settings updated successfully');
  }  changePassword(): void {
    // Navigate to change password component
    this.router.navigate(['/change-password']);
  }

  deleteAccount(): void {
    const confirmed = confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    
    if (confirmed) {
      // This would make an API call to delete the account
      alert('Account deletion would be implemented here');
    }
  }

  saveSettings(successMessage: string): void {
    this.isLoading = true;
    this.error = '';
    
    try {
      const settings = {
        fontSize: this.fontSize,
        colorScheme: this.colorScheme,
        sessionTimeout: this.sessionTimeout
      };

      // Save to localStorage for now (in production, this would be saved to the backend)
      localStorage.setItem('userSettings', JSON.stringify(settings));
      
      this.success = successMessage;
      this.isLoading = false;
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        this.success = '';
      }, 3000);
      
    } catch (error) {
      this.error = 'Failed to save settings. Please try again.';
      this.isLoading = false;
    }
  }

  applyAccessibilitySettings(): void {
    const body = document.body;
    
    // Apply font size
    body.classList.remove('font-small', 'font-medium', 'font-large');
    body.classList.add(`font-${this.fontSize}`);
    
    // Apply color scheme
    body.classList.remove('theme-light', 'theme-dark');
    body.classList.add(`theme-${this.colorScheme}`);
  }

  getAllSettings(): any {
    return {
      fontSize: this.fontSize,
      colorScheme: this.colorScheme,
      sessionTimeout: this.sessionTimeout
    };
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
