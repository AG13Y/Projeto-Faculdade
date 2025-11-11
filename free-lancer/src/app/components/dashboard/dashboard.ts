import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private authService = inject(AuthService);

  // Vamos pegar o nome do usuário logado para dar boas-vindas
  public userName = computed(() => this.authService.currentUser()?.nome || 'Usuário');
}
