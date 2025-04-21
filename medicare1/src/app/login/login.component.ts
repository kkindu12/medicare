import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private router: Router) {}

  onSubmit() {
    // TODO: Implement actual authentication logic
    if (this.username && this.password) {
      // Redirect to home page after successful login
      this.router.navigate(['/home']);
    } else {
      this.errorMessage = 'Please enter both username and password';
    }
  }
} 