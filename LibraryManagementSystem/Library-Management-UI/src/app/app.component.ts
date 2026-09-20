import { Component, OnInit, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
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
export class AppComponent implements OnInit {
  private router = inject(Router);
  authService = inject(AuthService);

  constructor() {
    // React to user login/role changes
    effect(() => {
      const user = this.authService.currentUser();
      this.updateTheme(this.router.url, user?.role);
    });
  }

  ngOnInit() {
    // React to navigation route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.updateTheme(event.urlAfterRedirects || event.url, this.authService.currentUser()?.role);
    });

    // Initial theme update
    this.updateTheme(window.location.pathname, this.authService.currentUser()?.role);
  }

  private updateTheme(url: string, role?: string) {
    let theme = 'student'; // Default to student orange theme

    const lowerUrl = (url || '').toLowerCase();
    const lowerRole = (role || '').toLowerCase();

    if (lowerUrl.includes('/staff') || lowerUrl.includes('/librarian') || lowerRole === 'librarian') {
      theme = 'librarian';
    } else if (lowerUrl.includes('/admin') || lowerRole === 'admin') {
      theme = 'admin';
    } else if (lowerUrl.includes('/student') || lowerRole === 'student' || lowerRole === 'member') {
      theme = 'student';
    }

    // Apply to html element and document body
    document.documentElement.setAttribute('data-theme', theme);
    document.body.classList.remove('theme-student', 'theme-librarian', 'theme-admin');
    document.body.classList.add(`theme-${theme}`);
  }

  showNavigation(): boolean {
    const url = this.router.url;
    const isAuthPage = url.includes('/student/login') || url.includes('/student/register') || url.includes('/staff/login') || url.includes('/admin/login');
    return this.authService.isAuthenticated() && !isAuthPage;
  }
}
