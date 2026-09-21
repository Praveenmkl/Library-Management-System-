import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { HlmButtonDirective } from '../../shared/spartan/button/hlm-button.directive';
import { HlmInputDirective } from '../../shared/spartan/input/hlm-input.directive';
import { HlmCardDirective } from '../../shared/spartan/card/hlm-card.directive';
import { HlmCardHeaderDirective, HlmCardTitleDirective, HlmCardDescriptionDirective, HlmCardContentDirective } from '../../shared/spartan/card/hlm-card-parts.directive';
import { provideIcons, NgIconComponent } from '@ng-icons/core';
import { lucideLibrary, lucideLock, lucideUser, lucideArrowRight } from '@ng-icons/lucide';

@Component({
  selector: 'app-login',
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
  providers: [provideIcons({ lucideLibrary, lucideLock, lucideUser, lucideArrowRight })],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-background relative overflow-hidden p-4">
      <!-- Background Glow Effects -->
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-[128px] pointer-events-none"></div>

      <div class="w-full max-w-md z-10">
        <!-- Logo -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl !bg-gradient-to-br !from-brand-500 !to-brand-600 text-white shadow-xl shadow-brand-500/30 mb-4">
            <ng-icon name="lucideLibrary" class="text-3xl text-white"></ng-icon>
          </div>
          <h1 class="text-3xl font-extrabold tracking-tight text-white">LibVerse Portal</h1>
          <p class="text-sm text-zinc-400 mt-1">Student Sign In</p>
        </div>

        <!-- Login Card -->
        <div hlmCard class="p-2 border-zinc-800 shadow-2xl bg-zinc-950/90">
          <div hlmCardHeader>
            <h2 hlmCardTitle class="text-2xl text-white">Student Sign In</h2>
            <p hlmCardDescription class="text-zinc-400">Enter your student credentials to access your portal</p>
          </div>

          <div hlmCardContent class="space-y-4">
            <div *ngIf="errorMessage" class="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium">
              {{ errorMessage }}
            </div>

            <form (ngSubmit)="onLogin()" class="space-y-4">
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Username / Email</label>
                <div class="relative">
                  <ng-icon name="lucideUser" class="absolute left-3 top-3 text-zinc-400 text-base"></ng-icon>
                  <input
                    hlmInput
                    type="text"
                    [(ngModel)]="username"
                    name="username"
                    placeholder="e.g. alex@student.edu"
                    class="pl-10 border-zinc-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/50"
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
                    class="pl-10 border-zinc-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/50"
                    required
                  />
                </div>
              </div>

              <!-- Student Role Badge -->
              <div class="flex items-center space-x-2 px-3 py-2 rounded-lg bg-brand-500/10 border border-brand-500/20">
                <ng-icon name="lucideArrowRight" class="text-sm text-brand-400"></ng-icon>
                <span class="text-xs font-bold text-brand-400 uppercase tracking-wider">Student Account Access</span>
              </div>

              <button
                hlmBtn
                variant="default"
                size="lg"
                type="submit"
                [disabled]="loading"
                class="w-full font-bold !bg-gradient-to-br !from-brand-500 !to-brand-600 !text-white !border-0 shadow-lg shadow-brand-500/30 hover:!from-brand-600 hover:!to-brand-700 mt-2"
              >
                <span>{{ loading ? 'Signing in...' : 'Sign In' }}</span>
                <ng-icon name="lucideArrowRight" class="ml-2 text-base"></ng-icon>
              </button>
            </form>

            <div class="text-center text-xs text-muted-foreground pt-4 border-t border-zinc-800 space-y-2">
              <div>
                Don't have a student account?
                <a routerLink="/student/register" class="text-brand-400 font-semibold hover:text-brand-300 hover:underline ml-1">Register as Student</a>
              </div>
              <div>
                Are you library staff?
                <a routerLink="/staff/login" class="text-brand-400 font-semibold hover:text-brand-300 hover:underline ml-1">Staff Login →</a>
              </div>
            </div>

            <div class="text-center pt-2">
              <a routerLink="/admin/login" class="text-xs text-zinc-500 hover:text-white underline">
                Administrator Portal →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  username = '';
  password = '';
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
      role: 'Student'
    }).subscribe({
      next: () => {
        this.authService.resolveMemberId(this.username).subscribe({
          next: () => {
            this.loading = false;
            this.router.navigate(['/student/dashboard']);
          },
          error: () => {
            this.loading = false;
            this.router.navigate(['/student/dashboard']);
          }
        });
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Invalid credentials or API server unreachable.';
      }
    });
  }
}


