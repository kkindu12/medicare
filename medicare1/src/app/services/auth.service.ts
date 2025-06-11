import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  getCurrentUser(): any {
    if (isPlatformBrowser(this.platformId) && typeof sessionStorage !== 'undefined') {
      const userStr = sessionStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }

  isLoggedIn(): boolean {
    const user = this.getCurrentUser();
    return user && user.id;
  }

  getUserId(): string | null {
    const user = this.getCurrentUser();
    return user ? user.id : null;
  }

  getUserName(): string {
    const user = this.getCurrentUser();
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.email || 'User';
  }

  isPatient(): boolean {
    const user = this.getCurrentUser();
    return user && user.role === false;
  }

  isDoctor(): boolean {
    const user = this.getCurrentUser();
    return user && user.role === true;
  }
}
