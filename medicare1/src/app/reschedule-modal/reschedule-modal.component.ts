import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Appointment } from '../services/appointment.service';

@Component({
  selector: 'app-reschedule-modal',
  templateUrl: './reschedule-modal.component.html',
  styleUrls: ['./reschedule-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class RescheduleModalComponent {
  @Input() appointment!: Appointment;
  @Output() closeModal = new EventEmitter<void>();
  @Output() reschedule = new EventEmitter<{
    id: number;
    date: string;
    time: string;
    reason: string;
  }>();

  availableTimes: string[] = [
    '09:00 AM', '10:00 AM', '11:00 AM',
    '02:00 PM', '03:00 PM', '04:00 PM'
  ];

  minDate: string;
  rescheduleData = {
    date: '',
    time: '',
    reason: ''
  };

  constructor() {
    // Set minimum date to today
    this.minDate = new Date().toISOString().split('T')[0];
  }

  close(): void {
    this.closeModal.emit();
  }

  onSubmit(): void {
    this.reschedule.emit({
      id: this.appointment.id,
      date: this.rescheduleData.date,
      time: this.rescheduleData.time,
      reason: this.rescheduleData.reason
    });
  }
} 