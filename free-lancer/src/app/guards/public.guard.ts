import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Protege rotas públicas (como login/registro) de usuários que JÁ estão logados.
 */
export const publicGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Se o usuário ESTÁ logado, não o deixe ver o login de novo
  if (authService.isLoggedIn()) {
    router.navigateByUrl('/next-login'); // Manda ele para a home
    return false; // Nega acesso à página de login
  }

  // Usuário não está logado, pode ver o login/registro
  return true; 
};