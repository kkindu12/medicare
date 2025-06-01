import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PatientRecord } from '../../emr/models/PatientRecord';
import { Report } from '../../emr/emr.component';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MedicalRecordsService {
  private apiUrl = environment.apiUrl; // Use environment variable

  constructor(private http: HttpClient) {}

  getPatientRecords() {
    return this.http.get(`${this.apiUrl}/api/patientRecords`);
  }

  addPatientRecord(PatientRecord: PatientRecord) {
    return this.http.post(`${this.apiUrl}/api/patientRecords`, PatientRecord);
  }

  updatePatientRecord(id: number, patientRecord: PatientRecord) {
    return this.http.put(`${this.apiUrl}/api/patients/${id}`, patientRecord);
  }

  getPatientReportsById(id: string) {
    return this.http.get<string[]>(`${this.apiUrl}/api/patients/getPatientRecords/${id}`);
  }

  uploadMedicalRecordPDFs(formData: FormData) {
    return this.http.post(`${this.apiUrl}/api/patients/upload-to-dropbox`, formData);
  }

  addPatientRecordById(id: string, formData : FormData) {
    return this.http.post<Report>(`${this.apiUrl}/api/patients/${id}/reports`, formData);
  }

  getPatientRecordByIdAndFileId(id: string, fileId: string) {
    return this.http.get(`${this.apiUrl}/api/patients/${id}/reports/${fileId}`, {
      responseType: 'blob'
    });
  }

  deleteReportByIdAndFileId(id: string, fileId: string) {
    return this.http.delete(`${this.apiUrl}/api/patients/${id}/reports/${fileId}`)
  }
  
}
