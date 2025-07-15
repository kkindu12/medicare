import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { PatientRecordWithUser } from '../models';

@Component({
  selector: 'app-patient-record-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patient-record-card.component.html',
  styleUrl: './patient-record-card.component.scss'
})
export class PatientRecordCardComponent {
  @Input() record!: PatientRecordWithUser;
  @Output() editRecord = new EventEmitter<PatientRecordWithUser>();
  @Output() addReport = new EventEmitter<PatientRecordWithUser>();
  @Output() viewHistory = new EventEmitter<PatientRecordWithUser>();

  onEditRecord() {
    this.editRecord.emit(this.record);
  }

  onAddReport() {
    this.addReport.emit(this.record);
  }

  onViewHistory() {
    this.viewHistory.emit(this.record);
  }
}
