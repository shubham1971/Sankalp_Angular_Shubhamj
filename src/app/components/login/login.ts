import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Login as LoginService } from '../../services/login';
import { CryptoService } from '../../services/crypto.service';
import { LoginRequest } from '../../models/login-request';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
  
})
export class Login {
  private loginService = inject(LoginService);
  private cryptoService = inject(CryptoService);
  private router = inject(Router);
  captchaText = '';

  ngOnInit() {
  this.generateCaptcha();
}

generateCaptcha() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

  this.captchaText = '';

  for (let i = 0; i < 6; i++) {
    this.captchaText += chars.charAt(
      Math.floor(Math.random() * chars.length)
    );
  }
}

  loginForm = new FormGroup({
    userId: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    captcha: new FormControl('', Validators.required),
    rememberMe: new FormControl(false)
  });

  login() {debugger
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    try {
      // 1. Generate client AES key
      const clientAES = this.cryptoService.generateAESKey();
      if (!clientAES) 
        {
          alert('Unable to generate client AES key.');
          return;
        }

        console.log('Generated clientAES:', clientAES);

      localStorage.setItem("clientAES", clientAES);

      // 2. RSA Encrypt the client AES key
      const clientKey = this.cryptoService.encryptRSA(clientAES);

      localStorage.setItem("clientKey", clientKey);
      console.log('Encrypted clientKey:', clientKey);

      // 3. AES Encrypt the credentials
      const encUser = this.cryptoService.encryptAES(this.loginForm.value.userId!, clientAES);
      const encPwd = this.cryptoService.encryptAES(this.loginForm.value.password!, clientAES);

      // 4. Create request object
      const request: LoginRequest = {
        clientKey: clientKey,
        userID: encUser,
        password: encPwd
      };

      // 5. Call API
      this.loginService.login(request).subscribe({
        next: (response) => {debugger
          if (response.status) {
            // Save Auth Token (backend returns it as clientToken)
            localStorage.setItem("token", response.clientToken || '');

            // Decrypt Response Data
            if (response.data) {
              const UserID = this.cryptoService.decryptAES(response.data.userID || '', clientAES);
              const UserName = this.cryptoService.decryptAES(response.data.username || '', clientAES);
              const role = this.cryptoService.decryptAES(response.data.userRole || '', clientAES);             
              const Mobile = this.cryptoService.decryptAES(response.data.mobile || '', clientAES);

              localStorage.setItem("UserId", UserID);
              localStorage.setItem("UserName", UserName);
              localStorage.setItem("Role", role);
              localStorage.setItem("Mobile", Mobile);              
            }

            this.router.navigate(['/dashboard']);
          } else {
            alert(response.message || 'Login failed.');
          }
        },
        error: (error) => {
          console.error(error);
          alert('An error occurred during login. Please try again.');
        }
      });
    } catch (e: any) {
      console.error(e);
      alert(e.message || 'Encryption failed.');
    }
  }
}
