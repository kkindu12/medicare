import { User } from './User';

export interface PatientRecordWithUser {
  id?: string;
  visitDate: string;
  visitTime: string;
  condition: string;
  doctor: string;
  prescription: string;
  status: string;
  user?: User;
}
