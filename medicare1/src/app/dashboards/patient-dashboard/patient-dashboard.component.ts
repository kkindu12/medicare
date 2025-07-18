import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { PatientDashboardRecordCardComponent } from './components/patient-dashboard-record-card/patient-dashboard-record-card.component';
import { AppointmentCardComponent, AppointmentCard } from './components/appointment-card/appointment-card.component';
import { PatientHistoryModalComponent } from '../../emr/patient-history-modal/patient-history-modal.component';
import { MedicalRecordsService } from '../../services/medicalRecordService/medical-records.service';
import { AppointmentService, Appointment } from '../../services/appointment.service';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../shared/alert/alert.service';
import { ChatbotService, ChatMessage } from '../../services/chatbot.service';
import { NotificationService } from '../../services/notification.service';
import { UserNotification } from '../../models/notification.model';
import { BillService, Bill } from '../../services/bill.service';
import type { PatientRecordWithUser } from '../../emr/models';
import { interval, Subscription } from 'rxjs';

interface DashboardAppointment {
  id?: string;
  doctor_id?: string;
  doctor_name: string;
  doctor_specialty: string;
  patient_id?: string;
  patient_name?: string;
  appointment_date: string;
  appointment_time: string;
  reason?: string;
  status: string;
  created_at?: string;
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
  imports: [CommonModule, FormsModule, NavbarComponent, PatientDashboardRecordCardComponent, AppointmentCardComponent, PatientHistoryModalComponent],
  templateUrl: './patient-dashboard.component.html',
  styleUrl: './patient-dashboard.component.scss'
})
export class PatientDashboardComponent implements OnInit, OnDestroy, AfterViewChecked {
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
  appointments: DashboardAppointment[] = [];
  isLoadingAppointments = false;
  isAutoRefreshing = false;
  
  // Real-time polling
  private appointmentPollingSubscription?: Subscription;
  private chatSubscription?: Subscription;
  private readonly POLLING_INTERVAL = 10000; // Poll every 10 seconds

  // Chat-related properties
  showChatInterface = false;
  currentMessage = '';
  chatMessages: ChatMessage[] = [];
  @ViewChild('chatMessagesContainer', { static: false }) chatMessagesContainer!: ElementRef;
  @ViewChild('messageInput', { static: false }) messageInputElement!: ElementRef;

  // Notifications properties
  notifications: UserNotification[] = [];
  isLoadingNotifications = false;
  unreadNotificationCount = 0;

  // Bills/Payment properties
  bills: Bill[] = [];
  isLoadingBills = false;
  billsError: string | null = null;

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
  // ];

  paymentHistory: Payment[] = [
    // Commented out hardcoded data - now loaded from backend as bills
    // {
    //   id: 1,
    //   date: '2025-06-05',
    //   amount: 250.00,
    //   description: 'Cardiology Consultation - Dr. Sarah Johnson',
    //   method: 'Credit Card',
    //   status: 'paid'
    // }
  ];  constructor(
    private medicalRecordsService: MedicalRecordsService,
    private router: Router,
    private route: ActivatedRoute,
    private appointmentService: AppointmentService,
    private authService: AuthService,
    private alertService: AlertService,
    private chatbotService: ChatbotService,
    private notificationService: NotificationService,
    private billService: BillService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}ngOnInit(): void {
    // Load current user from sessionStorage (only in browser)
    if (isPlatformBrowser(this.platformId) && typeof sessionStorage !== 'undefined') {
      const userStr = sessionStorage.getItem('user');
      if (userStr) {
        this.currentUser = JSON.parse(userStr);
      }
    }
    
    // Check for query parameters to set active tab
    this.route.queryParams.subscribe(params => {
      if (params['tab']) {
        this.activeTab = params['tab'];
      }
    });
    
    this.loadPatientRecords();
    this.loadAppointments();
    this.loadNotifications();
    this.loadPatientBills();
    this.startAppointmentPolling(); // Start auto-refreshing appointments
  }
  
