  import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class PaymentComponent {
  paymentForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.paymentForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/)]],
      expiry: ['', [Validators.required, Validators.pattern(/^\d{2}\/\d{2}$/)]],
      cvc: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
      cardName: ['', Validators.required],
      country: ['', Validators.required],
      zip: ['', Validators.required]
    });
  }

  onSubmit() {
      if (this.paymentForm.valid) {
    // Simulate payment processing...
    this.router.navigate(['/payment-success']);
  } else {
    alert('Please fill in all required fields.');
  }
  }
}
