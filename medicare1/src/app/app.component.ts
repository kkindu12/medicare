import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrescriptionFormComponent } from './prescription-form/prescription-form.component';
import { ChatPageComponent } from './chat-page/chat-page.component';
import { AIDrivenPageComponent } from './ai-driven-page/ai-driven-page.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,PrescriptionFormComponent,ChatPageComponent,AIDrivenPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'medicare1';
}
