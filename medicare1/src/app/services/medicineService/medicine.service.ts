import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Medicine } from '../../emr/models/Medicine';

@Injectable({
  providedIn: 'root'
})
export class MedicineService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getMedicines() {
    return this.http.get(`${this.apiUrl}/api/medicines`);
  }
}
