 import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-bill',
  standalone: true,
     imports: [CommonModule, FormsModule],
  templateUrl: './create-bill.component.html',
  styleUrls: ['./create-bill.component.scss']
})
export class CreateBillComponent implements OnInit {

  patients = [
    { id: 1, name: 'Arun Kumar' },
    { id: 2, name: 'Meera Joseph' },
    { id: 3, name: 'Rahul Das' }
  ];

  selectedPatientName: string | null = null;
  selectedPatientId: number | null = null;

  newItem = {
    description: '',
    amount: 0
  };

  billItems: any[] = [];
  totalAmount: number = 0;

  billNumber: string = '';
  lastBillNumber: number = 2025000;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.generateBillNumber();
  }

  generateBillNumber() {
    this.lastBillNumber += 1;
    this.billNumber = 'HOSP-' + this.lastBillNumber;
  }

  onPatientSelect(event: any) {
    const selected = this.patients.find(p => p.name === this.selectedPatientName);
    if (selected) {
      this.selectedPatientId = selected.id;
    } else {
      this.selectedPatientId = null;
    }
  }

  addItem() {
    if (this.selectedPatientId && this.newItem.description && this.newItem.amount > 0) {
      this.billItems.push({
        patientId: this.selectedPatientId,
        description: this.newItem.description,
        amount: this.newItem.amount
      });
      this.calculateTotal();
      this.newItem = { description: '', amount: 0 };
    } else {
      alert('Select patient, fill Patient ID and enter description & amount.');
    }
  }

  calculateTotal() {
    this.totalAmount = this.billItems.reduce((sum, item) => sum + Number(item.amount), 0);
  }

  removeItem(index: number) {
    this.billItems.splice(index, 1);
    this.calculateTotal();
  }

  submitBill() {
  if (!this.selectedPatientId || this.billItems.length === 0) {
    alert('Select patient and add at least one bill item.');
    return;
  }

  const billData = {
    billNumber: this.billNumber,
    patientId: this.selectedPatientId,
    patientName: this.selectedPatientName,
    billItems: this.billItems,
    totalAmount: this.totalAmount
  };
 
// Open new window
  const newWindow = window.open('', '_blank');

  // Build HTML receipt content
  let receiptHtml = `
    <html>
      <head>
        <title>Hospital Bill Receipt</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h2 { margin-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          table, th, td { border: 1px solid #ccc; padding: 8px; }
          th { background-color: #f8f8f8; }
          h4 { margin-top: 20px; }
          button { margin-top: 20px; padding: 8px 16px; }
        </style>
      </head>
      <body>
        <h2>Hospital Bill Receipt</h2>
        <p><strong>Bill Number:</strong> ${billData.billNumber}</p>
        <p><strong>Patient ID:</strong> ${billData.patientId}</p>
        <p><strong>Patient Name:</strong> ${billData.patientName}</p>

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
        <td>${item.amount}</td>
      </tr>
    `;
  });

  receiptHtml += `
          </tbody>
        </table>

        <h4>Total: Rs. ${billData.totalAmount}</h4>

         <button class="no-print" onclick="window.print()">Print Bill</button>
      </body>
    </html>
  `;

  newWindow!.document.open();
  newWindow!.document.write(receiptHtml);
  newWindow!.document.close();

  // Reset form for next bill
  this.generateBillNumber();
  this.selectedPatientName = null;
  this.selectedPatientId = null;
  this.billItems = [];
  this.totalAmount = 0;
}
   
}