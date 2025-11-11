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
  // Opcional: para feedback de erro
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

    // ATUALIZAÇÃO: Usamos .subscribe() em vez de try...catch
    this.authService.login(email, password).subscribe({
      next: (user) => {
        // Sucesso! O 'tap' no serviço já fez o redirecionamento.
        console.log('Login bem-sucedido:', user.nome);
      },
      error: (err) => {
        // Erro! (Ex: email ou senha inválidos do 'throwError')
        this.loginError = 'Email ou senha inválidos.';
        console.error(err);
      }
    });
  }
}
