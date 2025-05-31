import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MedicalRecordsService } from '../services/medicalRecordService/medical-records.service'
import { PatientService } from '../services/patientService/patient.service';

export interface Report {
  name: string;
  type: string;
  date: string;
  file_id?: string;
  fileType?: string;
  description?: string;
}

interface PatientRecord {
  visitDate: string;
  visitTime: string;
  condition: string;
  doctor: string;
  prescription: string;
  status: string;
}

export interface Patient {
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
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
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
  showAddRecordModal: boolean = false;
  showPatientModal: boolean = false;
  isEditMode: boolean = false;
  reportNames: string[] = [];

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

  records: Patient[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private medicalRecordsService: MedicalRecordsService,
    private patiendService: PatientService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.recordForm = this.fb.group({
      patientName: ['', Validators.required],
      condition: ['', Validators.required],
      doctor: ['', Validators.required],
      lastVisit: ['', Validators.required],
      lastVisitTime: [this.getCurrentTime(), Validators.required],
      status: ['', Validators.required],
      prescription: [''],
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
      this.loadPatients();
    }
    console.log('EMR Component initialized');
    console.log(this.medicalRecordsService.getPatientRecords());
  }

  loadPatients() {
    this.patiendService.getPatients().subscribe({
      next: (patients) => {
        this.records = patients;
      },
      error: (err) => {
        console.error('Error loading patients:', err);
        alert('Failed to load patients');
      }
    });
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

    // Ensure fields are enabled in add mode
    this.isEditMode = false;
    this.recordForm.get('doctor')?.enable();
    this.recordForm.get('prescription')?.enable();

    this.showAddRecordModal = true;
    const modal = document.getElementById('addRecordModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      document.body.classList.add('modal-open');
    }
  }

  onSubmit(event: Event) {
    event.preventDefault(); // prevent default form submission

    if (this.selectedFile) {
      this.uploadFileToServer(this.selectedFile);
    }
  }

  uploadFileToServer(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    this.medicalRecordsService.uploadMedicalRecordPDFs(formData).subscribe({
      next: (res) => alert('Upload success'),
      error: (err) => alert('Upload failed')
    });
  }

  addRecord() {
    if (this.recordForm.valid) {
      const formValue = this.recordForm.getRawValue(); // Use getRawValue to include disabled fields
      if (this.isEditMode) {
        // Update existing record
        this.patiendService.updatePatient(this.selectedPatient.id, formValue).subscribe({
          next: (updatedPatient) => {
            const index = this.records.findIndex(record => record.id === updatedPatient.id);
            if (index !== -1) {
              this.records[index] = updatedPatient;
            }
            this.recordForm.reset({
              lastVisitTime: this.getCurrentTime()
            });
            this.close();
            alert('Record updated successfully');
          },
          error: (err) => {
            console.error('Error updating patient:', err);
            alert('Failed to update patient');
          }
        });
      } else {
        // Add new record
        this.patiendService.addPatient(formValue).subscribe({
          next: (newPatient) => {
            this.records.push(newPatient);
            this.recordForm.reset({
              lastVisitTime: this.getCurrentTime()
            });
            this.close();
            alert('Record added successfully');
          },
          error: (err) => {
            console.error('Error adding patient:', err);
            alert('Failed to add patient');
          }
        });
      }
    }
  }

  editRecordModal(record: Patient) {
    this.selectedPatient = record;

    // Pre-fill the form with patient data
    this.recordForm.patchValue({
      patientName: record.patientName,
      condition: record.condition,
      doctor: record.doctor,
      lastVisit: record.lastVisit,
      lastVisitTime: record.lastVisitTime,
      status: record.status,
      prescription: record.prescription
    });

    // Set edit mode flag
    this.isEditMode = true;

    // Disable doctor and prescription fields in edit mode
    if (this.isEditMode) {
      this.recordForm.get('doctor')?.disable();
      this.recordForm.get('prescription')?.disable();
    } else {
      this.recordForm.get('doctor')?.enable();
      this.recordForm.get('prescription')?.enable();
    }

    // Show the modal
    this.showAddRecordModal = true;
    const modal = document.getElementById('addRecordModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      document.body.classList.add('modal-open');
    }
  }

  openPatientModal(record: Patient) {
    this.selectedPatient = record;
    this.selectedPatientPrescription = record.prescription;
    this.newReportName = '';
    this.selectedFile = null;
    
    this.showPatientModal = true;
    this.patiendService.getPatientRecordNames(this.selectedPatient.id)
    .subscribe({
      next: (data: string[]) => {
        this.reportNames = data;  
        console.log('Report names:', this.reportNames);
      },
      error: (err) => {
        console.error('Failed to load report names:', err);
      }
    });
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
    
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('name', this.newReportName.trim());
    formData.append('type', this.newReportType);
    if (this.newReportName) {
      formData.append('description', this.newReportName);
    }
    
    this.medicalRecordsService.addPatientRecordById(this.selectedPatient.id, formData).subscribe({
      next: (report) => {
        this.selectedPatient.reports.push(report);
        this.newReportName = '';
        this.selectedFile = null;
        const fileInput = document.getElementById('reportFile') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        alert('Report uploaded successfully');
      },
      error: (err) => {
        console.error('Error uploading report:', err);
        alert('Failed to upload report');
      }
    });
  }

  viewReport(report: Report) {
    if (!report.file_id) {
      alert('Unable to preview this report');
      return;
    }
    this.medicalRecordsService.getPatientRecordByIdAndFileId(this.selectedPatient.id, report.file_id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
      },
      error: (err) => {
        console.error('Error viewing report:', err);
        alert('Unable to preview this report');
      }
    });
  }

  deleteReport(index: number) {
    const report = this.selectedPatient.reports[index];
    if (!report.file_id) {
      alert('No file ID associated with this report');
      return;
    }
    if (confirm('Are you sure you want to delete this report?')) {
      this.medicalRecordsService.deleteReportByIdAndFileId(this.selectedPatient.id, report.file_id).subscribe({
        next: () => {
          this.selectedPatient.reports.splice(index, 1);
          alert('Report deleted successfully');
        },
        error: (err) => {
          console.error('Error deleting report:', err);
          alert('Failed to delete report');
        }
      });
    }
  }

  // printPrescription() {
  //   if (!this.selectedPatientPrescription?.trim()) {
  //     alert('Please add prescription details before printing');
  //     return;
  //   }
    
  //   const printWindow = window.open('', '_blank');
  //   if (printWindow) {
  //     printWindow.document.write(`
  //       <html>
  //         <head>
  //           <title>Prescription - ${this.selectedPatient.patientName}</title>
  //           <style>
  //             body { font-family: Arial, sans-serif; padding: 20px; }
  //             .header { text-align: center; margin-bottom: 30px; }
  //             .patient-info { margin-bottom: 20px; }
  //             .prescription { margin-top: 30px; white-space: pre-line; }
  //             .footer { margin-top: 50px; text-align: right; }
  //           </style>
  //         </head>
  //         <body>
  //           <div class="header">
  //             <h2>Medical Prescription</h2>
  //             <p>Date: ${this.selectedPatient.lastVisit} at ${this.selectedPatient.lastVisitTime}</p>
  //           </div>
  //           <div class="patient-info">
  //             <p><strong>Patient:</strong> ${this.selectedPatient.patientName}</p>
  //             <p><strong>Condition:</strong> ${this.selectedPatient.condition}</p>
  //             <p><strong>Doctor:</strong> ${this.selectedPatient.doctor}</p>
  //           </div>
  //           <div class="prescription">
  //             <h3>Prescription Details:</h3>
  //             <p>${this.selectedPatientPrescription}</p>
  //           </div>
  //           <div class="footer">
  //             <p>Doctor's Signature: ____________________</p>
  //           </div>
  //         </body>
  //       </html>
  //     `);
  //     printWindow.document.close();
  //     printWindow.print();
  //   }
  // }

  savePatientDetails() {
    const updateData: any = {
      patientName: this.selectedPatient.patientName,
      condition: this.selectedPatient.condition,
      doctor: this.selectedPatient.doctor,
      lastVisit: this.selectedPatient.lastVisit,
      lastVisitTime: this.selectedPatient.lastVisitTime,
      status: this.selectedPatient.status,
      prescription: this.selectedPatientPrescription
    };
    
    // this.http.put<Patient>(
    //   `http://localhost:8000/api/patients/${this.selectedPatient.id}`,
    //   updateData
    // )
    this.patiendService.updatePatient(this.selectedPatient.id, updateData).subscribe({
      next: (updatedPatient) => {
        const currentRecord: PatientRecord = {
          visitDate: this.selectedPatient.lastVisit,
          visitTime: this.selectedPatient.lastVisitTime,
          condition: this.selectedPatient.condition,
          doctor: this.selectedPatient.doctor,
          prescription: this.selectedPatient.prescription,
          status: this.selectedPatient.status
        };
        
        this.selectedPatient.previousRecords.unshift(currentRecord);
        this.selectedPatient = updatedPatient;
        this.close();
        alert('Patient details saved successfully');
      },
      error: (err) => {
        console.error('Error saving patient details:', err);
        alert('Failed to save patient details');
      }
    });
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

  viewReportByPatient(reportPath: string) {
    const dropboxBaseUrl = 'https://www.dropbox.com/home/Apps/medicare_capstone/'; 
    const fullUrl = `${dropboxBaseUrl}medicare_uploads/${this.selectedPatient.id}/${reportPath}?raw=1`;
    window.open(fullUrl, '_blank');
  }
}