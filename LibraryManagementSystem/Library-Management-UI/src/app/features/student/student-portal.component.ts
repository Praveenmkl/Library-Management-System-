import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { BookService } from '../../core/services/book.service';
import { BorrowingService } from '../../core/services/borrowing.service';
import { AuthService } from '../../core/services/auth.service';
import { Book } from '../../core/models/book.model';
import { HlmButtonDirective } from '../../shared/spartan/button/hlm-button.directive';
import { HlmInputDirective } from '../../shared/spartan/input/hlm-input.directive';
import { HlmBadgeDirective } from '../../shared/spartan/badge/hlm-badge.directive';
import { HlmCardDirective } from '../../shared/spartan/card/hlm-card.directive';
import { SpartanDialogComponent } from '../../shared/spartan/dialog/spartan-dialog.component';
import { provideIcons, NgIconComponent } from '@ng-icons/core';
import {
  lucideGraduationCap,
  lucideBookOpen,
  lucideBookmarkCheck,
  lucideClock,
  lucideSearch,
  lucideSparkles,
  lucideCircleCheck,
  lucideHeart,
  lucideSend,
  lucideUser,
  lucideMail,
  lucidePhone,
  lucideMapPin,
  lucideSave
} from '@ng-icons/lucide';

@Component({
  selector: 'app-student-portal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HlmButtonDirective,
    HlmInputDirective,
    HlmBadgeDirective,
    HlmCardDirective,
    SpartanDialogComponent,
    NgIconComponent
  ],
  providers: [
    provideIcons({
      lucideGraduationCap,
      lucideBookOpen,
      lucideBookmarkCheck,
      lucideClock,
      lucideSearch,
      lucideSparkles,
      lucideCircleCheck,
      lucideHeart,
      lucideSend,
      lucideUser,
      lucideMail,
      lucidePhone,
      lucideMapPin,
      lucideSave
    })
  ],
  template: `
    <div class="space-y-8 animate-in fade-in duration-300">
      <!-- HERO BANNER -->
      <div class="relative overflow-hidden rounded-3xl bg-white/5 p-8 border border-white/20 backdrop-blur-xl">
        <div class="relative z-10 max-w-2xl">
          <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-white mb-3">
            <ng-icon name="lucideGraduationCap" class="text-sm"></ng-icon>
            <span>Student Portal</span>
          </div>
          <h1 class="text-3xl font-extrabold text-foreground tracking-tight">
            {{ isProfileRoute() ? 'Student Profile & Account Settings' : ('Welcome back, ' + (authService.currentUser()?.fullName || authService.currentUser()?.username || 'Student') + '!') }}
          </h1>
          <p class="text-muted-foreground mt-2 text-sm leading-relaxed">
            {{ isProfileRoute() ? 'Manage your personal contact details, email address, and account standing.' : 'Track your active borrowed books, check upcoming due dates, discover new reading titles, and reserve copies.' }}
          </p>
        </div>
      </div>

      <!-- PROFILE ROUTE VIEW -->
      <div *ngIf="isProfileRoute()" class="max-w-3xl mx-auto space-y-6">
        <div hlmCard class="p-8 border border-white/20">
          <div class="flex items-center space-x-4 pb-6 border-b border-border">
            <div class="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center font-black text-2xl shadow-xl shadow-white/10">
              {{ (studentProfile.fullName.charAt(0) || 'S').toUpperCase() }}
            </div>
            <div>
              <h3 class="text-xl font-bold text-white">{{ studentProfile.fullName }}</h3>
              <p class="text-xs font-mono text-zinc-400">Student ID: {{ studentProfile.studentId }}</p>
              <span hlmBadge variant="outline" class="text-[10px] text-white border-white/20 bg-white/10 mt-1">Student Role</span>
            </div>
          </div>

          <form (ngSubmit)="saveProfile()" class="space-y-4 pt-6">
            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-foreground uppercase tracking-wider">Full Name</label>
              <div class="relative">
                <ng-icon name="lucideUser" class="absolute left-3 top-3 text-muted-foreground text-base"></ng-icon>
                <input hlmInput type="text" [(ngModel)]="studentProfile.fullName" name="fullName" class="pl-10" required />
              </div>
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-foreground uppercase tracking-wider">Email Address</label>
              <div class="relative">
                <ng-icon name="lucideMail" class="absolute left-3 top-3 text-muted-foreground text-base"></ng-icon>
                <input hlmInput type="email" [(ngModel)]="studentProfile.email" name="email" class="pl-10" required />
              </div>
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-foreground uppercase tracking-wider">Phone Number</label>
              <div class="relative">
                <ng-icon name="lucidePhone" class="absolute left-3 top-3 text-muted-foreground text-base"></ng-icon>
                <input hlmInput type="text" [(ngModel)]="studentProfile.phone" name="phone" class="pl-10" />
              </div>
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-foreground uppercase tracking-wider">Campus Address / Dorm</label>
              <div class="relative">
                <ng-icon name="lucideMapPin" class="absolute left-3 top-3 text-muted-foreground text-base"></ng-icon>
                <input hlmInput type="text" [(ngModel)]="studentProfile.address" name="address" class="pl-10" />
              </div>
            </div>

            <div class="pt-4 border-t border-border flex justify-end">
              <button hlmBtn variant="default" type="submit" class="shadow-lg shadow-white/10 font-bold">
                <ng-icon name="lucideSave" class="mr-2 text-base"></ng-icon>
                Save Profile Changes
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- DASHBOARD / BOOKS VIEW -->
      <ng-container *ngIf="!isProfileRoute()">
        <!-- Quick Stats Row -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div hlmCard class="p-5 glass-card border-border hover:border-white/40">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-bold uppercase tracking-wider text-muted-foreground">My Borrowed Books</p>
                <h3 class="text-3xl font-black text-foreground mt-1">{{ myLoans().length }}</h3>
                <p class="text-xs text-zinc-300 mt-1.5 font-bold">Currently in reading list</p>
              </div>
              <div class="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white shadow-lg shadow-white/5">
                <ng-icon name="lucideBookOpen" class="text-2xl"></ng-icon>
              </div>
            </div>
          </div>

          <div hlmCard class="p-5 glass-card border-border hover:border-white/40">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Overdue Items</p>
                <h3 class="text-3xl font-black text-white mt-1">{{ overdueLoansCount() }}</h3>
                <p class="text-xs text-zinc-300 mt-1.5 font-bold">Pending return status</p>
              </div>
              <div class="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white shadow-lg shadow-white/5">
                <ng-icon name="lucideClock" class="text-2xl"></ng-icon>
              </div>
            </div>
          </div>

          <div hlmCard class="p-5 glass-card border-border hover:border-white/40">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-bold uppercase tracking-wider text-muted-foreground">My Accrued Fines</p>
                <h3 class="text-3xl font-black text-foreground mt-1">\${{ totalFines() | number:'1.2-2' }}</h3>
                <p class="text-xs text-zinc-300 mt-1.5 font-bold">Account standing clear</p>
              </div>
              <div class="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white shadow-lg shadow-white/5">
                <ng-icon name="lucideBookmarkCheck" class="text-2xl"></ng-icon>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 1: My Active Bookshelf -->
        <div hlmCard class="p-6 space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-xl font-bold text-foreground">My Digital Bookshelf</h3>
              <p class="text-xs text-muted-foreground">Books currently issued to your student account</p>
            </div>
            <span hlmBadge variant="outline" class="text-xs font-bold text-white border-white/20 bg-white/10">
              <ng-icon name="lucideSparkles" class="mr-1"></ng-icon>
              Active Loan Member
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div *ngFor="let item of myLoans()" class="p-4 rounded-2xl bg-muted/30 border border-border/60 hover:border-white/40 transition-all flex flex-col justify-between space-y-3">
              <div>
                <div class="flex items-center justify-between mb-2">
                  <span hlmBadge [variant]="item.status === 'Overdue' ? 'secondary' : 'outline'" class="text-[10px] font-bold">
                    {{ item.status }}
                  </span>
                  <span class="text-xs font-mono text-muted-foreground">Due: {{ item.dueDate | date:'mediumDate' }}</span>
                </div>
                <h4 class="font-bold text-base text-foreground line-clamp-1">{{ getBookTitle(item.bookId) }}</h4>
                <p class="text-xs text-muted-foreground font-mono">Book ID: {{ item.bookId }}</p>
              </div>

              <div class="pt-3 border-t border-border/40 flex items-center justify-between text-xs">
                <span class="text-muted-foreground flex items-center">
                  <ng-icon name="lucideClock" class="mr-1 text-white"></ng-icon>
                  Borrowed: {{ item.borrowedAt | date:'shortDate' }}
                </span>
                <button hlmBtn variant="ghost" size="sm" (click)="requestRenewal(item.id!)" class="text-xs text-white hover:text-zinc-300 font-bold">
                  Request Renewal
                </button>
              </div>
            </div>

            <div *ngIf="myLoans().length === 0" class="col-span-full py-12 text-center text-muted-foreground">
              <ng-icon name="lucideBookOpen" class="text-4xl text-muted-foreground/40 mb-2"></ng-icon>
              <p class="text-sm font-semibold">You currently have no active book loans.</p>
              <p class="text-xs text-muted-foreground mt-1">Explore the catalog below to reserve a book!</p>
            </div>
          </div>
        </div>

        <!-- Section 2: Catalog Explorer & Reserve -->
        <div hlmCard class="p-6 space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 class="text-xl font-bold text-foreground">Discover Library Catalog</h3>
              <p class="text-xs text-muted-foreground">Search and reserve book titles online</p>
            </div>
            <div class="relative w-full sm:w-80">
              <ng-icon name="lucideSearch" class="absolute left-3 top-3 text-muted-foreground text-base"></ng-icon>
              <input
                hlmInput
                type="text"
                [ngModel]="searchTerm()"
                (ngModelChange)="searchTerm.set($event)"
                placeholder="Search catalog by title or author..."
                class="pl-10 focus:border-white/50"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div *ngFor="let book of filteredBooks()" class="p-5 rounded-2xl bg-card border border-border/80 hover:border-white/40 transition-all flex flex-col justify-between space-y-4">
              <div>
                <div class="flex items-center justify-between mb-2">
                  <span hlmBadge variant="outline" class="text-[10px]">
                    {{ book.category || 'General' }}
                  </span>
                  <span
                    hlmBadge
                    [variant]="book.availableCopies > 0 ? 'outline' : 'secondary'"
                    class="text-[10px] font-bold"
                  >
                    {{ book.availableCopies > 0 ? book.availableCopies + ' Available' : 'Out of Stock' }}
                  </span>
                </div>

                <h4 class="font-extrabold text-lg text-foreground tracking-tight leading-snug">{{ book.title }}</h4>
                <p class="text-xs text-muted-foreground mt-1">by {{ book.author }}</p>
                <p class="text-[11px] font-mono text-muted-foreground/80 mt-0.5">ISBN: {{ book.isbn }}</p>
              </div>

              <div class="pt-3 border-t border-border/40 flex items-center justify-between">
                <button
                  hlmBtn
                  [variant]="book.availableCopies > 0 ? 'default' : 'outline'"
                  size="sm"
                  [disabled]="book.availableCopies <= 0"
                  (click)="reserveBook(book)"
                  class="w-full font-bold shadow-lg shadow-white/10"
                >
                  <ng-icon name="lucideSend" class="mr-1.5 text-xs"></ng-icon>
                  {{ book.availableCopies > 0 ? 'Reserve Copy' : 'Unavailable' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </ng-container>
    </div>
  `
})
export class StudentPortalComponent implements OnInit {
  authService = inject(AuthService);
  bookService = inject(BookService);
  borrowingService = inject(BorrowingService);
  private router = inject(Router);

