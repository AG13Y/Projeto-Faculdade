import { Routes } from '@angular/router';
import { NextLogin } from './components/next-login/next-login';
import { SignPag } from './components/sign-pag/sign-pag';


export const routes: Routes = [
    {path: '', redirectTo: 'next-login', pathMatch: 'full'},
    {path: 'next-login', component: NextLogin},
    {path: 'sign-pag', component: SignPag},
];
