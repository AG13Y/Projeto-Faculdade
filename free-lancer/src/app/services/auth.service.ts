import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);

  // Signal para armazenar o usuário atual (ou null se não estiver logado)
  // Usamos 'as User | null' para tipar corretamente o signal
  currentUser = signal<User | null>(null);
  
  // Signal computado para saber se o usuário está logado
  isLoggedIn = computed(() => this.currentUser() !== null);

  constructor() {
    // Ao iniciar o serviço, verifica se há um usuário salvo no LocalStorage
    const storedUser = localStorage.getItem('freezy_user');
    if (storedUser) {
      this.currentUser.set(JSON.parse(storedUser));
    }
  }

  // Método de Login
  login(email: string, password: string) {
    // --- SIMULAÇÃO DE BACK-END ---
    // Em um app real, aqui você faria uma chamada HTTP (HttpClient)
    // Por enquanto, vamos apenas simular um usuário válido
    if (email && password) {
      const mockUser: User = {
        uid: '123-abc-xyz',
        email: email
      };

      // Salva no LocalStorage
      localStorage.setItem('freezy_user', JSON.stringify(mockUser));
      
      // Atualiza o signal
      this.currentUser.set(mockUser);
      
      // Redireciona para a página principal
      this.router.navigateByUrl('/next-login');
      
      return true;
    }
    return false;
  }

  // Método de Logout
  logout() {
    // Limpa o LocalStorage
    localStorage.removeItem('freezy_user');
    
    // Limpa o signal
    this.currentUser.set(null);
    
    // Redireciona para a página de login
    this.router.navigateByUrl('/sign-pag');
  }
  
  // Método de Registro (será usado no register-pag)
  register(email: string, password: string) {
    // Lógica de simulação de registro
    console.log('Registrando usuário:', email);
    // Em um app real, faria a chamada HTTP para criar o usuário
    // Por simplicidade, vamos apenas logar e redirecionar
    this.login(email, password); // Simula login automático após registro
  }
}