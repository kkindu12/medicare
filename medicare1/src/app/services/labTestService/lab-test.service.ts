import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { LabTest } from '../../emr/models/LabTest';

@Injectable({
  providedIn: 'root'
})
export class LabTestService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getLabTests() {
    return this.http.get(`${this.apiUrl}/api/labTests`);
  }
}
