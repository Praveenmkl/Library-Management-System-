import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { HlmButtonDirective } from '../../shared/spartan/button/hlm-button.directive';
import { HlmBadgeDirective } from '../../shared/spartan/badge/hlm-badge.directive';
import { provideIcons, NgIconComponent } from '@ng-icons/core';
import {
  lucideLayoutDashboard,
  lucideBookOpen,
  lucideUsers,
  lucideBookmarkCheck,
  lucideLogOut,
  lucideShield,
  lucideLibrary,
  lucideGraduationCap,
  lucideRotateCcw,
  lucideUserCheck,
  lucideFileText,
  lucideSettings,
  lucideDollarSign,
  lucidePlus,
  lucideUser
} from '@ng-icons/lucide';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, HlmButtonDirective, HlmBadgeDirective, NgIconComponent],
  providers: [
    provideIcons({
      lucideLayoutDashboard,
      lucideBookOpen,
      lucideUsers,
      lucideBookmarkCheck,
      lucideLogOut,
      lucideShield,
      lucideLibrary,
      lucideGraduationCap,
      lucideRotateCcw,
      lucideUserCheck,
      lucideFileText,
      lucideSettings,
      lucideDollarSign,
      lucidePlus,
      lucideUser
    })
  ],
  template: `
    <aside class="w-64 h-screen fixed left-0 top-0 z-40 bg-card/95 backdrop-blur-2xl border-r border-border flex flex-col justify-between p-4 transition-all duration-300">
      <!-- Top Section -->
      <div class="space-y-6">
        <!-- Logo Header -->
        <div class="flex items-center space-x-3 px-3 py-2 border-b border-border/50 pb-4">
          <div class="w-10 h-10 rounded-2xl flex items-center justify-center font-black shadow-lg"
               [ngClass]="authService.isStudent() ? 'shadow-brand-500/20 text-white' : (authService.isLibrarian() ? 'shadow-purple-500/20 text-white' : 'bg-white shadow-white/10 text-black')"
               [style.background]="authService.isStudent() ? 'linear-gradient(135deg, #f59e0b, #d97706)' : (authService.isLibrarian() ? 'linear-gradient(135deg, #a855f7, #9333ea)' : '')"
          >
            <ng-icon name="lucideLibrary" class="text-xl"></ng-icon>
          </div>
          <div>
            <h1 class="font-extrabold text-lg tracking-tight text-white">LibVerse</h1>
            <p class="text-[10px] font-bold uppercase tracking-widest"
               [ngClass]="authService.isStudent() ? 'text-brand-400' : (authService.isLibrarian() ? 'text-purple-400' : 'text-zinc-400')"
            >
              {{ authService.isAdmin() ? 'Admin Portal' : (authService.isLibrarian() ? 'Librarian Desk' : 'Student Portal') }}
            </p>
          </div>
        </div>

        <!-- Role Navigation Links -->
        <nav class="space-y-1.5 overflow-y-auto max-h-[calc(100vh-220px)] pr-1">
          <!-- STUDENT NAVIGATION -->
          <ng-container *ngIf="authService.isStudent()">
            <div class="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">Student Navigation</div>
            
            <a
              routerLink="/student/dashboard"
              routerLinkActive="bg-brand-500/10 text-brand-300 font-bold border-r-2 border-brand-500"
              class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-brand-300 hover:bg-brand-500/5 transition-all group"
            >
              <ng-icon name="lucideLayoutDashboard" class="text-base group-hover:scale-110 transition-transform"></ng-icon>
              <span>Dashboard</span>
            </a>

            <a
              routerLink="/student/books"
              routerLinkActive="bg-brand-500/10 text-brand-300 font-bold border-r-2 border-brand-500"
              class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-brand-300 hover:bg-brand-500/5 transition-all group"
            >
              <ng-icon name="lucideBookOpen" class="text-base group-hover:scale-110 transition-transform"></ng-icon>
              <span>Browse Books</span>
            </a>

            <a
              routerLink="/student/borrowings"
              routerLinkActive="bg-brand-500/10 text-brand-300 font-bold border-r-2 border-brand-500"
              class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-brand-300 hover:bg-brand-500/5 transition-all group"
            >
              <ng-icon name="lucideBookmarkCheck" class="text-base group-hover:scale-110 transition-transform"></ng-icon>
              <span>Loans & Fines</span>
            </a>

            <a
              routerLink="/student/profile"
              routerLinkActive="bg-brand-500/10 text-brand-300 font-bold border-r-2 border-brand-500"
              class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-brand-300 hover:bg-brand-500/5 transition-all group"
            >
              <ng-icon name="lucideUser" class="text-base group-hover:scale-110 transition-transform"></ng-icon>
              <span>My Profile</span>
            </a>
          </ng-container>

          <!-- LIBRARIAN NAVIGATION -->
          <ng-container *ngIf="authService.isLibrarian()">
            <div class="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-purple-300">Librarian Desk</div>

            <a
              routerLink="/staff/dashboard"
              routerLinkActive="bg-purple-500/15 text-purple-300 font-bold border-r-2 border-purple-500"
              class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-purple-300 hover:bg-purple-500/5 transition-all group"
            >
              <ng-icon name="lucideLayoutDashboard" class="text-base group-hover:scale-110 transition-transform"></ng-icon>
              <span>Dashboard</span>
            </a>

            <a
              routerLink="/staff/books"
              routerLinkActive="bg-purple-500/15 text-purple-300 font-bold border-r-2 border-purple-500"
              class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-purple-300 hover:bg-purple-500/5 transition-all group"
            >
              <ng-icon name="lucideBookOpen" class="text-base group-hover:scale-110 transition-transform"></ng-icon>
              <span>Manage Books</span>
            </a>

            <a
              routerLink="/staff/borrowings"
              routerLinkActive="bg-purple-500/15 text-purple-300 font-bold border-r-2 border-purple-500"
              class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-purple-300 hover:bg-purple-500/5 transition-all group"
            >
              <ng-icon name="lucidePlus" class="text-base group-hover:scale-110 transition-transform"></ng-icon>
              <span>Issue Books</span>
            </a>

            <a
              routerLink="/staff/returns"
              routerLinkActive="bg-purple-500/15 text-purple-300 font-bold border-r-2 border-purple-500"
              class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-purple-300 hover:bg-purple-500/5 transition-all group"
            >
              <ng-icon name="lucideRotateCcw" class="text-base group-hover:scale-110 transition-transform"></ng-icon>
              <span>Process Returns</span>
            </a>

            <a
              routerLink="/staff/students"
              routerLinkActive="bg-purple-500/15 text-purple-300 font-bold border-r-2 border-purple-500"
              class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-purple-300 hover:bg-purple-500/5 transition-all group"
            >
              <ng-icon name="lucideUsers" class="text-base group-hover:scale-110 transition-transform"></ng-icon>
              <span>Student Records</span>
            </a>

            <a
              routerLink="/staff/fines"
              routerLinkActive="bg-purple-500/15 text-purple-300 font-bold border-r-2 border-purple-500"
              class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-purple-300 hover:bg-purple-500/5 transition-all group"
            >
              <ng-icon name="lucideDollarSign" class="text-base group-hover:scale-110 transition-transform"></ng-icon>
              <span>Manage Fines</span>
            </a>

            <a
              routerLink="/staff/reports"
              routerLinkActive="bg-purple-500/15 text-purple-300 font-bold border-r-2 border-purple-500"
              class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-purple-300 hover:bg-purple-500/5 transition-all group"
            >
              <ng-icon name="lucideFileText" class="text-base group-hover:scale-110 transition-transform"></ng-icon>
              <span>Library Reports</span>
            </a>
          </ng-container>

          <!-- ADMIN NAVIGATION -->
          <ng-container *ngIf="authService.isAdmin()">
            <div class="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">Admin Control</div>

            <a
              routerLink="/admin/dashboard"
              routerLinkActive="bg-white/10 text-white font-bold border-r-2 border-white"
              class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-all group"
            >
              <ng-icon name="lucideLayoutDashboard" class="text-base group-hover:scale-110 transition-transform"></ng-icon>
              <span>Dashboard</span>
            </a>

            <a
              routerLink="/admin/librarians"
              routerLinkActive="bg-white/10 text-white font-bold border-r-2 border-white"
              class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-all group"
            >
              <ng-icon name="lucideUserCheck" class="text-base group-hover:scale-110 transition-transform"></ng-icon>
              <span>Manage Librarians</span>
            </a>

            <a
              routerLink="/admin/students"
              routerLinkActive="bg-white/10 text-white font-bold border-r-2 border-white"
              class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-all group"
            >
              <ng-icon name="lucideUsers" class="text-base group-hover:scale-110 transition-transform"></ng-icon>
              <span>Manage Students</span>
            </a>

            <a
              routerLink="/admin/books"
              routerLinkActive="bg-white/10 text-white font-bold border-r-2 border-white"
              class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-all group"
            >
              <ng-icon name="lucideBookOpen" class="text-base group-hover:scale-110 transition-transform"></ng-icon>
              <span>Inventory Books</span>
            </a>

            <a
              routerLink="/admin/borrowings"
              routerLinkActive="bg-white/10 text-white font-bold border-r-2 border-white"
              class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-all group"
            >
              <ng-icon name="lucideBookmarkCheck" class="text-base group-hover:scale-110 transition-transform"></ng-icon>
              <span>Borrowing Records</span>
            </a>

            <a
              routerLink="/admin/reports"
              routerLinkActive="bg-white/10 text-white font-bold border-r-2 border-white"
              class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-all group"
            >
              <ng-icon name="lucideFileText" class="text-base group-hover:scale-110 transition-transform"></ng-icon>
              <span>System Reports</span>
            </a>

            <a
              routerLink="/admin/settings"
              routerLinkActive="bg-white/10 text-white font-bold border-r-2 border-white"
              class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-all group"
            >
              <ng-icon name="lucideSettings" class="text-base group-hover:scale-110 transition-transform"></ng-icon>
              <span>System Settings</span>
            </a>
          </ng-container>
        </nav>
      </div>

      <!-- Bottom User Section -->
      <div class="pt-4 border-t border-border/50 space-y-3">
        <div *ngIf="authService.currentUser() as user" class="p-3 rounded-xl bg-zinc-900 flex items-center justify-between border border-zinc-800">
          <div class="flex items-center space-x-3 overflow-hidden">
            <div class="w-8 h-8 rounded-full font-extrabold flex items-center justify-center text-xs"
                 [ngClass]="authService.isStudent() || authService.isLibrarian() ? 'text-white' : 'bg-white text-black'"
                 [style.background]="authService.isStudent() ? 'linear-gradient(135deg, #f59e0b, #d97706)' : (authService.isLibrarian() ? 'linear-gradient(135deg, #a855f7, #9333ea)' : '')"
            >
              {{ user.username.substring(0, 2).toUpperCase() }}
            </div>
            <div class="truncate">
              <p class="text-xs font-semibold text-white truncate">{{ user.username }}</p>
              <span hlmBadge variant="outline" 
                    class="text-[9px] py-0 px-1.5 {{ authService.isStudent() ? 'text-brand-300 border-brand-500/30 bg-brand-500/10' : (authService.isLibrarian() ? 'text-purple-300 border-purple-500/30 bg-purple-500/10' : 'text-white border-white/20 bg-white/10') }}"
              >
                {{ user.role }}
              </span>
            </div>
          </div>
        </div>

        <button
          hlmBtn
          variant="outline"
          (click)="authService.logout()"
          class="w-full justify-start space-x-3 text-zinc-400 hover:bg-zinc-800 hover:text-white border-zinc-800 text-xs font-bold"
        >
          <ng-icon name="lucideLogOut" class="text-base"></ng-icon>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  `
})
export class SidebarComponent {
  authService = inject(AuthService);
}


