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
  
  // Nova propriedade para feedback de erro
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
    this.loginError = null; // Limpa erros antigos

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    // --- CORREÇÃO AQUI ---
    // Trocamos o try...catch por .subscribe()
    this.authService.login(email, password).subscribe({
      next: (user) => {
        // Sucesso! O 'tap' no serviço já fez o redirecionamento.
        console.log('Login bem-sucedido:', user.nome);
      },
      error: (err) => {
        // Erro! (Ex: "Email ou senha inválidos" vindo do serviço)
        this.loginError = 'Email ou senha inválidos.';
        console.error(err);
      }
    });
  }
}
