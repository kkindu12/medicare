import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Patient } from '../../emr/emr.component';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private apiUrl = 'http://localhost:8000'; // FastAPI URL

  constructor(private http: HttpClient) {}

  getPatients() {
    return this.http.get<Patient[]>(`${this.apiUrl}/api/patients`);
  }

  getPatientById(id: number) {
    return this.http.get<Patient>(`${this.apiUrl}/api/patients/${id}`);
  }

  updatePatient(id: string, patient: Patient) {
    return this.http.put<Patient>(`${this.apiUrl}/api/patients/${id}`, patient);
  }

  addPatient(patient: Patient) {
    return this.http.post<Patient>(`${this.apiUrl}/api/patients`, patient);
  }

  getPatientRecordNames(id: string) {
    return this.http.get<string[]>(`${this.apiUrl}/api/patients/getPatientRecords/${id}`);
  }
}

