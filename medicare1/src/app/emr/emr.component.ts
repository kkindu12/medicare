import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MedicalRecordsService } from '../services/medicalRecordService/medical-records.service'
import { PatientService } from '../services/patientService/patient.service';
import { UserService } from '../services/userService/user.service';
import { PatientRecordCardComponent } from './patient-record-card/patient-record-card.component';
import { PatientHistoryModalComponent } from './patient-history-modal/patient-history-modal.component';
import type { 
  User, 
  PatientReportResponse, 
  Report, 
  Patient, 
  PatientRecordWithUser, 
  Medication 
} from './models';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-emr',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, PatientRecordCardComponent, PatientHistoryModalComponent],
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
  patientUsers: User[] = [];
  monthOptions: { value: string, label: string }[] = [];

  selectedPatient: Patient = {
    id: '',
    patientName: 'Loading...',
    condition: '',
    doctor: '',
    visitDate: '',
    visitTime: '',
    status: '',
    prescription: '',
    reports: [],
    previousRecords: []
  };

  selectedPatientRecord: PatientRecordWithUser = {
    condition: '',
    doctor: '',
    visitDate: '',
    visitTime: '',
    status: '',
    prescription: '',
  };

  records: Patient[] = [];
  patientRecords: PatientRecordWithUser[] = [];
  previousPatientRecords: PatientRecordWithUser[] = [];  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private medicalRecordsService: MedicalRecordsService,
    private patientService: PatientService,
    private userService: UserService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.recordForm = this.fb.group({
      patientId: ['', Validators.required],
      condition: ['', Validators.required],
      doctor: ['', Validators.required], // Initialize empty, will be filled when modal opens
      visitDate: ['', Validators.required],
      visitTime: [this.getCurrentTime(), Validators.required],
      status: ['', Validators.required],
      prescription: [''],
    });
  }

  getCurrentTime(): string {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  }
  ngOnInit(): void {
    // Generate month options dynamically for current year
    this.generateMonthOptions();
    
    if (isPlatformBrowser(this.platformId)) {
      if (!document.getElementById('bootstrap-icons-css')) {
        const link = document.createElement('link');
        link.id = 'bootstrap-icons-css';
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css';
        document.head.appendChild(link);      }
      this.loadPatients();
      this.loadPatientUsers();
      this.loadPatientRecords();// Load patient users for dropdown
    }    console.log('EMR Component initialized');
    console.log(this.medicalRecordsService.getPatientRecords());
  }

  /**
   * Generate month options dynamically for the current year
   */
  generateMonthOptions(): void {
    const currentYear = new Date().getFullYear();
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    this.monthOptions = monthNames.map((monthName, index) => ({
      value: `${currentYear}-${(index + 1).toString().padStart(2, '0')}`,
      label: `${monthName} ${currentYear}`
    }));
  }

  loadPatients() {
    this.patientService.getPatients().subscribe({
      next: (patients) => {
        this.records = patients;
      },
      error: (err) => {
        console.error('Error loading patients:', err);
        alert('Failed to load patients');
      }
    });
  }
  loadPatientUsers() {
    this.userService.getPatientUsers().subscribe({
      next: (users) => {
        this.patientUsers = users.map(user => ({
          ...user,
          id: user.id ? String(user.id) : undefined
        }));
        console.log('Patient users loaded:', this.patientUsers);
      },
      error: (err) => {
        console.error('Error loading patient users:', err);
      }
    });
  }

  loadPatientRecords(){
    this.medicalRecordsService.getPatientRecords().subscribe({
      next: (response) => {   
        console.log('Patient records loaded:', response);
        this.patientRecords = response as PatientRecordWithUser[];
      },
      error: (err) => {   
        console.error('Error loading patient records:', err);
        alert('Failed to load patient records');
      }
    });
  }

  get filteredRecords() {
    return this.patientRecords.filter(record => {
      const patientName = record.user?.firstName.toLowerCase() || '';
      const condition = record.condition.toLowerCase();
      
      const matchesSearch = this.searchQuery
        ? patientName.includes(this.searchQuery.toLowerCase()) ||
          condition.includes(this.searchQuery.toLowerCase())
        : true;
      const matchesCondition = this.filterCondition ? record.condition === this.filterCondition : true;
      const matchesDoctor = this.filterDoctor ? record.doctor === this.filterDoctor : true;
      const matchesDate = this.filterDate && record.visitDate ? record.visitDate.includes(this.filterDate) : true;
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
      visitDate: currentDate,
      visitTime: currentTime,
      patientId: '',
      condition: '',
      doctor: this.getDoctorName(),  
      status: '',
      prescription: ''
    });

    // Ensure fields are enabled in add mode
    this.isEditMode = false;
    this.recordForm.get('doctor')?.enable();
    this.recordForm.get('prescription')?.enable();

    // Load patient users to ensure fresh data for dropdown
    this.loadPatientUsers();

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

    this.medicalRecordsService.uploadMedicalRecordPDFs(this.selectedPatientRecord.id ?? '', formData).subscribe({
      next: (res) => {
        // Clear the file selection after successful upload
        this.selectedFile = null;
        const fileInput = document.getElementById('reportFile') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
        alert('Upload success');
      },
      error: (err) => alert('Upload failed')
    });
  }

  addRecord() {
    if (this.recordForm.valid) {
      const formValue = this.recordForm.getRawValue(); 
      if (this.isEditMode) {
        this.medicalRecordsService.updatePatientRecord(this.selectedPatientRecord.id ?? '', formValue).subscribe({
          next: () => {
            this.recordForm.reset({
              visitTime: this.getCurrentTime()
            });
            this.close();
            this.loadPatientRecords(); 
            alert('Record updated successfully');
          },
          error: (err) => {
            console.error('Error updating patient:', err);
            alert('Failed to update patient');
          }
        });
      } else {
        // Add new record
        // this.patientService.addPatient(formValue).subscribe({
        //   next: (newPatient) => {
        //     this.records.push(newPatient);
        //     this.recordForm.reset({
        //       lastVisitTime: this.getCurrentTime()
        //     });
        //     this.close();
        //     alert('Record added successfully');
        //   },
        //   error: (err) => {
        //     console.error('Error adding patient:', err);
        //     alert('Failed to add patient');
        //   }
        // });
        this.medicalRecordsService.addPatientRecord(formValue).subscribe({    
          next: () => {
            this.recordForm.reset({
              visitDate: new Date().toISOString().split('T')[0],
              visitTime: this.getCurrentTime(),
              doctor: this.getDoctorName() 
            });
            this.loadPatientRecords();
            alert('Record added successfully');
          },
          error: (err) => {
            console.error('Error adding patient:', err);
            alert('Failed to add patient');
          }
        });
      }
      this.loadPatientRecords(); 
      this.close();
    }
  }
  editRecordModal(record: PatientRecordWithUser) {
    this.selectedPatientRecord = record;

    // Ensure patient users are loaded before setting form values
    this.loadPatientUsers();

    // Convert ID to string to ensure proper matching
    const patientId = record.user?.id ? String(record.user.id) : '';
    
    console.log('Editing record for patient ID:', patientId);
    console.log('Available patient users:', this.patientUsers);
    console.log('Patient user from record:', record.user);

    // Pre-fill the form with patient data
    this.recordForm.patchValue({
      patientId: patientId,
      condition: record.condition,
      doctor: record.doctor,
      visitDate: record.visitDate,
      visitTime: record.visitTime,
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

  openPatientModal(record: PatientRecordWithUser) {
    this.selectedPatientRecord = record;
    this.selectedPatientPrescription = record.prescription;
    this.newReportName = '';
    this.selectedFile = null;
    
    this.showPatientModal = true;
    this.medicalRecordsService.getMedicalRecordPDFs(this.selectedPatientRecord.id || '')
    .subscribe({
      next: (data: PatientReportResponse) => {
        this.reportNames = data.filenames; 
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
      visitDate: this.selectedPatient.visitDate,
      visitTime: this.selectedPatient.visitTime,
      status: this.selectedPatient.status,
      prescription: this.selectedPatientPrescription
    };
    
    // this.http.put<Patient>(
    //   `http://localhost:8000/api/patients/${this.selectedPatient.id}`,
    //   updateData
    // )
    this.patientService.updatePatient(this.selectedPatient.id, updateData).subscribe({
      next: (updatedPatient) => {
        const currentRecord: PatientRecordWithUser = {
          visitDate: this.selectedPatient.visitDate,
          visitTime: this.selectedPatient.visitTime,
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

  togglePreviousRecords(patientRecord: PatientRecordWithUser) {
    this.selectedPatientRecord = patientRecord;
    this.showPreviousRecords = true;
    this.medicalRecordsService.getPatientRecordsById(patientRecord.user?.id || '').subscribe({
      next: (reports) => {
        this.previousPatientRecords = reports.map(report => ({
          id: report.id,
          visitDate: report.visitDate,
          visitTime: report.visitTime,
          condition: report.condition,
          doctor: report.doctor,
          prescription: report.prescription,
          status: report.status,
          user: report.user
        }));
      },})

    const modal = document.getElementById('previousRecordsModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      document.body.classList.add('modal-open');
    }
    
  }

  closePreviousRecords() {
    this.showPreviousRecords = false;
    this.previousPatientRecords = [];
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
    const fullUrl = `${environment.dropboxBaseUrl}/${this.selectedPatientRecord.id}/${reportPath}?raw=1`;
    window.open(fullUrl, '_blank');
  }

  getDoctorName(){
    let doctorName = '';
    if (isPlatformBrowser(this.platformId)) {
      try {
        const userString = sessionStorage.getItem('user');
        const user = userString ? JSON.parse(userString) : null;
        doctorName = user ? `${user.firstName} ${user.lastName}` : '';
      } catch (error) {
        console.error('Error reading user data from sessionStorage:', error);
        doctorName = '';
      }
    }
    return doctorName;
  }

  getPatientRecordsByPatientId(patientId: string) {
    this.medicalRecordsService.getPatientRecordsById(patientId).subscribe({
      next: (reports) => {
        this.previousPatientRecords = reports.map(report => ({
          name: report.user?.firstName || 'Unknown',
          visitTime: report.visitTime,
          visitDate: report.visitDate,
          condition: report.condition,
          doctor: report.doctor,
          status: report.status,
          prescription: report.prescription
        }));
      },
      error: (err) => {
        console.error('Error loading patient reports:', err);
        alert('Failed to load patient reports');
      }
    });
  }
}