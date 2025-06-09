import { Routes } from '@angular/router';
import { SigninComponent } from './pages/signin/signin.component';
import { SignupComponent } from './pages/signup/signup.component';
import { EmrComponent } from './emr/emr.component';
import { PatientDashboardComponent } from './dashboards/patient-dashboard/patient-dashboard.component';
import { ProfileComponent } from './components/navbar/profile/profile.component';
import { SettingsComponent } from './components/navbar/settings/settings.component';
import { ChangePasswordComponent } from './components/navbar/settings/change-password/change-password.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/signin', pathMatch: 'full' },
    { path: 'signin', component: SigninComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
    { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
    { path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuard] },
    { path: 'emr', component: EmrComponent, canActivate: [AuthGuard] },
    { path: 'patient-dashboard', component: PatientDashboardComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: '/signin' }
];
