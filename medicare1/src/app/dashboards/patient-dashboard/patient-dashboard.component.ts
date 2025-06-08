import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { PatientDashboardRecordCardComponent } from './components/patient-dashboard-record-card/patient-dashboard-record-card.component';
import { PatientHistoryModalComponent } from '../../emr/patient-history-modal/patient-history-modal.component';
import { MedicalRecordsService } from '../../services/medicalRecordService/medical-records.service';
import type { PatientRecordWithUser } from '../../emr/models';

interface Appointment {
  id: number;
  date: string;
  time: string;
  doctor: string;
  specialty: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

interface Payment {
  id: number;
  date: string;
  amount: number;
  description: string;
  method: string;
  status: 'paid' | 'pending' | 'failed';
}

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent, PatientDashboardRecordCardComponent, PatientHistoryModalComponent],
  templateUrl: './patient-dashboard.component.html',
  styleUrl: './patient-dashboard.component.scss'
})
export class PatientDashboardComponent implements OnInit {
  activeTab: string = 'appointments';
  
  // Current User
  currentUser: any = null;
  
  // Patient Records properties
  patientRecords: PatientRecordWithUser[] = [];
  isLoadingRecords = false;
  recordsError: string | null = null;
  
  // Patient History Modal properties
  showPreviousRecords = false;
  selectedPatientRecord: PatientRecordWithUser | null = null;
  previousPatientRecords: PatientRecordWithUser[] = [];
  
  appointments: Appointment[] = [
    {
      id: 1,
      date: '2025-06-10',
      time: '10:00 AM',
      doctor: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      status: 'upcoming'
    },
    {
      id: 2,
      date: '2025-06-15',
      time: '2:30 PM',
      doctor: 'Dr. Michael Chen',
      specialty: 'Dermatology',
      status: 'upcoming'
    },
    {
      id: 3,
      date: '2025-06-05',
      time: '9:00 AM',
      doctor: 'Dr. Emily Davis',
      specialty: 'General Medicine',
      status: 'completed'
    }
  ];

  // medicalRecords: MedicalRecord[] = [
  //   {
  //     id: 1,
  //     date: '2025-06-05',
  //     type: 'Blood Test',
  //     description: 'Complete Blood Count - Results Normal',
  //     doctor: 'Dr. Emily Davis'
  //   },
  //   {
  //     id: 2,
  //     date: '2025-05-28',
  //     type: 'X-Ray',
  //     description: 'Chest X-Ray - No abnormalities detected',
  //     doctor: 'Dr. Robert Wilson'
  //   },
  //   {
  //     id: 3,
  //     date: '2025-05-20',      type: 'Prescription',
  //     description: 'Blood pressure medication - Lisinopril 10mg',
  //     doctor: 'Dr. Sarah Johnson'
  //   }
  //  ];

  paymentHistory: Payment[] = [
    {
      id: 1,
      date: '2025-06-05',
      amount: 250.00,
      description: 'Cardiology Consultation - Dr. Sarah Johnson',
      method: 'Credit Card',
      status: 'paid'
    },
    {
      id: 2,
      date: '2025-05-28',
      amount: 120.00,
      description: 'Blood Test - Laboratory Services',
      method: 'Insurance',
      status: 'paid'
    },
    {
      id: 3,
      date: '2025-05-20',
      amount: 80.00,
      description: 'Prescription Medication',
      method: 'Debit Card',
      status: 'pending'
    }  ];

  constructor(private medicalRecordsService: MedicalRecordsService) {}
  ngOnInit(): void {
    // Load current user from sessionStorage
    const userStr = sessionStorage.getItem('user');
    if (userStr) {
      this.currentUser = JSON.parse(userStr);
    }
    
    this.loadPatientRecords();
  }
  
  loadPatientRecords(): void {
    this.isLoadingRecords = true;
    this.recordsError = null;
    
    // Get patient ID from current user
    const patientId = this.currentUser?.id?.toString();
    
    if (!patientId) {
      this.recordsError = 'User not found. Please sign in again.';
      this.isLoadingRecords = false;
      return;
    }
    
    this.medicalRecordsService.getPatientRecordsById(patientId).subscribe({
      next: (records) => {
        this.patientRecords = records;
        this.isLoadingRecords = false;
      },
      error: (error) => {
        console.error('Error loading patient records:', error);
        this.recordsError = 'Failed to load medical records. Please try again.';
        this.isLoadingRecords = false;
      }
    });  }

  onViewHistory(record: PatientRecordWithUser): void {
    this.selectedPatientRecord = record;
    this.showPreviousRecords = true;
    
    // Load patient history using the medical records service
    if (record.user?.id) {
      this.medicalRecordsService.getPatientRecordsById(record.user.id.toString()).subscribe({
        next: (records) => {
          this.previousPatientRecords = records;
        },
        error: (error) => {
          console.error('Error loading patient history:', error);
          this.previousPatientRecords = [];
        }
      });
    }
  }

  onClosePreviousRecords(): void {
    this.showPreviousRecords = false;
    this.selectedPatientRecord = null;
    this.previousPatientRecords = [];
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
  getStatusClass(status: string): string {
    switch (status) {
      case 'upcoming': return 'badge bg-primary';
      case 'completed': return 'badge bg-success';
      case 'cancelled': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  }

  getPaymentStatusClass(status: string): string {
    switch (status) {
      case 'paid': return 'badge bg-success';
      case 'pending': return 'badge bg-warning';
      case 'failed': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  }

  // Helper method to get user's first name
  getUserFirstName(): string {
    if (this.currentUser?.firstName) {
      return this.currentUser.firstName;
    }
    if (this.currentUser?.name) {
      return this.currentUser.name.split(' ')[0];
    }
    return 'Patient';
  }

  // Helper method to get medical records count
  getMedicalRecordsCount(): number {
    return this.patientRecords.length;
  }
}
