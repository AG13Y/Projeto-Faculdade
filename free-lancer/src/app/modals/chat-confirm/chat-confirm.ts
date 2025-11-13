import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-chat-confirm',
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './chat-confirm.html',
  styleUrl: './chat-confirm.scss',
})
export class ChatConfirm {
  public freelancer = inject<User>(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<ChatConfirm>);

  startChat(): void {
    // Lógica futura para iniciar o chat
    console.log(`Iniciando chat com ${this.freelancer.nome}`);
    this.dialogRef.close();
  }

  close(): void {
    this.dialogRef.close();
  }

}
