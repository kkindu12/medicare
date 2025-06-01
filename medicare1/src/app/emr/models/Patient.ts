import { Report } from './Report';
import { PatientRecordWithUser } from './PatientRecordWithUser';

export interface Patient {
  id: string;
  patientName: string;
  condition: string;
  doctor: string;
  visitDate: string;
  visitTime: string;
  status: string;
  prescription: string;
  reports: Report[];
  previousRecords: PatientRecordWithUser[];
}
