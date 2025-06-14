import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Prescription, PharmacyStats, LabTest, InventoryItem, Report, Payment } from './models/prescription.model';
import { PrescriptionModalComponent } from './prescription-modal/prescription-modal.component';

type TabType = 'prescriptions' | 'lab-tests' | 'inventory' | 'reports' | 'payments';

@Component({
  selector: 'app-pharmacy',
  standalone: true,
  imports: [CommonModule, FormsModule, PrescriptionModalComponent],
  templateUrl: './pharmacy&laboratory.component.html',
  styleUrls: ['./pharmacy&laboratory.component.scss']
})
export class PharmacyComponent implements OnInit {
  activeTab: TabType = 'prescriptions';
  searchTerm: string = '';
  selectedStatus: string = 'ALL';
  
  filteredPrescriptions: Prescription[] = [];
  filteredLabTests: LabTest[] = [];
  filteredInventory: InventoryItem[] = [];
  filteredReports: Report[] = [];
  filteredPayments: Payment[] = [];

  // Modal properties
  isModalVisible: boolean = false;
  modalType: 'prescription' | 'labTest' | 'inventory' = 'prescription';
  modalMode: 'add' | 'edit' | 'view' = 'add';
  selectedPrescription: Prescription | null = null;
  selectedLabTest: LabTest | null = null;
  selectedInventoryItem: InventoryItem | null = null;

  pharmacyStats: PharmacyStats = {
    pendingPrescriptions: 12,
    labTestRequests: 8,
    outOfStockItems: 3,
    reportsUploaded: 25
  };

  recentPrescriptions: Prescription[] = [
    {
      id: '1',
      patientName: 'John Smith',
      patientId: 'P001',
      medication: 'Amoxicillin 500mg',
      doctor: 'Dr. Johnson',
      status: 'PENDING',
      date: '2024-06-14',
      time: '09:30',
      dosage: '500mg',
      frequency: 'Twice daily',
      duration: '7 days',
      notes: 'Take with food'
    },
    {
      id: '2',
      patientName: 'Sarah Wilson',
      patientId: 'P002',
      medication: 'Lisinopril 10mg',
      doctor: 'Dr. Brown',
      status: 'COMPLETED',
      date: '2024-06-13',
      time: '14:15',
      dosage: '10mg',
      frequency: 'Once daily',
      duration: '30 days'
    }
  ];

  labTests: LabTest[] = [
    {
      id: 'LT001',
      testName: 'Complete Blood Count',
      patientName: 'John Smith',
      patientId: 'P001',
      doctor: 'Dr. Johnson',
      status: 'PENDING',
      priority: 'NORMAL',
      requestDate: '2024-06-14',
      expectedDate: '2024-06-15',
      notes: 'Fasting required'
    },
    {
      id: 'LT002',
      testName: 'Lipid Profile',
      patientName: 'Mary Davis',
      patientId: 'P003',
      doctor: 'Dr. Smith',
      status: 'IN_PROGRESS',
      priority: 'URGENT',
      requestDate: '2024-06-13',
      expectedDate: '2024-06-14'
    }
  ];

