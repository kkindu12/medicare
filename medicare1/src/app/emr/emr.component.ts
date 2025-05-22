import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

interface Report {
  name: string;
  type: string;
  date: string;
  fileType: string;
  file?: File;
  url?: string;
}

interface PatientRecord {
  visitDate: string;
  visitTime: string;
  condition: string;
  doctor: string;
  prescription: string;
  status: string;
}

interface Patient {
  id: string;
  patientName: string;
  condition: string;
  doctor: string;
  lastVisit: string;
  lastVisitTime: string;
  status: string;
  prescription: string;
  reports: Report[];
  previousRecords: PatientRecord[];
}

@Component({
  selector: 'app-emr',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './emr.component.html',
  styleUrl: './emr.component.scss'
})
export class EmrComponent implements OnInit {
  searchQuery: string = '';
  filterCondition: string = '';
  filterDoctor: string = '';
  filterDate: string = '';

  recordForm: FormGroup;
  currentDate = new Date();
  printPrescriptionVisible = false;
  selectedPatientPrescription: string = '';
  selectedFile: File | null = null;
  newReportName: string = '';
  newReportType: string = 'Lab Test';
  showPreviousRecords: boolean = false;
  showAddRecordModal: boolean = false; // New flag for Add Record modal
  showPatientModal: boolean = false;   // New flag for Patient modal

  selectedPatient: Patient = {
    id: '',
    patientName: 'Loading...',
    condition: '',
    doctor: '',
    lastVisit: '',
    lastVisitTime: '',
    status: '',
    prescription: '',
    reports: [],
    previousRecords: []
  };

  records: Patient[] = [
    { 
      id: '1',
      patientName: 'John Doe', 
      condition: 'Diabetes', 
      doctor: 'Dr. Samantha Kumara', 
      lastVisit: '2025-04-15', 
      lastVisitTime: '09:30',
      status: 'Stable', 
      prescription: 'Metformin 500mg twice daily', 
      reports: [],
      previousRecords: [
        {
          visitDate: '2025-03-10',
          visitTime: '10:00',
          condition: 'Diabetes Checkup',
          doctor: 'Dr. Samantha Kumara',
          prescription: 'Continue current medication',
          status: 'Stable'
        },
        {
          visitDate: '2025-02-05',
          visitTime: '14:30',
          condition: 'Routine Checkup',
          doctor: 'Dr. Samantha Kumara',
          prescription: 'Metformin 500mg once daily',
          status: 'Stable'
        }
      ]
    },
    { 
      id: '2',
      patientName: 'Jane Smith', 
      condition: 'Hypertension', 
      doctor: 'Dr. Piyal Kodikara', 
      lastVisit: '2025-03-10', 
      lastVisitTime: '14:15',
      status: 'Critical', 
      prescription: 'Lisinopril 10mg daily', 
      reports: [],
      previousRecords: [
        {
          visitDate: '2025-02-01',
          visitTime: '11:00',
          condition: 'Blood Pressure Check',
          doctor: 'Dr. Piyal Kodikara',
          prescription: 'Lisinopril 5mg daily',
          status: 'Stable'
        }
      ]
    }
  ];

  constructor(private fb: FormBuilder, @Inject(PLATFORM_ID) private platformId: Object) {
    this.recordForm = this.fb.group({
      patientName: ['', Validators.required],
      condition: ['', Validators.required],
      doctor: ['', Validators.required],
      lastVisit: ['', Validators.required],
      lastVisitTime: [this.getCurrentTime(), Validators.required],
      status: ['', Validators.required],
      prescription: [''],
      reports: this.fb.array([])
    });
  }

