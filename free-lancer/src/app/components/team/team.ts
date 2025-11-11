import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-team',
  imports: [CommonModule, RouterModule],
  templateUrl: './team.html',
  styleUrl: './team.scss',
})
export class Team {
  private userService = inject(UserService);

  // Converte o Observable de usuários em um signal
  public users = toSignal(this.userService.getUsers(), { 
    initialValue: [] as User[] 
  });

  /**
   * Formata o 'tipo' do usuário para exibição
   */
  formatRole(tipo: 'freelancer' | 'empresa'): string {
    return tipo === 'freelancer' ? 'Freelancer' : 'Empresa';
  }
}
