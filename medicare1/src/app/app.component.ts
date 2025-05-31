import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EmrComponent } from "./emr/emr.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, EmrComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'emr';
}
