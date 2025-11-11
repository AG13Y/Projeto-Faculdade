import { Component, inject, signal } from '@angular/core';
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

  // 2. Signal para o preview da imagem. Começa com a imagem padrão.
  imagePreview = signal<string | ArrayBuffer | null>('icon-user.png'); //

  constructor() {
    this.registerForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      tipo: ['freelancer', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      terms: [false, [Validators.requiredTrue]],
      // 3. Novo FormControl (invisível) para armazenar o DataURL da imagem
      fotoUrl: [null] 
    });
  }

  // 4. Nova função para lidar com a seleção do arquivo
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      const reader = new FileReader();
      reader.onload = () => {
        // 'reader.result' contém o DataURL (ex: "data:image/png;base64,...")
        const result = reader.result;
        this.imagePreview.set(result); // Atualiza o preview na tela
        this.registerForm.patchValue({ fotoUrl: result }); // Salva o DataURL no formulário
      };
      reader.readAsDataURL(file);
    }
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

    // 5. O 'registerForm.value' agora contém a 'fotoUrl' (DataURL)
    this.authService.register(this.registerForm.value).subscribe({
      next: (user) => {
        console.log('Registro bem-sucedido:', user.nome);
      },
      error: (err) => {
        this.registerError = 'Ocorreu um erro ao registrar. Tente novamente.';
        console.error(err);
      }
    });
  }

}
