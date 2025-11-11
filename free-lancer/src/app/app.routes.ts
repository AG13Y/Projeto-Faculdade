import { Routes } from '@angular/router';
import { NextLogin } from './components/next-login/next-login';
import { SignPag } from './components/sign-pag/sign-pag';
import { RegisterPag } from './components/register-pag/register-pag';
import { Termos } from './components/termos/termos';
import { authGuard } from './guards/auth.guard';
import { publicGuard } from './guards/public.guard';
import { ProjectList } from './components/project-list/project-list';
import { Dashboard } from './components/dashboard/dashboard';
import { Calendar } from './components/calendar/calendar';
import { Documents } from './components/documents/documents';
import { Team } from './components/team/team';
import { Reports } from './components/reports/reports';


export const routes: Routes = [
    {path: '', redirectTo: 'sign-pag', pathMatch: 'full'},
    
    // 2. ATUALIZAR a rota 'next-login' para ter rotas-filhas
    {
      path: 'next-login', 
      component: NextLogin,
      canActivate: [authGuard],
      // 3. Adicionar o array 'children'
      children: [
        // 2. CORREÇÃO: Mudar o redirect de 'projects' para 'dashboard'
        { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, 
        
        // 3. Adicionar a nova rota
        { path: 'dashboard', component: Dashboard },
        
        // A rota de projetos continua aqui, mas não é mais o padrão
        { path: 'projects', component: ProjectList },
        { path: 'calendar', component: Calendar },
        { path: 'documents', component: Documents },
        { path: 'team', component: Team },
        { path: 'reports', component: Reports },
      ]
    },
    {path: 'sign-pag', component: SignPag, canActivate: [publicGuard] },
    {path: 'register-pag', component: RegisterPag, canActivate: [publicGuard] },
    {path: 'termos', component: Termos},
];
