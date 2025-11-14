import { Component, inject, OnInit } from '@angular/core';
import { Project } from '../../interface/project.model';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Review } from '../../interface/review.model';
import { AuthService } from '../../services/auth.service';
import { ReviewService } from '../../services/review.service';

export interface ReviewFormData {
  project: Project;
  revieweeId: string | number;
  revieweeType: 'empresa' | 'freelancer';
}

@Component({
  selector: 'app-review-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './review-form.html',
  styleUrl: './review-form.scss',
})
export class ReviewForm implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<ReviewForm>);
  private snackBar = inject(MatSnackBar);
  private reviewService = inject(ReviewService);
  private authService = inject(AuthService);
  public data: ReviewFormData = inject(MAT_DIALOG_DATA);
  private currentUser = this.authService.currentUser();

  public reviewForm!: FormGroup;
  public ratingOptions = [1, 2, 3, 4, 5]; // Opções de nota


  ngOnInit(): void {
    this.reviewForm = this.fb.group({
      rating: [null, [Validators.required]],
      comment: ['', [Validators.required, Validators.minLength(10)]]
    });
  }
  

  onSubmit(): void {
    
    if (this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();
      return;
    }
    const currentUser = this.currentUser;

    // 2. Verificação de segurança
    if (!currentUser) {
      this.snackBar.open('Erro: Usuário não autenticado.', 'Fechar', { duration: 3000 });
      return;
    }

    const formValues = this.reviewForm.value;

    const newReview: Omit<Review, 'id'> = {
      projectId: this.data.project.id,
      rating: Number(formValues.rating),
      comment: formValues.comment,
      timestamp: new Date().toISOString(),
      reviewerId: currentUser.id,
      reviewerType: currentUser.tipo,
      revieweeId: this.data.revieweeId,
      revieweeType: this.data.revieweeType
    };

    this.reviewService.addReview(newReview).subscribe({
      next: (review) => {
        this.snackBar.open('Avaliação enviada com sucesso!', 'OK', { duration: 3000 });
        this.dialogRef.close(true); // Retorna a avaliação criada
      },
      error: (err) => {
        console.error('Erro ao enviar avaliação:', err);
        this.snackBar.open('Erro ao enviar avaliação.', 'Fechar', { duration: 3000 });
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
