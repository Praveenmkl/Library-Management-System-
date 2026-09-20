import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BorrowingService } from '../../core/services/borrowing.service';
import { BookService } from '../../core/services/book.service';
import { MemberService } from '../../core/services/member.service';
import { AuthService } from '../../core/services/auth.service';
import { Borrowing } from '../../core/models/borrowing.model';
import { HlmButtonDirective } from '../../shared/spartan/button/hlm-button.directive';
import { HlmInputDirective } from '../../shared/spartan/input/hlm-input.directive';
import { HlmBadgeDirective } from '../../shared/spartan/badge/hlm-badge.directive';
import { HlmCardDirective } from '../../shared/spartan/card/hlm-card.directive';
import { SpartanDialogComponent } from '../../shared/spartan/dialog/spartan-dialog.component';
import { provideIcons, NgIconComponent } from '@ng-icons/core';
import { lucideBookmarkCheck, lucidePlus, lucideSearch, lucideRotateCcw, lucideCalendar, lucideBookOpen, lucideUser } from '@ng-icons/lucide';

@Component({
  selector: 'app-borrowings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HlmButtonDirective,
    HlmInputDirective,
    HlmBadgeDirective,
    HlmCardDirective,
    SpartanDialogComponent,
    NgIconComponent
  ],
  providers: [provideIcons({ lucideBookmarkCheck, lucidePlus, lucideSearch, lucideRotateCcw, lucideCalendar, lucideBookOpen, lucideUser })],
  template: `
    <div class="space-y-6 animate-in fade-in duration-300">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-extrabold text-foreground tracking-tight">Borrowing & Return Operations</h1>
          <p class="text-sm text-muted-foreground mt-0.5">Track book loans, due dates, returns, and calculated fines</p>
        </div>
        <button
          *ngIf="authService.isAuthenticated()"
          hlmBtn
          variant="default"
          (click)="openIssueModal()"
          class="font-bold !bg-gradient-to-br !from-brand-500 !to-brand-600 !text-white !border-0 shadow-lg shadow-brand-500/30 hover:!from-brand-600 hover:!to-brand-700"
        >
          <ng-icon name="lucidePlus" class="mr-2 text-base"></ng-icon>
          Issue Book Loan
        </button>
      </div>

      <!-- Filters & Search Bar -->
      <div hlmCard class="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-brand-500/20">
        <div class="relative w-full sm:w-96">
          <ng-icon name="lucideSearch" class="absolute left-3 top-3 text-brand-400/50 text-base"></ng-icon>
          <input
            hlmInput
            type="text"
            [ngModel]="searchTerm()"
            (ngModelChange)="searchTerm.set($event)"
            placeholder="Search by Book ID or Member ID..."
            class="pl-10 focus:border-brand-500/50"
          />
        </div>

        <div class="flex items-center space-x-2">
          <button
            hlmBtn
            [variant]="filterStatus() === '' ? 'default' : 'outline'"
            size="sm"
            (click)="filterStatus.set('')"
            class="text-xs rounded-full font-bold transition-all {{ filterStatus() === '' ? '!bg-gradient-to-br !from-brand-500 !to-brand-600 !text-white !border-0 shadow-md shadow-brand-500/20' : 'border-brand-500/30 text-brand-300 hover:bg-brand-500/10' }}"
          >
            All Loans
          </button>
          <button
            hlmBtn
            [variant]="filterStatus() === 'Borrowed' ? 'default' : 'outline'"
            size="sm"
            (click)="filterStatus.set('Borrowed')"
            class="text-xs rounded-full font-bold transition-all {{ filterStatus() === 'Borrowed' ? '!bg-gradient-to-br !from-brand-500 !to-brand-600 !text-white !border-0 shadow-md shadow-brand-500/20' : 'border-brand-500/30 text-brand-300 hover:bg-brand-500/10' }}"
          >
            Active
          </button>
          <button
            hlmBtn
            [variant]="filterStatus() === 'Returned' ? 'default' : 'outline'"
            size="sm"
            (click)="filterStatus.set('Returned')"
            class="text-xs rounded-full font-bold transition-all {{ filterStatus() === 'Returned' ? '!bg-gradient-to-br !from-brand-500 !to-brand-600 !text-white !border-0 shadow-md shadow-brand-500/20' : 'border-brand-500/30 text-brand-300 hover:bg-brand-500/10' }}"
          >
            Returned
          </button>
          <button
            hlmBtn
            [variant]="filterStatus() === 'Overdue' ? 'default' : 'outline'"
            size="sm"
            (click)="filterStatus.set('Overdue')"
            class="text-xs rounded-full font-bold transition-all {{ filterStatus() === 'Overdue' ? '!bg-gradient-to-br !from-brand-500 !to-brand-600 !text-white !border-0 shadow-md shadow-brand-500/20' : 'border-brand-500/30 text-brand-300 hover:bg-brand-500/10' }}"
          >
            Overdue
          </button>
        </div>
      </div>

      <!-- Data Table -->
      <div hlmCard class="p-0 overflow-hidden shadow-xl border border-brand-500/20">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-muted/50 text-xs uppercase text-muted-foreground border-b border-border">
              <tr>
                <th class="py-4 px-6 font-semibold">Book Title / ID</th>
                <th class="py-4 px-6 font-semibold">Member / ID</th>
                <th class="py-4 px-4 font-semibold">Borrowed Date</th>
                <th class="py-4 px-4 font-semibold">Due Date</th>
                <th class="py-4 px-4 font-semibold text-center">Status</th>
                <th class="py-4 px-4 font-semibold text-right">Fine Amount</th>
                <th *ngIf="authService.isAuthenticated()" class="py-4 px-6 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border/40">
              <tr *ngFor="let item of filteredBorrowings()" class="hover:bg-brand-500/5 transition-colors">
                <td class="py-4 px-6">
                  <div class="font-bold text-foreground">{{ getBookTitle(item.bookId) }}</div>
                  <div class="text-[11px] font-mono text-muted-foreground">ID: {{ item.bookId }}</div>
                </td>
                <td class="py-4 px-6">
                  <div class="font-bold text-foreground">{{ getMemberName(item.memberId) }}</div>
                  <div class="text-[11px] font-mono text-muted-foreground">ID: {{ item.memberId }}</div>
                </td>
                <td class="py-4 px-4 text-xs text-muted-foreground">{{ item.borrowedAt | date:'mediumDate' }}</td>
                <td class="py-4 px-4 text-xs font-semibold" [class.text-white]="isOverdue(item.dueDate, item.returnedAt)" [class.text-muted-foreground]="!isOverdue(item.dueDate, item.returnedAt)">
                  {{ item.dueDate | date:'mediumDate' }}
                </td>
                <td class="py-4 px-4 text-center">
                  <span
                    hlmBadge
                    [variant]="item.status === 'Returned' ? 'secondary' : 'outline'"
                    class="text-[10px] font-bold {{ item.status === 'Overdue' ? 'text-red-400 border-red-500/30' : (item.status === 'Returned' ? 'text-emerald-400 border-emerald-500/30' : 'border-brand-500/30 text-brand-300 bg-brand-500/10') }}"
                  >
                    {{ item.status }}
                  </span>
                </td>
                <td class="py-4 px-4 text-right font-mono text-xs font-bold text-foreground">
                  \${{ item.fineAmount | number:'1.2-2' }}
                </td>
                <td *ngIf="authService.isAuthenticated()" class="py-4 px-6 text-right">
                  <button
                    *ngIf="item.status !== 'Returned'"
                    hlmBtn
                    variant="outline"
                    size="sm"
                    (click)="returnBook(item.id!)"
                    class="text-xs text-brand-300 border-brand-500/30 hover:bg-brand-500/15"
                  >
                    <ng-icon name="lucideRotateCcw" class="mr-1.5 text-xs"></ng-icon>
                    Return Book
                  </button>
                  <span *ngIf="item.status === 'Returned'" class="text-xs text-muted-foreground italic">Returned</span>
                </td>
              </tr>
              <tr *ngIf="filteredBorrowings().length === 0">
                <td [attr.colspan]="authService.isAuthenticated() ? 7 : 6" class="py-12 text-center text-muted-foreground">
                  <ng-icon name="lucideBookmarkCheck" class="text-3xl text-brand-500/30 mb-2"></ng-icon>
                  <p class="text-sm">No borrowing transactions recorded.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Issue Book Loan Dialog Modal -->
      <app-spartan-dialog
        [(isOpen)]="isModalOpen"
        title="Issue New Book Loan"
        description="Select an active member and an available book copy to issue a loan record."
      >
        <form (ngSubmit)="issueLoan()" class="space-y-4">
          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-foreground">Select Book</label>
            <select
              hlmInput
              [(ngModel)]="newBorrowing.bookId"
              name="bookId"
              required
              class="appearance-none bg-background/50 focus:border-brand-500/60"
            >
              <option value="" disabled>-- Choose Available Book --</option>
              <option *ngFor="let b of availableBooks()" [value]="b.id">
                {{ b.title }} (By {{ b.author }}) - {{ b.availableCopies }} left
              </option>
            </select>
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-foreground">Select Member</label>
            <select
              hlmInput
              [(ngModel)]="newBorrowing.memberId"
              name="memberId"
              required
              class="appearance-none bg-background/50 focus:border-brand-500/60"
            >
              <option value="" disabled>-- Choose Member --</option>
              <option *ngFor="let m of activeMembersList()" [value]="m.id">
                {{ m.name }} ({{ m.email }})
              </option>
            </select>
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-foreground">Due Date</label>
            <input hlmInput type="date" [(ngModel)]="dueDateInput" name="dueDate" required class="focus:border-brand-500/60" />
          </div>

          <div class="flex justify-end space-x-3 pt-4 border-t border-border">
            <button hlmBtn variant="outline" type="button" (click)="isModalOpen = false">Cancel</button>
            <button hlmBtn variant="default" type="submit" class="font-bold !bg-gradient-to-br !from-brand-500 !to-brand-600 !text-white !border-0 shadow-lg shadow-brand-500/30 hover:!from-brand-600 hover:!to-brand-700">
              Issue Loan
            </button>
          </div>
        </form>
      </app-spartan-dialog>
    </div>
  `
})
export class BorrowingsComponent implements OnInit {
  borrowingService = inject(BorrowingService);
  bookService = inject(BookService);
  memberService = inject(MemberService);
  authService = inject(AuthService);

