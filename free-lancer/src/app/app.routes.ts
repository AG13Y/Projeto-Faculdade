import { Routes } from '@angular/router';
import { NextLogin } from './components/next-login/next-login';
import { SignPag } from './components/sign-pag/sign-pag';
import { RegisterPag } from './components/register-pag/register-pag';
import { Termos } from './components/termos/termos';


export const routes: Routes = [
    {path: '', redirectTo: 'next-login', pathMatch: 'full'},
    {path: 'next-login', component: NextLogin},
    {path: 'sign-pag', component: SignPag},
    {path: 'register-pag', component: RegisterPag},
    {path: 'termos', component: Termos},
];
