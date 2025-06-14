import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Prescription, PharmacyStats, LabTest, InventoryItem, Report, Payment } from './models/prescription.model';
import { PrescriptionModalComponent } from './prescription-modal/prescription-modal.component';

type TabType = 'prescriptions' | 'lab-tests' | 'inventory' | 'reports' | 'payments';

@Component({
  selector: 'app-pharmacy',
  standalone: true,
  imports: [CommonModule, FormsModule, PrescriptionModalComponent],
  templateUrl: './pharmacy&laboratory.component.html',
  styleUrls: ['./pharmacy&laboratory.component.scss']
})
export class PharmacyComponent {

}
