import { Injectable } from '@angular/core';
import { User } from '../../emr/models/User';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SignupService {
  
  private apiUrl = environment.apiUrl; // Use environment variable

  constructor(private http: HttpClient) { }

  addUser(user: User) {
      return this.http.post<User>(`${this.apiUrl}/api/users`, user);
  }
}
