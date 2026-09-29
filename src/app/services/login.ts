import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { LoginRequest } from '../models/login-request';
import { LoginResponse } from '../models/login-response';

@Injectable({
  providedIn: 'root'
})
export class Login {

  private http = inject(HttpClient);

  private apiUrl = '/api/Auth/Login';

  login(request: LoginRequest): Observable<LoginResponse> {

    return this.http.post<LoginResponse>(this.apiUrl, request);

  }

}