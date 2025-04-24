import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AppointmentBookingComponent } from './appointment-booking/appointment-booking.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'appointment-booking', component: AppointmentBookingComponent },
  { path: 'find-doctor', redirectTo: '/appointment-booking', pathMatch: 'full' },
  { path: 'my-appointments', redirectTo: '/appointment-booking', pathMatch: 'full' }
];
