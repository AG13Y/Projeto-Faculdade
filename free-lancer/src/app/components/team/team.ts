import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserDetail } from '../../modals/user-detail/user-detail';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-team',
  imports: [CommonModule, RouterModule, MatIconModule, MatDialogModule,],
  templateUrl: './team.html',
  styleUrl: './team.scss',
})
export class Team {
  private userService = inject(UserService);
  
  // 4. Injetar o serviço principal de MatDialog
  private dialog = inject(MatDialog);

  public users = signal<User[]>([]);
  public isLoading = signal(true);

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading.set(true);
    // Busca os usuários do seu serviço
    this.userService.getUsers().subscribe({ 
      next: (data) => {
        this.users.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar usuários:', err);
        this.isLoading.set(false);
      }
    });
  }

  /**
   * 5. Esta é a função que abre o modal de detalhes
   */
  openUserDetail(user: User): void {
    this.dialog.open(UserDetail, {
      width: '600px',
      maxWidth: '90vw',
      data: user, // <-- AQUI passamos o usuário clicado para o modal
      autoFocus: false
    });
  }

  /**
   * Helper para buscar a foto (para manter o HTML limpo)
   */
  getUserPhoto(user: User): string {
    if (user?.fotoUrl) {
      return user.fotoUrl;
    }
    return user?.tipo === 'empresa'
      ? 'assets/icon-company.png'
      : 'assets/icon-user.png';
  }
}
