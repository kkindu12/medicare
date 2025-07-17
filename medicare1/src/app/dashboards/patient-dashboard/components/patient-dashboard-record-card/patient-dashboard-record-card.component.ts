import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { PatientRecordWithUser } from '../../../../emr/models';

@Component({
  selector: 'app-patient-dashboard-record-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patient-dashboard-record-card.component.html',
  styleUrl: './patient-dashboard-record-card.component.scss'
})
export class PatientDashboardRecordCardComponent {
  @Input() record!: PatientRecordWithUser;
  @Output() viewHistory = new EventEmitter<PatientRecordWithUser>();

  onViewHistory() {
    this.viewHistory.emit(this.record);
  }
}
