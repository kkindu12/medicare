import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Import Bootstrap
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent {
  bookingForm: FormGroup;
  availableTimeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM',
    '02:00 PM', '03:00 PM', '04:00 PM'
  ];

  constructor(private fb: FormBuilder) {
    this.bookingForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      date: ['', [Validators.required]],
      timeSlot: ['', [Validators.required]],
      reason: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit() {
    // Initialize any Bootstrap components if needed
  }

  onSubmit() {
    if (this.bookingForm.valid) {
      console.log('Booking submitted:', this.bookingForm.value);
      // Here you would typically make an API call to save the booking
      alert('Appointment booked successfully!');
      this.bookingForm.reset();
    }
  }
} 