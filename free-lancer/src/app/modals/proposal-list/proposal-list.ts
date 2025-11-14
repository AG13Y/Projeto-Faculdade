import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap, of, forkJoin, map, firstValueFrom } from 'rxjs';
import { Project } from '../../interface/project.model';
import { Proposal } from '../../interface/proposal.model';
import { User } from '../../interface/user.model';
import { ProposalService } from '../../services/proposal.service';
import { UserService } from '../../services/user.service';
import { ProjectService } from '../../services/project.service';
import { MatChipsModule } from '@angular/material/chips';

export interface EnrichedProposal {
  proposal: Proposal;
  freelancer: User;
}

@Component({
  selector: 'app-proposal-list',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
  ],
  templateUrl: './proposal-list.html',
  styleUrl: './proposal-list.scss',
})
export class ProposalList {
  private proposalService = inject(ProposalService);
  private userService = inject(UserService);
  private dialogRef = inject(MatDialogRef<ProposalList>);
  private snackBar = inject(MatSnackBar);
  private projectService = inject(ProjectService);

  public project = inject<Project>(MAT_DIALOG_DATA);
  
  public proposals = signal<EnrichedProposal[]>([]);
  public isLoading = signal(true);

  constructor() {
    // 3. Chamamos a nova função async
    this.loadProposals();
  }

  /**
   * LÓGICA SIMPLIFICADA COM ASYNC/AWAIT
   */
  async loadProposals(): Promise<void> {
    try {
      this.isLoading.set(true);

      // 1. Busca as propostas e ESPERA (await) pela resposta
      const proposals = await firstValueFrom(
        this.proposalService.getProposalsForProject(this.project.id)
      );

      if (proposals.length === 0) {
        this.isLoading.set(false);
        return; // Sai da função se não houver propostas
      }

      // 2. Cria um array temporário
      const enrichedProposals: EnrichedProposal[] = [];

      // 3. Faz um loop por cada proposta
      for (const proposal of proposals) {
        // 4. Busca o freelancer daquela proposta e ESPERA (await)
        const freelancer = await firstValueFrom(
          this.userService.getUserById(proposal.freelancerId)
        );
        
        // 5. Adiciona a proposta + freelancer no array
        enrichedProposals.push({ proposal, freelancer });
      }

      // 6. Seta o signal DE UMA VEZ SÓ com todos os dados
      this.proposals.set(enrichedProposals);

    } catch (err) {
      console.error('Erro ao buscar propostas ou usuários:', err);
      this.snackBar.open('Erro ao carregar propostas.', 'Fechar', { duration: 3000 });
    } finally {
      // 7. Garante que o loading termine, mesmo se der erro
      this.isLoading.set(false);
    }
  }

  // (O resto do arquivo 'acceptProposal' e 'close' não muda)
  acceptProposal(item: EnrichedProposal): void {
    
    // 1. Atualizar o Projeto (mudar status, adicionar freelancerId)
    const projectUpdate$ = this.projectService.updateProject(this.project.id, {
      status: 'Em Andamento',
      freelancerId: item.freelancer.id
    });

    // 2. Atualizar a Proposta (mudar status)
    const proposalUpdate$ = this.proposalService.updateProposal(item.proposal.id, {
      status: 'Aprovada'
    });

    // 3. Executar as duas chamadas em paralelo
    forkJoin([projectUpdate$, proposalUpdate$]).subscribe({
      next: ([updatedProject, updatedProposal]) => {
        // Sucesso!
        this.snackBar.open(`Proposta de ${item.freelancer.nome} aceita!`, 'OK', { duration: 3000 });
        
        // 4. Fecha o modal e RETORNA os dados atualizados
        this.dialogRef.close({ 
          updatedProject: updatedProject,
          freelancer: item.freelancer 
        });
      },
      error: (err) => {
        console.error('Erro ao aceitar proposta:', err);
        this.snackBar.open('Erro ao aceitar proposta.', 'Fechar', { duration: 3000 });
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
