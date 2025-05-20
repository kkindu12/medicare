import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      // Here you would typically make an API call to your backend
      // For now, we'll simulate a login
      setTimeout(() => {
        const { email, password } = this.loginForm.value;
        
        // This is just a demo - replace with actual authentication
        if (email === 'demo@example.com' && password === 'password123') {
          // Store user info in localStorage or a service
          localStorage.setItem('user', JSON.stringify({ email }));
          this.router.navigate(['/home']);
        } else {
          this.errorMessage = 'Invalid email or password';
        }
        this.isLoading = false;
      }, 1000);
    }
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
} 