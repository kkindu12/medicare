export interface Prescription {
  id?: string;
  patientName: string;
  medication: string;
  doctor: string;
  patientId: string;
  status: 'PENDING' | 'URGENT' | 'COMPLETED' | 'CANCELLED';
  time: string;
  date: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  notes?: string;
}

export interface PharmacyStats {
  pendingPrescriptions: number;
  labTestRequests: number;
  outOfStockItems: number;
  reportsUploaded: number;
}

export interface LabTest {
  id: string;
  testName: string;
  patientName: string;
  patientId: string;
  doctor: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  priority: 'NORMAL' | 'URGENT' | 'STAT';
  requestDate: string;
  expectedDate?: string;
  notes?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minimumStock: number;
  maxStock: number;
  unitPrice: number;
  expiryDate: string;
  batchNumber: string;
  supplier: string;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'EXPIRED';
}

export interface Report {
  id: string;
  title: string;
  type: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ANNUAL';
  generatedBy: string;
  generatedDate: string;
  fileSize: string;
  status: 'DRAFT' | 'FINAL' | 'ARCHIVED';
}

export interface Payment {
  id: string;
  patientName: string;
  patientId: string;
  amount: number;
  paymentMethod: 'CASH' | 'CARD' | 'INSURANCE' | 'ONLINE';
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  transactionDate: string;
  items: string[];
  discount?: number;
  tax?: number;
}
