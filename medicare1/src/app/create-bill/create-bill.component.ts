import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/userService/user.service';
import { NotificationService } from '../services/notification.service';
import { BillService, BillCreate } from '../services/bill.service';
import { CreateNotificationRequest } from '../models/notification.model';

@Component({
  selector: 'app-create-bill',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-bill.component.html',
  styleUrls: ['./create-bill.component.scss']
})
export class CreateBillComponent implements OnInit {

  // Real patients from database
  patients: any[] = [];
  isLoadingPatients = false;
  patientError: string | null = null;

  selectedPatientName: string | null = null;

  newItem = {
    description: '',
    amount: 0
  };

  billItems: any[] = [];
  totalAmount: number = 0;

  billNumber: string = '';
  lastBillNumber: number = 2025000;

  constructor(
    private router: Router, 
    private userService: UserService,
    private notificationService: NotificationService,
    private billService: BillService
  ) {}

  ngOnInit(): void {
    this.generateBillNumber();
    this.loadPatients();
  }

  // Load all patients from the database
  loadPatients(): void {
    this.isLoadingPatients = true;
    this.patientError = null;

    console.log('Loading patients for bill creation...');

    this.userService.getAllUsers().subscribe({
      next: (users) => {
        console.log('Received users from API:', users);
        
        // Filter users to get only patients (role = false)
        this.patients = users
          .filter(user => !user.role) // Get only patients (not doctors/admins)
          .map(user => ({
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber
          }));
        
        this.isLoadingPatients = false;
        console.log('Filtered patients for billing:', this.patients.length, 'patients found');
        
        if (this.patients.length === 0) {
          this.patientError = 'No patients found. Please register patients first.';
        }
      },
      error: (error) => {
        console.error('Error loading patients:', error);
        this.patientError = 'Failed to load patients. Please check if the backend is running and try again.';
        this.isLoadingPatients = false;
      }
    });
  }

  // Refresh patients data
  refreshPatients(): void {
    this.loadPatients();
  }

  generateBill() {
    if (!this.selectedPatientName || this.billItems.length === 0) {
      alert('Select patient and add at least one bill item.');
      return;
    }

    // Find the patient to get their ID for backend storage
    const selectedPatient = this.patients.find(p => p.name === this.selectedPatientName);
    
    if (!selectedPatient) {
      alert('Error: Could not find patient information.');
      return;
    }

    const billData: BillCreate = {
      billNumber: this.billNumber,
      patientId: selectedPatient.id,
      patientName: this.selectedPatientName,
      billItems: this.billItems.map(item => ({
        description: item.description,
        amount: item.amount
      })),
      totalAmount: this.totalAmount,
      status: 'pending'
    };

    // Save bill to backend first
    this.billService.createBill(billData).subscribe({
      next: (savedBill) => {
        console.log('Bill saved to backend:', savedBill);
        
        // Generate and open bill receipt
        this.generateBillReceipt(billData);

        // Send notification to the patient
        this.sendBillNotification(selectedPatient, billData);

        // Reset form for next bill
        this.resetForm();
      },
      error: (error) => {
        console.error('Error saving bill to backend:', error);
        alert('Error saving bill to database. Please try again.');
      }
    });
  }

  private generateBillReceipt(billData: any) {
    // Open new window
    const newWindow = window.open('', '_blank');

    // Build HTML receipt content
    let receiptHtml = `
      <html>
        <head>
          <title>Hospital Bill Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { margin-bottom: 10px; color: #0d6efd; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            table, th, td { border: 1px solid #ccc; padding: 8px; }
            th { background-color: #f8f8f8; }
            h4 { margin-top: 20px; color: #198754; }
            button { margin-top: 20px; padding: 8px 16px; background-color: #0d6efd; color: white; border: none; border-radius: 4px; }
            .no-print { display: block; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <h2>🏥 Medicare Hospital Bill Receipt</h2>
          <p><strong>Bill Number:</strong> ${billData.billNumber}</p>
          <p><strong>Patient Name:</strong> ${billData.patientName}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>

          <table>
            <thead>
              <tr>
                <th>No.</th>
                <th>Description</th>
                <th>Amount (Rs.)</th>
              </tr>
            </thead>
            <tbody>
    `;

    billData.billItems.forEach((item: any, index: number) => {
      receiptHtml += `
        <tr>
          <td>${index + 1}</td>
          <td>${item.description}</td>
          <td>${item.amount.toFixed(2)}</td>
        </tr>
      `;
    });

    receiptHtml += `
            </tbody>
          </table>

          <h4>Total Amount: Rs. ${billData.totalAmount.toFixed(2)}</h4>
          
          <p style="margin-top: 30px; font-size: 0.9em; color: #666;">
            Thank you for choosing Medicare Hospital. This bill has been sent to your dashboard.
          </p>

          <button class="no-print" onclick="window.print()">🖨️ Print Bill</button>
        </body>
      </html>
    `;

    newWindow!.document.open();
    newWindow!.document.write(receiptHtml);
    newWindow!.document.close();
  }

  private sendBillNotification(patient: any, billData: any) {
    const notificationRequest: CreateNotificationRequest = {
      userId: patient.id,
      title: 'New Hospital Bill Generated',
      message: `A new bill (${billData.billNumber}) for Rs. ${billData.totalAmount.toFixed(2)} has been generated. Please check your dashboard for details.`,
      type: 'general',
      createdBy: 'reception', // You might want to get actual reception user ID
      createdByName: 'Reception Desk'
    };

    console.log('Sending bill notification to patient:', patient.name);

    this.notificationService.createNotification(notificationRequest).subscribe({
      next: (response) => {
        console.log('Bill notification sent successfully:', response);
        alert(`Bill generated successfully! Patient ${patient.name} has been notified.`);
      },
      error: (error) => {
        console.error('Error sending bill notification:', error);
        alert(`Bill generated successfully, but notification could not be sent. Please inform the patient manually.`);
      }
    });
  }

  private resetForm() {
    this.generateBillNumber();
    this.selectedPatientName = null;
    this.billItems = [];
    this.totalAmount = 0;
  }

  generateBillNumber() {
    this.lastBillNumber += 1;
    this.billNumber = 'HOSP-' + this.lastBillNumber;
  }

  onPatientSelect(event: any) {
    const selected = this.patients.find(p => p.name === this.selectedPatientName);
    if (selected) {
      console.log('Selected patient:', selected);
    }
  }

  addItem() {
    if (this.selectedPatientName && this.newItem.description && this.newItem.amount > 0) {
      this.billItems.push({
        patientName: this.selectedPatientName,
        description: this.newItem.description,
        amount: this.newItem.amount
      });
      this.calculateTotal();
      // Only clear description and amount fields
      this.newItem.description = '';
      this.newItem.amount = 0;
    } else {
      alert('Please select a patient and enter description & amount.');
    }
  }

  calculateTotal() {
    this.totalAmount = this.billItems.reduce((sum, item) => sum + Number(item.amount), 0);
  }

  removeItem(index: number) {
    this.billItems.splice(index, 1);
    this.calculateTotal();
  }
}