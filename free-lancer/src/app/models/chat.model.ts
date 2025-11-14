// Define uma única mensagem
export interface Message {
  id: string;
  senderId: string | number; // ID do usuário que enviou
  text: string;
  timestamp: string | Date;
}

// Define a conversa (chat) entre dois usuários
export interface ChatModel {
  id: string;
  // IDs dos dois usuários na conversa
  participantIds: (string | number)[]; 
  // Coleção de mensagens aninhadas
  messages: Message[];
}