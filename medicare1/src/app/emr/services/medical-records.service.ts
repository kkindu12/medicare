import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PatientRecord } from '../models/PatientRecord';

@Injectable({ providedIn: 'root' })
export class MedicalRecordsService {
  private apiUrl = 'http://localhost:8000'; // FastAPI URL

  constructor(private http: HttpClient) {}

  getPatientRecords() {
    return this.http.get(`${this.apiUrl}/patients`);
  }

  addPatientRecord(PatientRecord: PatientRecord) {
    return this.http.post(`${this.apiUrl}/patients`, PatientRecord);
  }

  updatePatientRecord(id: number, patientRecord: PatientRecord) {
    return this.http.put(`${this.apiUrl}/patients/${id}`, patientRecord);
  }

  getPatientReportsById(id: string) {
    return this.http.get<string[]>(`${this.apiUrl}/api/patients/getPatientRecords/${id}`);
  }
  
}
