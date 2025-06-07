import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';

interface Appointment {
  id: number;
  date: string;
  time: string;
  doctor: string;
  specialty: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

interface MedicalRecord {
  id: number;
  date: string;
  type: string;
  description: string;
  doctor: string;
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
  imports: [CommonModule, NavbarComponent],
  templateUrl: './patient-dashboard.component.html',
  styleUrl: './patient-dashboard.component.css'
})
export class PatientDashboardComponent {
  activeTab: string = 'appointments';
  
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

  medicalRecords: MedicalRecord[] = [
    {
      id: 1,
      date: '2025-06-05',
      type: 'Blood Test',
      description: 'Complete Blood Count - Results Normal',
      doctor: 'Dr. Emily Davis'
    },
    {
      id: 2,
      date: '2025-05-28',
      type: 'X-Ray',
      description: 'Chest X-Ray - No abnormalities detected',
      doctor: 'Dr. Robert Wilson'
    },
    {
      id: 3,
      date: '2025-05-20',      type: 'Prescription',
      description: 'Blood pressure medication - Lisinopril 10mg',
      doctor: 'Dr. Sarah Johnson'
    }
  ];

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
    }
  ];

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
  getRecordTypeClass(type: string): string {
    switch (type) {
      case 'Blood Test': return 'text-danger';
      case 'X-Ray': return 'text-info';
      case 'Prescription': return 'text-success';
      default: return 'text-primary';
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
}
