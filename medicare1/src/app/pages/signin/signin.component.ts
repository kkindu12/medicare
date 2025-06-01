import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SigninService } from '../../services/signinService/signin.service';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent {
  email: string = '';
  password: string = '';
  error: string = '';

  constructor(private router: Router, private signinService : SigninService) {}

  onSubmit() {
    this.error = '';
    if (!this.email || !this.password) {
      alert("Email and password are required.");
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(this.email)) {
      alert("Please enter a valid email address.");
      return;
    }
    if (this.email && this.password &&  this.email.trim() !== '' && this.password.trim() !== '') {
      this.signinService.GetUser({ email: this.email, password: this.password }).subscribe(
        (response) => { 
          if (response) {
            sessionStorage.setItem('user', JSON.stringify(response));
            this.router.navigate(['/emr']);
          } else {
            alert("Invalid email or password.");
          }
        },
      )
    } else {
      alert("Invalid email or password.");
    }
  }
}
