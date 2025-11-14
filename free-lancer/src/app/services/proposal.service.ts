import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Proposal } from '../interface/proposal.model'; // Importa a interface

@Injectable({
  providedIn: 'root'
})
export class ProposalService {
  private http = inject(HttpClient);
  // Aponta para o array 'proposals' no db.json
  private apiUrl = 'http://localhost:3000/proposals'; 



  /**
   * CREATE: Adiciona uma nova proposta
   * (Usaremos Omit<Proposal, 'id'> para que o formulário não precise enviar um ID)
   */
  addProposal(proposalData: Omit<Proposal, 'id'>): Observable<Proposal> {
    return this.http.post<Proposal>(this.apiUrl, proposalData);
  }

  /**
   * READ: Busca todas as propostas de um projeto específico
   */
 getProposalsForProject(projectId: string | number): Observable<Proposal[]> {
    return this.http.get<Proposal[]>(`${this.apiUrl}?projetoId=${projectId}`);
  }
  // (No futuro, podemos adicionar 'updateProposal' ou 'deleteProposal')

  updateProposal(id: string | number, data: Partial<Proposal>): Observable<Proposal> {
    return this.http.patch<Proposal>(`${this.apiUrl}/${id}`, data);
  }
}