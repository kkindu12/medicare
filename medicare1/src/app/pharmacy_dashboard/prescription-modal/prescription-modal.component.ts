<<<<<<< HEAD
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
=======
import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
>>>>>>> ad43748ede4905d6473e19af9145d55fc4085cb6
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Prescription, LabTest, InventoryItem } from '../models/prescription.model';

@Component({
  selector: 'app-prescription-modal',
<<<<<<< HEAD
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
=======
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
>>>>>>> ad43748ede4905d6473e19af9145d55fc4085cb6
          
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
          
<<<<<<< HEAD
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
=======
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
>>>>>>> ad43748ede4905d6473e19af9145d55fc4085cb6
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

<<<<<<< HEAD
    label {
      display: block;
      margin-bottom: 5px;
=======
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
>>>>>>> ad43748ede4905d6473e19af9145d55fc4085cb6
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
<<<<<<< HEAD
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
=======
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
>>>>>>> ad43748ede4905d6473e19af9145d55fc4085cb6
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
