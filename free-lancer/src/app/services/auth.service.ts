import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User, UserWithPassword } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap, catchError, throwError } from 'rxjs';

type RegisterData = Pick<User, 'email' | 'nome' | 'tipo'> & { password: string };

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
    
    // 2. Usamos 'UserWithPassword[]' para a resposta do GET
    return this.http.get<UserWithPassword[]>(`${this.apiUrl}/users?email=${email}&password=${password}`).pipe(
      map(users => {
        if (users.length === 0) {
          throw new Error('Email ou senha inválidos.');
        }
        
        // 3. AGORA a desestruturação funciona, pois 'users[0]' é 'UserWithPassword'
        const { password, ...userFound } = users[0];
        
        // 'userFound' agora é do tipo 'User' (sem a senha)
        return userFound; 
      }),
      tap(user => {
        this.currentUser.set(user);
        localStorage.setItem('freezy_user', JSON.stringify(user));
        this.router.navigateByUrl('/next-login');
      }),
      catchError(error => {
        console.error(error.message);
        return throwError(() => error); 
      })
    );
  }

  // --- REGISTRO CORRIGIDO ---
  register(data: RegisterData): Observable<User> {
    const uid = `uid_${Math.random().toString(36).substring(2, 9)}`;

    const newUserApiPayload = {
      ...data,
      uid: uid,
      fotoUrl: 'icon-user.png'
    };

    // 4. Usamos 'UserWithPassword' para a resposta do POST
    return this.http.post<UserWithPassword>(`${this.apiUrl}/users`, newUserApiPayload).pipe(
      map(createdUser => {
        // 5. Também limpamos a senha da resposta do POST
        const { password, ...userToStore } = createdUser;
        return userToStore; // Retorna o usuário limpo
      }),
      tap(userToStore => {
        // 6. Salvamos o usuário limpo no signal e localStorage
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