  getCurrentTime(): string {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (!document.getElementById('bootstrap-icons-css')) {
        const link = document.createElement('link');
        link.id = 'bootstrap-icons-css';
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css';
        document.head.appendChild(link);
      }
    }
  }

  get filteredRecords() {
    return this.records.filter(record => {
      const patientName = record.patientName.toLowerCase();
      const condition = record.condition.toLowerCase();
      
      const matchesSearch = this.searchQuery
        ? patientName.includes(this.searchQuery.toLowerCase()) ||
          condition.includes(this.searchQuery.toLowerCase())
        : true;
      const matchesCondition = this.filterCondition ? record.condition === this.filterCondition : true;
      const matchesDoctor = this.filterDoctor ? record.doctor === this.filterDoctor : true;
      const matchesDate = this.filterDate && record.lastVisit ? record.lastVisit.includes(this.filterDate) : true;
      return matchesSearch && matchesCondition && matchesDoctor && matchesDate;
    });
  }

  clearFilters() {
    this.searchQuery = '';
    this.filterCondition = '';
    this.filterDoctor = '';
    this.filterDate = '';
  }

  openAddRecordModal() {
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const currentTime = this.getCurrentTime();

    this.recordForm.reset({
      lastVisit: currentDate,
      lastVisitTime: currentTime,
      patientName: '',
      condition: '',
      doctor: '',
      status: '',
      prescription: ''
    });

    this.showAddRecordModal = true;
    const modal = document.getElementById('addRecordModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      document.body.classList.add('modal-open');
    }
  }

  addRecord() {
    if (this.recordForm.valid) {
      const formValue = this.recordForm.value;
      
      const newRecord: Patient = {
        id: Date.now().toString(),
        patientName: formValue.patientName,
        condition: formValue.condition,
        doctor: formValue.doctor,
        lastVisit: formValue.lastVisit,
        lastVisitTime: formValue.lastVisitTime,
        status: formValue.status,
        prescription: formValue.prescription,
        reports: [],
        previousRecords: []
      };
      
      this.records.push(newRecord);
      
      this.recordForm.reset({
        lastVisitTime: this.getCurrentTime()
      });
      
      this.close();
    }
  }

  openPatientModal(record: Patient) {
    this.selectedPatient = record;
    this.selectedPatientPrescription = record.prescription;
    this.newReportName = '';
    this.selectedFile = null;
    
    this.showPatientModal = true;
    const modal = document.getElementById('patientModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      document.body.classList.add('modal-open');
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type === 'application/pdf') {
        this.selectedFile = file;
      } else {
        alert('Please upload a PDF file');
        input.value = '';
        this.selectedFile = null;
      }
    }
  }

  uploadReport() {
    if (!this.newReportName?.trim()) {
      alert('Please enter a report name');
      return;
    }
    if (!this.selectedFile) {
      alert('Please select a file to upload');
      return;
    }
    
    const currentDate = new Date();
    const report: Report = {
      name: this.newReportName.trim(),
      type: this.newReportType,
      date: currentDate.toISOString().split('T')[0],
      fileType: 'pdf',
      file: this.selectedFile,
      url: URL.createObjectURL(this.selectedFile)
    };
    
    this.selectedPatient.reports.push(report);
    this.newReportName = '';
    this.selectedFile = null;
    const fileInput = document.getElementById('reportFile') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
    
    alert('Report uploaded successfully');
  }

  viewReport(report: Report) {
    if (!report?.url) {
      alert('Unable to preview this report');
      return;
    }
    window.open(report.url, '_blank');
  }

  deleteReport(index: number) {
    if (confirm('Are you sure you want to delete this report?')) {
      this.selectedPatient.reports.splice(index, 1);
    }
  }

  printPrescription() {
    if (!this.selectedPatientPrescription?.trim()) {
      alert('Please add prescription details before printing');
      return;
    }
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Prescription - ${this.selectedPatient.patientName}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .patient-info { margin-bottom: 20px; }
              .prescription { margin-top: 30px; white-space: pre-line; }
              .footer { margin-top: 50px; text-align: right; }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>Medical Prescription</h2>
              <p>Date: ${this.selectedPatient.lastVisit} at ${this.selectedPatient.lastVisitTime}</p>
            </div>
            <div class="patient-info">
              <p><strong>Patient:</strong> ${this.selectedPatient.patientName}</p>
              <p><strong>Condition:</strong> ${this.selectedPatient.condition}</p>
              <p><strong>Doctor:</strong> ${this.selectedPatient.doctor}</p>
            </div>
            <div class="prescription">
              <h3>Prescription Details:</h3>
              <p>${this.selectedPatientPrescription}</p>
            </div>
            <div class="footer">
              <p>Doctor's Signature: ____________________</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  }

  savePatientDetails() {
    const currentRecord: PatientRecord = {
      visitDate: this.selectedPatient.lastVisit,
      visitTime: this.selectedPatient.lastVisitTime,
      condition: this.selectedPatient.condition,
      doctor: this.selectedPatient.doctor,
      prescription: this.selectedPatient.prescription,
      status: this.selectedPatient.status
    };
    
    this.selectedPatient.previousRecords.unshift(currentRecord);
    this.selectedPatient.prescription = this.selectedPatientPrescription;
    this.close();
    alert('Patient details saved successfully');
  }

  togglePreviousRecords(patient: Patient) {
    this.selectedPatient = patient;
    this.showPreviousRecords = true;
    
    const modal = document.getElementById('previousRecordsModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      document.body.classList.add('modal-open');
    }
  }

  closePreviousRecords() {
    this.showPreviousRecords = false;
    const modal = document.getElementById('previousRecordsModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
    }
  }

  close() {
    this.showAddRecordModal = false;
    this.showPatientModal = false;
    this.showPreviousRecords = false;

    ['addRecordModal', 'patientModal', 'previousRecordsModal'].forEach(id => {
      const modal = document.getElementById(id);
      if (modal && modal.classList.contains('show')) {
        modal.classList.remove('show');
        modal.style.display = 'none';
      }
    });
    document.body.classList.remove('modal-open');
  }
}