  inventoryItems: InventoryItem[] = [
    {
      id: 'INV001',
      name: 'Amoxicillin 500mg',
      category: 'Antibiotics',
      currentStock: 150,
      minimumStock: 50,
      maxStock: 500,
      unitPrice: 2.50,
      expiryDate: '2025-12-31',
      batchNumber: 'AMX2024001',
      supplier: 'PharmaCorp',
      status: 'IN_STOCK'
    },
    {
      id: 'INV002',
      name: 'Paracetamol 500mg',
      category: 'Pain Relief',
      currentStock: 25,
      minimumStock: 30,
      maxStock: 300,
      unitPrice: 0.15,
      expiryDate: '2024-08-15',
      batchNumber: 'PAR2024002',      supplier: 'MediSupply',
      status: 'LOW_STOCK'
    },
    {
      id: 'INV003',
      name: 'Vitamin D3 1000IU',
      category: 'Vitamins',
      currentStock: 80,
      minimumStock: 20,
      maxStock: 200,
      unitPrice: 0.75,
      expiryDate: '2025-06-30',
      batchNumber: 'VIT2024003',
      supplier: 'HealthCorp',
      status: 'IN_STOCK'
    },
    {
      id: 'INV004',
      name: 'Medical Gloves (Box)',
      category: 'Medical Supplies',
      currentStock: 15,
      minimumStock: 25,
      maxStock: 100,
      unitPrice: 12.50,
      expiryDate: '2026-12-31',
      batchNumber: 'GLV2024004',
      supplier: 'MedSupplies Inc',
      status: 'LOW_STOCK'
    },
    {
      id: 'INV005',
      name: 'Lisinopril 10mg',
      category: 'Cardiovascular',
      currentStock: 120,
      minimumStock: 40,
      maxStock: 400,
      unitPrice: 1.25,
      expiryDate: '2025-09-15',
      batchNumber: 'LIS2024005',
      supplier: 'PharmaCorp',
      status: 'IN_STOCK'
    }
  ];  reports: Report[] = [
    {
      id: 'RPT001',
      title: 'Monthly Inventory Report',
      type: 'MONTHLY',
      generatedBy: 'System Administrator',
      generatedDate: '2024-06-01',
      fileSize: '2.5 MB',
      status: 'FINAL'
    },
    {
      id: 'RPT002',
      title: 'Weekly Prescription Analysis',
      type: 'WEEKLY',
      generatedBy: 'Dr. Sarah Johnson',
      generatedDate: '2024-06-10',
      fileSize: '1.8 MB',
      status: 'DRAFT'
    },
    {
      id: 'RPT003',
      title: 'Lab Test Performance Report',
      type: 'MONTHLY',
      generatedBy: 'Lab Manager',
      generatedDate: '2024-06-05',
      fileSize: '3.2 MB',
      status: 'FINAL'
    },
    {
      id: 'RPT004',
      title: 'Daily Sales Summary',
      type: 'DAILY',
      generatedBy: 'Finance Team',
      generatedDate: '2024-06-14',
      fileSize: '850 KB',
      status: 'FINAL'
    },
    {
      id: 'RPT005',
      title: 'Annual Financial Overview',
      type: 'ANNUAL',
      generatedBy: 'Chief Financial Officer',
      generatedDate: '2024-01-15',
      fileSize: '12.7 MB',
      status: 'ARCHIVED'
    },
    {
      id: 'RPT006',
      title: 'Patient Demographics Study',
      type: 'MONTHLY',
      generatedBy: 'Research Team',
      generatedDate: '2024-06-12',
      fileSize: '4.1 MB',
      status: 'DRAFT'
    },
    {
      id: 'RPT007',
      title: 'Medication Usage Trends',
      type: 'WEEKLY',
      generatedBy: 'Pharmacy Manager',
      generatedDate: '2024-06-13',
      fileSize: '2.9 MB',
      status: 'FINAL'
    }
  ];
  payments: Payment[] = [
    {
      id: 'PAY001',
      patientName: 'John Smith',
      patientId: 'PT001',
      amount: 45.50,
      transactionDate: '2024-06-14',
      status: 'COMPLETED',
      paymentMethod: 'CARD',
      items: ['Amoxicillin 500mg']
    },
    {
      id: 'PAY002',
      patientName: 'Sarah Wilson',
      patientId: 'PT002',
      amount: 25.00,
      transactionDate: '2024-06-13',
      status: 'PENDING',
      paymentMethod: 'CASH',
      items: ['Blood Test']
    }
  ];

  ngOnInit() {
    this.applyFilters();
  }

  setActiveTab(tab: TabType): void {
    this.activeTab = tab;
    this.applyFilters();
  }

