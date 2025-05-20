import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AppointmentBookingComponent } from './appointment-booking/appointment-booking.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'appointment-booking', component: AppointmentBookingComponent },
  { path: '**', redirectTo: '' }
];
