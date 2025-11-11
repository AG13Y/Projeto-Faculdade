export interface Review {
  id: string;
  projetoId: string; // Projeto que originou esta avaliação
  
  autorId: string; // ID do User que escreveu (ex: empresa)
  destinatarioId: string; // ID do User que foi avaliado (ex: freelancer)
  
  rating: number; // Nota de 1 a 5
  comentario: string;
  data: Date;
}