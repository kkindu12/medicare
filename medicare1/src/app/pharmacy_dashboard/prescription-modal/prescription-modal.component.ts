import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Prescription, LabTest, InventoryItem } from '../models/prescription.model';

@Component({
  selector: 'app-prescription-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],  template: `
    <div class="modal-overlay" *ngIf="isOpen" (click)="onOverlayClick($event)">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>{{ getModalTitle() }}</h3>
          <button class="close-btn" (click)="closeModal()">&times;</button>
        </div>
        
        <div class="modal-body">
          <!-- Prescription Form -->
          <form *ngIf="modalType === 'prescription'" (ngSubmit)="savePrescription()">
            <div class="form-group">
              <label for="patientName">Patient Name *</label>
              <input
                type="text"
                id="patientName"
                [(ngModel)]="prescriptionData.patientName"
                name="patientName"
                required
                class="form-control"
                placeholder="Enter patient name"
              >
            </div>
            
            <div class="form-group">
              <label for="medication">Medication *</label>
              <input
                type="text"
                id="medication"
                [(ngModel)]="prescriptionData.medication"
                name="medication"
                required
                class="form-control"
                placeholder="Enter medication name"
              >
            </div>
              <div class="form-group">
              <label for="patientId">Patient ID *</label>
              <input
                type="text"
                id="patientId"
                [(ngModel)]="prescriptionData.patientId"
                name="patientId"
                required
                class="form-control"
                placeholder="Enter patient ID"
              >
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="dosage">Dosage</label>
                <input
                  type="text"
                  id="dosage"
                  [(ngModel)]="prescriptionData.dosage"
                  name="dosage"
                  class="form-control"
                  placeholder="e.g., 500mg"
                >
              </div>
              
              <div class="form-group">
                <label for="frequency">Frequency</label>
                <input
                  type="text"
                  id="frequency"
                  [(ngModel)]="prescriptionData.frequency"
                  name="frequency"
                  class="form-control"
                  placeholder="e.g., twice daily"
                >
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="duration">Duration</label>
                <input
                  type="text"
                  id="duration"
                  [(ngModel)]="prescriptionData.duration"
                  name="duration"
                  class="form-control"
                  placeholder="e.g., 7 days"
                >
              </div>
              
              <div class="form-group">
                <label for="doctor">Doctor *</label>
                <input
                  type="text"
                  id="doctor"
                  [(ngModel)]="prescriptionData.doctor"
                  name="doctor"
                  required
                  class="form-control"
                  placeholder="Doctor name"
                >
              </div>
            </div>
            
            <div class="form-group">
              <label for="notes">Notes</label>
              <textarea
                id="notes"
                [(ngModel)]="prescriptionData.notes"
                name="notes"
                class="form-control"
                rows="3"
                placeholder="Special notes or instructions"
              ></textarea>
            </div>
            
            <div class="form-group">
              <label for="status">Status</label>
              <select
                id="status"
                [(ngModel)]="prescriptionData.status"
                name="status"
                class="form-control"
              >
                <option value="PENDING">Pending</option>
                <option value="URGENT">Urgent</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" (click)="onCancelClick($event)">Cancel</button>
              <button type="submit" class="btn btn-primary">{{ isEditing ? 'Update' : 'Save' }} Prescription</button>
            </div>
          </form>
          
          <!-- Lab Test Form -->
          <form *ngIf="modalType === 'labtest'" (ngSubmit)="saveLabTest()">
            <div class="form-group">
              <label for="labPatientName">Patient Name *</label>
              <input
                type="text"
                id="labPatientName"
                [(ngModel)]="labTestData.patientName"
                name="labPatientName"
                required
                class="form-control"
                placeholder="Enter patient name"
              >
            </div>
            
            <div class="form-group">
              <label for="testName">Test Name *</label>
              <input
                type="text"
                id="testName"
                [(ngModel)]="labTestData.testName"
                name="testName"
                required
                class="form-control"
                placeholder="Enter test name"
              >
            </div>
              <div class="form-group">
              <label for="labPatientId">Patient ID *</label>
              <input
                type="text"
                id="labPatientId"
                [(ngModel)]="labTestData.patientId"
                name="labPatientId"
                required
                class="form-control"
                placeholder="Enter patient ID"
              >
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="priority">Priority *</label>
                <select
                  id="priority"
                  [(ngModel)]="labTestData.priority"
                  name="priority"
                  required
                  class="form-control"
                >
                  <option value="NORMAL">Normal</option>
                  <option value="URGENT">Urgent</option>
                  <option value="STAT">STAT</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="doctor">Doctor *</label>
                <input
                  type="text"
                  id="doctor"
                  [(ngModel)]="labTestData.doctor"
                  name="doctor"
                  required
                  class="form-control"
                  placeholder="Doctor name"
                >
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="requestDate">Request Date</label>
                <input
                  type="date"
                  id="requestDate"
                  [(ngModel)]="labTestData.requestDate"
                  name="requestDate"
                  class="form-control"
                >
              </div>
              
              <div class="form-group">
                <label for="expectedDate">Expected Date</label>
                <input
                  type="date"
                  id="expectedDate"
                  [(ngModel)]="labTestData.expectedDate"
                  name="expectedDate"
                  class="form-control"
                >
              </div>
            </div>
            
            <div class="form-group">
              <label for="labStatus">Status</label>
              <select
                id="labStatus"
                [(ngModel)]="labTestData.status"
                name="labStatus"
                class="form-control"
              >
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="labNotes">Notes</label>
              <textarea
                id="labNotes"
                [(ngModel)]="labTestData.notes"
                name="labNotes"
                class="form-control"
                rows="2"
                placeholder="Additional notes"
              ></textarea>
            </div>            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" (click)="onCancelClick($event)">Cancel</button>
              <button type="submit" class="btn btn-primary">{{ isEditing ? 'Update' : 'Save' }} Lab Test</button>
            </div>
          </form>
          
          <!-- Inventory Form -->
          <form *ngIf="modalType === 'inventory'" (ngSubmit)="saveInventory()">
            <div class="form-group">
              <label for="itemName">Item Name *</label>
              <input
                type="text"
                id="itemName"
                [(ngModel)]="inventoryData.name"
                name="itemName"
                required
                class="form-control"
                placeholder="Enter item name"
              >
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="category">Category *</label>
                <select
                  id="category"
                  [(ngModel)]="inventoryData.category"
                  name="category"
                  required
                  class="form-control"
                >
                  <option value="">Select category</option>
                  <option value="Medications">Medications</option>
                  <option value="Medical Supplies">Medical Supplies</option>
                  <option value="Lab Equipment">Lab Equipment</option>
                  <option value="Surgical Instruments">Surgical Instruments</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="supplier">Supplier *</label>
                <input
                  type="text"
                  id="supplier"
                  [(ngModel)]="inventoryData.supplier"
                  name="supplier"
                  required
                  class="form-control"
                  placeholder="Supplier name"
                >
              </div>
            </div>
              <div class="form-row">
              <div class="form-group">
                <label for="currentStock">Current Stock *</label>
                <input
                  type="number"
                  id="currentStock"
                  [(ngModel)]="inventoryData.currentStock"
                  name="currentStock"
                  required
                  min="0"
                  class="form-control"
                  placeholder="0"
                >
              </div>
              
              <div class="form-group">
                <label for="minimumStock">Minimum Stock *</label>
                <input
                  type="number"
                  id="minimumStock"
                  [(ngModel)]="inventoryData.minimumStock"
                  name="minimumStock"
                  required
                  min="0"
                  class="form-control"
                  placeholder="0"
                >
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="maxStock">Maximum Stock</label>
                <input
                  type="number"
                  id="maxStock"
                  [(ngModel)]="inventoryData.maxStock"
                  name="maxStock"
                  min="0"
                  class="form-control"
                  placeholder="0"
                >
              </div>
              
              <div class="form-group">
                <label for="unitPrice">Unit Price *</label>
                <input
                  type="number"
                  id="unitPrice"
                  [(ngModel)]="inventoryData.unitPrice"
                  name="unitPrice"
                  required
                  min="0"
                  step="0.01"
                  class="form-control"
                  placeholder="0.00"
                >
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="expiryDate">Expiry Date *</label>
                <input
                  type="date"
                  id="expiryDate"
                  [(ngModel)]="inventoryData.expiryDate"
                  name="expiryDate"
                  required
                  class="form-control"
                >
              </div>
              
              <div class="form-group">
                <label for="inventoryStatus">Status</label>
                <select
                  id="inventoryStatus"
                  [(ngModel)]="inventoryData.status"
                  name="inventoryStatus"
                  class="form-control"
                >
                  <option value="IN_STOCK">In Stock</option>
                  <option value="LOW_STOCK">Low Stock</option>
                  <option value="OUT_OF_STOCK">Out of Stock</option>
                  <option value="EXPIRED">Expired</option>
                </select>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="batchNumber">Batch Number</label>
                <input
                  type="text"
                  id="batchNumber"
                  [(ngModel)]="inventoryData.batchNumber"
                  name="batchNumber"
                  class="form-control"
                  placeholder="Enter batch number"
                >
              </div>
            </div>            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" (click)="onCancelClick($event)">Cancel</button>
              <button type="submit" class="btn btn-primary">{{ isEditing ? 'Update' : 'Add' }} Item</button>
            </div>
          </form>
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
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 8px;
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }

    .modal-header {
      padding: 20px;
      border-bottom: 1px solid #e9ecef;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-header h3 {
      margin: 0;
      color: #2c3e50;
      font-size: 1.5rem;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #6c757d;
      padding: 0;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .close-btn:hover {
      color: #dc3545;
    }

    .modal-body {
      padding: 20px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }

    label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
      color: #2c3e50;
    }

    .form-control {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      transition: border-color 0.3s;
    }

    .form-control:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }

    .form-control:invalid {
      border-color: #dc3545;
    }

    textarea.form-control {
      resize: vertical;
      min-height: 60px;
    }    .modal-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e9ecef;
      pointer-events: auto;
      position: relative;
      z-index: 1001;
    }.btn {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.3s;
      pointer-events: auto;
      position: relative;
      z-index: 1001;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn-primary:hover {
      background-color: #0056b3;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background-color: #545b62;
    }

    @media (max-width: 768px) {
      .modal-content {
        width: 95%;
        margin: 10px;
      }

      .form-row {
        grid-template-columns: 1fr;
        gap: 10px;
      }

      .modal-actions {
        flex-direction: column-reverse;
      }

      .btn {
        width: 100%;
      }
    }
  `]
})
export class PrescriptionModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() modalType: 'prescription' | 'labtest' | 'inventory' = 'prescription';
  @Input() editData: any = null;
  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() saveEvent = new EventEmitter<any>();

  isEditing = false;  // Form data objects
  prescriptionData: Prescription = {
    id: '',
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

  labTestData: LabTest = {
    id: '',
    testName: '',
    patientName: '',
    patientId: '',
    doctor: '',
    status: 'PENDING',
    priority: 'NORMAL',
    requestDate: '',
    expectedDate: '',
    notes: ''
  };

  inventoryData: InventoryItem = {
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
  };  ngOnInit() {
    console.log('PrescriptionModalComponent initialized', {
      isOpen: this.isOpen,
      modalType: this.modalType,
      editData: this.editData
    });
    this.checkAndLoadEditData();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('PrescriptionModalComponent changes detected:', changes);
    if (changes['editData'] || changes['isOpen']) {
      this.checkAndLoadEditData();
    }
  }

  checkAndLoadEditData() {
    if (this.editData && this.isOpen) {
      console.log('Loading edit data:', this.editData);
      this.isEditing = true;
      this.loadEditData();
    } else if (this.isOpen) {
      console.log('Resetting forms for new entry');
      this.isEditing = false;
      this.resetForms();
    }
  }

  getModalTitle(): string {
    const action = this.isEditing ? 'Edit' : 'Add';
    switch (this.modalType) {
      case 'prescription':
        return `${action} Prescription`;
      case 'labtest':
        return `${action} Lab Test`;
      case 'inventory':
        return `${action} Inventory Item`;
      default:
        return 'Modal';
    }  }
  loadEditData() {
    console.log('loadEditData called with:', this.editData, 'modalType:', this.modalType);
    if (this.editData) {
      switch (this.modalType) {
        case 'prescription':
          this.prescriptionData = { ...this.editData };
          console.log('Loaded prescription data:', this.prescriptionData);
          break;
        case 'labtest':
          this.labTestData = { ...this.editData };
          console.log('Loaded lab test data:', this.labTestData);
          break;
        case 'inventory':
          this.inventoryData = { ...this.editData };
          console.log('Loaded inventory data:', this.inventoryData);
          break;
      }
    }
  }

  resetForms() {
    this.prescriptionData = {
      id: '',
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

    this.labTestData = {
      id: '',
      testName: '',
      patientName: '',
      patientId: '',
      doctor: '',
      status: 'PENDING',
      priority: 'NORMAL',
      requestDate: '',
      expectedDate: '',
      notes: ''
    };

    this.inventoryData = {
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
      status: 'IN_STOCK'    };
  }

  savePrescription() {
    if (this.isValidPrescription()) {
      const currentDate = new Date();
      const prescriptionToSave = {
        ...this.prescriptionData,
        id: this.isEditing ? this.editData.id : Date.now().toString(),
        date: currentDate.toISOString().split('T')[0],
        time: currentDate.toTimeString().split(' ')[0]
      };
      this.saveEvent.emit({ type: 'prescription', data: prescriptionToSave });
      this.closeModal();
    }
  }

  saveLabTest() {
    if (this.isValidLabTest()) {
      const currentDate = new Date();
      const labTestToSave = {
        ...this.labTestData,
        id: this.isEditing ? this.editData.id : Date.now().toString(),
        requestDate: currentDate.toISOString().split('T')[0]
      };
      this.saveEvent.emit({ type: 'labtest', data: labTestToSave });
      this.closeModal();
    }
  }

  saveInventory() {
    if (this.isValidInventory()) {
      const inventoryToSave = {
        ...this.inventoryData,
        id: this.isEditing ? this.editData.id : Date.now().toString()
      };
      this.saveEvent.emit({ type: 'inventory', data: inventoryToSave });
      this.closeModal();    }
  }

  isValidPrescription(): boolean {
    return !!(
      this.prescriptionData.patientName &&
      this.prescriptionData.medication &&
      this.prescriptionData.doctor &&
      this.prescriptionData.patientId
    );
  }

  isValidLabTest(): boolean {
    return !!(
      this.labTestData.patientName &&
      this.labTestData.testName &&
      this.labTestData.patientId &&
      this.labTestData.doctor
    );
  }

  isValidInventory(): boolean {
    return !!(
      this.inventoryData.name &&
      this.inventoryData.category &&
      this.inventoryData.currentStock >= 0 &&
      this.inventoryData.minimumStock >= 0 &&
      this.inventoryData.supplier &&
      this.inventoryData.unitPrice >= 0 &&
      this.inventoryData.expiryDate
    );
  }  closeModal() {
    console.log('closeModal() called - Cancel button clicked');
    this.isEditing = false;
    this.resetForms();
    this.closeModalEvent.emit();
  }

  onCancelClick(event: Event) {
    console.log('onCancelClick called');
    event.preventDefault();
    event.stopPropagation();
    this.closeModal();
  }

  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.closeModal();
    }
  }
}
