import { Component, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { BookService } from '../../core/services/book.service';
import { MemberService } from '../../core/services/member.service';
import { BorrowingService } from '../../core/services/borrowing.service';
import { AuthService } from '../../core/services/auth.service';
import { HlmButtonDirective } from '../../shared/spartan/button/hlm-button.directive';
import { HlmBadgeDirective } from '../../shared/spartan/badge/hlm-badge.directive';
import { HlmCardDirective } from '../../shared/spartan/card/hlm-card.directive';
import { HlmCardHeaderDirective, HlmCardTitleDirective, HlmCardDescriptionDirective, HlmCardContentDirective } from '../../shared/spartan/card/hlm-card-parts.directive';
import { provideIcons, NgIconComponent } from '@ng-icons/core';
import {
  lucideBookOpen,
  lucideUsers,
  lucideBookmarkCheck,
  lucideCircleAlert,
  lucidePlus,
  lucideArrowRight,
  lucideTrendingUp,
  lucideSparkles
} from '@ng-icons/lucide';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HlmButtonDirective,
    HlmBadgeDirective,
    HlmCardDirective,
    HlmCardHeaderDirective,
    HlmCardTitleDirective,
    HlmCardDescriptionDirective,
    HlmCardContentDirective,
    NgIconComponent
  ],
  providers: [
    provideIcons({
      lucideBookOpen,
      lucideUsers,
      lucideBookmarkCheck,
      lucideCircleAlert,
      lucidePlus,
      lucideArrowRight,
      lucideTrendingUp,
      lucideSparkles
    })
  ],
  template: `
    <div class="space-y-8 animate-in fade-in duration-300">
      <!-- Welcome Hero Banner -->
      <div
        class="relative overflow-hidden rounded-3xl p-8 backdrop-blur-xl transition-all duration-300"
        [ngClass]="isStaffReports() ? 'border border-[#96ff00]/30 bg-zinc-950/80 shadow-2xl shadow-[#96ff00]/5' : 'bg-zinc-900/90 p-8 border border-zinc-800'"
      >
        <!-- Background Radial Glow (for Librarian/Staff reports) -->
        <div *ngIf="isStaffReports()" class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(150,255,0,0.15)_0%,_transparent_60%)] pointer-events-none"></div>

        <div class="relative z-10 max-w-2xl">
          <div
            class="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold mb-3 transition-colors"
            [ngClass]="isStaffReports() ? 'bg-[#96ff00]/15 border border-[#96ff00]/30 text-[#96ff00]' : 'bg-white/10 border border-white/20 text-white'"
          >
            <ng-icon name="lucideSparkles" class="text-sm" [class.text-[#96ff00]]="isStaffReports()"></ng-icon>
            <span>{{ isStaffReports() ? 'Librarian Intelligence & Reports' : 'Live Overview Dashboard' }}</span>
          </div>
          <h1 class="text-3xl font-extrabold text-foreground tracking-tight">Library Analytics & Operations</h1>
          <p class="text-muted-foreground mt-2 text-sm leading-relaxed">
            Monitor real-time book availability, member activity, active loans, and fine status across the catalog.
          </p>
          <div class="flex flex-wrap gap-3 mt-6">
            <a
              [routerLink]="booksLink()"
              hlmBtn
              variant="default"
              class="font-bold transition-all duration-200"
              [ngClass]="isStaffReports()
                ? '!bg-gradient-to-br !from-[#96ff00] !to-[#85e600] !text-black !border-0 shadow-lg shadow-[#96ff00]/30 hover:!from-[#96ff00] hover:!to-[#85e600]'
                : 'bg-white text-black hover:bg-zinc-200'"
            >
              <ng-icon name="lucidePlus" class="mr-2 text-base"></ng-icon>
              Manage Catalog
            </a>
            <a
              [routerLink]="borrowingsLink()"
              hlmBtn
              variant="outline"
              class="font-bold transition-all duration-200"
              [ngClass]="isStaffReports()
                ? 'border-[#96ff00]/30 text-[#96ff00] hover:bg-[#96ff00]/15'
                : 'border-zinc-700 text-white hover:bg-zinc-800'"
            >
              Issue Book Loan
              <ng-icon name="lucideArrowRight" class="ml-2 text-base"></ng-icon>
            </a>
          </div>
        </div>
      </div>

      <!-- Overview Metric Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Card 1: Books -->
        <div
          hlmCard
          class="p-5 glass-card transition-all"
          [ngClass]="isStaffReports() ? 'border border-[#96ff00]/20 hover:border-[#96ff00]/40' : 'border-zinc-800 hover:border-white/40'"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Titles</p>
              <h3 class="text-3xl font-black text-foreground mt-1">{{ totalBooks() }}</h3>
              <p
                class="text-xs mt-1.5 flex items-center font-bold"
                [ngClass]="isStaffReports() ? 'text-[#96ff00]' : 'text-white/90'"
              >
                <ng-icon
                  name="lucideTrendingUp"
                  class="mr-1 text-sm"
                  [ngClass]="isStaffReports() ? 'text-[#96ff00]' : 'text-white'"
                ></ng-icon>
                {{ totalAvailableCopies() }} copies available
              </p>
            </div>
            <div
              class="w-12 h-12 rounded-2xl flex items-center justify-center transition-colors"
              [ngClass]="isStaffReports()
                ? 'bg-[#96ff00]/10 border border-[#96ff00]/25 text-[#96ff00] shadow-lg shadow-[#96ff00]/10'
                : 'bg-white/10 border border-white/20 text-white shadow-lg shadow-white/5'"
            >
              <ng-icon name="lucideBookOpen" class="text-2xl"></ng-icon>
            </div>
          </div>
        </div>

        <!-- Card 2: Members -->
        <div
          hlmCard
          class="p-5 glass-card transition-all"
          [ngClass]="isStaffReports() ? 'border border-[#96ff00]/20 hover:border-[#96ff00]/40' : 'border-zinc-800 hover:border-white/40'"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Registered Members</p>
              <h3 class="text-3xl font-black text-foreground mt-1">{{ totalMembers() }}</h3>
              <p
                class="text-xs mt-1.5 font-bold"
                [ngClass]="isStaffReports() ? 'text-[#96ff00]' : 'text-white/90'"
              >
                {{ activeMembers() }} active status
              </p>
            </div>
            <div
              class="w-12 h-12 rounded-2xl flex items-center justify-center transition-colors"
              [ngClass]="isStaffReports()
                ? 'bg-[#96ff00]/10 border border-[#96ff00]/25 text-[#96ff00] shadow-lg shadow-[#96ff00]/10'
                : 'bg-white/10 border border-white/20 text-white shadow-lg shadow-white/5'"
            >
              <ng-icon name="lucideUsers" class="text-2xl"></ng-icon>
            </div>
          </div>
        </div>

        <!-- Card 3: Active Loans -->
        <div
          hlmCard
          class="p-5 glass-card transition-all"
          [ngClass]="isStaffReports() ? 'border border-[#96ff00]/20 hover:border-[#96ff00]/40' : 'border-zinc-800 hover:border-white/40'"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Active Borrowings</p>
              <h3 class="text-3xl font-black text-foreground mt-1">{{ activeLoans() }}</h3>
              <p
                class="text-xs mt-1.5 font-bold"
                [ngClass]="isStaffReports() ? 'text-[#96ff00]' : 'text-white/90'"
              >
                Currently checked out
              </p>
            </div>
            <div
              class="w-12 h-12 rounded-2xl flex items-center justify-center transition-colors"
              [ngClass]="isStaffReports()
                ? 'bg-[#96ff00]/10 border border-[#96ff00]/25 text-[#96ff00] shadow-lg shadow-[#96ff00]/10'
                : 'bg-white/10 border border-white/20 text-white shadow-lg shadow-white/5'"
            >
              <ng-icon name="lucideBookmarkCheck" class="text-2xl"></ng-icon>
            </div>
          </div>
        </div>

        <!-- Card 4: Overdue Items -->
        <div
          hlmCard
          class="p-5 glass-card transition-all"
          [ngClass]="isStaffReports() ? 'border border-[#96ff00]/20 hover:border-[#96ff00]/40' : 'border-zinc-800 hover:border-white/40'"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Overdue Items</p>
              <h3 class="text-3xl font-black text-white mt-1">{{ overdueLoans() }}</h3>
              <p class="text-xs text-zinc-400 mt-1.5 font-bold">Pending return</p>
            </div>
            <div
              class="w-12 h-12 rounded-2xl flex items-center justify-center transition-colors"
              [ngClass]="isStaffReports()
                ? 'bg-[#96ff00]/10 border border-[#96ff00]/25 text-[#96ff00] shadow-lg shadow-[#96ff00]/10'
                : 'bg-white/10 border border-white/20 text-white shadow-lg shadow-white/5'"
            >
              <ng-icon name="lucideCircleAlert" class="text-2xl"></ng-icon>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Borrowings Feed & Quick Stats -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Table Feed -->
        <div
          hlmCard
          class="lg:col-span-2 p-6"
          [ngClass]="isStaffReports() ? 'border border-[#96ff00]/20' : ''"
        >
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-lg font-bold text-foreground">Recent Loan Records</h3>
              <p class="text-xs text-muted-foreground">Latest transactions across the library</p>
            </div>
            <a
              [routerLink]="borrowingsLink()"
              hlmBtn
              variant="outline"
              size="sm"
              class="text-xs font-bold"
              [ngClass]="isStaffReports()
                ? 'border-[#96ff00]/30 text-[#96ff00] hover:bg-[#96ff00]/15'
                : 'border-zinc-700 text-white hover:bg-zinc-800'"
            >
              View All
            </a>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead class="text-xs uppercase text-muted-foreground border-b border-border/50">
                <tr>
                  <th class="py-3 px-2 font-semibold">Book ID</th>
                  <th class="py-3 px-2 font-semibold">Member ID</th>
                  <th class="py-3 px-2 font-semibold">Due Date</th>
                  <th class="py-3 px-2 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-border/30">
                <tr
                  *ngFor="let item of recentBorrowings()"
                  class="transition-colors"
                  [ngClass]="isStaffReports() ? 'hover:bg-[#96ff00]/5' : 'hover:bg-muted/30'"
                >
                  <td class="py-3.5 px-2 font-mono text-xs text-foreground">{{ item.bookId }}</td>
                  <td class="py-3.5 px-2 font-mono text-xs text-muted-foreground">{{ item.memberId }}</td>
                  <td class="py-3.5 px-2 text-xs text-muted-foreground">{{ item.dueDate | date:'mediumDate' }}</td>
                  <td class="py-3.5 px-2 text-right">
                    <span
                      hlmBadge
                      [variant]="item.status === 'Returned' ? 'success' : (item.status === 'Overdue' ? 'destructive' : 'outline')"
                      class="text-[10px] font-bold"
                      [ngClass]="(isStaffReports() && item.status === 'Borrowed') ? '!text-[#96ff00] !border-[#96ff00]/30 !bg-[#96ff00]/10' : ''"
                    >
                      {{ item.status }}
                    </span>
                  </td>
                </tr>
                <tr *ngIf="recentBorrowings().length === 0">
                  <td colspan="4" class="py-8 text-center text-muted-foreground text-xs">
                    No borrowing records found.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Right Side Quick Card -->
        <div
          hlmCard
          class="p-6 space-y-6"
          [ngClass]="isStaffReports() ? 'border border-[#96ff00]/20' : ''"
        >
          <div>
            <h3 class="text-lg font-bold text-foreground">Category Distribution</h3>
            <p class="text-xs text-muted-foreground mt-0.5">Top genres in catalog</p>
          </div>

          <div class="space-y-4">
            <div *ngFor="let cat of categoryStats()" class="space-y-1.5">
              <div class="flex justify-between text-xs font-semibold">
                <span class="text-foreground">{{ cat.name }}</span>
                <span class="text-muted-foreground" [ngClass]="isStaffReports() ? 'text-[#96ff00] font-bold' : ''">{{ cat.count }} books</span>
              </div>
              <div class="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  [ngClass]="isStaffReports() ? 'bg-gradient-to-r from-[#96ff00] to-[#85e600] shadow-sm shadow-[#96ff00]/30' : 'bg-gradient-to-r from-white to-zinc-400'"
                  [style.width.%]="cat.percentage"
                ></div>
              </div>
            </div>
            <div *ngIf="categoryStats().length === 0" class="text-xs text-muted-foreground py-4 text-center">
              No categories populated yet.
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private router = inject(Router);
  authService = inject(AuthService);
  bookService = inject(BookService);
  memberService = inject(MemberService);
  borrowingService = inject(BorrowingService);

  isStaffReports = computed(() => {
    const url = (this.router.url || '').toLowerCase();
    return url.includes('/staff') || this.authService.isLibrarian();
  });

  booksLink = computed(() => {
    if (this.authService.isAdmin()) return '/admin/books';
    if (this.authService.isLibrarian()) return '/staff/books';
    return '/student/books';
  });

  borrowingsLink = computed(() => {
    if (this.authService.isAdmin()) return '/admin/borrowings';
    if (this.authService.isLibrarian()) return '/staff/borrowings';
    return '/student/borrowings';
  });

  totalBooks = computed(() => this.bookService.books().length);
  totalAvailableCopies = computed(() => this.bookService.books().reduce((acc, b) => acc + (b.availableCopies || 0), 0));
  totalMembers = computed(() => this.memberService.members().length);
  activeMembers = computed(() => this.memberService.members().filter(m => m.isActive).length);

  activeLoans = computed(() => this.borrowingService.borrowings().filter(b => b.status === 'Borrowed' || b.status === 'Overdue').length);
  overdueLoans = computed(() => this.borrowingService.borrowings().filter(b => b.status === 'Overdue').length);

  recentBorrowings = computed(() => this.borrowingService.borrowings().slice(0, 5));

  categoryStats = computed(() => {
    const books = this.bookService.books();
    if (!books.length) return [];
    const counts: Record<string, number> = {};
    books.forEach(b => {
      const cat = b.category || 'General';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({
      name,
      count,
      percentage: Math.min(100, Math.round((count / books.length) * 100))
    }));
  });

  ngOnInit() {
    this.bookService.loadAll().subscribe();
    this.memberService.loadAll().subscribe();
    this.borrowingService.loadAll().subscribe();
  }
}
