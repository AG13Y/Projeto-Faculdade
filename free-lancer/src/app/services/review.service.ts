import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Review } from '../interface/review.model';


@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private http = inject(HttpClient);
  private dbUrl = 'http://localhost:3000/reviews';

  /**
   * Adiciona uma nova avaliação
   */
  addReview(review: Omit<Review, 'id'>): Observable<Review> {
    return this.http.post<Review>(this.dbUrl, review);
  }

  /**
   * Busca todas as avaliações de um usuário específico (que ele recebeu)
   */
  getReviewsForUser(userId: string | number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.dbUrl}?revieweeId=${userId}`);
  }

  /**
   * Busca todas as avaliações de um projeto específico
   */
  getReviewsForProject(projectId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.dbUrl}?projectId=${projectId}`);
  }

  checkIfReviewExists(projectId: string, reviewerId: string | number): Observable<boolean> {
    // Busca por avaliações que combinem o ID do projeto E o ID de quem escreveu
    return this.http.get<Review[]>(`${this.dbUrl}?projectId=${projectId}&reviewerId=${reviewerId}`).pipe(
      map(reviews => reviews.length > 0) // Retorna true se encontrar 1 ou mais
    );
  }
}