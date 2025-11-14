import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of, switchMap, map} from 'rxjs';
import { ChatModel, Message } from '../interface/chat.model';
import { Chat } from '../modals/chat/chat';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/chats';
/**
   * 1. Encontra um chat existente ou cria um novo.
   * (Esta função está perfeita)
   */
  getOrCreateChat(userId1: string | number, userId2: string | number): Observable<ChatModel> {
    return this.http.get<ChatModel[]>(`${this.apiUrl}`).pipe(
      map(chats => 
        chats.find(c => 
          c.participantIds.includes(userId1) && c.participantIds.includes(userId2)
        )
      ),
      switchMap(chat => {
        if (chat) {
          // Se encontrou, retorna o chat
          return of(chat);
        } else {
          // Se não encontrou, cria um novo chat
          const newChat: Omit<ChatModel, 'id'> = {
            participantIds: [userId1, userId2],
            messages: []
          };
          return this.http.post<ChatModel>(this.apiUrl, newChat);
        }
      })
    );
  }

  /**
   * 2. Envia uma nova mensagem.
   * (Esta função também está ótima)
   */
  sendMessage(chatId: string, messageText: string, senderId: string | number): Observable<ChatModel> {
    
    // Busca o chat atual para adicionar a mensagem ao array
    return this.http.get<ChatModel>(`${this.apiUrl}/${chatId}`).pipe(
      switchMap(chat => {
        
        const newMessage: Message = {
          id: `msg_${Math.random().toString(36).substring(2, 9)}`,
          senderId: senderId,
          text: messageText,
          timestamp: new Date()
        };

        const updatedMessages = [...(chat.messages || []), newMessage];

        // Usamos PATCH para atualizar apenas o array de mensagens
        // e retornamos o chat completo que o servidor nos deu.
        return this.http.patch<ChatModel>(`${this.apiUrl}/${chatId}`, {
          messages: updatedMessages
        });
      })
    );
  }
}