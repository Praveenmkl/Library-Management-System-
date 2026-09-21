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
      <div class="relative overflow-hidden rounded-3xl p-8 border border-brand-500/30 backdrop-blur-xl">
        <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(245,158,11,0.15)_0%,_transparent_60%)]"></div>
        <div class="relative z-10 max-w-2xl">
          <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/15 border border-brand-500/30 text-xs font-bold text-brand-300 mb-3">
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
        <div hlmCard class="p-8 border border-brand-500/20">
          <div class="flex items-center space-x-4 pb-6 border-b border-border">
            <div class="w-16 h-16 rounded-full flex items-center justify-center font-black text-2xl shadow-xl text-white bg-gradient-to-br from-brand-500 to-brand-600 shadow-brand-500/30">
              {{ (studentProfile.fullName.charAt(0) || 'S').toUpperCase() }}
            </div>
            <div>
              <h3 class="text-xl font-bold text-white">{{ studentProfile.fullName }}</h3>
              <p class="text-xs font-mono text-zinc-400">Student ID: {{ studentProfile.studentId }}</p>
              <span hlmBadge variant="outline" class="text-[10px] text-brand-300 border-brand-500/30 bg-brand-500/10 mt-1">Student Role</span>
            </div>
          </div>

          <form (ngSubmit)="saveProfile()" class="space-y-4 pt-6">
            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-foreground uppercase tracking-wider">Full Name</label>
              <div class="relative">
                <ng-icon name="lucideUser" class="absolute left-3 top-3 text-brand-400/60 text-base"></ng-icon>
                <input hlmInput type="text" [(ngModel)]="studentProfile.fullName" name="fullName" class="pl-10 focus:border-brand-500/50 focus:ring-brand-500/20" required />
              </div>
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-foreground uppercase tracking-wider">Email Address</label>
              <div class="relative">
                <ng-icon name="lucideMail" class="absolute left-3 top-3 text-brand-400/60 text-base"></ng-icon>
                <input hlmInput type="email" [(ngModel)]="studentProfile.email" name="email" class="pl-10 focus:border-brand-500/50 focus:ring-brand-500/20" required />
              </div>
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-foreground uppercase tracking-wider">Phone Number</label>
              <div class="relative">
                <ng-icon name="lucidePhone" class="absolute left-3 top-3 text-brand-400/60 text-base"></ng-icon>
                <input hlmInput type="text" [(ngModel)]="studentProfile.phone" name="phone" class="pl-10 focus:border-brand-500/50 focus:ring-brand-500/20" />
              </div>
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-foreground uppercase tracking-wider">Campus Address / Dorm</label>
              <div class="relative">
                <ng-icon name="lucideMapPin" class="absolute left-3 top-3 text-brand-400/60 text-base"></ng-icon>
                <input hlmInput type="text" [(ngModel)]="studentProfile.address" name="address" class="pl-10 focus:border-brand-500/50 focus:ring-brand-500/20" />
              </div>
            </div>

            <div class="pt-4 border-t border-border flex justify-end">
              <button hlmBtn variant="default" type="submit" class="font-bold !bg-gradient-to-br !from-brand-500 !to-brand-600 !text-white !border-0 shadow-lg shadow-brand-500/30 hover:!from-brand-600 hover:!to-brand-700">
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
          <div hlmCard class="p-5 glass-card border-border hover:border-brand-500/40 group">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-bold uppercase tracking-wider text-muted-foreground">My Borrowed Books</p>
                <h3 class="text-3xl font-black text-foreground mt-1">{{ myLoans().length }}</h3>
                <p class="text-xs text-brand-300/70 mt-1.5 font-bold">Currently in reading list</p>
              </div>
              <div class="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/25 flex items-center justify-center text-brand-400 shadow-lg shadow-brand-500/5 group-hover:shadow-brand-500/15 transition-shadow">
                <ng-icon name="lucideBookOpen" class="text-2xl"></ng-icon>
              </div>
            </div>
          </div>

          <div hlmCard class="p-5 glass-card border-border hover:border-brand-500/40 group">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Overdue Items</p>
                <h3 class="text-3xl font-black text-white mt-1">{{ overdueLoansCount() }}</h3>
                <p class="text-xs text-brand-300/70 mt-1.5 font-bold">Pending return status</p>
              </div>
              <div class="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/25 flex items-center justify-center text-brand-400 shadow-lg shadow-brand-500/5 group-hover:shadow-brand-500/15 transition-shadow">
                <ng-icon name="lucideClock" class="text-2xl"></ng-icon>
              </div>
            </div>
          </div>

          <div hlmCard class="p-5 glass-card border-border hover:border-brand-500/40 group">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-bold uppercase tracking-wider text-muted-foreground">My Accrued Fines</p>
                <h3 class="text-3xl font-black text-foreground mt-1">\${{ totalFines() | number:'1.2-2' }}</h3>
                <p class="text-xs text-brand-300/70 mt-1.5 font-bold">Account standing clear</p>
              </div>
              <div class="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/25 flex items-center justify-center text-brand-400 shadow-lg shadow-brand-500/5 group-hover:shadow-brand-500/15 transition-shadow">
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
            <span hlmBadge variant="outline" class="text-xs font-bold text-brand-300 border-brand-500/30 bg-brand-500/10">
              <ng-icon name="lucideSparkles" class="mr-1"></ng-icon>
              Active Loan Member
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div *ngFor="let item of myLoans()" class="p-4 rounded-2xl bg-muted/30 border border-border/60 hover:border-brand-500/40 transition-all flex flex-col justify-between space-y-3">
              <div>
                <div class="flex items-center justify-between mb-2">
                  <span hlmBadge [variant]="item.status === 'Overdue' ? 'secondary' : 'outline'"
                        class="text-[10px] font-bold {{ item.status === 'Overdue' ? 'text-red-400' : 'border-brand-500/30 text-brand-300' }}"
                  >
                    {{ item.status }}
                  </span>
                  <span class="text-xs font-mono text-muted-foreground">Due: {{ item.dueDate | date:'mediumDate' }}</span>
                </div>
                <h4 class="font-bold text-base text-foreground line-clamp-1">{{ getBookTitle(item.bookId) }}</h4>
                <p class="text-xs text-muted-foreground font-mono">Book ID: {{ item.bookId }}</p>
              </div>

              <div class="pt-3 border-t border-border/40 flex items-center justify-end text-xs">
                <button hlmBtn variant="outline" size="sm" (click)="returnBook(item.id!)" class="text-xs text-brand-300 border-brand-500/30 hover:bg-brand-500/15 font-bold">
                  Return Book
                </button>
              </div>
            </div>

            <div *ngIf="myLoans().length === 0" class="col-span-full py-12 text-center text-muted-foreground">
              <ng-icon name="lucideBookOpen" class="text-4xl text-brand-500/30 mb-2"></ng-icon>
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
              <ng-icon name="lucideSearch" class="absolute left-3 top-3 text-brand-400/50 text-base"></ng-icon>
              <input
                hlmInput
                type="text"
                [ngModel]="searchTerm()"
                (ngModelChange)="searchTerm.set($event)"
                placeholder="Search catalog by title or author..."
                class="pl-10 focus:border-brand-500/50"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div *ngFor="let book of filteredBooks()" class="p-5 rounded-2xl bg-card border border-border/80 hover:border-brand-500/40 transition-all flex flex-col justify-between space-y-4">
              <div>
                <div class="flex items-center justify-between mb-2">
                  <span hlmBadge variant="outline" class="text-[10px] text-brand-300/80 border-brand-500/20">
                    {{ book.category || 'General' }}
                  </span>
                  <span
                    hlmBadge
                    [variant]="book.availableCopies > 0 ? 'outline' : 'secondary'"
                    class="text-[10px] font-bold {{ book.availableCopies > 0 ? 'text-emerald-400 border-emerald-500/30' : 'text-red-400' }}"
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
                  class="w-full font-bold"
                  [style.background]="book.availableCopies > 0 ? 'linear-gradient(135deg, #f59e0b, #d97706)' : ''"
                  [style.box-shadow]="book.availableCopies > 0 ? '0 6px 20px rgba(245,158,11,0.25)' : ''"
                  [class.text-white]="book.availableCopies > 0"
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

  myLoans = computed(() => {
    const cur = this.authService.currentUser();
    const memId = cur?.memberId;
    const email = cur?.email?.toLowerCase();
    const uname = cur?.username?.toLowerCase();

    return this.borrowingService.borrowings().filter(b => {
      const match = (memId && b.memberId === memId) ||
                    (email && b.memberId.toLowerCase() === email) ||
                    (uname && b.memberId.toLowerCase() === uname);
      return match && (b.status === 'Borrowed' || b.status === 'Overdue');
    });
  });

  overdueLoansCount = computed(() => this.myLoans().filter(b => b.status === 'Overdue').length);
  totalFines = computed(() => this.myLoans().reduce((acc, b) => acc + (b.fineAmount || 0), 0));

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
      if (cur.memberId) {
        this.studentProfile.studentId = cur.memberId;
      } else {
        this.authService.resolveMemberId(cur.username, cur.fullName).subscribe(id => {
          if (id) {
            this.studentProfile.studentId = id;
            this.borrowingService.loadAll().subscribe();
          }
        });
      }
    }
  }

  saveProfile() {
    this.authService.updateCurrentUserProfile({
      fullName: this.studentProfile.fullName,
      email: this.studentProfile.email
    });
    alert('Student profile updated successfully!');
  }

  getBookTitle(bookId: string): string {
    const b = this.bookService.books().find(x => x.id === bookId);
    return b ? b.title : bookId;
  }

  reserveBook(book: Book) {
    if (confirm(`Reserve a copy of "${book.title}"?`)) {
      const cur = this.authService.currentUser();
      const targetMemberId = cur?.memberId || cur?.email || cur?.username || 'student_demo';
      const d = new Date();
      d.setDate(d.getDate() + 14);

      this.borrowingService.borrowBook({
        bookId: book.id || '',
        memberId: targetMemberId,
        dueDate: d.toISOString(),
        status: 'Borrowed',
        fineAmount: 0
      }).subscribe({
        next: () => {
          alert(`Successfully reserved "${book.title}"! Enjoy reading.`);
          this.bookService.loadAll().subscribe();
          this.borrowingService.loadAll().subscribe();
        },
        error: (err) => alert(err.error?.message || 'Failed to reserve book')
      });
    }
  }

  returnBook(id: string) {
    if (confirm('Return this borrowed book now?')) {
      this.borrowingService.returnBook(id).subscribe({
        next: () => {
          alert('Book returned successfully!');
          this.bookService.loadAll().subscribe();
          this.borrowingService.loadAll().subscribe();
        },
        error: (err) => alert(err.error?.message || 'Failed to return book')
      });
    }
  }
}