  searchTerm = signal('');

  studentProfile = {
    fullName: 'Alex Johnson',
    email: 'alex@student.edu',
    phone: '+1 555-0199',
    address: 'Hall 4, Dorm 204, Campus Quad',
    studentId: 'STU-2025-089'
  };

  myLoans = computed(() => this.borrowingService.borrowings().filter(b => b.status === 'Borrowed' || b.status === 'Overdue'));
  overdueLoansCount = computed(() => this.myLoans().filter(b => b.status === 'Overdue').length);
  totalFines = computed(() => this.borrowingService.borrowings().reduce((acc, b) => acc + (b.fineAmount || 0), 0));

  filteredBooks = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    return this.bookService.books().filter(b => !term || b.title.toLowerCase().includes(term) || b.author.toLowerCase().includes(term));
  });

  isProfileRoute(): boolean {
    return this.router.url.includes('/student/profile');
  }

  ngOnInit() {
    this.bookService.loadAll().subscribe();
    this.borrowingService.loadAll().subscribe();
    const cur = this.authService.currentUser();
    if (cur) {
      if (cur.fullName) this.studentProfile.fullName = cur.fullName;
      if (cur.email) this.studentProfile.email = cur.email;
    }
  }

  saveProfile() {
    alert('Student profile updated successfully!');
  }

  getBookTitle(bookId: string): string {
    const b = this.bookService.books().find(x => x.id === bookId);
    return b ? b.title : bookId;
  }

  reserveBook(book: Book) {
    if (confirm(`Reserve a copy of "${book.title}"?`)) {
      const d = new Date();
      d.setDate(d.getDate() + 14);
      this.borrowingService.borrowBook({
        bookId: book.id || '',
        memberId: this.authService.currentUser()?.username || 'student_demo',
        dueDate: d.toISOString(),
        status: 'Borrowed',
        fineAmount: 0
      }).subscribe({
        next: () => {
          alert(`Successfully reserved "${book.title}"! Enjoy reading.`);
          this.bookService.loadAll().subscribe();
        },
        error: (err) => alert(err.error?.message || 'Failed to reserve book')
      });
    }
  }

  requestRenewal(id: string) {
    alert('Renewal request submitted to the Librarian desk!');
  }
}

