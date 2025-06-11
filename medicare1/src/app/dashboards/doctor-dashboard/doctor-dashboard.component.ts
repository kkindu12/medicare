import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { EmrComponent } from '../../emr/emr.component';
import { MedicalRecordsService } from '../../services/medicalRecordService/medical-records.service';
import { UserService } from '../../services/userService/user.service';
import { NotificationService } from '../../services/notification.service';
import { AlertService } from '../../shared/alert/alert.service';
import { environment } from '../../../environments/environment';
import type { PatientRecordWithUser, User } from '../../emr/models';

interface Appointment {
  id: number;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  type: 'consultation' | 'follow-up' | 'emergency';
  status: 'pending' | 'approved' | 'rejected' | 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

interface LabReport {
  id: number;
  patientId: string;
  patientName: string;
  testName: string;
  result: string;
  normalRange: string;
  status: 'normal' | 'abnormal' | 'critical';
  date: string;
  reviewed: boolean;
}

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, EmrComponent],
  templateUrl: './doctor-dashboard.component.html',
  styleUrls: ['./doctor-dashboard.component.scss']
})
export class DoctorDashboardComponent implements OnInit {
  activeTab: 'appointments' | 'lab-reports' | 'patient-records' = 'appointments';
  
  

  // Current Doctor User
  currentUser: any = null;
  
  // Dashboard Data
  appointments: Appointment[] = [];
  labReports: LabReport[] = [];
  patients: User[] = [];
  patientRecords: PatientRecordWithUser[] = [];
  filteredPatientRecords: PatientRecordWithUser[] = [];
  
  // UI State
  isLoading = false;
  error: string | null = null;
    // Filter States
  selectedDate: string = 'today';
  reportFilter: string = 'all';
  patientSearchTerm: string = '';
  
  // Modal States
  showAppointmentModal = false;
  showRecordModal = false;
  selectedAppointment: any = {};
  selectedMedicalRecord: PatientRecordWithUser | null = null;
  selectedPatient: User | null = null;
  
  // Form States
  isEditingAppointment = false;
  
  // Forms
  newAppointment: Partial<Appointment> = {};
  newPatientRecord: any = {
    patientId: '',
    visitDate: '',
    visitTime: '',
    doctor: '',
    condition: '',
    status: '',
    labTest: [],
    medicine: []
  };
  