  // Prescription Methods
  addNewPrescription(): void {
    this.selectedPrescription = null;
    this.modalType = 'prescription';
    this.modalMode = 'add';
    this.isModalVisible = true;
  }

  editPrescription(prescription: Prescription): void {
    this.selectedPrescription = prescription;
    this.modalType = 'prescription';
    this.modalMode = 'edit';
    this.isModalVisible = true;
  }

  viewPrescriptionDetails(prescription: Prescription): void {
    this.selectedPrescription = prescription;
    this.modalType = 'prescription';
    this.modalMode = 'view';
    this.isModalVisible = true;
  }

  updatePrescriptionStatus(prescriptionId: string, newStatus: Prescription['status']): void {
    const prescription = this.recentPrescriptions.find(p => p.id === prescriptionId);
    if (prescription) {
      prescription.status = newStatus;
      this.applyFilters();
    }
  }

  // Lab Test Methods
  addNewLabTest(): void {
    this.selectedLabTest = null;
    this.modalType = 'labTest';
    this.modalMode = 'add';
    this.isModalVisible = true;
  }

  editLabTest(labTest: LabTest): void {
    this.selectedLabTest = labTest;
    this.modalType = 'labTest';
    this.modalMode = 'edit';
    this.isModalVisible = true;
  }

  viewLabTestDetails(labTest: LabTest): void {
    this.selectedLabTest = labTest;
    this.modalType = 'labTest';
    this.modalMode = 'view';
    this.isModalVisible = true;
  }

  startLabTest(testId: string): void {
    const test = this.labTests.find(t => t.id === testId);
    if (test) {
      test.status = 'IN_PROGRESS';
      this.applyFilters();
    }
  }

  completeLabTest(testId: string): void {
    const test = this.labTests.find(t => t.id === testId);
    if (test) {
      test.status = 'COMPLETED';
      this.applyFilters();
    }
  }

  // Inventory Methods
  addNewInventoryItem(): void {
    this.selectedInventoryItem = null;
    this.modalType = 'inventory';
    this.modalMode = 'add';
    this.isModalVisible = true;
  }

  editInventoryItem(item: InventoryItem): void {
    this.selectedInventoryItem = item;
    this.modalType = 'inventory';
    this.modalMode = 'edit';
    this.isModalVisible = true;
  }

  viewInventoryItemDetails(item: InventoryItem): void {
    this.selectedInventoryItem = item;
    this.modalType = 'inventory';
    this.modalMode = 'view';
    this.isModalVisible = true;
  }

  restockItem(itemId: string): void {
    const item = this.inventoryItems.find(i => i.id === itemId);
    if (item) {
      // Simple restock logic - add 100 units
      item.currentStock += 100;
      item.status = item.currentStock > item.minimumStock ? 'IN_STOCK' : 'LOW_STOCK';
      this.applyFilters();
    }
  }
  // Report Methods
  generateNewReport(): void {
    const newReport: Report = {
      id: 'RPT' + (this.reports.length + 1).toString().padStart(3, '0'),
      title: 'Generated Report',
      type: 'DAILY',
      generatedBy: 'System',
      generatedDate: new Date().toISOString().split('T')[0],
      fileSize: '1.0 MB',
      status: 'DRAFT'
    };
    this.reports.push(newReport);
    this.applyFilters();
  }

  viewReport(report: Report): void {
    console.log('Viewing report:', report);
    // Implementation for viewing report
    // Could open a modal or navigate to a detailed view
  }

  editReport(report: Report): void {
    console.log('Editing report:', report);
    // Implementation for editing report
    // Could open a modal with pre-filled form
  }

  deleteReport(report: Report): void {
    console.log('Deleting report:', report);
    // Implementation for deleting report
    const index = this.reports.findIndex(r => r.id === report.id);
    if (index > -1) {
      this.reports.splice(index, 1);
      this.applyFilters(); // Refresh filtered list
    }
  }

  downloadReport(report: Report): void {
    console.log('Downloading report:', report);
    // Implementation for downloading report
    // Create a download link or trigger file download
  }

