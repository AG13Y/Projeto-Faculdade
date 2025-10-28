import { Routes } from '@angular/router';
import { NextLogin } from './components/next-login/next-login';

export const routes: Routes = [
    {path: '', redirectTo: 'next-login', pathMatch: 'full'},
    {path: 'next-login', component: NextLogin}
];
