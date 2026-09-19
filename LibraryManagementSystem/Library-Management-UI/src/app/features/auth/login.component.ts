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
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-[128px] pointer-events-none"></div>

      <div class="w-full max-w-md z-10">
        <!-- Logo -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white text-black shadow-xl shadow-white/10 mb-4">
            <ng-icon name="lucideLibrary" class="text-3xl text-black"></ng-icon>
          </div>
          <h1 class="text-3xl font-extrabold tracking-tight text-white">LibVerse Portal</h1>
          <p class="text-sm text-zinc-400 mt-1">Student & Staff Portal Sign In</p>
        </div>

        <!-- Login Card -->
        <div hlmCard class="p-2 border-zinc-800 shadow-2xl bg-zinc-950/90">
          <div hlmCardHeader>
            <h2 hlmCardTitle class="text-2xl text-white">Welcome Back</h2>
            <p hlmCardDescription class="text-zinc-400">Sign in with your email or username</p>
          </div>

          <div hlmCardContent class="space-y-4">
            <div *ngIf="errorMessage" class="p-3 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-sm font-medium">
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
                    class="pl-10 border-zinc-800 focus:border-white"
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
                    class="pl-10 border-zinc-800 focus:border-white"
                    required
                  />
                </div>
              </div>

              <!-- Quick Login Role Selector (for demo authentication) -->
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Sign In Role</label>
                <select [(ngModel)]="role" name="role" class="w-full h-10 px-3 rounded-md bg-zinc-900 border border-zinc-800 text-white text-xs">
                  <option value="Student">Student</option>
                  <option value="Librarian">Librarian Staff</option>
                </select>
              </div>

              <button
                hlmBtn
                variant="default"
                size="lg"
                type="submit"
                [disabled]="loading"
                class="w-full font-bold bg-white text-black hover:bg-zinc-200 mt-2"
              >
                <span>{{ loading ? 'Signing in...' : 'Sign In' }}</span>
                <ng-icon name="lucideArrowRight" class="ml-2 text-base"></ng-icon>
              </button>
            </form>

            <div class="text-center text-xs text-muted-foreground pt-4 border-t border-zinc-800 flex items-center justify-between">
              <div>
                Don't have a student account?
                <a routerLink="/auth/register" class="text-white font-semibold hover:underline ml-1">Register as Student</a>
              </div>
            </div>

            <div class="text-center pt-2">
              <a routerLink="/admin/login" class="text-xs text-zinc-400 hover:text-white underline">
                Administrator Sign In Portal →
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

  username = 'alex_student';
  password = 'password123';
  role: 'Student' | 'Librarian' = 'Student';
  loading = false;
  errorMessage = '';

  onLogin() {
    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter both username and password';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    // Set role session
    this.authService.setSession('session_token_' + Date.now(), this.username, this.role, this.username, this.username);
    this.loading = false;

    if (this.role === 'Student') {
      this.router.navigate(['/student/dashboard']);
    } else if (this.role === 'Librarian') {
      this.router.navigate(['/librarian/dashboard']);
    }
  }
}

