

// Define uma única mensagem
export interface Message {
  id: string;
  senderId: string | number; // ID do usuário que enviou
  text: string;
  timestamp: Date;
}

// Define a conversa (chat) entre dois usuários
export interface ChatModel {
  id: string;
  participantIds: (string | number)[]; 
  messages: Message[];
}