  // Payment Methods
  viewPaymentDetails(payment: Payment): void {
    console.log('Viewing payment:', payment);
  }

  // Modal Methods
  closeModal(): void {
    this.isModalVisible = false;
    this.selectedPrescription = null;
    this.selectedLabTest = null;
    this.selectedInventoryItem = null;
  }

  onSaveFromModal(event: any): void {
    if (event.type === 'prescription') {
      if (this.modalMode === 'add') {
        this.recentPrescriptions.push(event.data);
      } else if (this.modalMode === 'edit' && this.selectedPrescription) {
        const index = this.recentPrescriptions.findIndex(p => p.id === this.selectedPrescription!.id);
        if (index !== -1) {
          this.recentPrescriptions[index] = event.data;
        }
      }
    } else if (event.type === 'labTest') {
      if (this.modalMode === 'add') {
        this.labTests.push(event.data);
      } else if (this.modalMode === 'edit' && this.selectedLabTest) {
        const index = this.labTests.findIndex(t => t.id === this.selectedLabTest!.id);
        if (index !== -1) {
          this.labTests[index] = event.data;
        }
      }
    } else if (event.type === 'inventory') {
      if (this.modalMode === 'add') {
        this.inventoryItems.push(event.data);
      } else if (this.modalMode === 'edit' && this.selectedInventoryItem) {
        const index = this.inventoryItems.findIndex(i => i.id === this.selectedInventoryItem!.id);
        if (index !== -1) {
          this.inventoryItems[index] = event.data;
        }
      }
    }
    this.applyFilters();
  }

  // Filter Methods
  onSearchChange(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.applyFilters();
  }

  onStatusFilterChange(status: string): void {
    this.selectedStatus = status;
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = 'ALL';
    this.applyFilters();
  }

  isActiveTab(tab: string): boolean {
    return this.activeTab === tab;
  }

  private applyFilters(): void {
    // Filter prescriptions
    this.filteredPrescriptions = this.recentPrescriptions.filter(prescription => {
      const matchesSearch = !this.searchTerm || 
        prescription.patientName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        prescription.medication.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        prescription.doctor.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = this.selectedStatus === 'ALL' || prescription.status === this.selectedStatus;
      return matchesSearch && matchesStatus;
    });

    // Filter lab tests
    this.filteredLabTests = this.labTests.filter(test => {
      const matchesSearch = !this.searchTerm || 
        test.patientName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        test.testName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        test.doctor.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = this.selectedStatus === 'ALL' || test.status === this.selectedStatus;
      return matchesSearch && matchesStatus;
    });

    // Filter inventory
    this.filteredInventory = this.inventoryItems.filter(item => {
      const matchesSearch = !this.searchTerm || 
        item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.supplier.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = this.selectedStatus === 'ALL' || item.status === this.selectedStatus;
      return matchesSearch && matchesStatus;
    });

    // Filter reports
    this.filteredReports = this.reports.filter(report => {
      const matchesSearch = !this.searchTerm || 
        report.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        report.type.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = this.selectedStatus === 'ALL' || report.status === this.selectedStatus;
      return matchesSearch && matchesStatus;
    });    // Filter payments
    this.filteredPayments = this.payments.filter(payment => {
      const matchesSearch = !this.searchTerm || 
        payment.patientName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        payment.items.some(item => item.toLowerCase().includes(this.searchTerm.toLowerCase()));
      const matchesStatus = this.selectedStatus === 'ALL' || payment.status === this.selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }

  // Additional Methods for Template
  processOrders(): void {
    console.log('Processing orders...');
  }

  openQuickChat(): void {
    console.log('Opening quick chat...');
  }

  get monthlyReportsCount(): number {
    return this.reports.filter(r => r.type === 'MONTHLY').length;
  }

  get archivedReportsCount(): number {
    return this.reports.filter(r => r.status === 'ARCHIVED').length;
  }
}