  searchTerm = signal('');
  filterStatus = signal('');

  isModalOpen = false;
  dueDateInput = '';

  newBorrowing: Borrowing = {
    bookId: '',
    memberId: '',
    dueDate: '',
    status: 'Borrowed',
    fineAmount: 0
  };

  availableBooks = computed(() => this.bookService.books().filter(b => (b.availableCopies || 0) > 0));
  activeMembersList = computed(() => this.memberService.members().filter(m => m.isActive));

  filteredBorrowings = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const status = this.filterStatus();
    return this.borrowingService.borrowings().filter(b => {
      const matchesSearch = !term || b.bookId.toLowerCase().includes(term) || b.memberId.toLowerCase().includes(term);
      const matchesStatus = !status || b.status === status;
      return matchesSearch && matchesStatus;
    });
  });

  ngOnInit() {
    this.borrowingService.loadAll().subscribe();
    this.bookService.loadAll().subscribe();
    this.memberService.loadAll().subscribe();

    // Default due date: +14 days from now
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

  isOverdue(dueDateStr: string, returnedAt?: string | null): boolean {
    if (returnedAt) return false;
    return new Date(dueDateStr) < new Date();
  }

  openIssueModal() {
    this.newBorrowing = {
      bookId: this.availableBooks()[0]?.id || '',
      memberId: this.activeMembersList()[0]?.id || '',
      dueDate: this.dueDateInput,
      status: 'Borrowed',
      fineAmount: 0
    };
    this.isModalOpen = true;
  }

  issueLoan() {
    if (!this.newBorrowing.bookId || !this.newBorrowing.memberId) {
      alert('Please select both a Book and a Member');
      return;
    }

    this.newBorrowing.dueDate = new Date(this.dueDateInput).toISOString();
    this.newBorrowing.borrowedAt = new Date().toISOString();

    this.borrowingService.borrowBook(this.newBorrowing).subscribe({
      next: () => {
        this.isModalOpen = false;
        // Reload books to refresh available copy counts
        this.bookService.loadAll().subscribe();
      },
      error: (err) => alert(err.error?.message || 'Failed to issue loan')
    });
  }

  returnBook(id: string) {
    if (confirm('Process book return for this loan?')) {
      this.borrowingService.returnBook(id).subscribe({
        next: () => {
          this.bookService.loadAll().subscribe();
        },
        error: (err) => alert(err.error?.message || 'Failed to return book')
      });
    }
  }
}

