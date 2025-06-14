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
  activeTab: TabType = 'prescriptions' as TabType;
  searchTerm: string = '';
  selectedStatus: string = 'ALL';
  filteredPrescriptions: Prescription[] = [];
  filteredLabTests: LabTest[] = [];
  filteredInventory: InventoryItem[] = [];
  filteredReports: Report[] = [];
  filteredPayments: Payment[] = [];

  // Modal properties
  isModalVisible: boolean = false;
  selectedPrescription: Prescription | null = null;
  modalType: 'prescription' | 'labtest' | 'inventory' = 'prescription';
  modalMode: 'view' | 'edit' | 'new' = 'new';
  
  // Lab Test Modal properties
  isLabTestModalVisible: boolean = false;
  selectedLabTest: LabTest | null = null;
  selectedInventoryItem: InventoryItem | null = null;

  pharmacyStats: PharmacyStats = {
    pendingPrescriptions: 12,
    labTestRequests: 8,
    outOfStockItems: 3,
    reportsUploaded: 15
  };
  
  recentPrescriptions: Prescription[] = [
    {
      id: '1',
      patientName: 'John Smith',
      medication: 'Amoxicillin 500mg',
      doctor: 'Dr. Sarah Johnson',
      patientId: '#12345',
      status: 'PENDING',
      time: '2:30 PM',
      date: '2025-06-11',
      dosage: '500mg',
      frequency: 'Twice daily',
      duration: '7 days',
      notes: 'Take with food'
    },
    {
      id: '2',
      patientName: 'Maria Garcia',
      medication: 'Insulin Rapid-Acting',
      doctor: 'Dr. Michael Chen',
      patientId: '#12346',
      status: 'URGENT',
      time: '1:15 PM',
      date: '2025-06-11',
      dosage: '10 units',
      frequency: 'Before meals',
      duration: 'Ongoing',
      notes: 'Monitor blood glucose levels'
    },
    {
      id: '3',
      patientName: 'Robert Johnson',
      medication: 'Lisinopril 10mg',
      doctor: 'Dr. Emily Davis',
      patientId: '#12347',
      status: 'PENDING',
      time: '11:45 AM',
      date: '2025-06-11',
      dosage: '10mg',
      frequency: 'Once daily',
      duration: '30 days',
      notes: 'Take in the morning'
    }
  ];

  labTests: LabTest[] = [
    {
      id: '1',
      testName: 'Complete Blood Count',
      patientName: 'John Smith',
      patientId: '#12345',
      doctor: 'Dr. Sarah Johnson',
      status: 'PENDING',
      priority: 'NORMAL',
      requestDate: '2025-06-11',
      expectedDate: '2025-06-12',
      notes: 'Fasting required'
    },
    {
      id: '2',
      testName: 'Blood Glucose',
      patientName: 'Maria Garcia',
      patientId: '#12346',
      doctor: 'Dr. Michael Chen',
      status: 'PENDING',
      priority: 'URGENT',
      requestDate: '2025-06-11',
      expectedDate: '2025-06-11',
      notes: 'Emergency test'
    }
  ];

  inventoryItems: InventoryItem[] = [
    {
      id: '1',
      name: 'Amoxicillin 500mg',
      category: 'Antibiotics',
      currentStock: 150,
      minimumStock: 50,
      maxStock: 500,
      unitPrice: 2.50,
      expiryDate: '2025-12-31',
      batchNumber: 'AMX001',
      supplier: 'PharmaCorp',
      status: 'IN_STOCK'
    },
    {
      id: '2',
      name: 'Insulin Rapid-Acting',
      category: 'Diabetes',
      currentStock: 25,
      minimumStock: 30,
      maxStock: 100,
      unitPrice: 45.00,
      expiryDate: '2025-08-15',
      batchNumber: 'INS002',
      supplier: 'DiabetesCare Ltd',
      status: 'LOW_STOCK'
    },
    {
      id: '3',
      name: 'Paracetamol 500mg',
      category: 'Pain Relief',
      currentStock: 0,
      minimumStock: 100,
      maxStock: 1000,
      unitPrice: 0.15,
      expiryDate: '2025-10-20',
      batchNumber: 'PAR003',
      supplier: 'Generic Pharma',
      status: 'OUT_OF_STOCK'
    }
  ];

  reports: Report[] = [
    {
      id: '1',
      title: 'Daily Sales Report',
      type: 'DAILY',
      generatedBy: 'System',
      generatedDate: '2025-06-11',
      fileSize: '2.4 MB',
      status: 'FINAL'
    },
    {
      id: '2',
      title: 'Inventory Status Report',
      type: 'WEEKLY',
      generatedBy: 'Dr. Pharmacy',
      generatedDate: '2025-06-10',
      fileSize: '1.8 MB',
      status: 'FINAL'
    }
  ];

  payments: Payment[] = [
    {
      id: '1',
      patientName: 'John Smith',
      patientId: '#12345',
      amount: 25.50,
      paymentMethod: 'CARD',
      status: 'COMPLETED',
      transactionDate: '2025-06-11 14:30',
      items: ['Amoxicillin 500mg x14'],
      tax: 2.50
    },
    {
      id: '2',
      patientName: 'Maria Garcia',
      patientId: '#12346',
      amount: 180.00,
      paymentMethod: 'INSURANCE',
      status: 'PENDING',
      transactionDate: '2025-06-11 13:15',
      items: ['Insulin Rapid-Acting x4'],
      discount: 20.00,
      tax: 18.00
    }
  ];

  ngOnInit(): void {
    this.loadPharmacyData();
  }

  loadPharmacyData(): void {
    console.log('Loading pharmacy data...');
    this.updateStats();
    this.applyFilters();
  }

  private updateStats(): void {
    const pendingCount = this.recentPrescriptions.filter(p => p.status === 'PENDING').length;
    const urgentCount = this.recentPrescriptions.filter(p => p.status === 'URGENT').length;
    const labTestCount = this.labTests.filter(t => t.status === 'PENDING').length;
    const outOfStockCount = this.inventoryItems.filter(i => i.status === 'OUT_OF_STOCK').length;
    const reportsCount = this.reports.filter(r => r.status === 'FINAL').length;
    
    this.pharmacyStats = {
      pendingPrescriptions: pendingCount + urgentCount,
      labTestRequests: labTestCount,
      outOfStockItems: outOfStockCount,
      reportsUploaded: reportsCount
    };
  }

  setActiveTab(tab: TabType): void {
    this.activeTab = tab;
    this.searchTerm = '';
    this.selectedStatus = 'ALL';
    this.applyFilters();
    console.log('Active tab changed to:', tab);
  }

  processOrders(): void {
    console.log('Processing orders...');
  }

  openQuickChat(): void {
    console.log('Opening quick chat...');
  }
  addNewPrescription(): void {
    console.log('Adding new prescription...');
    this.selectedPrescription = null;
    this.modalType = 'prescription';
    this.modalMode = 'new';
    this.isModalVisible = true;
    console.log('Modal should be visible now:', this.isModalVisible);
  }

  updatePrescriptionStatus(prescriptionId: string, newStatus: Prescription['status']): void {
    const prescription = this.recentPrescriptions.find(p => p.id === prescriptionId);
    if (prescription) {
      prescription.status = newStatus;
      this.updateStats();
      this.applyFilters();
      console.log(`Prescription ${prescriptionId} status updated to ${newStatus}`);
    }
  }
  editPrescription(prescription: Prescription): void {
    console.log('Editing prescription:', prescription);
    console.log('Modal will open with editData:', prescription);
    this.selectedPrescription = prescription;
    this.modalType = 'prescription';
    this.modalMode = 'edit';
    this.isModalVisible = true;
    console.log('Modal state after edit:', {
      isModalVisible: this.isModalVisible,
      modalType: this.modalType,
      selectedPrescription: this.selectedPrescription
    });
  }
  viewPrescriptionDetails(prescription: Prescription): void {
    console.log('Viewing prescription details:', prescription);
    console.log('Modal will open with viewData:', prescription);
    this.selectedPrescription = prescription;
    this.modalType = 'prescription';
    this.modalMode = 'view';
    this.isModalVisible = true;
    console.log('Modal state after view:', {
      isModalVisible: this.isModalVisible,
      modalType: this.modalType,
      selectedPrescription: this.selectedPrescription
    });
  }
  closeModal(): void {
    console.log('closeModal() called in main component');
    this.isModalVisible = false;
    this.selectedPrescription = null;
    this.selectedLabTest = null;
    this.selectedInventoryItem = null;
  }

  onEditFromModal(item: any): void {
    console.log('Edit from modal:', item);
    this.closeModal();
  }
  onSaveFromModal(event: any): void {
    console.log('Save from modal:', event);
    
    switch (event.type) {
      case 'prescription':
        this.handlePrescriptionSave(event.data);
        break;
      case 'labtest':
        this.handleLabTestSave(event.data);
        break;
      case 'inventory':
        this.handleInventorySave(event.data);
        break;
    }
    
    this.updateStats();
    this.applyFilters();
  }

  private handlePrescriptionSave(prescription: Prescription): void {
    const existingIndex = this.recentPrescriptions.findIndex(p => p.id === prescription.id);
    
    if (existingIndex >= 0) {
      this.recentPrescriptions[existingIndex] = prescription;
      console.log('Updated prescription:', prescription);
    } else {
      this.recentPrescriptions.unshift(prescription);
      console.log('Added new prescription:', prescription);
    }
  }
  private handleLabTestSave(labTest: LabTest): void {
    const existingIndex = this.labTests.findIndex((l: LabTest) => l.id === labTest.id);
    
    if (existingIndex >= 0) {
      this.labTests[existingIndex] = labTest;
      console.log('Updated lab test:', labTest);
    } else {
      this.labTests.unshift(labTest);
      console.log('Added new lab test:', labTest);
    }
  }
  private handleInventorySave(inventory: InventoryItem): void {
    const existingIndex = this.inventoryItems.findIndex((i: InventoryItem) => i.id === inventory.id);
    
    if (existingIndex >= 0) {
      this.inventoryItems[existingIndex] = inventory;
      console.log('Updated inventory item:', inventory);
    } else {
      this.inventoryItems.unshift(inventory);
      console.log('Added new inventory item:', inventory);
    }
  }

  // Lab Test Methods
  addNewLabTest(): void {
    console.log('Adding new lab test...');
    this.selectedLabTest = null;
    this.modalType = 'labtest';
    this.modalMode = 'new';
    this.isModalVisible = true;
  }

  viewLabTestDetails(labTest: LabTest): void {
    console.log('Viewing lab test details:', labTest);
    this.selectedLabTest = labTest;
    this.modalType = 'labtest';
    this.modalMode = 'view';
    this.isModalVisible = true;
  }

  editLabTest(labTest: LabTest): void {
    console.log('Editing lab test:', labTest);
    this.selectedLabTest = labTest;
    this.modalType = 'labtest';
    this.modalMode = 'edit';
    this.isModalVisible = true;
  }

  startLabTest(testId: string): void {
    const test = this.labTests.find(t => t.id === testId);
    if (test && test.status === 'PENDING') {
      test.status = 'IN_PROGRESS';
      console.log(`Lab test ${testId} started`);
      this.updateStats();
      this.applyFilters();
    }
  }

  completeLabTest(testId: string): void {
    const test = this.labTests.find(t => t.id === testId);
    if (test && test.status === 'IN_PROGRESS') {
      test.status = 'COMPLETED';
      console.log(`Lab test ${testId} completed`);
      this.updateStats();
      this.applyFilters();
    }
  }
  // Inventory Methods
  addNewInventoryItem(): void {
    console.log('Adding new inventory item...');
    this.selectedInventoryItem = null;
    this.modalType = 'inventory';
    this.modalMode = 'new';
    this.isModalVisible = true;
  }

  viewInventoryItemDetails(item: InventoryItem): void {
    console.log('Viewing inventory item details:', item);
    this.selectedInventoryItem = item;
    this.modalType = 'inventory';
    this.modalMode = 'view';
    this.isModalVisible = true;
  }

  editInventoryItem(item: InventoryItem): void {
    console.log('Editing inventory item:', item);
    this.selectedInventoryItem = item;
    this.modalType = 'inventory';
    this.modalMode = 'edit';
    this.isModalVisible = true;
  }

  restockItem(itemId: string): void {
    const item = this.inventoryItems.find(i => i.id === itemId);
    if (item) {
      item.currentStock += 100;
      if (item.currentStock >= item.minimumStock) {
        item.status = 'IN_STOCK';
      }
      console.log(`Item ${itemId} restocked. New stock: ${item.currentStock}`);
      this.updateStats();
      this.applyFilters();
    }
  }
  // Reports Methods
  generateNewReport(): void {
    console.log('Generating new report...');
    const newReport: Report = {
      id: (this.reports.length + 1).toString(),
      title: `Report ${this.reports.length + 1}`,
      type: 'DAILY',
      generatedBy: 'Dr. Pharmacy',
      generatedDate: new Date().toISOString().split('T')[0],
      fileSize: '1.2 MB',
      status: 'FINAL'
    };
    this.reports.unshift(newReport);
    this.updateStats();
    this.applyFilters();
  }

  // Getter methods for template filters
  get monthlyReportsCount(): number {
    return this.reports.filter(r => r.type === 'MONTHLY').length;
  }

  get archivedReportsCount(): number {
    return this.reports.filter(r => r.status === 'ARCHIVED').length;
  }

  get completedPaymentsCount(): number {
    return this.payments.filter(p => p.status === 'COMPLETED').length;
  }

  get pendingPaymentsCount(): number {
    return this.payments.filter(p => p.status === 'PENDING').length;
  }

  viewReport(report: Report): void {
    console.log('Viewing report:', report);
    const reportDetails = `
Report Details:
═══════════════

Title: ${report.title}
Type: ${report.type}
Status: ${report.status}
Generated By: ${report.generatedBy}
Generated Date: ${report.generatedDate}
File Size: ${report.fileSize}

This is a sample report content for demonstration purposes.
    `;
    alert(reportDetails);
  }

  downloadReport(reportId: string): void {
    const report = this.reports.find(r => r.id === reportId);
    if (report) {
      console.log('Downloading report:', report.title);
      alert(`Report "${report.title}" downloaded successfully!`);
    }
  }

  // Payment Methods
  viewPaymentDetails(payment: Payment): void {
    console.log('Viewing payment details:', payment);
    const paymentDetails = `
Payment Details:
═══════════════

Patient: ${payment.patientName} (${payment.patientId})
Amount: $${payment.amount}
Payment Method: ${payment.paymentMethod}
Status: ${payment.status}
Transaction Date: ${payment.transactionDate}
Items: ${payment.items.join(', ')}
${payment.tax ? `Tax: $${payment.tax}` : ''}
${payment.discount ? `Discount: $${payment.discount}` : ''}
    `;
    alert(paymentDetails);
  }

  // Filter and Search Methods
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

  applyFilters(): void {
    switch (this.activeTab) {
      case 'prescriptions':
        this.filterPrescriptions();
        break;
      case 'lab-tests':
        this.filterLabTests();
        break;
      case 'inventory':
        this.filterInventory();
        break;
      case 'reports':
        this.filterReports();
        break;
      case 'payments':
        this.filterPayments();
        break;
    }
  }

  private filterPrescriptions(): void {
    let filtered = [...this.recentPrescriptions];

    if (this.searchTerm && this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(prescription =>
        prescription.patientName?.toLowerCase().includes(searchLower) ||
        prescription.medication?.toLowerCase().includes(searchLower) ||
        prescription.doctor?.toLowerCase().includes(searchLower) ||
        prescription.patientId?.includes(this.searchTerm)
      );
    }

    if (this.selectedStatus !== 'ALL') {
      filtered = filtered.filter(prescription => prescription.status === this.selectedStatus);
    }

    this.filteredPrescriptions = filtered;
  }

  private filterLabTests(): void {
    let filtered = [...this.labTests];

    if (this.searchTerm && this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(test =>
        test.patientName?.toLowerCase().includes(searchLower) ||
        test.testName?.toLowerCase().includes(searchLower) ||
        test.doctor?.toLowerCase().includes(searchLower) ||
        test.patientId?.includes(this.searchTerm)
      );
    }

    if (this.selectedStatus !== 'ALL') {
      filtered = filtered.filter(test => test.status === this.selectedStatus);
    }

    this.filteredLabTests = filtered;
  }

  private filterInventory(): void {
    let filtered = [...this.inventoryItems];

    if (this.searchTerm && this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(item =>
        item.name?.toLowerCase().includes(searchLower) ||
        item.category?.toLowerCase().includes(searchLower) ||
        item.batchNumber?.toLowerCase().includes(searchLower) ||
        item.supplier?.toLowerCase().includes(searchLower)
      );
    }

    if (this.selectedStatus !== 'ALL') {
      filtered = filtered.filter(item => item.status === this.selectedStatus);
    }

    this.filteredInventory = filtered;
  }

  private filterReports(): void {
    let filtered = [...this.reports];

    if (this.searchTerm && this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(report =>
        report.title?.toLowerCase().includes(searchLower) ||
        report.generatedBy?.toLowerCase().includes(searchLower) ||
        report.type?.toLowerCase().includes(searchLower)
      );
    }

    this.filteredReports = filtered;
  }

  private filterPayments(): void {
    let filtered = [...this.payments];

    if (this.searchTerm && this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(payment =>
        payment.patientName?.toLowerCase().includes(searchLower) ||
        payment.patientId?.includes(this.searchTerm) ||
        payment.paymentMethod?.toLowerCase().includes(searchLower)
      );
    }

    if (this.selectedStatus !== 'ALL') {
      filtered = filtered.filter(payment => payment.status === this.selectedStatus);
    }

    this.filteredPayments = filtered;
  }
}
