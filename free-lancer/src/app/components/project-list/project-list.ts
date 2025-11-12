import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Project } from '../../models/project.model';
import { ProjectService } from '../../services/project.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProjectDetail } from '../../modals/project-detail/project-detail';
import { ProjectForm } from '../../modals/project-form/project-form';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DeleteProject } from '../../modals/delete-project/delete-project';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { ConfirmStatus } from '../../modals/confirm-status/confirm-status';


@Component({
  selector: 'app-project-list',
  imports: [
    CommonModule, 
    RouterModule, 
    MatDialogModule,
    MatSnackBarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule],
  templateUrl: './project-list.html',
  styleUrl: './project-list.scss',
})
export class ProjectList implements OnInit { // 5. Implementar 'OnInit'
  private projectService = inject(ProjectService);
  private dialog = inject(MatDialog);

  private snackBar = inject(MatSnackBar);

  // 6. Esta é a ÚNICA "fonte da verdade". É um signal gravável.
  public projects = signal<Project[]>([]);
  public projectStatusOptions: Project['status'][] = ['Aberto', 'Em Andamento', 'Concluído', 'Cancelado'];
  
  // 7. REMOVER a linha 'public projects = toSignal(...)'

  // 8. Usar ngOnInit para carregar os dados quando o componente iniciar
  ngOnInit(): void {
    this.loadProjects();
  }

  /**
   * Busca os projetos da API e define o valor do signal
   */
  loadProjects(): void {
    this.projectService.getProjects().subscribe(data => {
      this.projects.set(data); // Popula o signal com os dados da API
    });
  }

  getStatusClass(status: Project['status']): string {
    switch (status) {
      case 'Aberto':
        return 'text-green-700 bg-green-50 ring-green-600/20';
      case 'Em Andamento':
        return 'text-yellow-700 bg-yellow-50 ring-yellow-600/20';
      case 'Concluído':
        return 'text-blue-700 bg-blue-50 ring-blue-600/20';
      case 'Cancelado':
        return 'text-red-700 bg-red-50 ring-red-600/20';
      default:
        return 'text-gray-700 bg-gray-50 ring-gray-600/20';
    }
  }

  deleteProject(projectToDelete: Project, event: MouseEvent): void {
    event.stopPropagation(); 

    const dialogRef = this.dialog.open(DeleteProject, {
      width: '400px',
      data: {
        title: 'Confirmar Exclusão',
        message: `Tem certeza que deseja deletar o projeto "${projectToDelete.titulo}"?`,
        confirmButtonText: 'Confirmar Exclusão', // Texto específico
        confirmButtonColor: 'warn' // Cor vermelha
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.projectService.deleteProject(projectToDelete.id).subscribe({
          next: () => {
            this.projects.update(currentProjects => 
              currentProjects.filter(p => p.id !== projectToDelete.id)
            );
            this.snackBar.open('Projeto deletado com sucesso!', 'OK', { duration: 3000 });
          },
          error: (err) => {
            this.snackBar.open('Erro ao deletar projeto.', 'Fechar', { duration: 3000 });
          }
        });
      }
    });
  }

  // 5. Nova função para alterar o status
  changeProjectStatus(project: Project, newStatus: Project['status'], event: MouseEvent, trigger: MatMenuTrigger): void {
    
    event.stopPropagation(); 

    if (project.status === newStatus) {
      return;
    }

    // 1. Abrir o modal de confirmação
    const dialogRef = this.dialog.open(ConfirmStatus, {
      width: '450px',
      data: {
        title: 'Confirmar Mudança de Status',
        message: `Tem certeza que quer mudar o status de "${project.status}" para "${newStatus}"?`,
        confirmButtonText: 'Confirmar Mudança', // Texto específico
        confirmButtonColor: 'primary' // Cor azul (padrão)
      }
    });
    

    // 2. Ouvir a resposta
    dialogRef.afterClosed().subscribe(result => {
      // 3. Só continuar se o usuário confirmou (result === true)
      if (result === true) {
        const payload: Partial<Project> = { status: newStatus };

        this.projectService.updateProject(project.id, payload).subscribe({
          next: (updatedProject) => {
            this.projects.update(currentProjects => 
              currentProjects.map(p => p.id === updatedProject.id ? updatedProject : p)
            );
            this.snackBar.open('Status do projeto atualizado!', 'OK', { duration: 3000 });
          },
          error: (err) => {
            console.error('Erro ao atualizar status:', err);
            this.snackBar.open('Erro ao atualizar status.', 'Fechar', { duration: 3000 });
          }
        });
      }
      // Se for falso, não faz nada.
    });

    trigger.closeMenu();
  }

  /**
   * Abre o modal de detalhes
   */
  openProjectDetails(project: Project): void {
    this.dialog.open(ProjectDetail, { // Nome corrigido
      data: project, 
      width: '800px',
      maxWidth: '90vw',
    });
  }

  /**
   * Abre o modal de criação
   */
  openCreateModal(): void {
    const dialogRef = this.dialog.open(ProjectForm, {
      width: '800px',
      maxWidth: '90vw',
      data: null // Passa 'null' para o construtor do formulário
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Adiciona o novo projeto ao início da lista
        this.projects.update(currentProjects => [result, ...currentProjects]);
      }
    });
  }

  // NOVA FUNÇÃO: Para abrir o modal em modo de edição
  openEditModal(project: Project, event: MouseEvent): void {
    event.stopPropagation(); // Impede que o clique abra o modal de "detalhes"

    const dialogRef = this.dialog.open(ProjectForm, {
      width: '800px',
      maxWidth: '90vw',
      data: project // Passa o projeto existente para o construtor do formulário
    });

    dialogRef.afterClosed().subscribe(result => {
      // 'result' é o projeto ATUALIZADO
      if (result) {
        // Encontra o projeto na lista e o substitui
        this.projects.update(currentProjects => 
          currentProjects.map(p => p.id === result.id ? result : p)
        );
      }
    });
  }
}
