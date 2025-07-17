import { Routes } from '@angular/router';
import { PharmacyComponent } from './pharmacy/pharmacy.component';
import { LaboratoryComponent } from './laboratory/laboratory.component';
import { CreateBillComponent } from './create-bill/create-bill.component';
import { BillReceiptComponent } from './bill-receipt/bill-receipt.component';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';
import { PaymentComponent } from './payment/payment.component';
import { ReceptionDashboardComponent } from './reception-dashboard/reception-dashboard.component';
import { SigninComponent } from './pages/signin/signin.component';
import { SignupComponent } from './pages/signup/signup.component';
import { EmrComponent } from './emr/emr.component';
import { PatientDashboardComponent } from './dashboards/patient-dashboard/patient-dashboard.component';
import { DoctorDashboardComponent } from './dashboards/doctor-dashboard/doctor-dashboard.component';
import { ProfileComponent } from './components/navbar/profile/profile.component';
import { SettingsComponent } from './components/navbar/settings/settings.component';
import { ChangePasswordComponent } from './components/navbar/settings/change-password/change-password.component';
import { AuthGuard } from './guards/auth.guard';
import { HomePageComponent } from './home-page/home-page/home-page.component';
import { BookingComponent } from './booking/booking.component';
import { MyAppointmentsComponent } from './my-appointments/my-appointments.component';
import { RescheduleAppointmentComponent } from './reschedule-appointment/reschedule-appointment.component';

export const routes: Routes = [
  { path: '', redirectTo: '/pharmacy', pathMatch: 'full' },
  { path: 'pharmacy', component: PharmacyComponent },
  { path: 'laboratory', component: LaboratoryComponent },
  { path: '**', redirectTo: '/pharmacy' }
    { path: '', component: HomePageComponent },
    { path: 'signin', component: SigninComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
    { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
    { path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuard] },    
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
    { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
    { path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuard] },    
    { path: 'emr', component: EmrComponent, canActivate: [AuthGuard] },
    { path: 'booking', component: BookingComponent },
    { path: 'my-appointments', component: MyAppointmentsComponent },
    { path: 'reschedule-appointment/:id', component: RescheduleAppointmentComponent, canActivate: [AuthGuard] },
    { path: 'patient-dashboard', component: PatientDashboardComponent, canActivate: [AuthGuard] },
    { path: 'doctor-dashboard', component: DoctorDashboardComponent, canActivate: [AuthGuard] },
    { path: 'patient-dashboard', component: PatientDashboardComponent, canActivate: [AuthGuard] },
    { path: 'doctor-dashboard', component: DoctorDashboardComponent, canActivate: [AuthGuard] },
    { path: 'create-bill', component: CreateBillComponent },
    { path: 'bill-receipt', component: BillReceiptComponent },
    { path: 'payment-success', component: PaymentSuccessComponent },
    { path: 'payment', component: PaymentComponent },
    { path: 'reception', component: ReceptionDashboardComponent },
    { path: '**', redirectTo: '' }
];
