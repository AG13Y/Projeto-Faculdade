export interface Proposal {
  id: string; // ID único da proposta
  projetoId: string; // ID do projeto ao qual se refere
  freelancerId: string; // ID do User (freelancer) que enviou
  
  mensagem: string; // A carta de apresentação do freelancer
  valorProposto: number; // O valor que o freelancer está cobrando
  prazoEstimadoDias: number; // Ex: 15 (dias)
  
  status: 'Pendente' | 'Aprovada' | 'Recusada';
  dataEnvio: Date;
}