  // Form helper properties
  labTestsText: string = '';
  medicationsText: string = '';
  constructor(
    private medicalRecordsService: MedicalRecordsService,
    private userService: UserService,
    private alertService: AlertService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
  ngOnInit(): void {
    this.loadUserData();
    this.loadDashboardData();
    this.initializeNewPatientRecord();
  }

  loadUserData(): void {
    if (isPlatformBrowser(this.platformId) && typeof sessionStorage !== 'undefined') {
      const userStr = sessionStorage.getItem('user');
      if (userStr) {
        this.currentUser = JSON.parse(userStr);
      }
    }
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.loadAppointments();
    this.loadLabReports();
    this.loadPatients();
    this.loadPatientRecords();
  }

  loadAppointments(): void {
    // Mock data - in real app, this would come from an API
    this.appointments = [
      {
        id: 1,
        patientId: '1',
        patientName: 'Akhila Induwara',
        date: '2025-06-11',
        time: '09:00',
        type: 'consultation',
        status: 'pending',
        notes: 'Follow-up for diabetes management'
      },
      // {
      //   id: 2,
      //   patientId: '2',
      //   patientName: 'Jane Smith',
      //   date: '2025-06-10',
      //   time: '10:30',
      //   type: 'follow-up',
      //   status: 'approved',
      //   notes: 'Post-surgery check-up'
      // },
      // {
      //   id: 3,
      //   patientId: '3',
      //   patientName: 'Robert Johnson',
      //   date: '2025-06-10',
      //   time: '14:00',
      //   type: 'consultation',
      //   status: 'pending',
      //   notes: 'New patient consultation'
      // },
      // {
      //   id: 4,
      //   patientId: '4',
      //   patientName: 'Emily Davis',
      //   date: '2025-06-11',
      //   time: '11:00',
      //   type: 'emergency',
      //   status: 'pending',
      //   notes: 'Urgent care needed'
      // },
      // {
      //   id: 5,
      //   patientId: '5',
      //   patientName: 'Michael Brown',
      //   date: '2025-06-11',
      //   time: '15:00',
      //   type: 'consultation',
      //   status: 'approved',
      //   notes: 'Annual check-up'
      // }
    ];
  }

  loadLabReports(): void {
    // Mock data
    this.labReports = [
      {
        id: 1,
        patientId: '1',
        patientName: 'John Doe',
        testName: 'HbA1c',
        result: '7.2%',
        normalRange: '4.0-5.6%',
        status: 'abnormal',
        date: '2025-06-08',
        reviewed: false
      },
      {
        id: 2,
        patientId: '2',
        patientName: 'Jane Smith',
        testName: 'Complete Blood Count',
        result: 'Normal',
        normalRange: 'Within normal limits',
        status: 'normal',
        date: '2025-06-07',
        reviewed: true
      },
      {
        id: 3,
        patientId: '3',
        patientName: 'Robert Johnson',
        testName: 'Cholesterol Panel',
        result: 'Total: 280 mg/dL',
        normalRange: 'Less than 200 mg/dL',
        status: 'critical',
        date: '2025-06-06',
        reviewed: false
      }
    ];
  }

  loadPatients(): void {
    this.userService.getPatientUsers().subscribe({
      next: (patients: User[]) => {
        this.patients = patients;
      },
      error: (error: any) => {
        console.error('Error loading patients:', error);
        this.error = 'Failed to load patients';
      }
    });
  }  loadPatientRecords(): void {
    console.log('Loading patient records from API...');
    this.isLoading = true;
    this.error = null; // Clear any previous errors
    
    this.medicalRecordsService.getPatientRecords().subscribe({
      next: (records: any) => {
        console.log('Patient records loaded successfully:', records);
        console.log('Number of records received:', Array.isArray(records) ? records.length : 'Not an array');
        
        this.patientRecords = records as PatientRecordWithUser[];
        this.filteredPatientRecords = this.patientRecords;
        this.isLoading = false;
        
        console.log('Patient records assigned to component:', this.patientRecords.length);
        console.log('Filtered patient records:', this.filteredPatientRecords.length);
      },
      error: (error: any) => {
        console.error('Error loading patient records:', error);
        console.error('Error details:', {
          status: error.status,
          message: error.message,
          url: error.url
        });
        
        this.error = `Failed to load patient records: ${error.status ? `HTTP ${error.status}` : error.message}`;        this.isLoading = false;
        this.patientRecords = [];
        this.filteredPatientRecords = [];
      }
    });
  }
  setActiveTab(tab: 'appointments' | 'lab-reports' | 'patient-records'): void {
    this.activeTab = tab;
  }

  // Appointment Management
  filterAppointmentsByDate(period: string): void {
    this.selectedDate = period;
  }

  getFilteredAppointments(): Appointment[] {
    switch (this.selectedDate) {
      case 'pending':
        return this.appointments.filter(apt => apt.status === 'pending');
      case 'approved':
        return this.appointments.filter(apt => apt.status === 'approved');
      case 'all':
        return this.appointments;
      default:
        return this.appointments;
    }
  }
  // New appointment approval methods
  approveAppointment(appointmentId: number): void {
    const appointment = this.appointments.find(a => a.id === appointmentId);
    if (appointment) {
      appointment.status = 'approved';
      console.log(`Appointment ${appointmentId} approved for ${appointment.patientName}`);
      this.alertService.showSuccess('Appointment Approved', `Appointment for ${appointment.patientName} has been approved successfully.`);
      // In a real app, this would make an API call to update the status
    }
  }
  rejectAppointment(appointmentId: number): void {
    const appointment = this.appointments.find(a => a.id === appointmentId);
    if (appointment) {
      appointment.status = 'rejected';
      console.log(`Appointment ${appointmentId} rejected for ${appointment.patientName}`);
      this.alertService.showWarning('Appointment Rejected', `Appointment for ${appointment.patientName} has been rejected.`);
      // In a real app, this would make an API call to update the status
    }
  }

  rescheduleAppointment(appointmentId: number): void {
    const appointment = this.appointments.find(a => a.id === appointmentId);
    if (appointment) {
      // Open reschedule modal or form
      console.log(`Rescheduling appointment ${appointmentId} for ${appointment.patientName}`);
      // In a real app, this would open a modal with date/time picker
      this.openAppointmentModal(appointment);
    }
  }

  openNewAppointmentModal(): void {
    this.selectedAppointment = {
      id: 0,
      patientId: '',
      patientName: '',
      date: '',
      time: '',
      type: 'consultation',
      status: 'scheduled',
      notes: ''
    };
    this.isEditingAppointment = false;
    // Bootstrap modal would be opened here
  }

  openAppointmentModal(appointment: Appointment): void {
    this.selectedAppointment = { ...appointment };
    this.isEditingAppointment = true;
    // Bootstrap modal would be opened here
  }
  saveAppointment(): void {
    if (this.isEditingAppointment && this.selectedAppointment.id) {
      const index = this.appointments.findIndex(apt => apt.id === this.selectedAppointment.id);
      if (index !== -1) {
        this.appointments[index] = { ...this.selectedAppointment };
        this.alertService.showSuccess('Appointment Updated', 'Appointment has been updated successfully.');
      }
    } else {
      this.selectedAppointment.id = this.appointments.length + 1;
      this.appointments.push({ ...this.selectedAppointment });
      this.alertService.showSuccess('Appointment Created', 'New appointment has been created successfully.');
    }
    this.closeAppointmentModal();
  }

  closeAppointmentModal(): void {
    this.showAppointmentModal = false;
    this.selectedAppointment = {};
    this.isEditingAppointment = false;
  }

  updateAppointmentStatus(appointmentId: number, status: string): void {
    const appointment = this.appointments.find(a => a.id === appointmentId);
    if (appointment) {
      appointment.status = status as any;
    }
  }

  // Lab Report Management
  markReportAsReviewed(reportId: number): void {
    const report = this.labReports.find(r => r.id === reportId);
    if (report) {
      report.reviewed = true;
    }
  }

  filterReports(filter: string): void {
    this.reportFilter = filter;
  }

  getFilteredLabReports(): LabReport[] {
    switch (this.reportFilter) {
      case 'critical':
        return this.labReports.filter(report => report.status === 'critical');
      case 'pending':
        return this.labReports.filter(report => !report.reviewed);
      case 'reviewed':
        return this.labReports.filter(report => report.reviewed);
      default:
        return this.labReports;
    }
  }

  getFilteredReports(): LabReport[] {
    return this.getFilteredLabReports();
  }

  viewLabReport(report: LabReport): void {
    // Implementation for viewing lab report details
    console.log('Viewing lab report:', report);
    // In a real app, this might open a modal or navigate to a detailed view
  }

  markAsReviewed(reportId: number): void {
    this.markReportAsReviewed(reportId);
  }

  downloadReport(reportId: number): void {
    const report = this.labReports.find(r => r.id === reportId);
    if (report) {
      // Create a downloadable report
      const reportData = {
        patientName: report.patientName,
        testName: report.testName,
        result: report.result,
        normalRange: report.normalRange,
        status: report.status,
        date: report.date,
        downloadedAt: new Date().toISOString()
      };
      
      const dataStr = JSON.stringify(reportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `lab-report-${report.patientName}-${report.testName}-${report.date}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }

  searchPatients(): void {
    if (!this.patientSearchTerm.trim()) {
      this.filteredPatientRecords = [...this.patientRecords];
    } else {
      const searchTerm = this.patientSearchTerm.toLowerCase();
      this.filteredPatientRecords = this.patientRecords.filter(record =>
        record.user?.firstName?.toLowerCase().includes(searchTerm) ||
        record.user?.lastName?.toLowerCase().includes(searchTerm) ||
        record.user?.email?.toLowerCase().includes(searchTerm) ||
        record.condition?.toLowerCase().includes(searchTerm)
      );
    }
  }

  openMedicalRecordModal(record: PatientRecordWithUser): void {
    this.selectedMedicalRecord = record;
    this.showRecordModal = true;
  }

  // Event handlers for PatientRecordCardComponent
  editMedicalRecord(record?: PatientRecordWithUser): void {
    if (record) {
      this.selectedMedicalRecord = record;
      // Open the existing medical record modal
      this.openMedicalRecordModal(record);
    } else if (this.selectedMedicalRecord) {
      // This is called from the modal button without parameters
      console.log('Edit functionality for:', this.selectedMedicalRecord.user?.firstName, this.selectedMedicalRecord.user?.lastName);
      // In a real app, this would open an edit form or modal
      alert(`Edit functionality for ${this.selectedMedicalRecord.user?.firstName} ${this.selectedMedicalRecord.user?.lastName} would be implemented here.`);
    }
  }

  addReportForRecord(record: PatientRecordWithUser): void {
    // Implementation for adding reports to a patient record
    console.log('Adding report for record:', record);
    // You could open a modal for file upload or navigate to report upload page
    alert(`Add report functionality for ${record.user?.firstName} ${record.user?.lastName} would be implemented here.`);
  }

  viewRecordHistory(record: PatientRecordWithUser): void {
    // Implementation for viewing patient record history
    console.log('Viewing history for record:', record);
    if (record.user?.id) {
      // Load historical records for this patient
      this.medicalRecordsService.getPatientRecordsById(record.user.id).subscribe({
        next: (records) => {
          console.log('Patient history records:', records);
          // You could open a modal showing historical records
          alert(`View history functionality for ${record.user?.firstName} ${record.user?.lastName} would show ${records.length} historical records.`);
        },
        error: (error) => {
          console.error('Error loading patient history:', error);
          alert('Error loading patient history. Please try again.');
        }
      });
    }
  }

  // Medical Records Management
  openRecordModal(patient: User): void {
    this.selectedPatient = patient;
    this.showRecordModal = true;
  }

  closeRecordModal(): void {
    this.showRecordModal = false;
    this.selectedPatient = null;
  }

  downloadMedicalRecord(record: PatientRecordWithUser | null): void {
    if (!record) {
      console.warn('No medical record selected for download');
      return;
    }
    
    // Implementation for downloading medical record
    // In a real application, this would generate a PDF or call a backend service
    console.log('Downloading medical record for:', record.user?.firstName, record.user?.lastName);
    
    // Example: Create a simple text file download
    const recordData = {
      patient: `${record.user?.firstName || ''} ${record.user?.lastName || ''}`,
      patientEmail: record.user?.email || '',
      phoneNumber: record.user?.phoneNumber || '',
      visitDate: record.visitDate || '',
      visitTime: record.visitTime || '',
      condition: record.condition || '',
      doctor: record.doctor || '',
      status: record.status || '',
      labTests: record.labTest || [],
      medicines: record.medicine || [],
      recordDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(recordData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `medical-record-${record.user?.firstName}-${record.user?.lastName}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Utility Methods
  getDoctorName(): string {
    if (this.currentUser?.firstName && this.currentUser?.lastName) {
      return `${this.currentUser.firstName} ${this.currentUser.lastName}`;
    }
    return 'Doctor';
  }

  getTodayAppointmentsCount(): number {
    const today = new Date().toISOString().split('T')[0];
    return this.appointments.filter(apt => apt.date === today).length;
  }
  getRecordsAddedCount(): number {
    const currentDoctorId = this.getCurrentDoctorId();
    if (!currentDoctorId) {
      return 0;
    }
    
    // Count patient records that were added by the current doctor
    // We'll use the doctorUser.id field or compare doctor names as fallback
    return this.patientRecords.filter(record => {
      // First try to match by doctor user ID
      if (record.doctorUser?.id) {
        return record.doctorUser.id === currentDoctorId;
      }
      
      // Fallback: match by doctor name (less reliable but covers older records)
      const currentDoctorName = this.getDoctorName();
      return record.doctor === currentDoctorName;
    }).length;
  }

  getCurrentDoctorId(): string {
    if (isPlatformBrowser(this.platformId) && typeof sessionStorage !== 'undefined') {
      try {
        const userString = sessionStorage.getItem('user');
        const user = userString ? JSON.parse(userString) : null;
        return user ? user.id : '';
      } catch (error) {
        console.error('Error reading user data from sessionStorage:', error);
        return '';
      }
    }
    return '';
  }

  getUnreviewedReportsCount(): number {
    return this.labReports.filter(report => !report.reviewed).length;
  }

  getCriticalReportsCount(): number {
    return this.labReports.filter(report => report.status === 'critical' && !report.reviewed).length;
  }

  getUserDisplayName(): string {
    if (this.currentUser?.firstName && this.currentUser?.lastName) {
      return `Dr. ${this.currentUser.firstName} ${this.currentUser.lastName}`;
    }
    return 'Doctor';
  }

  getTodayAppointments(): Appointment[] {
    const today = new Date().toISOString().split('T')[0];
    return this.appointments.filter(apt => apt.date === today);
  }

  getUpcomingAppointments(): Appointment[] {
    const today = new Date().toISOString().split('T')[0];
    return this.appointments.filter(apt => apt.date >= today && apt.status === 'scheduled');
  }

  getUnreviewedReports(): LabReport[] {
    return this.labReports.filter(report => !report.reviewed);
  }

  getCriticalReports(): LabReport[] {
    return this.labReports.filter(report => report.status === 'critical' && !report.reviewed);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }
  formatTime(timeString: string): string {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  }

  // Add Patient Record Methods
  savePatientRecord(): void {
    if (!this.newPatientRecord.patientId || !this.newPatientRecord.visitDate || 
        !this.newPatientRecord.visitTime || !this.newPatientRecord.condition) {
      alert('Please fill in all required fields');
      return;
    }

    this.isLoading = true;
    
    // Convert comma-separated strings to arrays
    const medicines = this.medicationsText 
      ? this.medicationsText.split(',').map(item => item.trim()).filter(item => item.length > 0)
      : [];
    
    const labTests = this.labTestsText 
      ? this.labTestsText.split(',').map(item => item.trim()).filter(item => item.length > 0)
      : [];

    // Prepare the record data
    const recordData = {
      ...this.newPatientRecord,
      medicine: medicines,
      labTest: labTests,
      doctor: this.getDoctorName(),
      status: this.newPatientRecord.status || 'active'
    };    // Save the record using the medical records service
    this.medicalRecordsService.addPatientRecord(recordData).subscribe({
      next: (response) => {
        console.log('Patient record saved successfully:', response);
        alert('Patient record saved successfully!');
        this.resetForm();
        this.loadPatientRecords(); // Refresh the records list
        this.isLoading = false;
        
        // Switch to Patient Records tab to show the new record
        this.setActiveTab('patient-records');
      },
      error: (error) => {
        console.error('Error saving patient record:', error);
        alert('Error saving patient record. Please try again.');
        this.isLoading = false;
      }
    });
  }

  resetForm(): void {
    this.newPatientRecord = {
      patientId: '',
      visitDate: '',
      visitTime: '',
      doctor: '',
      condition: '',
      status: 'active',
      labTest: [],
      medicine: []
    };
    this.labTestsText = '';
    this.medicationsText = '';
  }

  initializeNewPatientRecord(): void {
    this.newPatientRecord = {
      patientId: '',
      visitDate: '',
      visitTime: '',
      doctor: this.getDoctorName(),
      condition: '',
      status: 'active',
      labTest: [],
      medicine: []
    };
    this.labTestsText = '';
    this.medicationsText = '';
  }

  // Debug method to check component state
  debugPatientRecords(): void {
    console.log('=== Patient Records Debug Info ===');
    console.log('Active Tab:', this.activeTab);
    console.log('Is Loading:', this.isLoading);
    console.log('Error:', this.error);
    console.log('Patient Records Array:', this.patientRecords);
    console.log('Patient Records Length:', this.patientRecords.length);
    console.log('Filtered Patient Records:', this.filteredPatientRecords);
    console.log('Filtered Length:', this.filteredPatientRecords.length);
    console.log('Search Term:', this.patientSearchTerm);
    console.log('Medical Records Service:', this.medicalRecordsService);
    console.log('Environment API URL:', environment.apiUrl);
    console.log('================================');
  }
}
