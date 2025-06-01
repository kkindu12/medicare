import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import type { Patient } from '../../emr/models';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private apiUrl = environment.apiUrl; // Use environment variable

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

