import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AppointmentBookingComponent } from './appointment-booking/appointment-booking.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'appointment-booking', component: AppointmentBookingComponent },
  { path: 'find-doctor', component: AppointmentBookingComponent },
  { path: 'my-appointments', component: AppointmentBookingComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AppointmentBookingComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes),
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { } 