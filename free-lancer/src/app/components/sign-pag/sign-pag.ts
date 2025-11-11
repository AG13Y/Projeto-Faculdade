import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-pag',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './sign-pag.html',
  styleUrl: './sign-pag.scss',
})
export class SignPag {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  loginForm: FormGroup;
  
  loginError: string | null = null;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  submitLogin() {
    if (this.loginForm.invalid) {
      return;
    }
    this.loginError = null; 

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    this.authService.login(email, password).subscribe({
      next: (user) => {
        console.log('Login bem-sucedido:', user.nome);
      },
      error: (err) => {
        // --- CORREÇÃO AQUI ---
        // Agora pegamos a mensagem de erro específica vinda do serviço
        this.loginError = err.message; 
        console.error(err);
      }
    });
  }
}
