import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Project } from '../../models/project.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProjectService } from '../../services/project.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProjectDetail } from '../../modals/project-detail/project-detail';
import { ProjectForm } from '../../modals/project-form/project-form';


@Component({
  selector: 'app-project-list',
  imports: [CommonModule, RouterModule, MatDialogModule],
  templateUrl: './project-list.html',
  styleUrl: './project-list.scss',
})
export class ProjectList implements OnInit { // 5. Implementar 'OnInit'
  private projectService = inject(ProjectService);
  private dialog = inject(MatDialog);

  // 6. Esta é a ÚNICA "fonte da verdade". É um signal gravável.
  public projects = signal<Project[]>([]);
  
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
    const dialogRef = this.dialog.open(ProjectForm, { // Nome corrigido
      width: '800px',
      maxWidth: '90vw',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // 9. ATUALIZA o signal 'projects' (o mesmo que a API populou)
        this.projects.update(currentProjects => [result, ...currentProjects]);
      }
    });
  }
}
