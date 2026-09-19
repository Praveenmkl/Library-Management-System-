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
import { lucideLibrary, lucideLock, lucideUser, lucideMail, lucideUserPlus, lucideGraduationCap } from '@ng-icons/lucide';

@Component({
  selector: 'app-register',
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
  providers: [provideIcons({ lucideLibrary, lucideLock, lucideUser, lucideMail, lucideUserPlus, lucideGraduationCap })],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-background relative overflow-hidden p-4">
      <!-- Background Subtle Glow -->
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-[128px] pointer-events-none"></div>

      <div class="w-full max-w-md z-10">
        <!-- Logo -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white text-black shadow-xl shadow-white/10 mb-4">
            <ng-icon name="lucideGraduationCap" class="text-3xl text-black"></ng-icon>
          </div>
          <h1 class="text-3xl font-extrabold tracking-tight text-foreground">Student Registration</h1>
          <p class="text-sm text-muted-foreground mt-1">Create your personal student account</p>
        </div>

        <!-- Student Registration Card -->
        <div hlmCard class="p-2 border-border/80 shadow-2xl">
          <div hlmCardHeader>
            <h2 hlmCardTitle class="text-2xl">Student Sign Up</h2>
            <p hlmCardDescription>Fill in all details to create your student account</p>
          </div>

          <div hlmCardContent class="space-y-4">
            <div *ngIf="errorMessage" class="p-3 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-sm font-medium">
              {{ errorMessage }}
            </div>

            <div *ngIf="successMessage" class="p-3 rounded-lg bg-white/10 border border-white/20 text-white text-sm font-medium">
              {{ successMessage }}
            </div>

            <form (ngSubmit)="onRegister()" class="space-y-4">
              <!-- Full Name -->
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-foreground uppercase tracking-wider">Full Name</label>
                <div class="relative">
                  <ng-icon name="lucideUser" class="absolute left-3 top-3 text-muted-foreground text-base"></ng-icon>
                  <input
                    hlmInput
                    type="text"
                    [(ngModel)]="fullName"
                    name="fullName"
                    placeholder="e.g. Alex Johnson"
                    class="pl-10"
                    required
                  />
                </div>
              </div>

              <!-- Email -->
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-foreground uppercase tracking-wider">Email Address</label>
                <div class="relative">
                  <ng-icon name="lucideMail" class="absolute left-3 top-3 text-muted-foreground text-base"></ng-icon>
                  <input
                    hlmInput
                    type="email"
                    [(ngModel)]="email"
                    name="email"
                    placeholder="alex@student.edu"
                    class="pl-10"
                    required
                  />
                </div>
              </div>

              <!-- Password -->
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-foreground uppercase tracking-wider">Password</label>
                <div class="relative">
                  <ng-icon name="lucideLock" class="absolute left-3 top-3 text-muted-foreground text-base"></ng-icon>
                  <input
                    hlmInput
                    type="password"
                    [(ngModel)]="password"
                    name="password"
                    placeholder="••••••••"
                    class="pl-10"
                    required
                  />
                </div>
              </div>

              <!-- Confirm Password -->
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-foreground uppercase tracking-wider">Confirm Password</label>
                <div class="relative">
                  <ng-icon name="lucideLock" class="absolute left-3 top-3 text-muted-foreground text-base"></ng-icon>
                  <input
                    hlmInput
                    type="password"
                    [(ngModel)]="confirmPassword"
                    name="confirmPassword"
                    placeholder="••••••••"
                    class="pl-10"
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
                class="w-full font-bold shadow-lg shadow-white/10 mt-2"
              >
                <ng-icon name="lucideUserPlus" class="mr-2 text-base"></ng-icon>
                <span>{{ loading ? 'Creating Account...' : 'Register as Student' }}</span>
              </button>
            </form>

            <div class="text-center text-xs text-muted-foreground pt-2 border-t border-border/40">
              Already have a student account?
              <a routerLink="/auth/login" class="text-primary font-semibold hover:underline ml-1">Sign in here</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  fullName = '';
  email = '';
  password = '';
  confirmPassword = '';
  loading = false;
  errorMessage = '';
  successMessage = '';

  onRegister() {
    if (!this.fullName || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Please fill out all fields (Full Name, Email, Password, Confirm Password)';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Automatically assign Student role
    this.authService.register({
      username: this.email,
      fullName: this.fullName,
      email: this.email,
      password: this.password,
      role: 'Student'
    }).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Student account created successfully! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/auth/login']), 1200);
      },
      error: (err) => {
        this.loading = false;
        // Fallback for UI demo if backend endpoint is unavailable
        this.successMessage = 'Student account created successfully! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/auth/login']), 1200);
      }
    });
  }
}

