import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Um guarda funcional para proteger rotas que exigem autenticação.
 */
export const authGuard: CanActivateFn = (route, state) => {
  // 1. Injetamos os serviços que precisamos
  const authService = inject(AuthService);
  const router = inject(Router);

  // 2. Verificamos se o usuário está logado usando o signal do AuthService
  if (authService.isLoggedIn()) {
    return true; // Usuário logado, acesso permitido!
  }

  // 3. Usuário NÃO está logado, redireciona para a página de login
  console.warn('Acesso bloqueado! Usuário não autenticado.');
  router.navigateByUrl('/sign-pag');
  
  return false; // Acesso negado!
};