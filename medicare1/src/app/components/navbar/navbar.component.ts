import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

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
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  userName: string = '';
  currentUser: any = null;
  showNotifications: boolean = false;
  showUserMenu: boolean = false;
  notificationCount: number = 3;

  constructor(private router: Router) {}

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
    }  ];

  ngOnInit(): void {
    // Load current user from sessionStorage
    const userStr = sessionStorage.getItem('user');
    if (userStr) {
      this.currentUser = JSON.parse(userStr);
      // Set the full name from the user data
      if (this.currentUser?.name) {
        this.userName = this.currentUser.name;
      } else if (this.currentUser?.firstName && this.currentUser?.lastName) {
        this.userName = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
      }
    }
  }

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
    
    // Clear session storage
    sessionStorage.removeItem('user');
    
    // Redirect to signin page
    this.router.navigate(['/signin']);
  }
}
