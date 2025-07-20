import { User } from './User';

export interface MedicineDetails {
  medicineId: string;
  frequency: string;
  duration: string;
  pillsPerTime: number;
  numberOfPills: number;
}

export interface PatientRecordWithUser {
  id?: string;
  visitDate: string;
  visitTime: string;
  condition: string;
  doctor: string;
  prescription: string;
  status: string;
  labTest?: string[];
  medicine?: MedicineDetails[];  
  user?: User;
  doctorUser?: User;  // Doctor who issued this record
  isEdited?: boolean;
  editedBy?: string;  // Doctor ID who edited
  editedByName?: string;  // Doctor name who edited
  editedAt?: string;  // Timestamp of edit
}
