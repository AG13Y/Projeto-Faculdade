import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { RouterLink } from "@angular/router";
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register-pag',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register-pag.html',
  styleUrl: './register-pag.scss',
})
export class RegisterPag {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  registerForm: FormGroup;
  registerError: string | null = null;

  constructor() {
    this.registerForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      tipo: ['freelancer', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      terms: [false, [Validators.requiredTrue]] 
    }, {
      validators: this.passwordMatcher
    });
  }

  passwordMatcher(control: AbstractControl): ValidationErrors | null {
    // ... (lógica do validador não muda)
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    if (password && confirmPassword && password !== confirmPassword) {
      return { mismatch: true };
    }
    return null;
  }

  submitRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.registerError = null;

    // ATUALIZAÇÃO: Usamos .subscribe() em vez de try...catch
    this.authService.register(this.registerForm.value).subscribe({
      next: (user) => {
        // Sucesso! O 'tap' no serviço já redirecionou.
        console.log('Registro bem-sucedido:', user.nome);
      },
      error: (err) => {
        // Erro!
        this.registerError = 'Ocorreu um erro ao registrar. Tente novamente.';
        console.error(err);
      }
    });
  }

}
