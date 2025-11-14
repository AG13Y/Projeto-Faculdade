import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of, switchMap, map, timer } from 'rxjs';
import { ChatModel, Message } from '../models/chat.model';
import { Chat } from '../modals/chat/chat';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/chats';

  /**
   * Encontra um chat existente entre dois usuários ou cria um novo.
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
          return of(chat);
        } else {
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
   * Busca as mensagens mais recentes de um chat (usado para polling).
   */
  getChatMessages(chatId: string): Observable<ChatModel> {
    return this.http.get<ChatModel>(`${this.apiUrl}/${chatId}`);
  }

  /**
   * Cria um "poll" que busca mensagens a cada 3 segundos.
   */
  pollChatMessages(chatId: string): Observable<ChatModel> {
    // --- CORREÇÃO AQUI ---
    // Trocamos timer(0, 3000) por timer(3000, 3000)
    // O primeiro '3000' é o delay inicial antes de começar o poll.
    // O '0' estava causando a "race condition".
    return timer(3000, 3000).pipe( 
      switchMap(() => this.getChatMessages(chatId))
    );
  }

  /**
   * Envia uma nova mensagem.
   */
  sendMessage(chatId: string, messageText: string, senderId: string | number): Observable<ChatModel> {
    const newMessage: Message = {
      id: `msg_${Math.random().toString(36).substring(2, 9)}`,
      senderId: senderId,
      text: messageText,
      // usar ISO string para serializar corretamente no db/json-server
      timestamp: new Date().toISOString()
    };

    return this.http.get<ChatModel>(`${this.apiUrl}/${chatId}`).pipe(
      switchMap(chat => {
        const updatedMessages = [...(chat.messages || []), newMessage];
        // PATCH atualiza apenas o campo messages (mais seguro com json-server)
        return this.http.patch<ChatModel>(`${this.apiUrl}/${chatId}`, { messages: updatedMessages });
      })
    );
  }
}