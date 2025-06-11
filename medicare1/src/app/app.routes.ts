import { Routes } from '@angular/router';
import { SigninComponent } from './pages/signin/signin.component';
import { SignupComponent } from './pages/signup/signup.component';
import { EmrComponent } from './emr/emr.component';
import { AuthGuard } from './guards/auth.guard';
import { HomePageComponent } from './home-page/home-page/home-page.component';
import { BookingAppointment } from './bam/booking-appointment/booking-appointment';


export const routes: Routes = [
    { path: '', component: HomePageComponent },
    { path: 'signin', component: SigninComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'emr', component: EmrComponent, canActivate: [AuthGuard] },
    { path: 'appointment-booking', component: BookingAppointment },
    { path: '**', redirectTo: '' }
];
