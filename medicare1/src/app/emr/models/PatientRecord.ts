export interface PatientRecord {
  _id?: string; // Optional if you're generating it server-side
  patientName: string;
  condition: string;
  doctor: string;
  lastVisit: string; // ISO date string (e.g., "2025-05-25")
  lastVisitTime: string; // e.g., "13:42"
  status: string;
  prescription: string;
  reports: any[]; // Can be replaced with a specific type if reports have a defined structure
  previousRecords: any[];
  patientId: string // Same as above
}
