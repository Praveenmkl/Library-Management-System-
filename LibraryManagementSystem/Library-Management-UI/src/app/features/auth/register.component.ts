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
      <!-- Background Glow Effects -->
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-[128px] pointer-events-none"></div>

      <div class="w-full max-w-md z-10">
        <!-- Logo -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl !bg-gradient-to-br !from-brand-500 !to-brand-600 text-white shadow-xl shadow-brand-500/30 mb-4">
            <ng-icon name="lucideGraduationCap" class="text-3xl text-white"></ng-icon>
          </div>
          <h1 class="text-3xl font-extrabold tracking-tight text-white">Student Registration</h1>
          <p class="text-sm text-zinc-400 mt-1">Create your personal student account</p>
        </div>

        <!-- Student Registration Card -->
        <div hlmCard class="p-2 border-zinc-800 shadow-2xl bg-zinc-950/90">
          <div hlmCardHeader>
            <h2 hlmCardTitle class="text-2xl text-white">Student Sign Up</h2>
            <p hlmCardDescription class="text-zinc-400">Fill in all details to create your student account</p>
          </div>

          <div hlmCardContent class="space-y-4">
            <div *ngIf="errorMessage" class="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium">
              {{ errorMessage }}
            </div>

            <div *ngIf="successMessage" class="p-3 rounded-lg bg-brand-500/10 border border-brand-500/30 text-brand-300 text-sm font-medium">
              {{ successMessage }}
            </div>

            <form (ngSubmit)="onRegister()" class="space-y-4">
              <!-- Full Name -->
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Full Name</label>
                <div class="relative">
                  <ng-icon name="lucideUser" class="absolute left-3 top-3 text-zinc-400 text-base"></ng-icon>
                  <input
                    hlmInput
                    type="text"
                    [(ngModel)]="fullName"
                    name="fullName"
                    placeholder="e.g. Alex Johnson"
                    class="pl-10 border-zinc-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/50"
                    required
                  />
                </div>
              </div>

              <!-- Email -->
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Email Address</label>
                <div class="relative">
                  <ng-icon name="lucideMail" class="absolute left-3 top-3 text-zinc-400 text-base"></ng-icon>
                  <input
                    hlmInput
                    type="email"
                    [(ngModel)]="email"
                    name="email"
                    placeholder="alex@student.edu"
                    class="pl-10 border-zinc-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/50"
                    required
                  />
                </div>
              </div>

              <!-- Password -->
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

              <!-- Confirm Password -->
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Confirm Password</label>
                <div class="relative">
                  <ng-icon name="lucideLock" class="absolute left-3 top-3 text-zinc-400 text-base"></ng-icon>
                  <input
                    hlmInput
                    type="password"
                    [(ngModel)]="confirmPassword"
                    name="confirmPassword"
                    placeholder="••••••••"
                    class="pl-10 border-zinc-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/50"
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
                class="w-full font-bold !bg-gradient-to-br !from-brand-500 !to-brand-600 !text-white !border-0 shadow-lg shadow-brand-500/30 hover:!from-brand-600 hover:!to-brand-700 mt-2"
              >
                <ng-icon name="lucideUserPlus" class="mr-2 text-base"></ng-icon>
                <span>{{ loading ? 'Creating Account...' : 'Register as Student' }}</span>
              </button>
            </form>

            <div class="text-center text-xs text-muted-foreground pt-4 border-t border-zinc-800">
              Already have a student account?
              <a routerLink="/student/login" class="text-brand-400 font-semibold hover:text-brand-300 hover:underline ml-1">Sign in here</a>
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
        setTimeout(() => this.router.navigate(['/student/login']), 1200);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Registration failed. Please check your information or try again.';
      }
    });
  }
}

