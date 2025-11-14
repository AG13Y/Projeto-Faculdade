import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Project } from '../../interface/project.model';
import { Proposal } from '../../interface/proposal.model';
import { AuthService } from '../../services/auth.service';
import { ProposalService } from '../../services/proposal.service';

@Component({
  selector: 'app-proposal-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './proposal-form.html',
  styleUrl: './proposal-form.scss',
})
export class ProposalForm implements OnInit{
  private fb = inject(FormBuilder);
  private proposalService = inject(ProposalService);
  private authService = inject(AuthService);
  private dialogRef = inject(MatDialogRef<ProposalForm>);
  private snackBar = inject(MatSnackBar);

  // Injetamos os dados do PROJETO que o ProjectListComponent enviou
  public project = inject<Project>(MAT_DIALOG_DATA);
  // Pegamos o usuário (freelancer) logado
  private currentUser = this.authService.currentUser()!; 

  public proposalForm!: FormGroup;

  ngOnInit(): void {
    this.proposalForm = this.fb.group({
      valorProposto: [null, [Validators.required, Validators.min(1)]],
      prazoEstimadoDias: [null, [Validators.required, Validators.min(1)]],
      mensagem: ['', [Validators.required, Validators.minLength(20)]]
    });
  }

  onSubmit(): void {
    if (this.proposalForm.invalid) {
      this.proposalForm.markAllAsTouched();
      return;
    }

    const formValues = this.proposalForm.value;

    // Montamos o objeto completo da Proposta
    const newProposalData: Omit<Proposal, 'id'> = {
      projetoId: this.project.id,
      freelancerId: this.currentUser.id,
      mensagem: formValues.mensagem,
      valorProposto: Number(formValues.valorProposto),
      prazoEstimadoDias: Number(formValues.prazoEstimadoDias),
      status: 'Pendente',
      dataEnvio: new Date()
    };

    // Chamamos o serviço de proposta
    this.proposalService.addProposal(newProposalData).subscribe({
      next: (createdProposal) => {
        this.snackBar.open('Proposta enviada com sucesso!', 'OK', { duration: 3000 });
        // Fecha o modal (não precisamos retornar nada, só fechar)
        this.dialogRef.close(true); 
      },
      error: (err) => {
        console.error('Erro ao enviar proposta:', err);
        this.snackBar.open('Erro ao enviar proposta. Tente novamente.', 'Fechar', { duration: 3000 });
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
