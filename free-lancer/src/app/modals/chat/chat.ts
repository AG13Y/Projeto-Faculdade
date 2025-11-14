import { CommonModule } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { User } from '../../models/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { ChatService } from '../../services/chat.service';
import { ChatModel } from '../../models/chat.model';

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
export class Chat implements OnInit, OnDestroy, AfterViewChecked {
  // Acesso ao elemento do container de scroll
  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  // Injeções
  private chatService = inject(ChatService);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<Chat>);
  public data: ChatModalData = inject(MAT_DIALOG_DATA);

  // Propriedades
  public targetUser = this.data.targetUser;
  public currentUser = this.data.currentUser;
  public chat = signal<ChatModel | null>(null);
  public messageControl = new FormControl('', { nonNullable: true, validators: [Validators.required] });
  private chatSubscription: Subscription | null = null;
  private needsScroll = true;

  ngOnInit(): void {
    // 1. Encontra ou cria o chat
    this.chatService.getOrCreateChat(this.currentUser.id, this.targetUser.id).subscribe({
      next: (chat) => {
        // --- CORREÇÃO AQUI ---
        // 2. Definimos o signal IMEDIATAMENTE com o histórico inicial.
        this.chat.set(chat);
        
        // 3. O poll agora só busca ATUALIZAÇÕES (de 3 em 3 segundos)
        this.chatSubscription = this.chatService.pollChatMessages(chat.id).subscribe({
          next: (updatedChat) => {
            if (this.chat()?.messages.length !== updatedChat.messages.length) {
              this.needsScroll = true;
            }
            this.chat.set(updatedChat); // Atualiza com novas mensagens
          },
          error: (err) => this.showError('Erro ao buscar novas mensagens.')
        });
      },
      error: (err) => this.showError('Erro ao iniciar chat.')
    });
  }

  // Rola para o final após a view ser checada e se 'needsScroll' for true
  ngAfterViewChecked(): void {
    if (this.needsScroll) {
      this.scrollToBottom();
      this.needsScroll = false;
    }
  }

  // 3. Encerra a inscrição do "polling" ao fechar o modal
  ngOnDestroy(): void {
    this.chatSubscription?.unsubscribe();
  }

  sendMessage(): void {
    if (this.messageControl.invalid) return;

    const currentChat = this.chat();
    if (!currentChat) return;

    const messageText = this.messageControl.value;
    
    this.messageControl.disable();
    this.messageControl.reset();

    this.chatService.sendMessage(currentChat.id, messageText, this.currentUser.id).subscribe({
      next: (updatedChat) => {
        // Esta é a atualização "otimista" (mostra a msg enviada)
        this.chat.set(updatedChat); 
        this.needsScroll = true;
        this.messageControl.enable();
        // O poll vai pegar essa msg daqui 3s, mas não haverá "flicker"
        // pois o objeto será o mesmo.
      },
      error: (err) => {
        this.showError('Erro ao enviar mensagem.');
        this.messageControl.enable();
      }
    });
  }

  private scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Fechar', { duration: 3000 });
  }

  close(): void {
    this.dialogRef.close();
  }
}
