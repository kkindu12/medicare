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

  // Variables for patient details modal
  selectedPatient: any = null;
  selectedPatientPrescription: string = '';
  newReport: string = '';

  // Sample patient records data
  records = [
    { patientName: 'John Doe', condition: 'Diabetes', doctor: 'Dr. Samantha Kumara', lastVisit: '2025-04-15', status: 'Stable', prescription: '', reports: [] },
    { patientName: 'Jane Smith', condition: 'Hypertension', doctor: 'Dr. Piyal Kodikara', lastVisit: '2025-03-10', status: 'Critical', prescription: '', reports: [] },
    { patientName: 'Emily Johnson', condition: 'Asthma', doctor: 'Dr. Sunil Jayathilake', lastVisit: '2025-02-20', status: 'Stable', prescription: '', reports: [] },
    { patientName: 'Michael Brown', condition: 'Diabetes', doctor: 'Dr. Samantha Kumara', lastVisit: '2025-04-01', status: 'Stable', prescription: '', reports: [] },
    { patientName: 'Sarah Davis', condition: 'Hypertension', doctor: 'Dr. Piyal Kodikara', lastVisit: '2025-03-25', status: 'Critical', prescription: '', reports: [] },
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
      const newRecord = { ...this.recordForm.value, prescription: '', reports: [] };
      this.records.push(newRecord);
      this.recordForm.reset();
      const modal = document.getElementById('addRecordModal');
      if (modal) {
        (modal as any).classList.remove('show');
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
      }
    }
  }

  // Open patient details modal
  openPatientModal(record: any) {
    this.selectedPatient = record;
    this.selectedPatientPrescription = record.prescription || '';
    this.newReport = '';
    const modal = document.getElementById('patientModal');
    if (modal) {
      (modal as any).classList.add('show');
      modal.style.display = 'block';
      document.body.classList.add('modal-open');
    }
  }

  // Add a report to the selected patient
  addReport() {
    if (this.newReport.trim()) {
      this.selectedPatient.reports.push(this.newReport.trim());
      this.newReport = '';
    }
  }

  // Save patient details (prescription and reports)
  savePatientDetails() {
    if (this.selectedPatient) {
      this.selectedPatient.prescription = this.selectedPatientPrescription;
      const modal = document.getElementById('patientModal');
      if (modal) {
        (modal as any).classList.remove('show');
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
      }
    }
  }

  close() {
  const modals = ['addRecordModal', 'patientModal'];
  modals.forEach(id => {
    const modal = document.getElementById(id);
    if (modal && modal.classList.contains('show')) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
    }
  });
}

}