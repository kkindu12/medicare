import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import type { User } from '../../emr/models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getPatientUsers() {
    return this.http.get<User[]>(`${this.apiUrl}/api/users/patients`);
  }
}
