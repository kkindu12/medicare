import { Component, HostListener, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { UserNotification } from '../../models/notification.model';
import { Subscription } from 'rxjs';

interface NotificationDisplay {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  userName: string = '';
  currentUser: any = null;
  userRole: string = 'Patient';  showNotifications: boolean = false;
  showUserMenu: boolean = false;
  notificationCount: number = 0;
  notifications: NotificationDisplay[] = [];
  
  private notificationsSubscription?: Subscription;
  private unreadCountSubscription?: Subscription;  constructor(
    private router: Router,
    private notificationService: NotificationService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {    // Load current user from sessionStorage (only in browser)
    if (isPlatformBrowser(this.platformId) && typeof sessionStorage !== 'undefined') {
      const userStr = sessionStorage.getItem('user');
      if (userStr) {
        this.currentUser = JSON.parse(userStr);
        // Set the full name from the user data
        if (this.currentUser?.name) {
          this.userName = this.currentUser.name;
        } else if (this.currentUser?.firstName && this.currentUser?.lastName) {
          this.userName = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
        }
          // Set user role based on role property (true = doctor, false = patient)
        this.userRole = this.currentUser?.role ? 'Doctor' : 'Patient';
        
        // Initialize notifications for both patients and doctors
        this.initializeNotifications();
      }
    }
  }
  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    if (this.notificationsSubscription) {
      this.notificationsSubscription.unsubscribe();
    }
    if (this.unreadCountSubscription) {
      this.unreadCountSubscription.unsubscribe();
    }
    
    // Close SSE connection
    this.notificationService.closeSSE();
  }private initializeNotifications(): void {
    console.log('Initializing notifications for user:', this.currentUser);
    
    // Subscribe to notifications
    this.notificationsSubscription = this.notificationService.notifications$.subscribe(
      (notifications: UserNotification[]) => {
        console.log('Navbar received notifications:', notifications);
        this.notifications = notifications.map(n => ({
          id: n.id,
          title: n.title,
          message: n.message,
          time: this.formatTime(n.createdAt),
          read: n.read,
          type: n.type || 'general'
        }));
        console.log('Mapped notifications for display:', this.notifications);
      }
    );    // Subscribe to unread count
    this.unreadCountSubscription = this.notificationService.unreadCount$.subscribe(
      (count: number) => {
        console.log('Unread count updated:', count);
        this.notificationCount = count;
      }
    );

    // Initialize notifications
    this.notificationService.initializeNotifications();
  }

  private formatTime(createdAt: string): string {
    const now = new Date();
    const created = new Date(createdAt);
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) {
      return 'Just now';
    } else if (diffMins < 60) {
      return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    }
  }  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    this.showUserMenu = false;
    
    // Always refresh notifications when dropdown is opened
    if (this.showNotifications && this.currentUser?.id) {
      console.log('🔄 Refreshing notifications on dropdown open for user:', this.currentUser.id);
      this.notificationService.forceRefresh();
    }
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
    this.router.navigate(['/profile']);
  }  settings(): void {
    console.log('Navigate to settings');
    this.showUserMenu = false;
    this.router.navigate(['/settings']);
  }  onNotificationClick(notification: NotificationDisplay): void {
    // Mark notification as read if it's not already read
    if (!notification.read) {
      this.notificationService.markAsRead(notification.id).subscribe({
        next: () => {
          console.log('Notification marked as read');
        },
        error: (error) => {
          console.error('Error marking notification as read:', error);
        }
      });
    }    // Navigate to relevant page based on notification type
    if (notification.type === 'medical_record') {
      // Navigate to appropriate dashboard based on user role
      if (this.currentUser?.role) {
        // Doctor - navigate to doctor dashboard
        this.router.navigate(['/doctor-dashboard'], { fragment: 'patient-records' });
      } else {
        // Patient - navigate to patient dashboard
        this.router.navigate(['/patient-dashboard'], { fragment: 'records' });
      }
    } else if (notification.type === 'appointment') {
      // Navigate to appropriate appointment section based on user role
      if (this.currentUser?.role) {
        // Doctor - navigate to doctor dashboard appointments tab
        this.router.navigate(['/doctor-dashboard']);
      } else {
        // Patient - navigate to patient dashboard appointments tab
        this.router.navigate(['/patient-dashboard'], { queryParams: { tab: 'appointments' } });
      }
    }
    
    this.showNotifications = false;
  }

  markAllNotificationsAsRead(): void {
    if (this.currentUser?.id) {
      this.notificationService.markAllAsRead(this.currentUser.id).subscribe({
        next: () => {
          console.log('All notifications marked as read');
        },
        error: (error) => {
          console.error('Error marking all notifications as read:', error);
        }
      });
    }
  }
    logout(): void {
    console.log('Logout user');
    this.showUserMenu = false;
    
    // Clear session storage (only in browser)
    if (isPlatformBrowser(this.platformId) && typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem('user');
    }
    
    // Redirect to signin page
    this.router.navigate(['/signin']);
  }

  testNotifications(): void {
    console.log('🔧 Testing notifications manually...');
    console.log('Current user:', this.currentUser);
    
    if (this.currentUser?.id) {
      console.log(`Calling API for user ID: ${this.currentUser.id}`);
      this.notificationService.loadNotifications(this.currentUser.id).subscribe({
        next: (notifications) => {
          console.log('✅ Test successful! Received notifications:', notifications);
          console.log(`Found ${notifications.length} notifications`);
        },
        error: (error) => {
          console.error('❌ Test failed:', error);
          console.error('Error details:', error.error);
          console.error('Status:', error.status);
        }
      });
    } else {
      console.error('❌ No current user found');
    }
  }
  debugUserInfo(): void {
    console.log('🔍 Debug User Information:');
    if (isPlatformBrowser(this.platformId) && typeof sessionStorage !== 'undefined') {
      const userStr = sessionStorage.getItem('user');
      console.log('Raw user string from sessionStorage:', userStr);
      
      if (userStr) {
        const user = JSON.parse(userStr);
        console.log('Parsed user object:', user);
        console.log('User ID:', user.id);
        console.log('User role:', user.role);
        console.log('User firstName:', user.firstName);
        console.log('User lastName:', user.lastName);
      } else {
        console.log('❌ No user found in sessionStorage');
      }
    } else {
      console.log('❌ sessionStorage not available (likely server-side rendering)');
    }
  }
}
