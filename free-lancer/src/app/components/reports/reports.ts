import { Component, computed, inject, signal } from '@angular/core';
import { Project } from '../../interface/project.model';
import { Review } from '../../interface/review.model';
import { User } from '../../interface/user.model';
import { CommonModule} from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ProjectService } from '../../services/project.service';
import { ReviewService } from '../../services/review.service';
import { UserService } from '../../services/user.service';

export interface EnrichedReview {
  review: Review;
  reviewer: User;
  project: Project;
  stars: boolean[];
}

@Component({
  selector: 'app-reports',
  imports: [
    CommonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './reports.html',
  styleUrl: './reports.scss',
})
export class Reports {
  // Injeções
  private reviewService = inject(ReviewService);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private projectService = inject(ProjectService);
  private snackBar = inject(MatSnackBar);

  // Signals
  public isLoading = signal(true);
  public reviews = signal<EnrichedReview[]>([]);
  private currentUser = this.authService.currentUser()!;

  // Signals Computados para as Estatísticas
  public totalReviews = computed(() => this.reviews().length);
  public averageRating = computed(() => {
    const reviews = this.reviews();
    if (reviews.length === 0) return 0;
    
    const sum = reviews.reduce((acc, curr) => acc + curr.review.rating, 0);
    return (sum / reviews.length);
  });

  ngOnInit(): void {
    this.loadEnrichedReviews();
  }

  async loadEnrichedReviews(): Promise<void> {
    this.isLoading.set(true);
    try {
      // 1. Pega todas as avaliações que o usuário logado RECEBEU
      const rawReviews = await firstValueFrom(
        this.reviewService.getReviewsForUser(this.currentUser.id)
      );

      if (rawReviews.length === 0) {
        this.isLoading.set(false);
        return;
      }

      // 2. "Enriquece" cada avaliação com dados do projeto e do autor
      const enrichedList: EnrichedReview[] = [];
      for (const review of rawReviews) {
        // Pega os dados de quem escreveu a avaliação
        const reviewer$ = this.userService.getUserById(review.reviewerId);
        // Pega os dados do projeto
        const project$ = this.projectService.getProjectById(review.projectId);

        // Aguarda as duas chamadas
        const [reviewer, project] = await Promise.all([
          firstValueFrom(reviewer$),
          firstValueFrom(project$)
        ]);

        if (reviewer && project) {
  review.rating = Number(review.rating || 0); // garante number

  // cria array de estrelas (true = preenchida)
  const stars = Array.from({ length: 5 }, (_, idx) => idx < review.rating);

  enrichedList.push({ review, reviewer, project, stars });
}
      }

      this.reviews.set(enrichedList.sort((a, b) => 
        new Date(b.review.timestamp).getTime() - new Date(a.review.timestamp).getTime()
      )); // Ordena por mais recente

    } catch (err) {
      console.error('Erro ao carregar relatórios:', err);
      this.snackBar.open('Erro ao carregar avaliações.', 'Fechar', { duration: 3000 });
    } finally {
      this.isLoading.set(false);
    }
  }

  getStarArray(rating: number): boolean[] {
  const stars: boolean[] = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(i <= rating);
  }
  return stars;
}
}
