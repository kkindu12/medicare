import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const userString = sessionStorage.getItem('user');
        
        if (userString) {
          const user = JSON.parse(userString);
          if (user && user.id && user.firstName && user.lastName) {
            return true;
          }
        }
      } catch (error) {
        console.error('Error reading user data from sessionStorage:', error);
      }
    }
    this.router.navigate(['/signin']);
    return false;
  }
}
