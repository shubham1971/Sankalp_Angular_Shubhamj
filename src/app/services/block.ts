import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CryptoService } from './crypto.service';

@Injectable({
  providedIn: 'root'
})
export class BlockService {

  private http = inject(HttpClient);
  private cryptoService = inject(CryptoService);
  private apiUrl = '/api/Master/GetBlockList';

  getBlockList(distCode: string) {

     const clientAES = localStorage.getItem('clientAES') || '';
     if (!clientAES) {
      throw new Error('Client AES key not found.');
    }

    // RSA encrypt the AES key
    const clientKey =  this.cryptoService.encryptRSA(clientAES);
    // Send RSA encrypted AES key and district code
    const request = {
      clientKey: clientKey,
      distCode: distCode
    };

    return this.http.post<any>(this.apiUrl, request);   

  }

}