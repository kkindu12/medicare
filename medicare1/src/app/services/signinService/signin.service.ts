import { Injectable } from '@angular/core';
import { GetUserDTO, SigninUserResponse } from '../../emr/models/User';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SigninService {
  
  private apiUrl = environment.apiUrl; // Use environment variable

  constructor(private http: HttpClient) { }

  GetUser(user: GetUserDTO) {
        return this.http.post<SigninUserResponse>(`${this.apiUrl}/api/users/signin`, user);
  }
}
