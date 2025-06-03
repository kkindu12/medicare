import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MedicalRecordsService } from '../services/medicalRecordService/medical-records.service'
import { PatientService } from '../services/patientService/patient.service';
import { UserService } from '../services/userService/user.service';
import { AlertService } from '../shared/alert/alert.service';
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
import { MedicineService } from '../services/medicineService/medicine.service';
import { LabTestService } from '../services/labTestService/lab-test.service';
import { LabTest } from './models/LabTest';
import { Medicine } from './models/Medicine';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-emr',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, PatientRecordCardComponent, PatientHistoryModalComponent, NgSelectModule],
  templateUrl: './emr.component.html',
  styleUrl: './emr.component.scss'
})
export class EmrComponent implements OnInit {
  searchQuery: string = '';
  filterStatus: string = '';
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
  totalFee = 0;

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
  medicines: Medicine[] = [];
  labTests: LabTest[] = [];
  selectedMedicines: any[] = [];
  showPrescriptionTable: boolean = false;
  previousPatientRecords: PatientRecordWithUser[] = [];constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private medicalRecordsService: MedicalRecordsService,
    private patientService: PatientService,
    private userService: UserService,
    private alertService: AlertService,
    private medicineService: MedicineService,
    private labTestService: LabTestService,
    @Inject(PLATFORM_ID) private platformId: Object  ) {    this.recordForm = this.fb.group({
      patientId: ['', Validators.required],
      condition: ['', Validators.required],
      doctor: ['', Validators.required], // Initialize empty, will be filled when modal opens
      visitDate: ['', Validators.required],
      visitTime: [this.getCurrentTime(), Validators.required],
      status: ['', Validators.required],
      prescription: [''],
      medicine: [''], // Add medicine form control
      labTest: [[]], // Initialize as array for multiple selection
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
      this.loadPatientRecords();
      this.loadLabTests();
      this.loadMedicines();
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
      },      error: (err) => {
        console.error('Error loading patients:', err);
        this.alertService.showError('Load Error', 'Failed to load patients. Please try again.');
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
      },      error: (err) => {   
        console.error('Error loading patient records:', err);
        this.alertService.showError('Load Error', 'Failed to load patient records. Please try again.');
      }
    });
  }

  loadMedicines() {
    this.medicineService.getMedicines().subscribe({   
      next: (response) => {   
        this.medicines = response as Medicine[];
      },      
      error: (err) => {   
        this.alertService.showError('Load Error', 'Failed to load medicine records. Please try again.');
      }
    })
  } 
  
  loadLabTests() {
    this.labTestService.getLabTests().subscribe({   
      next: (response) => {   
        this.labTests = response as LabTest[];
      },      
      error: (err) => {   
        this.alertService.showError('Load Error', 'Failed to load Lab test records. Please try again.');
      }
    })
  } 

  get filteredRecords() {
    return this.patientRecords.filter(record => {
      const patientFirstName = record.user?.firstName.toLowerCase() || '';
      const patientLastName = record.user?.lastName.toLowerCase() || '';
      const condition = record.condition.toLowerCase();
        const matchesSearch = this.searchQuery
        ? patientFirstName.includes(this.searchQuery.toLowerCase()) ||
          patientLastName.includes(this.searchQuery.toLowerCase()) ||
          condition.includes(this.searchQuery.toLowerCase())
        : true;
      const matchesStatus = this.filterStatus ? record.status === this.filterStatus : true;
      const matchesDoctor = this.filterDoctor ? record.doctor === this.filterDoctor : true;
      const matchesDate = this.filterDate && record.visitDate ? record.visitDate.includes(this.filterDate) : true;
      return matchesSearch && matchesStatus && matchesDoctor && matchesDate;
    });
  }
  clearFilters() {
    this.searchQuery = '';
    this.filterStatus = '';
    this.filterDoctor = '';
    this.filterDate = '';
  }
  openAddRecordModal() {
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const currentTime = this.getCurrentTime();    this.recordForm.reset({
      visitDate: currentDate,
      visitTime: currentTime,
      patientId: '',
      condition: '',
      doctor: this.getDoctorName(),  
      status: '',
      prescription: '',
      labTest: [] // Reset lab test selection
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
        this.alertService.showSuccess('Upload Success', 'File uploaded successfully!');
      },
      error: (err) => this.alertService.showError('Upload Failed', 'Failed to upload file. Please try again.')
    });
  }  addRecord() {
    if (this.recordForm.valid) {
      const formValue = this.recordForm.getRawValue();
        // Add selected medicines data to the form
      if (this.selectedMedicines.length > 0) {
        formValue.medicine = this.selectedMedicines.map(medicine => ({
          medicineId: medicine.medicineId,
          frequency: medicine.frequency || '',
          duration: medicine.duration || '',
          pillsPerTime: parseInt(medicine.pillsPerTime) || 0,
          numberOfPills: parseInt(medicine.numberOfPills) || 0
        }));
      }

      // Add selected lab tests from the form
      const selectedLabTests = this.recordForm.get('labTest')?.value || [];
      formValue.labTest = selectedLabTests;
      
      if (this.isEditMode) {
        this.medicalRecordsService.updatePatientRecord(this.selectedPatientRecord.id ?? '', formValue).subscribe({          next: () => {
            this.recordForm.reset({
              visitTime: this.getCurrentTime(),
              labTest: [] // Reset lab test selection
            });
            this.resetPrescriptionTable();
            this.close();            
            this.loadPatientRecords(); 
            this.alertService.showSuccess('Update Success', 'Record updated successfully!');
          },
          error: (err) => {
            console.error('Error updating patient:', err);
            this.alertService.showError('Update Failed', 'Failed to update patient record. Please try again.');
          }
        });
      } else {
        // Add new record
        this.medicalRecordsService.addPatientRecord(formValue).subscribe({          next: () => {
            this.recordForm.reset({
              visitDate: new Date().toISOString().split('T')[0],
              visitTime: this.getCurrentTime(),
              doctor: this.getDoctorName(),
              labTest: [] // Reset lab test selection
            });
            this.resetPrescriptionTable();
            this.loadPatientRecords();
            this.alertService.showSuccess('Add Success', 'Record added successfully!');
          },
          error: (err) => {
            console.error('Error adding patient:', err);
            this.alertService.showError('Add Failed', 'Failed to add patient record. Please try again.');
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
    console.log('Patient user from record:', record.user);    // Pre-fill the form with patient data
    this.recordForm.patchValue({
      patientId: patientId,
      condition: record.condition,
      doctor: record.doctor,
      visitDate: record.visitDate,
      visitTime: record.visitTime,
      status: record.status,
      prescription: record.prescription,
      labTest: record.labTest || [] // Include lab test data
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
        this.selectedFile = file;      } else {
        this.alertService.showWarning('Invalid File Type', 'Please upload a PDF file only.');
        input.value = '';
        this.selectedFile = null;
      }
    }
  }
  uploadReport() {
    if (!this.newReportName?.trim()) {
      this.alertService.showWarning('Missing Information', 'Please enter a report name.');
      return;
    }
    if (!this.selectedFile) {
      this.alertService.showWarning('Missing File', 'Please select a file to upload.');
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
        const fileInput = document.getElementById('reportFile') as HTMLInputElement;        if (fileInput) fileInput.value = '';
        this.alertService.showSuccess('Upload Success', 'Report uploaded successfully!');
      },
      error: (err) => {
        console.error('Error uploading report:', err);
        this.alertService.showError('Upload Failed', 'Failed to upload report. Please try again.');
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
    this.resetPrescriptionTable();

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
      }    });
  }

  // Medicine selection and prescription table methods
  onMedicineSelected() {
    const selectedMedicineId = this.recordForm.get('medicine')?.value;
    if (selectedMedicineId) {
      const selectedMedicine = this.medicines.find(m => m.id === selectedMedicineId);
      if (selectedMedicine) {
        const newPrescription = {
          medicineId: selectedMedicine.id,
          medicineName: selectedMedicine.name,
          frequency: '',
          duration: '',
          pillsPerTime: '',
          numberOfPills: ''
        };
        this.selectedMedicines.push(newPrescription);
        this.showPrescriptionTable = true;
        // Reset the medicine dropdown
        this.recordForm.get('medicine')?.setValue('');
      }
    }
  }

  updatePrescription(index: number, field: string, value: string) {
    if (this.selectedMedicines[index]) {
      this.selectedMedicines[index][field] = value;
    }
  }

  removeMedicine(index: number) {
    this.selectedMedicines.splice(index, 1);
    if (this.selectedMedicines.length === 0) {
      this.showPrescriptionTable = false;
    }
  }

  resetPrescriptionTable() {
    this.selectedMedicines = [];
    this.showPrescriptionTable = false;
  }  getInputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  // Get selected lab test names for display
  getSelectedLabTestNames(): string[] {
    const selectedLabTestIds = this.recordForm.get('labTest')?.value || [];
    return selectedLabTestIds.map((id: string) => {
      const labTest = this.labTests.find(lt => lt.id === id);
      return labTest ? labTest.reportName : '';
    }).filter((name: string) => name);
  }

  // Note: This method generates a formatted prescription text from selected medicines
  // It's available for display purposes but no longer automatically fills the prescription field
  generatePrescriptionText(): string {
    if (this.selectedMedicines.length === 0) {
      return '';
    }

    let prescriptionText = 'PRESCRIPTION:\n\n';
    
    this.selectedMedicines.forEach((medicine, index) => {
      prescriptionText += `${index + 1}. ${medicine.medicineName}\n`;
      
      if (medicine.frequency) {
        prescriptionText += `   Frequency: ${medicine.frequency}\n`;
      }
      if (medicine.duration) {
        prescriptionText += `   Duration: ${medicine.duration}\n`;
      }
      if (medicine.pillsPerTime) {
        prescriptionText += `   Pills per time: ${medicine.pillsPerTime}\n`;
      }
      if (medicine.numberOfPills) {
        prescriptionText += `   Total pills: ${medicine.numberOfPills}\n`;
      }
      prescriptionText += '\n';
    });

    // Also include any additional prescription notes from the text area
    const additionalNotes = this.recordForm.get('prescription')?.value;
    if (additionalNotes && additionalNotes.trim()) {
      prescriptionText += 'ADDITIONAL NOTES:\n' + additionalNotes.trim();
    }

    return prescriptionText;
  }
}