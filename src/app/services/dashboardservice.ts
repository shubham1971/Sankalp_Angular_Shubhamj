import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CryptoService } from './crypto.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private http = inject(HttpClient);
  private cryptoService = inject(CryptoService);

  private apiUrl ='https://localhost:7279/api/Dashboard/Summary';

  getSummary(): Observable<any> {

    // Get the AES key generated during login
    const clientAES = localStorage.getItem('clientAES') || '';

    if (!clientAES) {
      throw new Error('Client AES key not found.');
    }

    // RSA encrypt the AES key
    const clientKey =  this.cryptoService.encryptRSA(clientAES);

    // Send RSA encrypted AES key
    const request = {
      clientKey: clientKey
    };

    return this.http.post<any>(this.apiUrl, request);
  }
}