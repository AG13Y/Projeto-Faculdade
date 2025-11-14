import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../interface/user.model';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService } from '../../services/auth.service';
import { Chat } from '../chat/chat';

@Component({
  selector: 'app-user-detail',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './user-detail.html',
  styleUrl: './user-detail.scss',
})
export class UserDetail {
  public user = inject<User>(MAT_DIALOG_DATA);
  
  // 2. Injeta a referência do modal para podermos fechá-lo
  private dialogRef = inject(MatDialogRef<UserDetail>);

  private dialog = inject(MatDialog); // 4. Injetar o serviço de diálogo
  private authService = inject(AuthService);

  constructor() {
    // Log para confirmar que recebemos o usuário correto
    console.log('Usuário recebido no modal:', this.user);
  }

  // Propriedades
  public currentUser = this.authService.currentUser();
  
  // 6. Signal para saber se estamos vendo nosso próprio perfil
  public isOwnProfile = signal(this.currentUser?.id === this.user.id);
  /**
   * Função simples para fechar o modal
   */
  close(): void {
    this.dialogRef.close();
  }

  startChat(): void {
    if (!this.currentUser) return; // Checagem de segurança

    // Abre o novo modal de chat
    this.dialog.open(Chat, {
      width: '500px',
      maxWidth: '90vw',
      data: {
        targetUser: this.user,
        currentUser: this.currentUser
      }
    });

    // Fecha o modal de detalhes do usuário
    this.close();
  }
  /**
   * Helper para exibir a foto correta ou um placeholder
   */
  get userPhoto(): string {
    if (this.user?.fotoUrl) {
      return this.user.fotoUrl;
    }
    // Retorna ícones padrão que você já tem
    return this.user?.tipo === 'empresa'
      ? 'assets/icon-company.png'
      : 'assets/icon-user.png';
  }
}
