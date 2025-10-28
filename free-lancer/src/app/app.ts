import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NextLogin } from './components/next-login/next-login';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('free-lancer');
}
