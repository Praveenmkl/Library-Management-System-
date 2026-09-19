import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { HeaderComponent } from './layout/header/header.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, HeaderComponent],
  template: `
    <div class="min-h-screen bg-background text-foreground flex antialiased">
      <!-- Sidebar Navigation (Only visible for authenticated users on portal pages) -->
      <app-sidebar *ngIf="showNavigation()"></app-sidebar>

      <!-- Main Shell Area -->
      <div [class.pl-64]="showNavigation()" class="flex-1 flex flex-col min-h-screen transition-all duration-300">
        <app-header *ngIf="showNavigation()"></app-header>

        <main class="flex-1 p-6 max-w-7xl w-full mx-auto">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class AppComponent {
  private router = inject(Router);
  authService = inject(AuthService);

  showNavigation(): boolean {
    const url = this.router.url;
    const isAuthPage = url.includes('/auth/login') || url.includes('/auth/register') || url.includes('/admin/login');
    return this.authService.isAuthenticated() && !isAuthPage;
  }
}
