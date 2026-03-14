import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="logo">PsicoSystem</div>
      <div class="links">
        <a routerLink="/calendario" routerLinkActive="activo">Calendario</a>
        <a routerLink="/agendar" routerLinkActive="activo">Agendar</a>
        <a routerLink="/datos" routerLinkActive="activo">Datos</a>
      </div>
    </nav>
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    body { margin: 0; font-family: sans-serif; background: #f8fafc; }
    .navbar { display: flex; justify-content: space-between; align-items: center; padding: 15px 30px; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
    .logo { font-weight: semi-bold; font-size: 1.2rem; font-family: fantasy; color: #253a43; }
    .links a {text-decoration: none; color: #64748b; margin-left: 20px; font-weight: 800; font-size: 16px; }
    .links a:hover, .links a.activo { color: #0ea5e9; }
    main { padding: 20px; }
  `]
})
export class AppComponent {}
