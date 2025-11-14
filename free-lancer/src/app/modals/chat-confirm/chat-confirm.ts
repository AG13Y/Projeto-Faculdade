import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../interface/user.model';
import { Chat } from '../chat/chat';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-chat-confirm',
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './chat-confirm.html',
  styleUrl: './chat-confirm.scss',
})
export class ChatConfirm {
  public user = inject<User>(MAT_DIALOG_DATA);
  public freelancer = inject<User>(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<ChatConfirm>);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);

  public currentUser = this.authService.currentUser();

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

  close(): void {
    this.dialogRef.close();
  }

}
