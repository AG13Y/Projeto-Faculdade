import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { User } from '../../interface/user.model';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './profile-form.html',
  styleUrl: './profile-form.scss',
})
export class ProfileForm {
  
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private dialogRef = inject(MatDialogRef<ProfileForm>);
  private snackBar = inject(MatSnackBar);

  public profileForm!: FormGroup;
  // Pegamos o usuário logado. O '!' garante que ele existe (o modal só abre se logado)
  public user = this.authService.currentUser()!;

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      // Campos Comuns
      nome: [this.user.nome, [Validators.required, Validators.minLength(3)]],
      fotoUrl: [this.user.fotoUrl || null],
      bio: [this.user.bio || ''],
      localizacao: [this.user.localizacao || ''],

      // Campos de Freelancer
      habilidades: [(this.user.habilidades || []).join(', ')],
      precoHora: [this.user.precoHora || null],

      // Campos de Empresa
      nomeEmpresa: [this.user.nomeEmpresa || ''],
      cnpj: [this.user.cnpj || ''],
      website: [this.user.website || '']
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const formValues = this.profileForm.value;
    const dataToUpdate: Partial<User> = {
      ...formValues,
      habilidades: formValues.habilidades?.split(',').map((h: string) => h.trim()) || []
    };

    // 1. CORREÇÃO FINAL AQUI:
    // Trocamos 'this.user.uid' por 'this.user.id'
    this.userService.updateUser(this.user.id!, dataToUpdate).subscribe({
      next: (updatedUser) => {
        // Esta lógica de sucesso está correta
        this.authService.updateCurrentUser(updatedUser);
        this.snackBar.open('Perfil atualizado com sucesso!', 'OK', { duration: 3000 });
        this.dialogRef.close(true); 
      },
      error: (err) => {
        // Esta lógica de erro está correta
        console.error('Erro ao atualizar perfil:', err);
        this.snackBar.open('Erro ao atualizar perfil.', 'Fechar', { duration: 3000 });
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }

}
