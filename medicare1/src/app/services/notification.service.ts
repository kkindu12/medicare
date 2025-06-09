import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { UserNotification, CreateNotificationRequest } from '../models/notification.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'http://localhost:8000';
  private notificationsSubject = new BehaviorSubject<UserNotification[]>([]);
  private unreadCountSubject = new BehaviorSubject<number>(0);
  private eventSource: EventSource | null = null;

  public notifications$ = this.notificationsSubject.asObservable();
  public unreadCount$ = this.unreadCountSubject.asObservable();  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    // Only initialize notifications if we're in the browser
    if (isPlatformBrowser(this.platformId)) {
      this.initializeNotifications();
    }

    // Poll for new notifications every 2 seconds for near real-time updates
    interval(2000).subscribe(() => {
      if (isPlatformBrowser(this.platformId)) {
        const currentUser = this.getCurrentUser();
        if (currentUser && !currentUser.role) { // Only for patients
        this.loadNotifications(currentUser.id).subscribe({
          error: (error) => console.error('Error polling notifications:', error)
        });
      }
    }
    });    // Add window focus event listener for immediate refresh when user returns to tab
    if (isPlatformBrowser(this.platformId) && typeof window !== 'undefined') {
      window.addEventListener('focus', () => {
        console.log('🔄 Window focused - refreshing notifications');
        this.forceRefresh();
      });
    }

    // Add visibility change event listener for when tab becomes visible
    if (isPlatformBrowser(this.platformId) && typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
          console.log('🔄 Tab became visible - refreshing notifications');
          this.forceRefresh();
        }
      });
    }
  }
  private getCurrentUser(): any {
    if (isPlatformBrowser(this.platformId) && typeof sessionStorage !== 'undefined') {
      const userStr = sessionStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }// Load notifications for a specific user
  loadNotifications(userId: string): Observable<UserNotification[]> {
    console.log(`Loading notifications for user: ${userId}`);
    return new Observable(observer => {
      this.http.get<UserNotification[]>(`${this.apiUrl}/api/notifications/${userId}`).subscribe({
        next: (notifications) => {
          console.log(`Received ${notifications.length} notifications:`, notifications);
          this.notificationsSubject.next(notifications);
          const unreadCount = notifications.filter(n => !n.read).length;
          this.unreadCountSubject.next(unreadCount);
          console.log(`Unread count: ${unreadCount}`);
          observer.next(notifications);
          observer.complete();
        },        error: (error) => {
          console.error('Error loading notifications:', error);
          console.error('Error status:', error.status);
          console.error('Error details:', error.error);
          console.error('Full error object:', error);
          observer.error(error);
        }
      });
    });
  }  // Create a new notification (used when doctor creates a record)
  createNotification(notification: CreateNotificationRequest): Observable<UserNotification> {
    return this.http.post<UserNotification>(`${this.apiUrl}/api/notifications`, notification);
  }
  // Mark notification as read
  markAsRead(notificationId: string): Observable<any> {
    return new Observable(observer => {
      this.http.put(`${this.apiUrl}/api/notifications/${notificationId}/read`, {}).subscribe({
        next: (response) => {
          // Update local state
          const notifications = this.notificationsSubject.value;
          const updatedNotifications = notifications.map(n => 
            n.id === notificationId ? { ...n, read: true } : n
          );
          this.notificationsSubject.next(updatedNotifications);
          
          // Update unread count
          const unreadCount = updatedNotifications.filter(n => !n.read).length;
          this.unreadCountSubject.next(unreadCount);
          
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          console.error('Error marking notification as read:', error);
          observer.error(error);
        }
      });
    });
  }
  // Mark all notifications as read
  markAllAsRead(userId: string): Observable<any> {
    return new Observable(observer => {
      this.http.put(`${this.apiUrl}/api/notifications/${userId}/read-all`, {}).subscribe({
        next: (response) => {
          // Update local state
          const notifications = this.notificationsSubject.value;
          const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
          this.notificationsSubject.next(updatedNotifications);
          this.unreadCountSubject.next(0);
          
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          console.error('Error marking all notifications as read:', error);
          observer.error(error);
        }
      });
    });
  }
  // Delete notification
  deleteNotification(notificationId: string): Observable<any> {
    return new Observable(observer => {
      this.http.delete(`${this.apiUrl}/api/notifications/${notificationId}`).subscribe({
        next: (response) => {
          // Update local state
          const notifications = this.notificationsSubject.value;
          const updatedNotifications = notifications.filter(n => n.id !== notificationId);
          this.notificationsSubject.next(updatedNotifications);
          
          // Update unread count
          const unreadCount = updatedNotifications.filter(n => !n.read).length;
          this.unreadCountSubject.next(unreadCount);
          
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          console.error('Error deleting notification:', error);
          observer.error(error);
        }
      });
    });
  }  // Initialize notifications for current user
  initializeNotifications(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return; // Don't initialize on server side
    }
    
    const currentUser = this.getCurrentUser();
    if (currentUser && !currentUser.role) { // Only for patients
      this.loadNotifications(currentUser.id);
      // Also initialize SSE for real-time updates
      this.initializeSSE(currentUser.id);
    }
  }
  // Get current notifications (synchronous)
  getCurrentNotifications(): UserNotification[] {
    return this.notificationsSubject.value;
  }

  // Get current unread count (synchronous)
  getCurrentUnreadCount(): number {
    return this.unreadCountSubject.value;
  }  // Force immediate refresh of notifications (can be called from any component)
  forceRefresh(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return; // Don't execute on server side
    }
    
    const currentUser = this.getCurrentUser();
    if (currentUser && !currentUser.role) { // Only for patients
      console.log('🔄 Force refreshing notifications...');
      this.loadNotifications(currentUser.id).subscribe({
        next: (notifications) => {
          console.log('✅ Force refresh completed, found:', notifications.length, 'notifications');
        },
        error: (error) => {
          console.error('❌ Force refresh failed:', error);
        }
      });
    }
  }
  // Initialize real-time SSE connection
  initializeSSE(userId: string): void {
    if (!isPlatformBrowser(this.platformId) || typeof EventSource === 'undefined') {
      return; // Don't initialize SSE on server side or if EventSource is not available
    }
    
    // Close existing connection if any
    this.closeSSE();

    console.log('🔌 Initializing SSE connection for user:', userId);
    
    try {
      this.eventSource = new EventSource(`${this.apiUrl}/api/sse/notifications/${userId}`);
      
      this.eventSource.onopen = () => {
        console.log('✅ SSE connection established');
      };

      this.eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📨 SSE message received:', data);
          
          if (data.type === 'notifications' && data.data) {
            // Update notifications in real-time
            this.updateNotificationsFromSSE(data.data);
          } else if (data.type === 'connected') {
            console.log('🔗 SSE connection confirmed');
          } else if (data.type === 'heartbeat') {
            console.log('💓 SSE heartbeat received');
          }
        } catch (error) {
          console.error('Error parsing SSE message:', error);
        }
      };

      this.eventSource.onerror = (error) => {
        console.error('❌ SSE connection error:', error);
        // Reconnect after a delay
        setTimeout(() => {
          if (this.getCurrentUser()?.id === userId) {
            console.log('🔄 Reconnecting SSE...');
            this.initializeSSE(userId);
          }
        }, 5000);
      };
    } catch (error) {
      console.error('Error initializing SSE:', error);
    }
  }

  // Close SSE connection
  closeSSE(): void {
    if (this.eventSource) {
      console.log('🔌 Closing SSE connection');
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  // Update notifications from SSE data
  private updateNotificationsFromSSE(sseNotifications: any[]): void {
    const currentUser = this.getCurrentUser();
    if (!currentUser?.id) return;

    // Load full notifications to ensure we have complete data
    this.loadNotifications(currentUser.id).subscribe({
      next: (notifications) => {
        console.log('🔄 Updated notifications via SSE');
      },
      error: (error) => {
        console.error('Error updating notifications from SSE:', error);
      }
    });
  }
}
