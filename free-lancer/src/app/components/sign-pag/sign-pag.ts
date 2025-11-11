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
  // Injetando dependências modernas
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  loginForm: FormGroup;

  constructor() {
    // Criando o formulário reativo
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  submitLogin() {
    if (this.loginForm.invalid) {
      console.error("Formulário inválido");
      // Você pode adicionar lógica para exibir erros na tela
      return;
    }

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    try {
      this.authService.login(email, password);
    } catch (error) {
      console.error("Erro no login:", error);
      // Exibir feedback de erro para o usuário (ex: "Email ou senha inválidos")
    }
  }

}
