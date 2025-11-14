export interface User {
  // MUDANÇA AQUI
  id: string | number; // Trocamos 'uid' por 'id'
  
  email: string;
  nome: string;
  tipo: 'freelancer' | 'empresa';
  
  // ... (resto da interface não muda)
  fotoUrl?: string;
  bio?: string;
  localizacao?: string;
  habilidades?: string[];
  precoHora?: number;
  nomeEmpresa?: string;
  cnpj?: string;
  website?: string;
}

export interface UserWithPassword extends User {
  password: string;
}