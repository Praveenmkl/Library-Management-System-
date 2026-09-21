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
import { lucideShield, lucideLock, lucideUser, lucideArrowRight } from '@ng-icons/lucide';

@Component({
  selector: 'app-admin-login',
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
  providers: [provideIcons({ lucideShield, lucideLock, lucideUser, lucideArrowRight })],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-background relative overflow-hidden p-4">
      <!-- Glow effect -->
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-[128px] pointer-events-none"></div>

      <div class="w-full max-w-md z-10">
        <!-- Logo Header -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white text-black shadow-xl shadow-white/10 mb-4">
            <ng-icon name="lucideShield" class="text-3xl text-black"></ng-icon>
          </div>
          <h1 class="text-3xl font-extrabold tracking-tight text-white">Admin Control Portal</h1>
          <p class="text-sm text-zinc-400 mt-1">Protected Executive Administration System</p>
        </div>

        <!-- Admin Login Card -->
        <div hlmCard class="p-2 border-zinc-800 shadow-2xl bg-zinc-950/90">
          <div hlmCardHeader>
            <h2 hlmCardTitle class="text-2xl text-white">Admin Sign In</h2>
            <p hlmCardDescription class="text-zinc-400">Enter your executive administrator credentials</p>
          </div>

          <div hlmCardContent class="space-y-4">
            <div *ngIf="errorMessage" class="p-3 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-sm font-medium">
              {{ errorMessage }}
            </div>

            <form (ngSubmit)="onAdminLogin()" class="space-y-4">
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Admin Username / Email</label>
                <div class="relative">
                  <ng-icon name="lucideUser" class="absolute left-3 top-3 text-zinc-400 text-base"></ng-icon>
                  <input
                    hlmInput
                    type="text"
                    [(ngModel)]="username"
                    name="username"
                    placeholder="admin@library.org"
                    class="pl-10 border-zinc-800 focus:border-white"
                    required
                  />
                </div>
              </div>

              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Admin Password</label>
                <div class="relative">
                  <ng-icon name="lucideLock" class="absolute left-3 top-3 text-zinc-400 text-base"></ng-icon>
                  <input
                    hlmInput
                    type="password"
                    [(ngModel)]="password"
                    name="password"
                    placeholder="••••••••"
                    class="pl-10 border-zinc-800 focus:border-white"
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
                class="w-full font-bold bg-white text-black hover:bg-zinc-200 mt-2"
              >
                <span>{{ loading ? 'Authenticating Admin...' : 'Sign In to Admin Portal' }}</span>
                <ng-icon name="lucideArrowRight" class="ml-2 text-base"></ng-icon>
              </button>
            </form>

            <div class="text-center text-xs text-muted-foreground pt-4 border-t border-zinc-800">
              Not an Administrator?
              <a routerLink="/student/login" class="text-white font-semibold hover:underline ml-1">Student & Staff Sign In</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminLoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  username = '';
  password = '';
  loading = false;
  errorMessage = '';

  onAdminLogin() {
    if (!this.username || !this.password) {
      this.errorMessage = 'Admin credentials required';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login({
      username: this.username,
      password: this.password,
      role: 'Admin'
    }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Invalid credentials or API server unreachable.';
      }
    });
  }
}
