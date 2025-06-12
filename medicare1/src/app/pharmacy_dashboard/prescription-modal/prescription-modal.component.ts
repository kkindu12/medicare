import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Prescription, LabTest, InventoryItem } from '../models/prescription.model';

@Component({
  selector: 'app-prescription-modal',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" *ngIf="isVisible" (click)="onOverlayClick($event)">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>{{ getModalTitle() }}</h3>
          <button class="close-btn" (click)="closeModal()">×</button>
        </div>
        
        <!-- View Mode -->
        <div class="modal-body" *ngIf="!isEditMode && prescription && modalType === 'prescription'">
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

        <!-- View Mode for Lab Test -->
        <div class="modal-body" *ngIf="!isEditMode && labTest && modalType === 'labtest'">
          <div class="detail-row">
            <label>Test Name:</label>
            <span>{{ labTest.testName }}</span>
          </div>
          
          <div class="detail-row">
            <label>Patient Name:</label>
            <span>{{ labTest.patientName }}</span>
          </div>
          
          <div class="detail-row">
            <label>Patient ID:</label>
            <span>{{ labTest.patientId }}</span>
          </div>
          
          <div class="detail-row">
            <label>Requested by:</label>
            <span>{{ labTest.doctor }}</span>
          </div>
          
          <div class="detail-row">
            <label>Status:</label>
            <span class="status-badge" [ngClass]="labTest.status.toLowerCase()">
              {{ labTest.status }}
            </span>
          </div>
          
          <div class="detail-row">
            <label>Priority:</label>
            <span class="priority-badge" [ngClass]="labTest.priority.toLowerCase()">
              {{ labTest.priority }}
            </span>
          </div>
          
          <div class="detail-row">
            <label>Request Date:</label>
            <span>{{ labTest.requestDate }}</span>
          </div>
          
          <div class="detail-row" *ngIf="labTest.expectedDate">
            <label>Expected Date:</label>
            <span>{{ labTest.expectedDate }}</span>
          </div>
          
          <div class="detail-row full-width" *ngIf="labTest.notes">
            <label>Notes:</label>
            <p>{{ labTest.notes }}</p>
          </div>
        </div>

        <!-- Edit Mode for Prescription -->
        <form class="modal-body edit-form" *ngIf="isEditMode && modalType === 'prescription'" (ngSubmit)="onSubmit()" #prescriptionForm="ngForm">
          <div class="form-row">
            <div class="form-group">
              <label for="patientName">Patient Name *</label>
              <input 
                type="text" 
                id="patientName"
                name="patientName"
                [(ngModel)]="formData.patientName" 
                required
                class="form-input"
                placeholder="Enter patient name">
            </div>
            
            <div class="form-group">
              <label for="patientId">Patient ID *</label>
              <input 
                type="text" 
                id="patientId"
                name="patientId"
                [(ngModel)]="formData.patientId" 
                required
                class="form-input"
                placeholder="e.g., #12345">
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="medication">Medication *</label>
              <input 
                type="text" 
                id="medication"
                name="medication"
                [(ngModel)]="formData.medication" 
                required
                class="form-input"
                placeholder="Enter medication name">
            </div>
            
            <div class="form-group">
              <label for="doctor">Prescribed by *</label>
              <input 
                type="text" 
                id="doctor"
                name="doctor"
                [(ngModel)]="formData.doctor" 
                required
                class="form-input"
                placeholder="Doctor name">
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="dosage">Dosage</label>
              <input 
                type="text" 
                id="dosage"
                name="dosage"
                [(ngModel)]="formData.dosage" 
                class="form-input"
                placeholder="e.g., 500mg">
            </div>
            
            <div class="form-group">
              <label for="frequency">Frequency</label>
              <input 
                type="text" 
                id="frequency"
                name="frequency"
                [(ngModel)]="formData.frequency" 
                class="form-input"
                placeholder="e.g., Twice daily">
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="duration">Duration</label>
              <input 
                type="text" 
                id="duration"
                name="duration"
                [(ngModel)]="formData.duration" 
                class="form-input"
                placeholder="e.g., 7 days">
            </div>
            
            <div class="form-group">
              <label for="status">Status *</label>
              <select 
                id="status"
                name="status"
                [(ngModel)]="formData.status" 
                required
                class="form-input">
                <option value="PENDING">Pending</option>
                <option value="URGENT">Urgent</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>
          
          <div class="form-group full-width">
            <label for="notes">Notes</label>
            <textarea 
              id="notes"
              name="notes"
              [(ngModel)]="formData.notes" 
              class="form-textarea"
              rows="3"
              placeholder="Additional instructions or notes..."></textarea>
          </div>
        </form>        <!-- Edit Mode for Lab Test -->
        <form class="modal-body edit-form" *ngIf="isEditMode && modalType === 'labtest'" (ngSubmit)="onSubmit()" #labTestForm="ngForm">
          ...existing code...
        </form>

        <!-- View Mode for Inventory Item -->
        <div class="modal-body" *ngIf="!isEditMode && inventoryItem && modalType === 'inventory'">
          <div class="detail-row">
            <label>Item Name:</label>
            <span>{{ inventoryItem.name }}</span>
          </div>
          
          <div class="detail-row">
            <label>Category:</label>
            <span>{{ inventoryItem.category }}</span>
          </div>
          
          <div class="detail-row">
            <label>Current Stock:</label>
            <span>{{ inventoryItem.currentStock }}</span>
          </div>
          
          <div class="detail-row">
            <label>Minimum Stock:</label>
            <span>{{ inventoryItem.minimumStock }}</span>
          </div>
          
          <div class="detail-row">
            <label>Maximum Stock:</label>
            <span>{{ inventoryItem.maxStock }}</span>
          </div>
            <div class="detail-row">
            <label>Unit Price:</label>
            <span>\${{ inventoryItem.unitPrice }}</span>
          </div>
          
          <div class="detail-row">
            <label>Status:</label>
            <span class="status-badge" [ngClass]="inventoryItem.status.toLowerCase()">
              {{ inventoryItem.status.replace('_', ' ') }}
            </span>
          </div>
          
          <div class="detail-row">
            <label>Expiry Date:</label>
            <span>{{ inventoryItem.expiryDate }}</span>
          </div>
          
          <div class="detail-row">
            <label>Batch Number:</label>
            <span>{{ inventoryItem.batchNumber }}</span>
          </div>
          
          <div class="detail-row">
            <label>Supplier:</label>
            <span>{{ inventoryItem.supplier }}</span>
          </div>
        </div>

        <!-- Edit Mode for Inventory Item -->
        <form class="modal-body edit-form" *ngIf="isEditMode && modalType === 'inventory'" (ngSubmit)="onSubmit()" #inventoryForm="ngForm">
          <div class="form-row">
            <div class="form-group">
              <label for="itemName">Item Name *</label>
              <input 
                type="text" 
                id="itemName"
                name="itemName"
                [(ngModel)]="inventoryFormData.name" 
                required
                class="form-input"
                placeholder="Enter item name">
            </div>
            
            <div class="form-group">
              <label for="category">Category *</label>
              <input 
                type="text" 
                id="category"
                name="category"
                [(ngModel)]="inventoryFormData.category" 
                required
                class="form-input"
                placeholder="e.g., Antibiotics">
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="currentStock">Current Stock *</label>
              <input 
                type="number" 
                id="currentStock"
                name="currentStock"
                [(ngModel)]="inventoryFormData.currentStock" 
                required
                min="0"
                class="form-input"
                placeholder="Enter current stock">
            </div>
            
            <div class="form-group">
              <label for="minimumStock">Minimum Stock *</label>
              <input 
                type="number" 
                id="minimumStock"
                name="minimumStock"
                [(ngModel)]="inventoryFormData.minimumStock" 
                required
                min="0"
                class="form-input"
                placeholder="Enter minimum stock">
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="maxStock">Maximum Stock *</label>
              <input 
                type="number" 
                id="maxStock"
                name="maxStock"
                [(ngModel)]="inventoryFormData.maxStock" 
                required
                min="0"
                class="form-input"
                placeholder="Enter maximum stock">
            </div>
            
            <div class="form-group">
              <label for="unitPrice">Unit Price *</label>
              <input 
                type="number" 
                id="unitPrice"
                name="unitPrice"
                [(ngModel)]="inventoryFormData.unitPrice" 
                required
                min="0"
                step="0.01"
                class="form-input"
                placeholder="Enter unit price">
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="expiryDate">Expiry Date *</label>
              <input 
                type="date" 
                id="expiryDate"
                name="expiryDate"
                [(ngModel)]="inventoryFormData.expiryDate" 
                required
                class="form-input">
            </div>
            
            <div class="form-group">
              <label for="batchNumber">Batch Number *</label>
              <input 
                type="text" 
                id="batchNumber"
                name="batchNumber"
                [(ngModel)]="inventoryFormData.batchNumber" 
                required
                class="form-input"
                placeholder="Enter batch number">
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="supplier">Supplier *</label>
              <input 
                type="text" 
                id="supplier"
                name="supplier"
                [(ngModel)]="inventoryFormData.supplier" 
                required
                class="form-input"
                placeholder="Enter supplier name">
            </div>
            
            <div class="form-group">
              <label for="status">Status *</label>
              <select 
                id="status"
                name="status"
                [(ngModel)]="inventoryFormData.status" 
                required
                class="form-input">
                <option value="IN_STOCK">In Stock</option>
                <option value="LOW_STOCK">Low Stock</option>
                <option value="OUT_OF_STOCK">Out of Stock</option>
                <option value="EXPIRED">Expired</option>
              </select>
            </div>
          </div>
        </form>
        
        <div class="modal-footer">
          <button type="button" class="btn-secondary" (click)="closeModal()">
            {{ isEditMode ? 'Cancel' : 'Close' }}
          </button>
          <button 
            *ngIf="!isEditMode" 
            type="button" 
            class="btn-primary" 
            (click)="editItem()">
            Edit
          </button>
          <button 
            *ngIf="isEditMode" 
            type="button" 
            class="btn-primary" 
            (click)="onSubmit()"
            [disabled]="!isFormValid()">
            {{ isNew ? 'Create' : 'Update' }} {{ modalType === 'prescription' ? 'Prescription' : modalType === 'labtest' ? 'Lab Test' : 'Item' }}
          </button>
        </div>
      </div>
    </div>
  `,styles: [`
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
      max-width: 800px;
      max-height: 90vh;
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
    }    .status-badge.pending {
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
    }    .status-badge.in_stock {
      background: #d1fae5;
      color: #065f46;
    }

    .status-badge.low_stock {
      background: #fef3c7;
      color: #92400e;
    }

    .status-badge.out_of_stock {
      background: #fee2e2;
      color: #dc2626;
    }

    .status-badge.expired {
      background: #fee2e2;
      color: #7f1d1d;
    }

    .priority-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .priority-badge.normal {
      background: #f3f4f6;
      color: #374151;
    }

    .priority-badge.urgent {
      background: #fef3c7;
      color: #92400e;
    }

    .priority-badge.stat {
      background: #fee2e2;
      color: #dc2626;
    }

    /* Edit form styles */
    .edit-form .form-row {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .form-group {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .form-group.full-width {
      width: 100%;
    }

    .form-group label {
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
    }

    .form-input, .form-textarea {
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 0.875rem;
      transition: border-color 0.2s;
    }

    .form-input:focus, .form-textarea:focus {
      outline: none;
      border-color: #4c6ef5;
      box-shadow: 0 0 0 3px rgba(76, 110, 245, 0.1);
    }

    .form-textarea {
      resize: vertical;
      min-height: 80px;
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

    .btn-primary:hover:not(:disabled) {
      background: #364fc7;
    }

    .btn-primary:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: #e5e7eb;
      color: #374151;
    }

    .btn-secondary:hover {
      background: #d1d5db;
    }

    @media (max-width: 768px) {
      .edit-form .form-row {
        flex-direction: column;
        gap: 0;
      }
      
      .modal-content {
        width: 95%;
        margin: 1rem;
      }
    }
  `]
})
export class PrescriptionModalComponent implements OnChanges {
  @Input() isVisible: boolean = false;
  @Input() prescription: Prescription | null = null;
  @Input() labTest: LabTest | null = null;
  @Input() inventoryItem: InventoryItem | null = null;
  @Input() modalType: 'prescription' | 'labtest' | 'inventory' = 'prescription';
  @Input() isNew: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() edit = new EventEmitter<Prescription>();
  @Output() save = new EventEmitter<Prescription>();
  @Output() saveLabTest = new EventEmitter<LabTest>();
  @Output() saveInventoryItem = new EventEmitter<InventoryItem>();

  isEditMode: boolean = false;
  formData: Prescription = this.getEmptyPrescription();
  labTestFormData: LabTest = this.getEmptyLabTest();
  inventoryFormData: InventoryItem = this.getEmptyInventoryItem();  ngOnChanges(): void {
    if (this.modalType === 'prescription') {
      if (this.prescription && !this.isNew) {
        this.formData = { ...this.prescription };
        this.isEditMode = false;
      } else if (this.isNew) {
        this.formData = this.getEmptyPrescription();
        this.isEditMode = true;
      }
    } else if (this.modalType === 'labtest') {
      if (this.labTest && !this.isNew) {
        this.labTestFormData = { ...this.labTest };
        this.isEditMode = false;
      } else if (this.isNew) {
        this.labTestFormData = this.getEmptyLabTest();
        this.isEditMode = true;
      }
    } else if (this.modalType === 'inventory') {
      if (this.inventoryItem && !this.isNew) {
        this.inventoryFormData = { ...this.inventoryItem };
        this.isEditMode = false;
      } else if (this.isNew) {
        this.inventoryFormData = this.getEmptyInventoryItem();
        this.isEditMode = true;
      }
    }
  }  closeModal(): void {
    this.isEditMode = false;
    this.formData = this.getEmptyPrescription();
    this.labTestFormData = this.getEmptyLabTest();
    this.inventoryFormData = this.getEmptyInventoryItem();
    this.close.emit();
  }

  getModalTitle(): string {
    if (this.modalType === 'labtest') {
      return this.isEditMode ? (this.isNew ? 'New Lab Test' : 'Edit Lab Test') : 'Lab Test Details';
    } else if (this.modalType === 'inventory') {
      return this.isEditMode ? (this.isNew ? 'New Inventory Item' : 'Edit Inventory Item') : 'Inventory Item Details';
    } else {
      return this.isEditMode ? (this.isNew ? 'New Prescription' : 'Edit Prescription') : 'Prescription Details';
    }
  }

  editItem(): void {
    this.isEditMode = true;
    if (this.modalType === 'prescription' && this.prescription) {
      this.formData = { ...this.prescription };
    } else if (this.modalType === 'labtest' && this.labTest) {
      this.labTestFormData = { ...this.labTest };
    } else if (this.modalType === 'inventory' && this.inventoryItem) {
      this.inventoryFormData = { ...this.inventoryItem };
    }
  }  onSubmit(): void {
    if (this.isFormValid()) {
      if (this.modalType === 'prescription') {
        if (this.isNew) {
          // Set current date and time for new prescription
          const now = new Date();
          this.formData.date = now.toISOString().split('T')[0];
          this.formData.time = now.toLocaleTimeString('en-US', { 
            hour12: true, 
            hour: 'numeric', 
            minute: '2-digit' 
          });
          this.formData.id = this.generateId();
        }
        this.save.emit({ ...this.formData });
      } else if (this.modalType === 'labtest') {
        if (this.isNew) {
          this.labTestFormData.id = this.generateId();
          if (!this.labTestFormData.requestDate) {
            this.labTestFormData.requestDate = new Date().toISOString().split('T')[0];
          }
        }
        this.saveLabTest.emit({ ...this.labTestFormData });
      } else if (this.modalType === 'inventory') {
        if (this.isNew) {
          this.inventoryFormData.id = this.generateId();
          // Auto-set status based on stock levels
          if (this.inventoryFormData.currentStock === 0) {
            this.inventoryFormData.status = 'OUT_OF_STOCK';
          } else if (this.inventoryFormData.currentStock <= this.inventoryFormData.minimumStock) {
            this.inventoryFormData.status = 'LOW_STOCK';
          } else {
            this.inventoryFormData.status = 'IN_STOCK';
          }
        }
        this.saveInventoryItem.emit({ ...this.inventoryFormData });
      }
      this.closeModal();
    }
  }

  onOverlayClick(event: Event): void {
    this.closeModal();
  }  isFormValid(): boolean {
    if (this.modalType === 'prescription') {
      return !!(
        this.formData.patientName?.trim() &&
        this.formData.patientId?.trim() &&
        this.formData.medication?.trim() &&
        this.formData.doctor?.trim() &&
        this.formData.status
      );
    } else if (this.modalType === 'labtest') {
      return !!(
        this.labTestFormData.testName?.trim() &&
        this.labTestFormData.patientName?.trim() &&
        this.labTestFormData.patientId?.trim() &&
        this.labTestFormData.doctor?.trim() &&
        this.labTestFormData.status &&
        this.labTestFormData.priority
      );
    } else if (this.modalType === 'inventory') {
      return !!(
        this.inventoryFormData.name?.trim() &&
        this.inventoryFormData.category?.trim() &&
        this.inventoryFormData.currentStock >= 0 &&
        this.inventoryFormData.minimumStock >= 0 &&
        this.inventoryFormData.maxStock >= 0 &&
        this.inventoryFormData.unitPrice >= 0 &&
        this.inventoryFormData.expiryDate?.trim() &&
        this.inventoryFormData.batchNumber?.trim() &&
        this.inventoryFormData.supplier?.trim() &&
        this.inventoryFormData.status
      );
    }
    return false;
  }

  private getEmptyPrescription(): Prescription {
    return {
      patientName: '',
      medication: '',
      doctor: '',
      patientId: '',
      status: 'PENDING',
      time: '',
      date: '',
      dosage: '',
      frequency: '',
      duration: '',
      notes: ''
    };
  }

  private getEmptyLabTest(): LabTest {
    return {
      id: '',
      testName: '',
      patientName: '',
      patientId: '',
      doctor: '',
      status: 'PENDING',
      priority: 'NORMAL',
      requestDate: new Date().toISOString().split('T')[0],
      expectedDate: '',
      notes: ''
    };
  }

  private getEmptyInventoryItem(): InventoryItem {
    return {
      id: '',
      name: '',
      category: '',
      currentStock: 0,
      minimumStock: 0,
      maxStock: 0,
      unitPrice: 0,
      expiryDate: '',
      batchNumber: '',
      supplier: '',
      status: 'IN_STOCK'
    };
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
