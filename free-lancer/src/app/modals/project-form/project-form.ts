import { CommonModule } from '@angular/common';
import { Component, Inject, inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Project } from '../../models/project.model';
import { AuthService } from '../../services/auth.service';
import { ProjectService } from '../../services/project.service';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';

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
  private currentUser = this.authService.currentUser();
  public minDate = new Date();

  public isEditMode = false;
  public modalTitle = 'Criar Novo Projeto';
  private existingProjectId: string | null = null;

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: Project | null) {
    if (data) {
      this.isEditMode = true;
      this.modalTitle = 'Editar Projeto';
      this.existingProjectId = data.id;
    }
  }

  ngOnInit(): void {
    this.projectForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(5)]],
      descricao: ['', [Validators.required, Validators.minLength(20)]],
      orcamento: [null, [Validators.required, Validators.min(1)]],
      // Vamos pegar as habilidades como um texto separado por vírgula
      habilidades: ['', Validators.required],
      prazoFinal: [null] 
    });
    if (this.isEditMode && this.data) {
      this.projectForm.patchValue({
        titulo: this.data.titulo,
        descricao: this.data.descricao,
        orcamento: this.data.orcamento,
        // Converte o array ["Angular", "JS"] de volta para a string "Angular, JS"
        habilidades: (this.data.habilidadesNecessarias || []).join(', '),
        // Converte a string de data (do JSON) para um objeto Date
        prazoFinal: this.data.prazoFinal ? new Date(this.data.prazoFinal) : null
      });
    }
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

    // 6. Montar o payload de dados (comum para ambos os modos)
    // Usamos 'Partial<Project>' pois 'update' só precisa de alguns campos
    const projectPayload: Partial<Project> = {
      titulo: formValues.titulo,
      descricao: formValues.descricao,
      orcamento: Number(formValues.orcamento),
      habilidadesNecessarias: formValues.habilidades.split(',').map((h: string) => h.trim()),
      prazoFinal: formValues.prazoFinal
    };


    // 7. Decidir qual método do serviço chamar
    if (this.isEditMode && this.existingProjectId) {
      // --- MODO UPDATE ---
      this.projectService.updateProject(this.existingProjectId, projectPayload).subscribe({
        next: (updatedProject) => {
          this.snackBar.open('Projeto atualizado com sucesso!', 'OK', { duration: 3000 });
          // Fecha o modal e envia o projeto ATUALIZADO de volta
          this.dialogRef.close(updatedProject); 
        },
        error: (err) => {
          console.error('Erro ao atualizar projeto:', err);
          this.snackBar.open('Erro ao atualizar projeto.', 'Fechar', { duration: 3000 });
        }
      });
    } else {
      // --- MODO CREATE ---
      const newProjectData: Omit<Project, 'id'> = {
        ...projectPayload,
        empresaId: this.currentUser.id,
        status: 'Aberto',
        dataPostagem: new Date(),
        freelancerId: null,
      } as Omit<Project, 'id'>; // Cast para garantir a tipagem

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
