import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  constructor(private router: Router) {}

  goToSignIn() {
    this.router.navigate(['/signin']);
  }

  goToAppointment() {
    this.router.navigate(['/appointment-booking']);
  }
}
