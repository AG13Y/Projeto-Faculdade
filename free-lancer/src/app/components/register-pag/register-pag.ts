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
  // 4. Injetar o FormBuilder e o AuthService
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  registerForm: FormGroup;

  constructor() {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      // Validador para o campo "confirmar senha"
      confirmPassword: ['', [Validators.required]],
      // Validador para o checkbox de termos
      terms: [false, [Validators.requiredTrue]] 
    }, {
      // 5. Adicionar um validador customizado ao FormGroup
      validators: this.passwordMatcher
    });
  }

  /**
   * Validador customizado para checar se os campos 'password' e 'confirmPassword' são iguais.
   */
  passwordMatcher(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    // Se as senhas não batem, retorna um erro 'mismatch'
    if (password && confirmPassword && password !== confirmPassword) {
      return { mismatch: true };
    }
    
    // Se tudo estiver OK, retorna null (sem erros)
    return null;
  }

  /**
   * Chamado ao submeter o formulário de registro
   */
  submitRegister() {
    if (this.registerForm.invalid) {
      console.error("Formulário de registro inválido");
      // Marca todos os campos como "tocados" para exibir os erros
      this.registerForm.markAllAsTouched();
      return;
    }

    const email = this.registerForm.value.email;
    const password = this.registerForm.value.password;

    try {
      // 6. Chamar o método de registro do nosso serviço
      // (Que, por enquanto, já faz o login e redireciona)
      this.authService.register(email, password);
    } catch (error) {
      console.error("Erro no registro:", error);
      // Aqui você poderia exibir um erro para o usuário (ex: "Email já cadastrado")
    }
  }

}
