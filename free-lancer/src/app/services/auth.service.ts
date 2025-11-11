import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User, UserWithPassword } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap, catchError, throwError } from 'rxjs';

type RegisterData = Pick<User, 'email' | 'nome' | 'tipo' | 'fotoUrl'> & { password: string };

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  // 2. Injetar o HttpClient
  private http = inject(HttpClient);
  // 3. Definir a URL base da nossa API fake
  private apiUrl = 'http://localhost:3000';

  currentUser = signal<User | null>(null);
  isLoggedIn = computed(() => this.currentUser() !== null);

  constructor() {
    const storedUser = localStorage.getItem('freezy_user');
    if (storedUser) {
      this.currentUser.set(JSON.parse(storedUser));
    }
  }

  // --- LOGIN CORRIGIDO ---
  login(email: string, password: string): Observable<User> {
    
    // 1. Buscamos APENAS pelo email
    return this.http.get<UserWithPassword[]>(`${this.apiUrl}/users?email=${email}`).pipe(
      map(users => {
        // 2. Verificamos se o email foi encontrado
        if (users.length === 0) {
          throw new Error('Email não encontrado.'); // Erro específico
        }

        const userWithPassword = users[0];

        // 3. Verificamos se a senha bate
        if (userWithPassword.password !== password) {
          throw new Error('Senha incorreta.'); // Erro específico
        }
        
        // 4. Se tudo deu certo, removemos a senha do objeto
        const { password: pw, ...userFound } = userWithPassword;
        
        return userFound; 
      }),
      tap(user => {
        // 5. Sucesso! Salva no signal, localStorage e redireciona
        this.currentUser.set(user);
        localStorage.setItem('freezy_user', JSON.stringify(user));
        this.router.navigateByUrl('/next-login');
      }),
      catchError(error => {
        // 6. Propaga o erro (seja "Email não encontrado" ou "Senha incorreta")
        console.error(error.message);
        return throwError(() => error); 
      })
    );
  }

  // --- REGISTRO CORRIGIDO ---
 register(data: RegisterData): Observable<User> {
    const uid = `uid_${Math.random().toString(36).substring(2, 9)}`;

    // 2. Criamos o payload da API
    const newUserApiPayload = {
      ...data, // email, nome, tipo, password, e agora fotoUrl
      uid: uid,
      // Se a fotoUrl não foi enviada (é null), usamos o ícone padrão
      fotoUrl: data.fotoUrl || 'icon-user.png' //
    };

    return this.http.post<UserWithPassword>(`${this.apiUrl}/users`, newUserApiPayload).pipe(
      map(createdUser => {
        const { password, ...userToStore } = createdUser;
        return userToStore;
      }),
      tap(userToStore => {
        localStorage.setItem('freezy_user', JSON.stringify(userToStore));
        this.currentUser.set(userToStore);
        this.router.navigateByUrl('/next-login');
      }),
      catchError(error => {
        console.error("Erro ao registrar na API:", error);
        return throwError(() => error);
      })
    );
  }

  // --- LOGOUT (NÃO MUDA) ---
  logout() {
    localStorage.removeItem('freezy_user');
    this.currentUser.set(null);
    this.router.navigateByUrl('/sign-pag');
  }
}