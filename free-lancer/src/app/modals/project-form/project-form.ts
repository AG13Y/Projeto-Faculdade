import { CommonModule } from '@angular/common';
import { Component, Inject, inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Project } from '../../interface/project.model';
import { AuthService } from '../../services/auth.service';
import { ProjectService } from '../../services/project.service';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Proposal } from '../../interface/proposal.model';
import { ProposalService } from '../../services/proposal.service';
import { ProposalForm } from '../proposal-form/proposal-form';

@Component({
  selector: 'app-project-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDatepickerModule
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
  // Este era o erro de timing que corrigimos:
  private currentUser = this.authService.currentUser(); 
  public minDate = new Date();

  public isEditMode = false;
  public modalTitle = 'Criar Novo Projeto';
  private existingProjectId: string | null = null;

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: Project | null) {
    if (data) {
      this.isEditMode = true;
      this.modalTitle = 'Editar Projeto';
      this.existingProjectId = data.id; // 'id' era obrigatório no modelo
    }
  }

  ngOnInit(): void {
    this.projectForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(5)]],
      descricao: ['', [Validators.required, Validators.minLength(20)]],
      orcamento: [null, [Validators.required, Validators.min(1)]],
      habilidades: ['', Validators.required],
      prazoFinal: [null] 
    });
    if (this.isEditMode && this.data) {
      this.projectForm.patchValue({
        titulo: this.data.titulo,
        descricao: this.data.descricao,
        orcamento: this.data.orcamento,
        habilidades: (this.data.habilidadesNecessarias || []).join(', '),
        prazoFinal: this.data.prazoFinal ? new Date(this.data.prazoFinal) : null
      });
    }
  }

  onSubmit(): void {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }

    // A lógica de 'currentUser' aqui estava lendo a propriedade da classe
    if (!this.currentUser) { 
      this.snackBar.open('Erro: Você precisa estar logado.', 'Fechar', { duration: 3000 });
      return;
    }

    const formValues = this.projectForm.value;

    const projectPayload: Partial<Project> = {
      titulo: formValues.titulo,
      descricao: formValues.descricao,
      orcamento: Number(formValues.orcamento),
      habilidadesNecessarias: formValues.habilidades.split(',').map((h: string) => h.trim()),
      prazoFinal: formValues.prazoFinal
    };


    if (this.isEditMode && this.existingProjectId) {
      // --- MODO UPDATE ---
      this.projectService.updateProject(this.existingProjectId, projectPayload).subscribe({
        next: (updatedProject) => {
          this.snackBar.open('Projeto atualizado com sucesso!', 'OK', { duration: 3000 });
          this.dialogRef.close(updatedProject); 
        },
        error: (err) => {
          this.snackBar.open('Erro ao atualizar projeto.', 'Fechar', { duration: 3000 });
        }
      });
    } else {
      // --- MODO CREATE (Com o "cast" que queríamos remover) ---
      const newProjectData: Omit<Project, 'id'> = {
        ...projectPayload,
        empresaId: this.currentUser.id, // Lendo da propriedade
        status: 'Aberto',
        dataPostagem: new Date(),
        
      } as Omit<Project, 'id'>; // <-- Este é o "cast"

      this.projectService.addProject(newProjectData).subscribe({
        next: (createdProject) => {
          this.snackBar.open('Projeto criado com sucesso!', 'OK', { duration: 3000 });
          this.dialogRef.close(createdProject); 
        },
        error: (err) => {
          console.error('Erro ao criar projeto:', err);
          this.snackBar.open('Erro ao criar projeto. Tente novamente.', 'Fechar', { duration: 3000 });
        }
      });
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
