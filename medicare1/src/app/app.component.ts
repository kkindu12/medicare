import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrescriptionFormComponent } from './prescription-form/prescription-form.component';

import { HeaderComponent } from './components/header/header.component';
import { DoctorListComponent } from "./components/doctor-list/doctor-list.component";
import { ChatPageComponent } from "./components/chat-page/chat-page.component";
import { DoctorpageComponent } from "./components/doctorpage/doctorpage.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PrescriptionFormComponent, HeaderComponent, DoctorListComponent, ChatPageComponent, DoctorpageComponent],
  // need to be import
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  // title = 'medicare1';
  title = 'HealthBot';
}




