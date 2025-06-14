import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Prescription, LabTest, InventoryItem } from '../models/prescription.model';

@Component({
  selector: 'app-prescription-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
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
                  placeholder="Enter dosage"
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
                  placeholder="Enter frequency"
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
                  placeholder="Enter duration"
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
                  placeholder="Enter doctor name"
                >
              </div>
            </div>

            <div class="form-group">
              <label for="prescriptionNotes">Notes</label>
              <textarea
                id="prescriptionNotes"
                [(ngModel)]="prescriptionData.notes"
                name="prescriptionNotes"
                class="form-control"
                rows="3"
                placeholder="Enter additional notes"
              ></textarea>
            </div>
            
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancel</button>
              <button type="submit" class="btn btn-primary">{{ mode === 'edit' ? 'Update' : 'Add' }} Prescription</button>
            </div>
          </form>

          <!-- Lab Test Form -->
          <form *ngIf="modalType === 'labTest'" (ngSubmit)="saveLabTest()">
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
              <div class="form-group">              <label for="testDate">Request Date *</label>
              <input
                type="date"
                id="testDate"
                [(ngModel)]="labTestData.requestDate"
                name="testDate"
                  required
                  class="form-control"
                >
              </div>

              <div class="form-group">
                <label for="priority">Priority</label>
                <select
                  id="priority"
                  [(ngModel)]="labTestData.priority"
                  name="priority"
                  class="form-control"
                >                  <option value="NORMAL">Normal</option>
                  <option value="URGENT">Urgent</option>
                  <option value="STAT">STAT</option>
                </select>
              </div>
            </div>            <div class="form-group">
              <label for="labNotes">Notes</label>
              <textarea
                id="labNotes"
                [(ngModel)]="labTestData.notes"
                name="labNotes"
                class="form-control"
                rows="3"
                placeholder="Enter additional notes"
              ></textarea>
            </div>
            
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancel</button>
              <button type="submit" class="btn btn-primary">{{ mode === 'edit' ? 'Update' : 'Add' }} Lab Test</button>
            </div>
          </form>

          <!-- Inventory Form -->
          <form *ngIf="modalType === 'inventory'" (ngSubmit)="saveInventoryItem()">
            <div class="form-group">              <label for="itemName">Item Name *</label>
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

            <div class="form-group">
              <label for="category">Category *</label>
              <select
                id="category"
                [(ngModel)]="inventoryData.category"
                name="category"
                required
                class="form-control"              >
                <option value="">Select category</option>
                <option value="Antibiotics">Antibiotics</option>
                <option value="Pain Relief">Pain Relief</option>
                <option value="Vitamins">Vitamins</option>
                <option value="Medical Supplies">Medical Supplies</option>
                <option value="Equipment">Equipment</option>
                <option value="Consumables">Consumables</option>
                <option value="Cardiovascular">Cardiovascular</option>
                <option value="Diabetes">Diabetes</option>
                <option value="Respiratory">Respiratory</option>
              </select>
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
                  placeholder="Enter current stock"
                >
              </div>

              <div class="form-group">                <label for="minStock">Minimum Stock *</label>
                <input
                  type="number"
                  id="minStock"
                  [(ngModel)]="inventoryData.minimumStock"
                  name="minStock"
                  required
                  min="0"
                  class="form-control"
                  placeholder="Enter minimum stock level"
                >
              </div>
            </div>

            <div class="form-row">              <div class="form-group">
                <label for="maxStock">Maximum Stock</label>
                <input
                  type="number"
                  id="maxStock"
                  [(ngModel)]="inventoryData.maxStock"
                  name="maxStock"
                  min="0"
                  class="form-control"
                  placeholder="Enter maximum stock level"
                >
              </div>

              <div class="form-group">
                <label for="unitPrice">Unit Price</label>
                <input
                  type="number"
                  id="unitPrice"
                  [(ngModel)]="inventoryData.unitPrice"
                  name="unitPrice"
                  min="0"
                  step="0.01"
                  class="form-control"
                  placeholder="Enter unit price"
                >
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

              <div class="form-group">
                <label for="expiryDate">Expiry Date</label>
                <input
                  type="date"
                  id="expiryDate"
                  [(ngModel)]="inventoryData.expiryDate"
                  name="expiryDate"
                  class="form-control"
                >
              </div>
            </div>            <div class="form-group">
              <label for="supplier">Supplier</label>
              <input
                type="text"
                id="supplier"
                [(ngModel)]="inventoryData.supplier"
                name="supplier"
                class="form-control"
                placeholder="Enter supplier name"
              >
            </div>
            
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancel</button>
              <button type="submit" class="btn btn-primary">{{ mode === 'edit' ? 'Update' : 'Add' }} Item</button>
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
      animation: fadeIn 0.3s ease-out;
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      max-width: 600px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
      animation: slideIn 0.3s ease-out;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid #e5e7eb;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 12px 12px 0 0;
    }

    .modal-header h3 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: white;
      opacity: 0.8;
      transition: opacity 0.2s;
      padding: 0;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
    }

    .close-btn:hover {
      opacity: 1;
      background-color: rgba(255, 255, 255, 0.1);
    }

    .modal-body {
      padding: 1.5rem;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #374151;
      font-size: 0.875rem;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 0.875rem;
      transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
      box-sizing: border-box;
    }

    .form-control:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .form-control:invalid {
      border-color: #ef4444;
    }

    textarea.form-control {
      resize: vertical;
      min-height: 80px;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e5e7eb;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s ease-in-out;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 80px;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }

    .btn-secondary {
      background-color: #6b7280;
      color: white;
    }

    .btn-secondary:hover {
      background-color: #4b5563;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translate(-50%, -60%) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translate(0, 0) scale(1);
      }
    }

    @media (max-width: 768px) {
      .modal-content {
        width: 95%;
        margin: 1rem;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .modal-header {
        padding: 1rem;
      }

      .modal-body {
        padding: 1rem;
      }
    }
  `]
})
export class PrescriptionModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() modalType: 'prescription' | 'labTest' | 'inventory' = 'prescription';
  @Input() mode: 'add' | 'edit' | 'view' = 'add';
  @Input() data: any = null;

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  prescriptionData: Prescription = this.getEmptyPrescription();
  labTestData: LabTest = this.getEmptyLabTest();
  inventoryData: InventoryItem = this.getEmptyInventoryItem();

  ngOnInit() {
    this.resetFormData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && this.data) {
      this.loadData();
    }
    if (changes['isOpen'] && this.isOpen) {
      this.resetFormData();
    }
  }

  getModalTitle(): string {
    const action = this.mode === 'add' ? 'Add' : (this.mode === 'edit' ? 'Edit' : 'View');
    switch (this.modalType) {
      case 'prescription':
        return `${action} Prescription`;
      case 'labTest':
        return `${action} Lab Test`;
      case 'inventory':
        return `${action} Inventory Item`;
      default:
        return 'Modal';
    }
  }

  loadData() {
    if (this.data) {
      switch (this.modalType) {
        case 'prescription':
          this.prescriptionData = { ...this.data };
          break;
        case 'labTest':
          this.labTestData = { ...this.data };
          break;
        case 'inventory':
          this.inventoryData = { ...this.data };
          break;
      }
    }
  }

  resetFormData() {
    if (this.mode === 'add' || !this.data) {
      this.prescriptionData = this.getEmptyPrescription();
      this.labTestData = this.getEmptyLabTest();
      this.inventoryData = this.getEmptyInventoryItem();
    } else {
      this.loadData();
    }
  }
  getEmptyPrescription(): Prescription {
    return {
      id: '',
      patientName: '',
      patientId: '',
      medication: '',
      dosage: '',
      frequency: '',
      duration: '',
      doctor: '',
      status: 'PENDING',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0],
      notes: ''
    };
  }
  getEmptyLabTest(): LabTest {
    return {
      id: '',
      patientName: '',
      patientId: '',
      testName: '',
      doctor: '',
      requestDate: new Date().toISOString().split('T')[0],
      status: 'PENDING',
      priority: 'NORMAL',
      notes: ''
    };
  }
  getEmptyInventoryItem(): InventoryItem {
    return {
      id: '',
      name: '',
      category: '',
      currentStock: 0,
      minimumStock: 0,
      maxStock: 100,
      unitPrice: 0,
      expiryDate: '',
      batchNumber: '',
      supplier: '',
      status: 'IN_STOCK'
    };
  }

  onOverlayClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  closeModal() {
    this.close.emit();
  }

  savePrescription() {
    if (this.mode === 'add') {
      this.prescriptionData.id = this.generateId();
    }
    this.save.emit({ type: 'prescription', data: this.prescriptionData });
    this.closeModal();
  }

  saveLabTest() {
    if (this.mode === 'add') {
      this.labTestData.id = this.generateId();
    }
    this.save.emit({ type: 'labTest', data: this.labTestData });
    this.closeModal();
  }

  saveInventoryItem() {
    if (this.mode === 'add') {
      this.inventoryData.id = this.generateId();
    }
    this.save.emit({ type: 'inventory', data: this.inventoryData });
    this.closeModal();
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}
