import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { MedicalRecordsService } from '../../services/medicalRecordService/medical-records.service';
import { UserService } from '../../services/userService/user.service';
import { NotificationService } from '../../services/notification.service';
import { AlertService } from '../../shared/alert/alert.service';
import { AppointmentService, Appointment } from '../../services/appointment.service';
import { EmrComponent } from '../../emr/emr.component';
import { environment } from '../../../environments/environment';
import type { PatientRecordWithUser, User } from '../../emr/models';
import { interval, Subscription } from 'rxjs';

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
export class DoctorDashboardComponent implements OnInit, OnDestroy {
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
  isAutoRefreshing = false;
  
  // Real-time polling
  private appointmentPollingSubscription?: Subscription;
  private readonly POLLING_INTERVAL = 10000; // Poll every 10 seconds
  
  // Filter States
  selectedDate: string = 'all';
  reportFilter: string = 'all';
  patientSearchTerm: string = '';
  
  // Modal States
  showAppointmentModal = false;
  showRecordModal = false;
  selectedAppointment: Appointment | null = null;
  selectedMedicalRecord: PatientRecordWithUser | null = null;
  selectedPatient: User | null = null;
  rejectionReason: string = '';
  
  // Form States
  isEditingAppointment = false;
  
  constructor(
    private medicalRecordsService: MedicalRecordsService,
    private userService: UserService,
    private alertService: AlertService,
    private appointmentService: AppointmentService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
  ngOnInit(): void {
    this.loadUserData();
    this.loadDashboardData();
    this.startAppointmentPolling();
  }

  ngOnDestroy(): void {
    // Clean up polling subscription
    if (this.appointmentPollingSubscription) {
      this.appointmentPollingSubscription.unsubscribe();
    }
  }

  startAppointmentPolling(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.appointmentPollingSubscription = interval(this.POLLING_INTERVAL).subscribe(() => {
      if (this.activeTab === 'appointments') {
        this.isAutoRefreshing = true;
        this.loadAppointments();
        setTimeout(() => this.isAutoRefreshing = false, 1000); // Hide indicator after 1s
      }
    });
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
    if (this.currentUser && this.currentUser.id) {
      this.appointmentService.getDoctorAppointments(this.currentUser.id).subscribe({
        next: (appointments) => {
          this.appointments = appointments;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading appointments:', error);
          this.alertService.showError('Error', 'Failed to load appointments');
          this.isLoading = false;
        }
      });
    } else {
      // Fallback if no user
      this.appointments = [];
      this.isLoading = false;
    }
  }

  loadLabReports(): void {
    // Mock data for lab reports
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
      }
    });
  }

  loadPatientRecords(): void {
    this.medicalRecordsService.getPatientRecords().subscribe({
      next: (records: any) => {
        this.patientRecords = records as PatientRecordWithUser[];
        this.filteredPatientRecords = [...this.patientRecords];
      },
      error: (error: any) => {
        console.error('Error loading patient records:', error);
      }
    });
  }

  // Tab Management
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

  // Appointment approval methods
  approveAppointment(appointmentId: string): void {
    if (!appointmentId) return;
    
    this.appointmentService.approveAppointment(appointmentId).subscribe({
      next: (updatedAppointment) => {
        // Update the local appointment list
        const index = this.appointments.findIndex(a => a.id === appointmentId);
        if (index !== -1) {
          this.appointments[index] = updatedAppointment;
        }
        this.alertService.showSuccess('Appointment Approved', `Appointment for ${updatedAppointment.patient_name} has been approved successfully.`);
      },
      error: (error) => {
        console.error('Error approving appointment:', error);
        this.alertService.showError('Error', 'Failed to approve appointment');
      }
    });
  }
  openRejectModal(appointment: Appointment): void {
    console.log('Opening rejection modal for appointment:', appointment);
    this.selectedAppointment = appointment;
    this.rejectionReason = '';
    
    // Open the rejection modal (will be handled by Bootstrap modal)
    if (typeof window !== 'undefined') {
      const modalElement = document.getElementById('rejectModal');
      
      if (!modalElement) {
        console.error('Modal element not found in the DOM');
        this.alertService.showError('UI Error', 'Cannot open rejection modal. Please refresh the page and try again.');
        return;
      }
      
      try {
        if ((window as any).bootstrap && (window as any).bootstrap.Modal) {
          const modal = new (window as any).bootstrap.Modal(modalElement);
          modal.show();
          console.log('Modal shown successfully');
        } else {
          console.error('Bootstrap Modal not found - falling back to manual display');
          this.alertService.showWarning('UI Warning', 'Using fallback modal display method');
          modalElement.classList.add('show');
          modalElement.style.display = 'block';
        }
      } catch (e) {
        console.error('Error showing modal:', e);
        this.alertService.showError('UI Error', 'Failed to show rejection modal. Please refresh and try again.');
      }
    }
  }

  confirmRejectAppointment(): void {
    if (!this.selectedAppointment?.id || !this.rejectionReason.trim()) {
      this.alertService.showWarning('Invalid Input', 'Please provide a reason for rejection');
      return;
    }

    this.appointmentService.rejectAppointment(this.selectedAppointment.id, this.rejectionReason).subscribe({
      next: (updatedAppointment) => {
        // Update the local appointment list
        const index = this.appointments.findIndex(a => a.id === this.selectedAppointment?.id);
        if (index !== -1) {
          this.appointments[index] = updatedAppointment;
        }
        this.alertService.showWarning('Appointment Rejected', `Appointment for ${updatedAppointment.patient_name} has been rejected.`);
        this.closeRejectModal();
      },
      error: (error) => {
        console.error('Error rejecting appointment:', error);
        if (error && error.error && error.error.detail) {
          this.alertService.showError('Rejection Failed', error.error.detail);
        } else if (error && error.message) {
          this.alertService.showError('Rejection Failed', error.message);
        } else {
          this.alertService.showError('Error', 'Failed to reject appointment. Please try again or contact support.');
        }
      }
    });
  }
  closeRejectModal(): void {
    console.log('Closing rejection modal');
    this.selectedAppointment = null;
    this.rejectionReason = '';
    
    // Close the modal
    if (typeof window !== 'undefined') {
      const modalElement = document.getElementById('rejectModal');
      if (!modalElement) {
        console.error('Modal element not found when closing');
        return;
      }
      
      try {
        if ((window as any).bootstrap && (window as any).bootstrap.Modal) {
          const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
          if (modal) {
            modal.hide();
            console.log('Modal hidden successfully');
          } else {
            console.warn('No modal instance found, trying manual close');
            modalElement.classList.remove('show');
            modalElement.style.display = 'none';
          }
        } else {
          console.warn('Bootstrap not found, using manual close');
          modalElement.classList.remove('show');
          modalElement.style.display = 'none';
        }
      } catch (e) {
        console.error('Error closing modal:', e);
      }
    }
  }

  openAppointmentModal(appointment: Appointment): void {
    this.selectedAppointment = { ...appointment };
    this.isEditingAppointment = true;
  }

  // Lab Report Management
  filterReports(filter: string): void {
    this.reportFilter = filter;
  }

  getFilteredLabReports(): LabReport[] {
    switch (this.reportFilter) {
      case 'unreviewed':
        return this.labReports.filter(report => !report.reviewed);
      case 'critical':
        return this.labReports.filter(report => report.status === 'critical');
      case 'all':
        return this.labReports;
      default:
        return this.labReports;
    }
  }

  viewLabReport(report: LabReport): void {
    console.log('Viewing lab report:', report);
  }

  markAsReviewed(reportId: number): void {
    const report = this.labReports.find(r => r.id === reportId);
    if (report) {
      report.reviewed = true;
      this.alertService.showSuccess('Report Updated', 'Lab report marked as reviewed');
    }
  }

  downloadReport(reportId: number): void {
    console.log('Downloading report:', reportId);
  }

  // Patient Records Management
  searchPatients(): void {
    const searchTerm = this.patientSearchTerm.toLowerCase();
    if (!searchTerm) {
      this.filteredPatientRecords = [...this.patientRecords];
    } else {
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

  editMedicalRecord(): void {
    if (this.selectedMedicalRecord) {
      console.log('Edit functionality for:', this.selectedMedicalRecord.user?.firstName, this.selectedMedicalRecord.user?.lastName);
    }
  }

  downloadMedicalRecord(record: PatientRecordWithUser): void {
    console.log('Downloading medical record for:', record.user?.firstName, record.user?.lastName);
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
    return this.appointments.filter(apt => apt.appointment_date === today).length;
  }
  getRecordsAddedCount(): number {
    if (!this.currentUser?.id) {
      return 0;
    }
    
    // Count patient records that were added by the current doctor
    // We'll use the doctorUser.id field or compare doctor names as fallback
    return this.patientRecords.filter(record => {
      // First try to match by doctor user ID
      if (record.doctorUser?.id) {
        return record.doctorUser.id === this.currentUser.id;
      }
      
      // Fallback: match by doctor name (less reliable but covers older records)
      const currentDoctorName = this.getDoctorName();
      return record.doctor === currentDoctorName;
    }).length;
  }

  // Get patient records added by the current doctor
  getMyPatientRecords(): PatientRecordWithUser[] {
    if (!this.currentUser?.id) {
      return [];
    }
    
    return this.patientRecords.filter(record => {
      // First try to match by doctor user ID
      if (record.doctorUser?.id) {
        return record.doctorUser.id === this.currentUser.id;
      }
      
      // Fallback: match by doctor name (less reliable but covers older records)
      const currentDoctorName = this.getDoctorName();
      return record.doctor === currentDoctorName;
    });
  }
  // Get filtered patient records (only current doctor's records with search)
  getFilteredPatientRecords(): PatientRecordWithUser[] {
    const searchTerm = this.patientSearchTerm.toLowerCase();
    let recordsToFilter = this.getMyPatientRecords(); // Only get current doctor's records
    
    // If search term exists, filter by search
    if (searchTerm) {
      recordsToFilter = recordsToFilter.filter(record =>
        record.user?.firstName?.toLowerCase().includes(searchTerm) ||
        record.user?.lastName?.toLowerCase().includes(searchTerm) ||
        record.user?.email?.toLowerCase().includes(searchTerm) ||
        record.condition?.toLowerCase().includes(searchTerm)
      );
    }
    
    return recordsToFilter;
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

  // Missing methods needed by the template
  openNewAppointmentModal(): void {
    this.selectedAppointment = {
      doctor_id: this.currentUser?.id || '',
      doctor_name: this.getDoctorName(),
      doctor_specialty: this.currentUser?.doctorDetails?.highestQualifications || '',
      patient_id: '',
      patient_name: '',
      appointment_date: '',
      appointment_time: '',
      reason: 'consultation',
      status: 'pending'
    };
    this.isEditingAppointment = false;
    this.showAppointmentModal = true;
  }

  saveAppointment(): void {
    if (!this.selectedAppointment) return;
    
    if (this.isEditingAppointment && this.selectedAppointment.id) {
      // Update existing appointment
      const index = this.appointments.findIndex(apt => apt.id === this.selectedAppointment?.id);
      if (index !== -1 && this.selectedAppointment) {
        this.appointments[index] = { ...this.selectedAppointment } as Appointment;
        this.alertService.showSuccess('Appointment Updated', 'Appointment has been updated successfully.');
      }
    } else {
      // Create new appointment
      if (this.selectedAppointment) {
        this.appointmentService.createAppointment(this.selectedAppointment).subscribe({
          next: (newAppointment) => {
            this.appointments.push(newAppointment);
            this.alertService.showSuccess('Appointment Created', 'New appointment has been created successfully.');
          },
          error: (error) => {
            console.error('Error creating appointment:', error);
            this.alertService.showError('Error', 'Failed to create appointment');
          }
        });
      }
    }
    this.closeAppointmentModal();
  }

  closeAppointmentModal(): void {
    this.showAppointmentModal = false;
    this.selectedAppointment = null;
    this.isEditingAppointment = false;
  }

  rescheduleAppointment(appointmentId?: string): void {
    if (!appointmentId) return;
    
    const appointment = this.appointments.find(a => a.id === appointmentId);
    if (appointment) {
      this.openAppointmentModal(appointment);
    }
  }

  getCriticalReportsCount(): number {
    return this.labReports.filter(report => report.status === 'critical' && !report.reviewed).length;
  }
}
