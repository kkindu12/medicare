import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class SettingsComponent implements OnInit, OnDestroy {
  // Accessibility settings
  fontSize: string = 'medium';
  originalFontSize: string = 'medium'; // Track saved font size
  
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
    // Load user settings from localStorage
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      Object.assign(this, settings);
      this.originalFontSize = this.fontSize; // Store saved font size
    } else {
      // Set defaults
      this.fontSize = 'medium';
      this.originalFontSize = 'medium';
    }
    
    // Apply saved accessibility settings on load
    setTimeout(() => {
      this.applyGlobalFontSettings();
    }, 100);
  }

  onAccessibilitySettingsSubmit(): void {
    // Update original font size and save permanently
    this.originalFontSize = this.fontSize;
    this.saveSettings('Accessibility settings updated successfully');
    this.applyGlobalFontSettings(); // Apply to all pages except home
  }

  onFontSizeChange(): void {
    // Apply font size change temporarily for preview (current page only)
    this.applyPreviewToCurrentPage();
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
    // Legacy method - calls global settings
    this.applyGlobalFontSettings();
  }

  private applyGlobalFontSettings(): void {
    // Apply font settings globally to all pages EXCEPT protected pages
    const baseSize = this.getFontSizeValue(this.fontSize);
    
    // Set CSS custom property for proportional scaling
    document.documentElement.style.setProperty('--base-font-size', baseSize);
    document.documentElement.style.setProperty('--font-scale', this.getFontScale(this.fontSize));
    
    // Add font size class to body (but protect certain pages)
    const body = document.body;
    const fontClasses = ['font-small', 'font-medium', 'font-large', 'font-extra-large'];
    fontClasses.forEach(cls => body.classList.remove(cls));
    
    // Only add font class if not on protected pages
    const currentUrl = window.location.pathname;
    const isProtectedPage = currentUrl === '/' || 
                           currentUrl === '/home' || 
                           currentUrl === '/home-page' ||
                           currentUrl === '/signin' ||
                           currentUrl === '/sign-in' ||
                           currentUrl === '/login';
    
    if (!isProtectedPage) {
      body.classList.add(`font-${this.fontSize}`);
    }
    
    // Apply to non-protected pages
    this.applyToNonHomePages();
  }

  private applyPreviewToCurrentPage(): void {
    // Apply font preview only to current settings page
    const baseSize = this.getFontSizeValue(this.fontSize);
    const scale = this.getFontScale(this.fontSize);
    
    // Apply to settings page elements with proportional scaling
    const settingsContainer = document.querySelector('.form-section');
    if (settingsContainer) {
      this.applyFontToContainer(settingsContainer, baseSize, scale);
    }
  }

  private getFontSizeValue(fontSizeKey: string): string {
    switch (fontSizeKey) {
      case 'small': return '14px';
      case 'medium': return '16px';
      case 'large': return '18px';
      case 'extra-large': return '20px';
      default: return '16px';
    }
  }

  private getFontScale(fontSizeKey: string): string {
    switch (fontSizeKey) {
      case 'small': return '0.875'; // 14/16
      case 'medium': return '1'; // 16/16
      case 'large': return '1.125'; // 18/16
      case 'extra-large': return '1.25'; // 20/16
      default: return '1';
    }
  }

  private applyToNonHomePages(): void {
    // Check if we're NOT on home page or sign-in page
    const currentUrl = window.location.pathname;
    const isProtectedPage = currentUrl === '/' || 
                           currentUrl === '/home' || 
                           currentUrl === '/home-page' ||
                           currentUrl === '/signin' ||
                           currentUrl === '/sign-in' ||
                           currentUrl === '/login';
    
    if (!isProtectedPage) {
      const baseSize = this.getFontSizeValue(this.fontSize);
      const scale = this.getFontScale(this.fontSize);
      
      // Apply to all page content except protected pages
      const containers = document.querySelectorAll('body *:not(.home-page):not(.home-page *):not(.signin-page):not(.signin-page *)');
      containers.forEach(container => {
        this.applyFontToContainer(container, baseSize, scale);
      });
    }
  }

  private applyFontToContainer(container: Element, baseSize: string, scale: string): void {
    const elements = container.querySelectorAll('*');
    elements.forEach(element => {
      const htmlElement = element as HTMLElement;
      const tagName = element.tagName.toLowerCase();
      
      // Apply proportional scaling based on element type
      if (tagName === 'h1') {
        htmlElement.style.fontSize = `calc(${baseSize} * ${scale} * 2.5)`;
      } else if (tagName === 'h2') {
        htmlElement.style.fontSize = `calc(${baseSize} * ${scale} * 2)`;
      } else if (tagName === 'h3') {
        htmlElement.style.fontSize = `calc(${baseSize} * ${scale} * 1.75)`;
      } else if (tagName === 'h4') {
        htmlElement.style.fontSize = `calc(${baseSize} * ${scale} * 1.5)`;
      } else if (tagName === 'h5') {
        htmlElement.style.fontSize = `calc(${baseSize} * ${scale} * 1.25)`;
      } else if (tagName === 'h6') {
        htmlElement.style.fontSize = `calc(${baseSize} * ${scale} * 1.1)`;
      } else if (htmlElement.classList.contains('small') || tagName === 'small') {
        htmlElement.style.fontSize = `calc(${baseSize} * ${scale} * 0.875)`;
      } else if (htmlElement.classList.contains('lead')) {
        htmlElement.style.fontSize = `calc(${baseSize} * ${scale} * 1.25)`;
      } else {
        // Regular text elements
        htmlElement.style.fontSize = `calc(${baseSize} * ${scale})`;
      }
    });
  }

  ngOnDestroy(): void {
    // Revert to original font size if changes weren't saved
    if (this.fontSize !== this.originalFontSize) {
      this.fontSize = this.originalFontSize;
      this.applyGlobalFontSettings();
    }
  }

  getAllSettings(): any {
    return {
      fontSize: this.fontSize,
      sessionTimeout: this.sessionTimeout
    };
  }
  goBack(): void {
    // Revert to original font size if changes weren't saved
    if (this.fontSize !== this.originalFontSize) {
      this.fontSize = this.originalFontSize;
      this.applyGlobalFontSettings();
    }
    
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
