import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  userName: string = 'John Doe';
  showNotifications: boolean = false;
  showUserMenu: boolean = false;
  notificationCount: number = 3;

  notifications: Notification[] = [
    {
      id: 1,
      title: 'Appointment Reminder',
      message: 'Your appointment with Dr. Smith is tomorrow at 2:00 PM',
      time: '2 hours ago',
      read: false
    },
    {
      id: 2,
      title: 'Lab Results Ready',
      message: 'Your blood test results are now available',
      time: '5 hours ago',
      read: false
    },
    {
      id: 3,
      title: 'Prescription Renewal',
      message: 'Time to renew your medication prescription',
      time: '1 day ago',
      read: false
    }
  ];

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    this.showUserMenu = false;
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
    this.showNotifications = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown')) {
      this.showNotifications = false;
      this.showUserMenu = false;
    }
  }

  viewProfile(): void {
    console.log('Navigate to profile');
    this.showUserMenu = false;
  }

  settings(): void {
    console.log('Navigate to settings');
    this.showUserMenu = false;
  }

  medicalHistory(): void {
    console.log('Navigate to medical history');
    this.showUserMenu = false;
  }

  logout(): void {
    console.log('Logout user');
    this.showUserMenu = false;
    // Add logout logic here
  }
}
