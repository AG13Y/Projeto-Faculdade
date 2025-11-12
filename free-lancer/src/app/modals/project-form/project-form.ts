import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Project } from '../../models/project.model';
import { AuthService } from '../../services/auth.service';
import { ProjectService } from '../../services/project.service';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-project-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './project-form.html',
  styleUrl: './project-form.scss',
})
export class ProjectForm implements OnInit {
  private fb = inject(FormBuilder);
  private projectService = inject(ProjectService);
  private authService = inject(AuthService);
  private dialogRef = inject(MatDialogRef<ProjectForm>);
  private snackBar = inject(MatSnackBar);

  public projectForm!: FormGroup;
  private currentUser = this.authService.currentUser();

  ngOnInit(): void {
    this.projectForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(5)]],
      descricao: ['', [Validators.required, Validators.minLength(20)]],
      orcamento: [null, [Validators.required, Validators.min(1)]],
      // Vamos pegar as habilidades como um texto separado por vírgula
      habilidades: ['', Validators.required] 
    });
  }

  onSubmit(): void {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }

    if (!this.currentUser) {
      this.snackBar.open('Erro: Você precisa estar logado.', 'Fechar', { duration: 3000 });
      return;
    }

    const formValues = this.projectForm.value;

    // Montamos o objeto completo do novo projeto
    const newProjectData: Omit<Project, 'id'> = {
      titulo: formValues.titulo,
      descricao: formValues.descricao,
      orcamento: Number(formValues.orcamento),
      // Converte a string "Angular, TypeScript" em ["Angular", "TypeScript"]
      habilidadesNecessarias: formValues.habilidades.split(',').map((h: string) => h.trim()),
      empresaId: this.currentUser.uid, // Pega o ID do usuário logado
      status: 'Aberto', // Status padrão
      dataPostagem: new Date(),
      freelancerId: null, // Nenhum freelancer atribuído ainda
    };

    // Chamamos o serviço
    this.projectService.addProject(newProjectData).subscribe({
      next: (createdProject) => {
        // Sucesso!
        this.snackBar.open('Projeto criado com sucesso!', 'OK', { duration: 3000 });
        // Fecha o modal e envia o novo projeto de volta para a lista
        this.dialogRef.close(createdProject); 
      },
      error: (err) => {
        console.error('Erro ao criar projeto:', err);
        this.snackBar.open('Erro ao criar projeto. Tente novamente.', 'Fechar', { duration: 3000 });
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }

}
