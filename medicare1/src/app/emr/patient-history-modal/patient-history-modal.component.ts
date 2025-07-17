import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { PatientRecordWithUser } from '../models';

@Component({
  selector: 'app-patient-history-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patient-history-modal.component.html',
  styleUrl: './patient-history-modal.component.scss'
})
export class PatientHistoryModalComponent {
  @Input() showPreviousRecords: boolean = false;
  @Input() selectedPatientRecord: PatientRecordWithUser | null = null;
  @Input() previousPatientRecords: PatientRecordWithUser[] = [];
  @Output() closePreviousRecords = new EventEmitter<void>();

  onClose() {
    this.closePreviousRecords.emit();
  }
}
