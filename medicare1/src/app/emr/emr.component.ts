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

interface Patient {
  patientName: string;
  condition: string;
  doctor: string;
  lastVisit: string;
  status: string;
  prescription: string;
  reports: Report[];
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
  selectedPatient: Patient | null = null;
  selectedPatientPrescription: string = '';
  selectedFile: File | null = null;
  newReportName: string = '';
  newReportType: string = 'Lab Test';

  records: Patient[] = [
    { 
      patientName: 'John Doe', 
      condition: 'Diabetes', 
      doctor: 'Dr. Samantha Kumara', 
      lastVisit: '2025-04-15', 
      status: 'Stable', 
      prescription: '', 
      reports: [] 
    },
    { 
      patientName: 'Jane Smith', 
      condition: 'Hypertension', 
      doctor: 'Dr. Piyal Kodikara', 
      lastVisit: '2025-03-10', 
      status: 'Critical', 
      prescription: '', 
      reports: [] 
    },
    { 
      patientName: 'Emily Johnson', 
      condition: 'Asthma', 
      doctor: 'Dr. Sunil Jayathilake', 
      lastVisit: '2025-02-20', 
      status: 'Stable', 
      prescription: '', 
      reports: [] 
    },
    { 
      patientName: 'Michael Brown', 
      condition: 'Diabetes', 
      doctor: 'Dr. Samantha Kumara', 
      lastVisit: '2025-04-01', 
      status: 'Stable', 
      prescription: '', 
      reports: [] 
    },
    { 
      patientName: 'Sarah Davis', 
      condition: 'Hypertension', 
      doctor: 'Dr. Piyal Kodikara', 
      lastVisit: '2025-03-25', 
      status: 'Critical', 
      prescription: '', 
      reports: [] 
    },
  ];

  constructor(private fb: FormBuilder, @Inject(PLATFORM_ID) private platformId: Object) {
    this.recordForm = this.fb.group({
      patientName: ['', Validators.required],
      condition: ['', Validators.required],
      doctor: ['', Validators.required],
      lastVisit: ['', Validators.required],
      status: ['', Validators.required],
      prescription: [''],
      reports: this.fb.array([])
    });
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
    const modal = document.getElementById('addRecordModal');
    if (modal) {
      (modal as any).classList.add('show');
      modal.style.display = 'block';
      document.body.classList.add('modal-open');
    }
  }

  addRecord() {
    if (this.recordForm.valid) {
      const newRecord: Patient = { 
        ...this.recordForm.value,
        reports: []
      };
      this.records.push(newRecord);
      this.recordForm.reset();
      this.close();
    }
  }

  openPatientModal(record: Patient) {
    this.selectedPatient = record;
    this.selectedPatientPrescription = record.prescription;
    this.newReportName = '';
    this.selectedFile = null;
    
    const modal = document.getElementById('patientModal');
    if (modal) {
      (modal as any).classList.add('show');
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
    if (!this.selectedPatient) return;
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
    if (report?.url) {
      window.open(report.url, '_blank');
    } else {
      alert('Unable to preview this report');
    }
  }

  deleteReport(index: number) {
    if (!this.selectedPatient) return;
    if (confirm('Are you sure you want to delete this report?')) {
      this.selectedPatient.reports.splice(index, 1);
    }
  }

  printPrescription() {
    if (!this.selectedPatientPrescription?.trim()) {
      alert('Please add prescription details before printing');
      return;
    }
    if (!this.selectedPatient) return;
    
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
              <p>Date: ${new Date().toLocaleDateString()}</p>
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

  emailPrescription() {
    if (!this.selectedPatientPrescription?.trim()) {
      alert('Please add prescription details before emailing');
      return;
    }
    if (!this.selectedPatient) return;
    
    alert(`Prescription for ${this.selectedPatient.patientName} would be emailed here.`);
  }

  savePatientDetails() {
    if (!this.selectedPatient) return;
    
    this.selectedPatient.prescription = this.selectedPatientPrescription;
    this.close();
    alert('Patient details saved successfully');
  }

  close() {
    ['addRecordModal', 'patientModal'].forEach(id => {
      const modal = document.getElementById(id);
      if (modal && (modal as any).classList.contains('show')) {
        (modal as any).classList.remove('show');
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
      }
    });
  }
}