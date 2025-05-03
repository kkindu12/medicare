import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-emr',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './emr.component.html',
  styleUrl: './emr.component.css'
})
export class EmrComponent implements OnInit {
  // Search and filter variables
  searchQuery: string = '';
  filterCondition: string = '';
  filterDoctor: string = '';
  filterDate: string = '';

  // Form for adding new records
  recordForm: FormGroup;

  // Sample patient records data
  records = [
    { patientName: 'John Doe', condition: 'Diabetes', doctor: 'Dr. Samantha Kumara', lastVisit: '2025-04-15', status: 'Stable' },
    { patientName: 'Jane Smith', condition: 'Hypertension', doctor: 'Dr. Piyal Kodikara', lastVisit: '2025-03-10', status: 'Critical' },
    { patientName: 'Emily Johnson', condition: 'Asthma', doctor: 'Dr. Sunil Jayathilake', lastVisit: '2025-02-20', status: 'Stable' },
    { patientName: 'Michael Brown', condition: 'Diabetes', doctor: 'Dr. Samantha Kumara', lastVisit: '2025-04-01', status: 'Stable' },
    { patientName: 'Sarah Davis', condition: 'Hypertension', doctor: 'Dr. Piyal Kodikara', lastVisit: '2025-03-25', status: 'Critical' },
  ];

  constructor(private fb: FormBuilder) {
    // Initialize the form with validators
    this.recordForm = this.fb.group({
      patientName: ['', Validators.required],
      condition: ['', Validators.required],
      doctor: ['', Validators.required],
      lastVisit: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  // Computed property for filtered records
  get filteredRecords() {
    return this.records.filter(record => {
      const matchesSearch = this.searchQuery
        ? record.patientName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          record.condition.toLowerCase().includes(this.searchQuery.toLowerCase())
        : true;
      const matchesCondition = this.filterCondition ? record.condition === this.filterCondition : true;
      const matchesDoctor = this.filterDoctor ? record.doctor === this.filterDoctor : true;
      const matchesDate = this.filterDate ? record.lastVisit.includes(this.filterDate) : true;
      return matchesSearch && matchesCondition && matchesDoctor && matchesDate;
    });
  }

  // Clear filters
  clearFilters() {
    this.searchQuery = '';
    this.filterCondition = '';
    this.filterDoctor = '';
    this.filterDate = '';
  }

  // Open the add record modal
  openAddRecordModal() {
    const modal = document.getElementById('addRecordModal');
    if (modal) {
      (modal as any).classList.add('show');
      modal.style.display = 'block';
      document.body.classList.add('modal-open');
    }
  }

  // Add a new record
  addRecord() {
    if (this.recordForm.valid) {
      this.records.push(this.recordForm.value);
      this.recordForm.reset();
      const modal = document.getElementById('addRecordModal');
      if (modal) {
        (modal as any).classList.remove('show');
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
      }
    }
  }
  close() {
    const modal = document.getElementById('addRecordModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
    }
  }
  
}