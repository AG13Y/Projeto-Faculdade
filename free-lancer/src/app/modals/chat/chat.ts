import { CommonModule } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { User } from '../../interface/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { ChatService } from '../../services/chat.service';
import { ChatModel, Message } from '../../interface/chat.model';

interface ChatModalData {
  targetUser: User;
  currentUser: User;
}

@Component({
  selector: 'app-chat',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
})
export class Chat {
  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  // Injeções
  private chatService = inject(ChatService);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<ChatModel>);
  public data: ChatModalData = inject(MAT_DIALOG_DATA);

  // Propriedades
  public targetUser = this.data.targetUser;
  public currentUser = this.data.currentUser;
  public chat = signal<ChatModel | null>(null);
  public messageControl = new FormControl('', { nonNullable: true, validators: [Validators.required] });
  
  // 2. Removemos 'chatSubscription' e 'needsScroll'
  
  ngOnInit(): void {
    // 3. O 'ngOnInit' agora SÓ busca o chat.
    this.chatService.getOrCreateChat(this.currentUser.id, this.targetUser.id).subscribe({
      next: (chat) => {
        this.chat.set(chat);
        // Não iniciamos mais o 'poll'
      },
      error: (err) => this.showError('Erro ao iniciar chat.')
    });
  }

  // 4. Usamos AfterViewInit para rolar para baixo UMA VEZ após o chat carregar
  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  /**
   * 5. O novo sendMessage (Pessimista)
   * Não há mais "atualização otimista".
   */
  sendMessage(): void {
    // Validação
    if (this.messageControl.invalid) return;
    const currentChat = this.chat();
    if (!currentChat) return;

    const messageText = this.messageControl.value.trim();
    if (!messageText) {
      this.messageControl.reset();
      return;
    }

    // A. Desabilita o formulário enquanto envia
    this.messageControl.disable();

    // B. Chama o serviço
    this.chatService.sendMessage(currentChat.id, messageText, this.currentUser.id).subscribe({
      next: (chatFromServer) => {
        // C. SUCESSO: O servidor salvou.
        //    Atualizamos o signal com o chat que o servidor retornou.
        this.chat.set(chatFromServer);
        
        // D. Limpa o form, reabilita e rola para baixo
        this.messageControl.reset();
        this.messageControl.enable();
        this.scrollToBottom(); // Rola para a nova mensagem
      },
      error: (err) => {
        // E. ERRO: Apenas mostramos o erro e reabilitamos o form.
        this.showError('Erro ao enviar mensagem.');
        this.messageControl.enable();
      }
    });
  }

  private scrollToBottom(): void {
    // Usamos um setTimeout para garantir que o DOM foi atualizado
    setTimeout(() => {
      try {
        this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
      } catch(err) { }
    }, 0);
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Fechar', { duration: 3000 });
  }

  close(): void {
    this.dialogRef.close();
  }
}
