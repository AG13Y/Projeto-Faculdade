export interface Project {
  id: string; // ID único do projeto
  titulo: string;
  descricao: string;
  
  // Vínculos
  empresaId: string; // ID do User (tipo 'empresa') que postou o projeto
  freelancerId?: string | null; // ID do User (tipo 'freelancer') que está executando
  
  // Metadados
  status: 'Aberto' | 'Em Andamento' | 'Concluído' | 'Cancelado';
  orcamento: number;
  dataPostagem: Date;
  prazoFinal?: Date;
  habilidadesNecessarias?: string[]; // Ajuda no "match" com freelancers
}