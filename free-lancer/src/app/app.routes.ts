import { Routes } from '@angular/router';
import { NextLogin } from './components/next-login/next-login';
import { SignPag } from './components/sign-pag/sign-pag';
import { RegisterPag } from './components/register-pag/register-pag';
import { Termos } from './components/termos/termos';
import { authGuard } from './guards/auth.guard';
import { publicGuard } from './guards/public.guard';


export const routes: Routes = [
    {path: '', redirectTo: 'sign-pag', pathMatch: 'full'},
    
    // 2. Adicionamos o 'canActivate: [authGuard]' à rota protegida
    {
      path: 'next-login', 
      component: NextLogin,
      canActivate: [authGuard] // <-- A MÁGICA ACONTECE AQUI
    },
    {path: 'sign-pag', component: SignPag, canActivate: [publicGuard] },
    {path: 'register-pag', component: RegisterPag, canActivate: [publicGuard] },
    
    // Rotas públicas
    
    {path: 'termos', component: Termos}, // 'Termos' pode ser sempre acessível
];
