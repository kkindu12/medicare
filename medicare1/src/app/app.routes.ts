import { Routes } from '@angular/router';
import { SigninComponent } from './pages/signin/signin.component';
import { SignupComponent } from './pages/signup/signup.component';
import { EmrComponent } from './emr/emr.component';
import { PharmacyComponent } from './pharmacy_dashboard/pharmacy&laboratory.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/signin', pathMatch: 'full' },
    { path: 'signin', component: SigninComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'emr', component: EmrComponent, canActivate: [AuthGuard] },
    { path: 'pharmacy', component: PharmacyComponent },
    { path: '**', redirectTo: '/signin' }
];
