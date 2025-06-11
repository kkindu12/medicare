import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Prescription } from '../models/prescription.model';

@Component({
  selector: 'app-prescription-modal',
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" *ngIf="isVisible" (click)="onOverlayClick($event)">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>Prescription Details</h3>
          <button class="close-btn" (click)="closeModal()">×</button>
        </div>
        
        <div class="modal-body" *ngIf="prescription">
          <div class="detail-row">
            <label>Patient Name:</label>
            <span>{{ prescription.patientName }}</span>
          </div>
          
          <div class="detail-row">
            <label>Patient ID:</label>
            <span>{{ prescription.patientId }}</span>
          </div>
          
          <div class="detail-row">
            <label>Medication:</label>
            <span>{{ prescription.medication }}</span>
          </div>
          
          <div class="detail-row">
            <label>Prescribed by:</label>
            <span>{{ prescription.doctor }}</span>
          </div>
          
          <div class="detail-row">
            <label>Status:</label>
            <span class="status-badge" [ngClass]="prescription.status.toLowerCase()">
              {{ prescription.status }}
            </span>
          </div>
          
          <div class="detail-row" *ngIf="prescription.dosage">
            <label>Dosage:</label>
            <span>{{ prescription.dosage }}</span>
          </div>
          
          <div class="detail-row" *ngIf="prescription.frequency">
            <label>Frequency:</label>
            <span>{{ prescription.frequency }}</span>
          </div>
          
          <div class="detail-row" *ngIf="prescription.duration">
            <label>Duration:</label>
            <span>{{ prescription.duration }}</span>
          </div>
          
          <div class="detail-row full-width" *ngIf="prescription.notes">
            <label>Notes:</label>
            <p>{{ prescription.notes }}</p>
          </div>
          
          <div class="detail-row">
            <label>Date & Time:</label>
            <span>{{ prescription.date }} at {{ prescription.time }}</span>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn-secondary" (click)="closeModal()">Close</button>
          <button class="btn-primary" (click)="editPrescription()">Edit</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      width: 90%;
      max-width: 600px;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    }

    .modal-header {
      padding: 1.5rem;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-header h3 {
      margin: 0;
      color: #1f2937;
      font-size: 1.25rem;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #6b7280;
      padding: 0.25rem;
      border-radius: 4px;
    }

    .close-btn:hover {
      background: #f3f4f6;
      color: #374151;
    }

    .modal-body {
      padding: 1.5rem;
    }

    .detail-row {
      display: flex;
      margin-bottom: 1rem;
      align-items: flex-start;
    }

    .detail-row.full-width {
      flex-direction: column;
    }

    .detail-row label {
      font-weight: 600;
      color: #374151;
      min-width: 130px;
      margin-right: 1rem;
    }

    .detail-row span, .detail-row p {
      color: #6b7280;
      margin: 0;
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-badge.pending {
      background: #fef3c7;
      color: #92400e;
    }

    .status-badge.urgent {
      background: #fee2e2;
      color: #dc2626;
    }

    .status-badge.completed {
      background: #d1fae5;
      color: #065f46;
    }

    .status-badge.cancelled {
      background: #fee2e2;
      color: #7f1d1d;
    }

    .modal-footer {
      padding: 1.5rem;
      border-top: 1px solid #e5e7eb;
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
    }

    .btn-primary, .btn-secondary {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary {
      background: #4c6ef5;
      color: white;
    }

    .btn-primary:hover {
      background: #364fc7;
    }

    .btn-secondary {
      background: #e5e7eb;
      color: #374151;
    }

    .btn-secondary:hover {
      background: #d1d5db;
    }
  `]
})
export class PrescriptionModalComponent {
  @Input() isVisible: boolean = false;
  @Input() prescription: Prescription | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() edit = new EventEmitter<Prescription>();

  closeModal(): void {
    this.close.emit();
  }

  editPrescription(): void {
    if (this.prescription) {
      this.edit.emit(this.prescription);
    }
  }

  onOverlayClick(event: Event): void {
    this.closeModal();
  }
}
