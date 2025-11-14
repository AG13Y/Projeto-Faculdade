import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Project } from '../interface/project.model'; // Importa nossa interface

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/projects'; // Aponta para o db.json

  constructor() { }

  /**
   * READ: Busca todos os projetos
   */
  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl);
  }

  /**
   * READ: Busca um projeto pelo ID
   */
  getProjectById(id: string): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${id}`);
  }

  /**
   * CREATE: Adiciona um novo projeto
   * (Usaremos Omit<Project, 'id'> para que o formulário não precise enviar um ID)
   */
  addProject(projectData: Omit<Project, 'id'>): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, projectData);
  }

  /**
   * UPDATE: Atualiza um projeto existente
   */
  updateProject(id: string, projectData: Partial<Project>): Observable<Project> {
    return this.http.patch<Project>(`${this.apiUrl}/${id}`, projectData);
  }

  /**
   * DELETE: Remove um projeto
   */
  deleteProject(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}