import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Prescription, LabTest, InventoryItem } from '../models/prescription.model';

@Component({
  selector: 'app-prescription-modal',
  imports: [CommonModule, FormsModule],  template: `
    <div class="modal-overlay" *ngIf="isVisible" (click)="onOverlayClick($event)">
      <div class="modal-content" (click)="$event.stopPropagation()">        <div class="modal-header">
          <h3>{{ 
            modalType === 'prescription' ? (prescription ? 'Prescription Details' : 'New Prescription') :
            modalType === 'labtest' ? (labTest ? 'Lab Test Details' : 'New Lab Test') :
            modalType === 'inventory' ? (inventoryItem ? 'Inventory Item Details' : 'Add Inventory Item') : 'Modal'
          }}</h3>
          <button class="close-btn" (click)="closeModal()">×</button>
        </div>        <!-- View Mode - Existing Prescription -->
        <div class="modal-body" *ngIf="prescription && modalMode === 'view' && modalType === 'prescription'">
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
        </div>        <!-- View Mode - Existing Lab Test -->
        <div class="modal-body" *ngIf="labTest && modalMode === 'view' && modalType === 'labtest'">
          <div class="detail-row">
            <label>Patient Name:</label>
            <span>{{ labTest.patientName }}</span>
          </div>
          
          <div class="detail-row">
            <label>Patient ID:</label>
            <span>{{ labTest.patientId }}</span>
          </div>
          
          <div class="detail-row">
            <label>Test Name:</label>
            <span>{{ labTest.testName }}</span>
          </div>
          
          <div class="detail-row">
            <label>Requested by:</label>
            <span>{{ labTest.doctor }}</span>
          </div>
          
          <div class="detail-row">
            <label>Status:</label>
            <span class="status-badge" [ngClass]="labTest.status.toLowerCase().replace('_', '-')">
              {{ labTest.status.replace('_', ' ') }}
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
        </div>        <!-- Form Mode - New/Edit Prescription or Lab Test -->
        <div class="modal-body" *ngIf="modalMode === 'edit' || modalMode === 'new'">
          <form (ngSubmit)="savePrescription()" #prescriptionForm="ngForm">
            <div class="form-row">
              <label for="patientName">Patient Name *</label>
              <input type="text" id="patientName" name="patientName" 
                     [(ngModel)]="formData.patientName" required 
                     class="form-input">
            </div>
            
            <div class="form-row">
              <label for="patientId">Patient ID *</label>
              <input type="text" id="patientId" name="patientId" 
                     [(ngModel)]="formData.patientId" required 
                     class="form-input" placeholder="#12345">
            </div>            <!-- Prescription Medication Field -->
            <div class="form-row" *ngIf="modalType === 'prescription'">
              <label for="medication">Medication *</label>
              <input type="text" id="medication" name="medication" 
                     [(ngModel)]="formData.medication" required 
                     class="form-input" placeholder="e.g., Amoxicillin 500mg">
            </div>

            <!-- Lab Test Name Field -->
            <div class="form-row" *ngIf="modalType === 'labtest'">
              <label for="testName">Test Name *</label>
              <input type="text" id="testName" name="testName" 
                     [(ngModel)]="formData.testName" required 
                     class="form-input" placeholder="e.g., Blood Test">
            </div>
            
            <div class="form-row">
              <label for="doctor">Prescribed by *</label>
              <input type="text" id="doctor" name="doctor" 
                     [(ngModel)]="formData.doctor" required 
                     class="form-input" placeholder="Dr. Name">
            </div>
              <div class="form-row" *ngIf="modalType === 'prescription'">
              <label for="dosage">Dosage</label>
              <input type="text" id="dosage" name="dosage" 
                     [(ngModel)]="formData.dosage" 
                     class="form-input" placeholder="e.g., 500mg">
            </div>
            
            <div class="form-row" *ngIf="modalType === 'prescription'">
              <label for="frequency">Frequency</label>
              <input type="text" id="frequency" name="frequency" 
                     [(ngModel)]="formData.frequency" 
                     class="form-input" placeholder="e.g., Twice daily">
            </div>
            
            <div class="form-row" *ngIf="modalType === 'prescription'">
              <label for="duration">Duration</label>
              <input type="text" id="duration" name="duration" 
                     [(ngModel)]="formData.duration" 
                     class="form-input" placeholder="e.g., 7 days">
            </div>

            <div class="form-row" *ngIf="modalType === 'labtest'">
              <label for="priority">Priority</label>
              <select id="priority" name="priority" 
                      [(ngModel)]="formData.priority" 
                      class="form-input">
                <option value="NORMAL">Normal</option>
                <option value="URGENT">Urgent</option>
                <option value="STAT">STAT</option>
              </select>
            </div>
            
            <!-- Inventory Item Fields -->
            <div class="form-row" *ngIf="modalType === 'inventory'">
              <label for="itemName">Item Name *</label>
              <input type="text" id="itemName" name="itemName" 
                     [(ngModel)]="formData.name" required 
                     class="form-input" placeholder="e.g., Paracetamol">
            </div>
            
            <div class="form-row" *ngIf="modalType === 'inventory'">
              <label for="category">Category *</label>
              <select id="category" name="category" 
                      [(ngModel)]="formData.category" required 
                      class="form-input">
                <option value="">Select Category</option>
                <option value="MEDICATION">Medication</option>
                <option value="MEDICAL_SUPPLIES">Medical Supplies</option>
                <option value="EQUIPMENT">Equipment</option>
                <option value="LAB_SUPPLIES">Lab Supplies</option>
              </select>
            </div>
            
            <div class="form-row" *ngIf="modalType === 'inventory'">
              <label for="currentStock">Current Stock *</label>
              <input type="number" id="currentStock" name="currentStock" 
                     [(ngModel)]="formData.currentStock" required 
                     class="form-input" placeholder="0" min="0">
            </div>
            
            <div class="form-row" *ngIf="modalType === 'inventory'">
              <label for="minimumStock">Minimum Stock *</label>
              <input type="number" id="minimumStock" name="minimumStock" 
                     [(ngModel)]="formData.minimumStock" required 
                     class="form-input" placeholder="0" min="0">
            </div>
            
            <div class="form-row" *ngIf="modalType === 'inventory'">
              <label for="maxStock">Maximum Stock *</label>
              <input type="number" id="maxStock" name="maxStock" 
                     [(ngModel)]="formData.maxStock" required 
                     class="form-input" placeholder="0" min="0">
            </div>
            
            <div class="form-row" *ngIf="modalType === 'inventory'">
              <label for="unitPrice">Unit Price *</label>
              <input type="number" id="unitPrice" name="unitPrice" 
                     [(ngModel)]="formData.unitPrice" required 
                     class="form-input" placeholder="0.00" min="0" step="0.01">
            </div>
            
            <div class="form-row" *ngIf="modalType === 'inventory'">
              <label for="supplier">Supplier *</label>
              <input type="text" id="supplier" name="supplier" 
                     [(ngModel)]="formData.supplier" required 
                     class="form-input" placeholder="Supplier Name">
            </div>
            
            <div class="form-row" *ngIf="modalType === 'inventory'">
              <label for="batchNumber">Batch Number</label>
              <input type="text" id="batchNumber" name="batchNumber" 
                     [(ngModel)]="formData.batchNumber" 
                     class="form-input" placeholder="Batch Number">
            </div>
            
            <div class="form-row" *ngIf="modalType === 'inventory'">
              <label for="expiryDate">Expiry Date</label>
              <input type="date" id="expiryDate" name="expiryDate" 
                     [(ngModel)]="formData.expiryDate" 
                     class="form-input">
            </div>
            
            <div class="form-row" *ngIf="modalType === 'inventory'">
              <label for="inventoryStatus">Status</label>
              <select id="inventoryStatus" name="inventoryStatus" 
                      [(ngModel)]="formData.status" 
                      class="form-input">
                <option value="IN_STOCK">In Stock</option>
                <option value="LOW_STOCK">Low Stock</option>
                <option value="OUT_OF_STOCK">Out of Stock</option>
                <option value="EXPIRED">Expired</option>
              </select>
            </div>

            <div class="form-row" *ngIf="modalType === 'labtest'">
              <label for="priority">Priority</label>
              <select id="priority" name="priority" 
                      [(ngModel)]="formData.priority" 
                      class="form-input">
                <option value="NORMAL">Normal</option>
                <option value="URGENT">Urgent</option>
                <option value="STAT">STAT</option>
              </select>
            </div>
            
            <div class="form-row full-width">
              <label for="notes">Notes</label>
              <textarea id="notes" name="notes" 
                        [(ngModel)]="formData.notes" 
                        class="form-textarea" rows="3" 
                        placeholder="Additional instructions or notes..."></textarea>
            </div>
          </form>
        </div>
        
        <div class="modal-footer">
          <button class="btn-secondary" (click)="closeModal()">Cancel</button>
          <div *ngIf="modalMode === 'view'">
            <button class="btn-primary" (click)="editPrescription()">Edit</button>
          </div>
          <div *ngIf="modalMode === 'edit' || modalMode === 'new'">
            <button class="btn-primary" (click)="savePrescription()" 
                    [disabled]="!isFormValid()">
              {{ (prescription || labTest || inventoryItem) ? 'Update' : 'Save' }} {{ 
                modalType === 'prescription' ? 'Prescription' : 
                modalType === 'labtest' ? 'Lab Test' : 
                modalType === 'inventory' ? 'Item' : 'Item'
              }}
            </button>
          </div>
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

    /* Form Styles */
    .form-row {
      margin-bottom: 1rem;
    }

    .form-row label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #374151;
    }

    .form-input,
    .form-textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.2s;
      box-sizing: border-box;
    }

    .form-input:focus,
    .form-textarea:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .form-textarea {
      resize: vertical;
      min-height: 80px;
    }

    .form-row.full-width {
      grid-column: 1 / -1;
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
export class PrescriptionModalComponent implements OnInit, OnChanges {
  @Input() isVisible: boolean = false;
  @Input() prescription: Prescription | null = null;
  @Input() labTest: LabTest | null = null;
  @Input() inventoryItem: InventoryItem | null = null;
  @Input() modalType: 'prescription' | 'labtest' | 'inventory' = 'prescription';
  @Input() modalMode: 'view' | 'edit' | 'new' = 'new';
  @Output() close = new EventEmitter<void>();
  @Output() edit = new EventEmitter<Prescription | LabTest | InventoryItem>();
  @Output() save = new EventEmitter<Prescription | LabTest | InventoryItem>();

  isEditMode: boolean = false;
  formData: any = {}; // Use any for flexibility

  get currentItem() {
    return this.modalType === 'prescription' ? this.prescription : this.labTest;
  }
  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnChanges(): void {
    this.initializeForm();
  }  initializeForm(): void {
    // Set edit mode based on modalMode input
    this.isEditMode = this.modalMode === 'edit' || this.modalMode === 'new';
    
    if (this.modalType === 'prescription' && this.prescription && this.modalMode !== 'new') {
      // Editing or viewing existing prescription
      this.formData = { ...this.prescription };
    } else if (this.modalType === 'labtest' && this.labTest && this.modalMode !== 'new') {
      // Editing or viewing existing lab test
      this.formData = { ...this.labTest };
    } else if (this.modalType === 'inventory' && this.inventoryItem && this.modalMode !== 'new') {
      // Editing or viewing existing inventory item
      this.formData = { ...this.inventoryItem };
    } else {
      // Creating new item
      this.resetForm();
    }
  }  resetForm(): void {
    if (this.modalType === 'prescription') {
      this.formData = {
        patientName: '',
        patientId: '',
        medication: '',
        doctor: '',
        dosage: '',
        frequency: '',
        duration: '',
        notes: '',
        status: 'PENDING'
      };
    } else if (this.modalType === 'labtest') {
      this.formData = {
        patientName: '',
        patientId: '',
        testName: '',
        doctor: '',
        notes: '',
        status: 'PENDING',
        priority: 'NORMAL'
      };
    } else if (this.modalType === 'inventory') {
      this.formData = {
        name: '',
        category: '',
        currentStock: 0,        minimumStock: 0,
        maxStock: 0,
        unitPrice: 0,
        expiryDate: '',
        batchNumber: '',
        supplier: '',
        status: 'IN_STOCK'
      };
    }
  }

  closeModal(): void {
    this.isEditMode = false;
    this.resetForm();
    this.close.emit();
  }

  editPrescription(): void {
    this.isEditMode = true;
    if (this.prescription) {
      this.formData = { ...this.prescription };
    }
  }
  savePrescription(): void {
    if (this.isFormValid()) {
      if (this.modalType === 'prescription') {
        const prescriptionData: Prescription = {
          id: this.prescription?.id || this.generateId(),
          patientName: this.formData.patientName || '',
          patientId: this.formData.patientId || '',
          medication: this.formData.medication || '',
          doctor: this.formData.doctor || '',
          status: this.formData.status || 'PENDING',
          time: new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          date: new Date().toLocaleDateString('en-US'),
          dosage: this.formData.dosage || '',
          frequency: this.formData.frequency || '',
          duration: this.formData.duration || '',
          notes: this.formData.notes || ''        };
        this.save.emit(prescriptionData);
      } else if (this.modalType === 'labtest') {
        const labTestData: LabTest = {
          id: this.labTest?.id || this.generateId(),
          patientName: this.formData.patientName || '',
          patientId: this.formData.patientId || '',
          testName: this.formData.testName || '',
          doctor: this.formData.doctor || '',
          status: this.formData.status || 'PENDING',
          priority: this.formData.priority || 'NORMAL',
          requestDate: new Date().toLocaleDateString('en-US'),
          notes: this.formData.notes || ''
        };
        this.save.emit(labTestData);
      } else if (this.modalType === 'inventory') {
        const inventoryData: InventoryItem = {
          id: this.inventoryItem?.id || this.generateId(),
          name: this.formData.name || '',
          category: this.formData.category || '',
          currentStock: this.formData.currentStock || 0,
          minimumStock: this.formData.minimumStock || 0,
          maxStock: this.formData.maxStock || 0,
          unitPrice: this.formData.unitPrice || 0,
          expiryDate: this.formData.expiryDate || '',
          batchNumber: this.formData.batchNumber || '',
          supplier: this.formData.supplier || '',
          status: this.formData.status || 'IN_STOCK'
        };
        this.save.emit(inventoryData);
      }
      this.closeModal();
    }
  }  isFormValid(): boolean {
    if (this.modalType === 'prescription') {
      return !!(
        this.formData.patientName?.trim() &&
        this.formData.patientId?.trim() &&
        this.formData.medication?.trim() &&
        this.formData.doctor?.trim()
      );
    } else if (this.modalType === 'labtest') {
      return !!(
        this.formData.patientName?.trim() &&
        this.formData.patientId?.trim() &&
        this.formData.testName?.trim() &&
        this.formData.doctor?.trim()
      );
    } else if (this.modalType === 'inventory') {
      return !!(
        this.formData.name?.trim() &&
        this.formData.category?.trim() &&
        this.formData.supplier?.trim() &&
        this.formData.currentStock >= 0 &&        this.formData.minimumStock >= 0 &&
        this.formData.maxStock >= 0 &&
        this.formData.unitPrice >= 0
      );
    }
    return false;
  }

  private generateId(): string {
    return 'RX' + Date.now().toString().slice(-6);
  }

  onOverlayClick(event: Event): void {
    this.closeModal();
  }
}
