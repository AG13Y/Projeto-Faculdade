import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Project } from '../../models/project.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-project-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './project-list.html',
  styleUrl: './project-list.scss',
})
export class ProjectList {
  private projectService = inject(ProjectService);

  // 2. Usamos 'toSignal' para converter o Observable de projetos em um signal
  // O 'initialValue: []' garante que 'projects' nunca seja indefinido
  public projects = toSignal(this.projectService.getProjects(), { initialValue: [] as Project[] });

  constructor() {
    // O 'toSignal' já cuida da inscrição (subscribe) e cancelamento (unsubscribe)
  }
}