  ngOnDestroy(): void {
    // Clean up polling subscription
    if (this.appointmentPollingSubscription) {
      this.appointmentPollingSubscription.unsubscribe();
    }
    
    // Clean up chat subscription
    if (this.chatSubscription) {
      this.chatSubscription.unsubscribe();
    }
  }

  ngAfterViewChecked(): void {
    // Auto-scroll to bottom after view updates
    if (this.showChatInterface) {
      this.scrollToBottom();
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

  loadAppointments(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      return;
    }

    this.isLoadingAppointments = true;
    this.appointmentService.getPatientAppointments(currentUser.id).subscribe({
      next: (appointments) => {
        this.appointments = appointments.map(app => ({
          id: app.id,
          doctor_id: app.doctor_id,
          doctor_name: app.doctor_name,
          doctor_specialty: app.doctor_specialty,
          patient_id: app.patient_id,
          patient_name: app.patient_name,
          appointment_date: app.appointment_date,
          appointment_time: app.appointment_time,
          reason: app.reason,
          status: app.status,
          created_at: app.created_at
        }));
        this.isLoadingAppointments = false;
      },
      error: (error) => {
        console.error('Error loading appointments:', error);
        this.isLoadingAppointments = false;
      }
    });
  }

  // Notification methods
  loadNotifications(): void {
    if (!this.currentUser?.id) return;
    
    this.isLoadingNotifications = true;
    this.notificationService.loadNotifications(this.currentUser.id).subscribe({
      next: (notifications: UserNotification[]) => {
        this.notifications = notifications;
        this.unreadNotificationCount = notifications.filter(n => !n.read).length;
        this.isLoadingNotifications = false;
      },
      error: (error: any) => {
        console.error('Error loading notifications:', error);
        this.isLoadingNotifications = false;
      }
    });
  }

  refreshNotifications(): void {
    this.loadNotifications();
  }

  markNotificationAsRead(notification: UserNotification): void {
    if (notification.read) return;
    
    this.notificationService.markAsRead(notification.id).subscribe({
      next: () => {
        notification.read = true;
        this.unreadNotificationCount = Math.max(0, this.unreadNotificationCount - 1);
      },
      error: (error: any) => {
        console.error('Error marking notification as read:', error);
      }
    });
  }

  markAllAsRead(): void {
    const unreadNotifications = this.notifications.filter(n => !n.read);
    
    unreadNotifications.forEach(notification => {
      this.notificationService.markAsRead(notification.id).subscribe({
        next: () => {
          notification.read = true;
        },
        error: (error: any) => {
          console.error('Error marking notification as read:', error);
        }
      });
    });
    
    this.unreadNotificationCount = 0;
  }

  deleteNotification(notification: UserNotification): void {
    // Implementation depends on if you have a delete endpoint
    const index = this.notifications.indexOf(notification);
    if (index > -1) {
      this.notifications.splice(index, 1);
      if (!notification.read) {
        this.unreadNotificationCount = Math.max(0, this.unreadNotificationCount - 1);
      }
    }
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'medical_record': return 'bi-file-medical-fill text-success';
      case 'appointment': return 'bi-calendar-event-fill text-primary';
      case 'appointment_approved': return 'bi-check-circle-fill text-success';
      case 'appointment_rejected': return 'bi-x-circle-fill text-danger';
      case 'prescription': return 'bi-prescription text-info';
      case 'lab_result': return 'bi-clipboard-data-fill text-warning';
      case 'general': return 'bi-info-circle-fill text-info';
      default: return 'bi-bell-fill text-secondary';
    }
  }
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
    switch (status.toLowerCase()) {
      case 'pending':
        return 'badge bg-warning text-dark';
      case 'confirmed':
        return 'badge bg-success';
      case 'completed':
        return 'badge bg-primary';
      case 'cancelled':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
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

  // Helper method to get appointments count
  getAppointmentsCount(): number {
    return this.appointments.length;
  }

  // Navigation methods
  goToBooking(): void {
    this.router.navigate(['/booking']);
  }
  rescheduleAppointment(appointment: DashboardAppointment): void {
    if (!appointment.id) {
      this.alertService.showError('Error', 'Cannot reschedule appointment without ID');
      return;
    }
    
    // Navigate to reschedule appointment page with appointment ID
    this.router.navigate(['/reschedule-appointment', appointment.id]);
  }
  async cancelAppointment(appointment: DashboardAppointment): Promise<void> {
    const confirmed = await this.alertService.showConfirm(
      'Cancel Appointment', 
      'Are you sure you want to cancel this appointment?',
      'Yes, Cancel',
      'Keep Appointment'
    );
    
    if (confirmed && appointment.id) {
      this.appointmentService.cancelAppointment(appointment.id).subscribe({
        next: () => {
          this.alertService.showSuccess('Appointment Cancelled', 'Your appointment has been cancelled successfully!');
          this.loadAppointments(); // Reload appointments
        },
        error: (error) => {
          console.error('Error cancelling appointment:', error);
          this.alertService.showError('Cancellation Failed', 'Failed to cancel appointment. Please try again.');
        }
      });
    }
  }

  // Chat-related methods
  startConversation(): void {
    this.showChatInterface = true;
    
    // Clear any existing subscription
    if (this.chatSubscription) {
      this.chatSubscription.unsubscribe();
    }
    
    // Subscribe to chatbot messages
    this.chatSubscription = this.chatbotService.messages$.subscribe(messages => {
      this.chatMessages = messages;
    });

    // Clear any existing messages and start fresh
    this.chatbotService.clearChat();
  }

  closeChatInterface(): void {
    this.showChatInterface = false;
    this.currentMessage = '';
    this.chatMessages = [];
    
    // Unsubscribe from chat messages
    if (this.chatSubscription) {
      this.chatSubscription.unsubscribe();
      this.chatSubscription = undefined;
    }
  }

  sendMessage(): void {
    if (!this.currentMessage.trim()) return;

    const userMessage = this.currentMessage.trim();
    this.currentMessage = '';

    // Send message to chatbot service
    this.chatbotService.sendMessage(userMessage);

    // Focus back to input
    setTimeout(() => {
      if (this.messageInputElement) {
        this.messageInputElement.nativeElement.focus();
      }
    }, 100);
  }

  private scrollToBottom(): void {
    if (this.chatMessagesContainer) {
      const element = this.chatMessagesContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }

  // Bills/Payment methods
  loadPatientBills(): void {
    if (!this.currentUser?.id) return;
    
    this.isLoadingBills = true;
    this.billsError = null;
    
    this.billService.getPatientBills(this.currentUser.id).subscribe({
      next: (bills: Bill[]) => {
        this.bills = bills;
        // Convert bills to payment history format for compatibility
        this.paymentHistory = bills.map(bill => ({
          id: parseInt(bill.id || '0'),
          date: new Date(bill.createdAt).toLocaleDateString(),
          amount: bill.totalAmount,
          description: `Bill ${bill.billNumber} - ${bill.billItems.map(item => item.description).join(', ')}`,
          method: 'Hospital Bill',
          status: bill.status as 'paid' | 'pending' | 'failed'
        }));
        this.isLoadingBills = false;
      },
      error: (error: any) => {
        console.error('Error loading patient bills:', error);
        this.billsError = 'Failed to load payment history. Please try again.';
        this.isLoadingBills = false;
      }
    });
  }

  refreshBills(): void {
    this.loadPatientBills();
  }

  payBill(billId: string): void {
    this.billService.updateBillStatus(billId, 'paid').subscribe({
      next: () => {
        this.alertService.showSuccess('Payment Successful', 'Bill has been marked as paid.');
        this.loadPatientBills(); // Reload bills
      },
      error: (error: any) => {
        console.error('Error updating bill status:', error);
        this.alertService.showError('Payment Failed', 'Unable to process payment. Please try again.');
      }
    });
  }
}
