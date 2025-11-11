export interface User {
  // Dados de Autenticação e Comuns
  uid: string; // ID único (vindo do Firebase Auth, por exemplo)
  email: string;
  nome: string;
  tipo: 'freelancer' | 'empresa'; // Define o papel do usuário
  
  // Dados de Perfil
  fotoUrl?: string; // URL da foto de perfil ou logo
  bio?: string; // Pequena biografia ou "sobre" da empresa
  localizacao?: string; // Ex: "São Paulo, SP"

  // Campos Específicos de Freelancer
  habilidades?: string[]; // Ex: ['Angular', 'TypeScript', 'Design UI/UX']
  precoHora?: number;

  // Campos Específicos de Empresa
  nomeEmpresa?: string;
  cnpj?: string; // Mencionado nos termos
  website?: string;
}

// ===================================================================
// ADICIONE ESTA NOVA INTERFACE ABAIXO
// ===================================================================
/**
 * Esta interface representa o que o db.json retorna.
 * NUNCA devemos usar esta interface dentro do nosso app,
 * apenas no serviço de autenticação para 'limpar' a senha.
 */
export interface UserWithPassword extends User {
  password: string;
}