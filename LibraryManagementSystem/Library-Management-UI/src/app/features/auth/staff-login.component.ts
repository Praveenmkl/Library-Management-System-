import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { HlmButtonDirective } from '../../shared/spartan/button/hlm-button.directive';
import { HlmInputDirective } from '../../shared/spartan/input/hlm-input.directive';
import { HlmCardDirective } from '../../shared/spartan/card/hlm-card.directive';
import {
  HlmCardHeaderDirective,
  HlmCardTitleDirective,
  HlmCardDescriptionDirective,
  HlmCardContentDirective
} from '../../shared/spartan/card/hlm-card-parts.directive';
import { provideIcons, NgIconComponent } from '@ng-icons/core';
import {
  lucideLibrary,
  lucideLock,
  lucideUser,
  lucideArrowRight,
  lucideBriefcase,
  lucideShield
} from '@ng-icons/lucide';

@Component({
  selector: 'app-staff-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HlmButtonDirective,
    HlmInputDirective,
    HlmCardDirective,
    HlmCardHeaderDirective,
    HlmCardTitleDirective,
    HlmCardDescriptionDirective,
    HlmCardContentDirective,
    NgIconComponent
  ],
  providers: [
    provideIcons({
      lucideLibrary,
      lucideLock,
      lucideUser,
      lucideArrowRight,
      lucideBriefcase,
      lucideShield
    })
  ],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-background relative overflow-hidden p-4">
      <!-- Background Glow Effects -->
      <div class="absolute top-1/3 right-1/4 w-96 h-96 bg-librarian-500/15 rounded-full blur-[128px] pointer-events-none"></div>
      <div class="absolute bottom-1/4 left-1/3 w-64 h-64 bg-purple-900/20 rounded-full blur-[96px] pointer-events-none"></div>

      <div class="w-full max-w-md z-10">
        <!-- Logo -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl !bg-gradient-to-br !from-librarian-500 !to-librarian-700 text-white shadow-xl shadow-librarian-500/30 mb-4">
            <ng-icon name="lucideBriefcase" class="text-3xl text-white"></ng-icon>
          </div>
          <h1 class="text-3xl font-extrabold tracking-tight text-white">Librarian Desk</h1>
          <p class="text-sm text-zinc-400 mt-1">LibVerse Staff & Librarian Sign In</p>
        </div>

        <!-- Staff Login Card -->
        <div hlmCard class="p-2 border-purple-500/20 shadow-2xl bg-zinc-950/90 backdrop-blur-2xl">
          <div hlmCardHeader>
            <h2 hlmCardTitle class="text-2xl text-white">Staff Sign In</h2>
            <p hlmCardDescription class="text-zinc-400">Enter your librarian credentials to access the desk</p>
          </div>

          <div hlmCardContent class="space-y-4">
            <div *ngIf="errorMessage" class="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium">
              {{ errorMessage }}
            </div>

            <!-- Staff Role Badge -->
            <div class="flex items-center space-x-2 px-3 py-2 rounded-lg bg-librarian-500/10 border border-librarian-500/20">
              <ng-icon name="lucideShield" class="text-sm text-librarian-400"></ng-icon>
              <span class="text-xs font-bold text-librarian-300 uppercase tracking-wider">Librarian Desk Access</span>
            </div>

            <form (ngSubmit)="onLogin()" class="space-y-4">
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Staff Username / Email</label>
                <div class="relative">
                  <ng-icon name="lucideUser" class="absolute left-3 top-3 text-zinc-400 text-base"></ng-icon>
                  <input
                    hlmInput
                    type="text"
                    [(ngModel)]="username"
                    name="username"
                    placeholder="e.g. librarian@libverse.com"
                    class="pl-10 border-zinc-800 focus:border-librarian-500 focus:ring-1 focus:ring-librarian-500/50"
                    required
                  />
                </div>
              </div>

              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Password</label>
                <div class="relative">
                  <ng-icon name="lucideLock" class="absolute left-3 top-3 text-zinc-400 text-base"></ng-icon>
                  <input
                    hlmInput
                    type="password"
                    [(ngModel)]="password"
                    name="password"
                    placeholder="••••••••"
                    class="pl-10 border-zinc-800 focus:border-librarian-500 focus:ring-1 focus:ring-librarian-500/50"
                    required
                  />
                </div>
              </div>

              <button
                hlmBtn
                variant="default"
                size="lg"
                type="submit"
                [disabled]="loading"
                class="w-full font-bold !bg-gradient-to-br !from-librarian-500 !to-librarian-700 !text-white !border-0 shadow-lg shadow-librarian-500/30 hover:!from-librarian-600 hover:!to-librarian-800 mt-2"
              >
                <span>{{ loading ? 'Signing in...' : 'Sign In as Staff' }}</span>
                <ng-icon name="lucideArrowRight" class="ml-2 text-base"></ng-icon>
              </button>
            </form>

            <div class="text-center text-xs text-muted-foreground pt-4 border-t border-zinc-800 space-y-2">
              <div>
                Not a staff member?
                <a routerLink="/student/login" class="text-librarian-400 font-semibold hover:text-librarian-300 hover:underline ml-1">Student Login →</a>
              </div>
              <div>
                <a routerLink="/admin/login" class="text-xs text-zinc-500 hover:text-white underline">
                  Administrator Portal →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class StaffLoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  username = 'librarian_staff';
  password = 'password123';
  loading = false;
  errorMessage = '';

  onLogin() {
    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter both username and password';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login({
      username: this.username,
      password: this.password,
      role: 'Librarian'
    }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/staff/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Invalid credentials or API server unreachable.';
      }
    });
  }
}
