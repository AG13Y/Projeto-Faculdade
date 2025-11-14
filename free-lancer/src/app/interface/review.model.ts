export interface Review {
  id: string;
  projectId: string; // O projeto que está sendo avaliado
  
  // Quem escreveu a avaliação
  reviewerId: string | number; 
  reviewerType: 'empresa' | 'freelancer';

  // Quem está sendo avaliado
  revieweeId: string | number; 
  revieweeType: 'empresa' | 'freelancer';

  rating: number; // Nota de 1 a 5
  comment: string; // O feedback em texto
  timestamp: string;
}