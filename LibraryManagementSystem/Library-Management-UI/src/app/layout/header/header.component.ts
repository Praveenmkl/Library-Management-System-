import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { HlmButtonDirective } from '../../shared/spartan/button/hlm-button.directive';
import { provideIcons, NgIconComponent } from '@ng-icons/core';
import { lucideSun, lucideMoon, lucideBell, lucideCircleCheck, lucideLogOut } from '@ng-icons/lucide';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, HlmButtonDirective, NgIconComponent],
  providers: [provideIcons({ lucideSun, lucideMoon, lucideBell, lucideCircleCheck, lucideLogOut })],
  template: `
    <header class="h-16 border-b border-border bg-card/40 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-30">
      <!-- Title / Search -->
      <div class="flex items-center space-x-4">
        <div>
          <h2 class="text-sm font-semibold text-foreground">Library Workspace</h2>
          <div class="flex items-center space-x-2 text-[11px] text-muted-foreground">
            <span class="w-2.5 h-2.5 rounded-full bg-[#1bfc06] shadow-[0_0_10px_#1bfc06] animate-pulse"></span>
            <span>API Online (localhost:5000)</span>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center space-x-3">
        <button hlmBtn variant="ghost" size="icon" (click)="toggleTheme()" class="rounded-full">
          <ng-icon [name]="isDarkMode ? 'lucideSun' : 'lucideMoon'" class="text-lg text-foreground"></ng-icon>
        </button>

        <button hlmBtn variant="ghost" size="icon" class="rounded-full relative">
          <ng-icon name="lucideBell" class="text-lg text-foreground"></ng-icon>
          <span class="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary"></span>
        </button>

        <div class="h-4 w-px bg-border my-auto"></div>

        <button hlmBtn variant="outline" size="sm" (click)="authService.logout()" class="text-xs">
          <ng-icon name="lucideLogOut" class="mr-1 text-sm"></ng-icon>
          Sign Out
        </button>
      </div>
    </header>
  `
})
export class HeaderComponent {
  authService = inject(AuthService);
  isDarkMode = true;

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}

