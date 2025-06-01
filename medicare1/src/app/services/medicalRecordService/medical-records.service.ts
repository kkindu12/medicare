import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PatientRecordWithUser } from '../../emr/emr.component';
import { PatientRecord } from '../../emr/models/PatientRecord';
import { Report } from '../../emr/emr.component';
import { environment } from '../../../environments/environment';
import { PatientReportResponse } from '../../emr/models/PatientReportResponse';

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

  updatePatientRecord(id: string, patientRecord: PatientRecord) {
    return this.http.put(`${this.apiUrl}/api/patientRecords/${id}`, patientRecord);
  }

  getPatientRecordsById(id: string) {
    return this.http.get<PatientRecordWithUser[]>(`${this.apiUrl}/api/patients/getPatientRecords/${id}`);
  }

  getPatientReportsById(id: string) {
    return this.http.get<PatientRecordWithUser[]>(`${this.apiUrl}/api/patientRecords/getPatientReports/${id}`);
  }

  uploadMedicalRecordPDFs(patientRecordId: string, formData: FormData) {
    return this.http.post(`${this.apiUrl}/api/patientRecords/upload-to-dropbox/${patientRecordId}`, formData);
  }

  getMedicalRecordPDFs(patientRecordId: string) {
    return this.http.get<PatientReportResponse>(`${this.apiUrl}/api/patientRecords/getPatientReports/${patientRecordId}`);
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
