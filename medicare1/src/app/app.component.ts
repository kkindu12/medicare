import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrescriptionFormComponent } from './prescription-form/prescription-form.component';
import { ChatPageComponent } from './chat-page/chat-page.component';
import { AIDrivenPageComponent } from './ai-driven-page/ai-driven-page.component';
import { HeaderComponent } from './components/header/header.component';
import { ChatComponent } from './components/chat/chat.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,PrescriptionFormComponent,ChatPageComponent,AIDrivenPageComponent,HeaderComponent,ChatComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  // title = 'medicare1';
  title = 'HealthBot';
}


