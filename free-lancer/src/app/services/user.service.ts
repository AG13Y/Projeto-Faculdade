import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { User, UserWithPassword } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/users';

  constructor() { }

  /**
   * Busca todos os usuários da plataforma, mas remove a senha.
   */
  getUsers(): Observable<User[]> {
    return this.http.get<UserWithPassword[]>(this.apiUrl).pipe(
      // Mapeia a resposta para remover o campo 'password'
      map(users => 
        users.map(u => {
          const { password, ...user } = u; // Desestruturação para remover a senha
          return user; // Retorna o objeto User limpo
        })
      )
    );
  }
  
  updateUser(uid: string, data: Partial<User>): Observable<User> {
    // Usamos PATCH para atualizar apenas os campos enviados
    // A API fake (json-server) retorna o objeto completo atualizado
    return this.http.patch<User>(`${this.apiUrl}/${uid}`, data);
  }
  // (No futuro, podemos adicionar 'getUserById(id: string)' aqui)
}