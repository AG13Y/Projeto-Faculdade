/*
	Installed from https://ui.angular-material.dev/api/registry/
	Update this file using `@ngm-dev/cli update free-multi-column/full-width-three-column`
*/

import { Component, computed, inject, input } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { DeviceService } from '../../utils/services/device.service';
import { cx } from '../../utils/functions/cx';
import { SimpleStackedListComponent } from "../../free-stacked-lists/simple";
import { Router, RouterModule} from "@angular/router";
import { AuthService } from '../../../services/auth.service';

type User = {
  name: string;
  email: string;
  imageUrl: string;
};

@Component({
  selector: 'ngm-dev-block-content-placeholder-full-width-three-column',
  template: `
    <div
      class="relative h-full overflow-hidden rounded-xl border border-dashed border-gray-400 bg-surface">
      <svg
        class="absolute inset-0 h-full w-full stroke-gray-200 dark:stroke-gray-700"
        fill="none">
        <defs>
          <pattern
            [id]="patternId()"
            x="0"
            y="0"
            width="10"
            height="10"
            patternUnits="userSpaceOnUse">
            <path d="M-3 13 15-5M-5 5l18-18M-1 21 17 3"></path>
          </pattern>
        </defs>
        <rect
          stroke="none"
          [attr.fill]="'url(#' + patternId() + ')'"
          width="100%"
          height="100%"></rect>
      </svg>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
      }
    `,
  ],
})
export class ContentPlaceholderFullWidthThreeColumnComponent {
  readonly patternId = input('full-width-three-column-pattern-1');
}

@Component({
  selector: 'ngm-dev-block-full-width-three-column',
  templateUrl: './full-width-three-column.component.html',
  styleUrls: ['./full-width-three-column.component.scss'],
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    RouterModule,
],
})
export class FullWidthThreeColumnComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  readonly cx = cx;
  readonly isLoggedIn = this.authService.isLoggedIn;

  // --- ESTA É A MUDANÇA ---
  readonly user = computed(() => {
    const currentUser = this.authService.currentUser();
    
    if (currentUser) {
      // Usuário está logado
      return {
        name: currentUser.nome, // <-- MUDANÇA: de email para nome
        email: 'Clique para sair',
        imageUrl: currentUser.fotoUrl || 'icon-user.png', // <-- MUDANÇA: usa a foto do usuário
      };
    } else {
      // Usuário deslogado (estado padrão)
      return {
        name: 'Entre',
        email: 'Ou cadastre',
        imageUrl: 'icon-user.png',
      };
    }
  });
  
  readonly isLessThanMD$ = inject(DeviceService).isLessThanMD$;
 readonly mainMenu: {
    label: string;
    id: string;
    icon: string;
    routerLink: string;
    isActive?: boolean;
  }[] = [
    {
      label: 'Página Inicial',
      id: 'dashboard',
      icon: 'home',
      routerLink: './dashboard', 
      isActive: true, // <-- MUDANÇA AQUI
    },
    {
      label: 'Time',
      id: 'team',
      icon: 'people',
      routerLink: './team',
      isActive: false,
    },
    {
      label: 'Projetos',
      id: 'projects',
      icon: 'folder',
      routerLink: './projects', 
      isActive: false, // <-- MUDANÇA AQUI
    },
    {
      label: 'Calendário',
      id: 'calendar',
      icon: 'event',
      routerLink: './calendar',
    },
    {
      label: 'Documentos',
      id: 'documents',
      icon: 'article',
      routerLink: './documents',
    },
    {
      label: 'Relatórios',
      id: 'reports',
      icon: 'bar_chart',
      routerLink: './reports',
    },
  ];
  readonly teamMenu = [
    {
      label: 'Alpha',
      id: 'alpha',
    },
    {
      label: 'Beta',
      id: 'beta',
    },
    {
      label: 'Gamma',
      id: 'gamma',
    },
  ];

  irParaLogin(): void {
    if (this.isLoggedIn()) {
      this.authService.logout();
    } else {
      this.router.navigate(['/sign-pag']); 
    }
  }
  
}
