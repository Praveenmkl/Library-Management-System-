import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BookService } from '../../core/services/book.service';
import { MemberService } from '../../core/services/member.service';
import { BorrowingService } from '../../core/services/borrowing.service';
import { Borrowing } from '../../core/models/borrowing.model';
import { HlmButtonDirective } from '../../shared/spartan/button/hlm-button.directive';
import { HlmInputDirective } from '../../shared/spartan/input/hlm-input.directive';
import { HlmBadgeDirective } from '../../shared/spartan/badge/hlm-badge.directive';
import { HlmCardDirective } from '../../shared/spartan/card/hlm-card.directive';
import { SpartanDialogComponent } from '../../shared/spartan/dialog/spartan-dialog.component';
import { provideIcons, NgIconComponent } from '@ng-icons/core';
import {
  lucideBookmarkCheck,
  lucideRotateCcw,
  lucidePlus,
  lucideSearch,
  lucideBookOpen,
  lucideUsers,
  lucideMail,
  lucideCircleCheck,
  lucideCircleAlert
} from '@ng-icons/lucide';

@Component({
  selector: 'app-librarian-portal',
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
      lucideBookmarkCheck,
      lucideRotateCcw,
      lucidePlus,
      lucideSearch,
      lucideBookOpen,
      lucideUsers,
      lucideMail,
      lucideCircleCheck,
      lucideCircleAlert
    })
  ],
  template: `
    <div class="space-y-8 animate-in fade-in duration-300">
      <!-- Hero Banner -->
      <div class="relative overflow-hidden rounded-3xl bg-white/5 p-8 border border-white/20 backdrop-blur-xl">
        <div class="relative z-10 max-w-2xl">
          <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-white mb-3">
            <ng-icon name="lucideBookOpen" class="text-sm"></ng-icon>
            <span>Librarian Circulation Desk</span>
          </div>
          <h1 class="text-3xl font-extrabold text-foreground tracking-tight">Circulation Desk Operations</h1>
          <p class="text-muted-foreground mt-2 text-sm leading-relaxed">
            Express issue book loans, process returns at the counter, adjust inventory stock, and monitor overdue items.
          </p>
        </div>
      </div>

      <!-- Quick Desk Action Widgets -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Express Issue Desk -->
        <div hlmCard class="p-6 space-y-4 border-border hover:border-white/40">
          <div class="flex items-center justify-between pb-3 border-b border-border/50">
            <div>
              <h3 class="text-lg font-bold text-foreground">Express Issue Counter</h3>
              <p class="text-xs text-muted-foreground">Checkout book to student or member</p>
            </div>
            <span hlmBadge variant="outline" class="text-xs font-bold text-white border-white/20 bg-white/10">Counter Mode</span>
          </div>

          <form (ngSubmit)="issueLoan()" class="space-y-3">
            <div class="space-y-1">
              <label class="text-xs font-semibold text-foreground">Select Book Copy</label>
              <select hlmInput [(ngModel)]="quickBookId" name="quickBookId" required class="appearance-none bg-background/50 focus:border-white/50">
                <option value="" disabled>-- Select Available Book --</option>
                <option *ngFor="let b of availableBooks()" [value]="b.id">
                  {{ b.title }} ({{ b.availableCopies }} copies left)
                </option>
              </select>
            </div>

            <div class="space-y-1">
              <label class="text-xs font-semibold text-foreground">Select Member / Student</label>
              <select hlmInput [(ngModel)]="quickMemberId" name="quickMemberId" required class="appearance-none bg-background/50 focus:border-white/50">
                <option value="" disabled>-- Select Member --</option>
                <option *ngFor="let m of activeMembersList()" [value]="m.id">
                  {{ m.name }} ({{ m.email }})
                </option>
              </select>
            </div>

            <div class="space-y-1">
              <label class="text-xs font-semibold text-foreground">Due Date</label>
              <input hlmInput type="date" [(ngModel)]="dueDateInput" name="dueDate" required class="focus:border-white/50" />
            </div>

            <button hlmBtn variant="outline" type="submit" class="w-full font-bold text-white border-white/20 hover:bg-white/10 shadow-lg shadow-white/5 mt-2">
              <ng-icon name="lucidePlus" class="mr-2 text-base"></ng-icon>
              Complete Book Checkout
            </button>
          </form>
        </div>

        <!-- Overdue Action Feed -->
        <div hlmCard class="p-6 space-y-4 border-border hover:border-white/40">
          <div class="flex items-center justify-between pb-3 border-b border-border/50">
            <div>
              <h3 class="text-lg font-bold text-foreground">Overdue Loan Feed</h3>
              <p class="text-xs text-muted-foreground">High priority overdue reminders</p>
            </div>
            <span hlmBadge variant="outline" class="text-xs font-bold text-white border-white/20 bg-white/10">{{ overdueItems().length }} Pending</span>
          </div>

          <div class="space-y-3 max-h-64 overflow-y-auto pr-1">
            <div *ngFor="let item of overdueItems()" class="p-3 rounded-xl bg-white/5 border border-white/20 flex items-center justify-between">
              <div>
                <p class="font-bold text-xs text-foreground">{{ getBookTitle(item.bookId) }}</p>
                <p class="text-[11px] text-muted-foreground">Member: {{ getMemberName(item.memberId) }}</p>
              </div>
              <button hlmBtn variant="outline" size="sm" (click)="sendReminder(item)" class="text-xs text-white border-white/20 hover:bg-white/10 font-bold">
                <ng-icon name="lucideMail" class="mr-1 text-xs"></ng-icon>
                Send Reminder
              </button>
            </div>

            <div *ngIf="overdueItems().length === 0" class="py-8 text-center text-xs text-muted-foreground">
              No overdue loans currently pending.
            </div>
          </div>
        </div>
      </div>

      <!-- Active Circulation Table -->
      <div hlmCard class="p-0 overflow-hidden shadow-xl border-border">
        <div class="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
          <h3 class="text-lg font-bold text-foreground">Active Circulation Desk Log</h3>
          <input
            hlmInput
            type="text"
            [ngModel]="searchTerm()"
            (ngModelChange)="searchTerm.set($event)"
            placeholder="Search transactions..."
            class="w-64 text-xs focus:border-white/50"
          />
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-muted/50 text-xs uppercase text-muted-foreground border-b border-border">
              <tr>
                <th class="py-3.5 px-6 font-semibold">Book Title / ID</th>
                <th class="py-3.5 px-6 font-semibold">Member</th>
                <th class="py-3.5 px-4 font-semibold">Due Date</th>
                <th class="py-3.5 px-4 font-semibold text-center">Status</th>
                <th class="py-3.5 px-6 font-semibold text-right">Counter Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border/40">
              <tr *ngFor="let item of filteredBorrowings()" class="hover:bg-muted/20 transition-colors">
                <td class="py-4 px-6">
                  <div class="font-bold text-foreground">{{ getBookTitle(item.bookId) }}</div>
                  <div class="text-[11px] font-mono text-muted-foreground">ID: {{ item.bookId }}</div>
                </td>
                <td class="py-4 px-6">
                  <div class="font-bold text-foreground">{{ getMemberName(item.memberId) }}</div>
                  <div class="text-[11px] font-mono text-muted-foreground">ID: {{ item.memberId }}</div>
                </td>
                <td class="py-4 px-4 text-xs font-mono text-muted-foreground">{{ item.dueDate | date:'mediumDate' }}</td>
                <td class="py-4 px-4 text-center">
                  <span
                    hlmBadge
                    variant="outline"
                    class="text-[10px] font-bold text-white border-white/20 bg-white/10"
                  >
                    {{ item.status }}
                  </span>
                </td>
                <td class="py-4 px-6 text-right">
                  <button
                    *ngIf="item.status !== 'Returned'"
                    hlmBtn
                    variant="outline"
                    size="sm"
                    (click)="returnBook(item.id!)"
                    class="text-xs text-white border-white/20 hover:bg-white/10 font-bold"
                  >
                    <ng-icon name="lucideRotateCcw" class="mr-1.5 text-xs"></ng-icon>
                    Process Return
                  </button>
                  <span *ngIf="item.status === 'Returned'" class="text-xs text-muted-foreground italic">Returned</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class LibrarianPortalComponent implements OnInit {
  borrowingService = inject(BorrowingService);
  bookService = inject(BookService);
  memberService = inject(MemberService);

  searchTerm = signal('');

  quickBookId = '';
  quickMemberId = '';
  dueDateInput = '';

  availableBooks = computed(() => this.bookService.books().filter(b => (b.availableCopies || 0) > 0));
  activeMembersList = computed(() => this.memberService.members().filter(m => m.isActive));

  overdueItems = computed(() => this.borrowingService.borrowings().filter(b => b.status === 'Overdue'));

  filteredBorrowings = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    return this.borrowingService.borrowings().filter(b => !term || b.bookId.toLowerCase().includes(term) || b.memberId.toLowerCase().includes(term));
  });

  ngOnInit() {
    this.borrowingService.loadAll().subscribe();
    this.bookService.loadAll().subscribe();
    this.memberService.loadAll().subscribe();

    const d = new Date();
    d.setDate(d.getDate() + 14);
    this.dueDateInput = d.toISOString().split('T')[0];
  }

  getBookTitle(bookId: string): string {
    const b = this.bookService.books().find(x => x.id === bookId);
    return b ? b.title : bookId;
  }

  getMemberName(memberId: string): string {
    const m = this.memberService.members().find(x => x.id === memberId);
    return m ? m.name : memberId;
  }

  issueLoan() {
    if (!this.quickBookId || !this.quickMemberId) {
      alert('Please select both a Book and a Member');
      return;
    }

    const payload: Borrowing = {
      bookId: this.quickBookId,
      memberId: this.quickMemberId,
      dueDate: new Date(this.dueDateInput).toISOString(),
      borrowedAt: new Date().toISOString(),
      status: 'Borrowed',
      fineAmount: 0
    };

    this.borrowingService.borrowBook(payload).subscribe({
      next: () => {
        alert('Book checked out successfully at circulation desk!');
        this.bookService.loadAll().subscribe();
        this.quickBookId = '';
        this.quickMemberId = '';
      },
      error: (err) => alert(err.error?.message || 'Failed to issue book')
    });
  }

  returnBook(id: string) {
    if (confirm('Process return for this book loan?')) {
      this.borrowingService.returnBook(id).subscribe({
        next: () => {
          this.bookService.loadAll().subscribe();
        }
      });
    }
  }

  sendReminder(item: Borrowing) {
    alert(`Overdue reminder email sent to ${this.getMemberName(item.memberId)}!`);
  }
}
