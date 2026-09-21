import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../core/services/book.service';
import { AuthService } from '../../core/services/auth.service';
import { BorrowingService } from '../../core/services/borrowing.service';
import { Book } from '../../core/models/book.model';
import { HlmButtonDirective } from '../../shared/spartan/button/hlm-button.directive';
import { HlmInputDirective } from '../../shared/spartan/input/hlm-input.directive';
import { HlmBadgeDirective } from '../../shared/spartan/badge/hlm-badge.directive';
import { HlmCardDirective } from '../../shared/spartan/card/hlm-card.directive';
import { SpartanDialogComponent } from '../../shared/spartan/dialog/spartan-dialog.component';
import { provideIcons, NgIconComponent } from '@ng-icons/core';
import { lucideBookOpen, lucidePlus, lucideSearch, lucidePencil, lucideTrash2, lucideLayers, lucideEye, lucideSend } from '@ng-icons/lucide';

@Component({
  selector: 'app-books',
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
  providers: [provideIcons({ lucideBookOpen, lucidePlus, lucideSearch, lucidePencil, lucideTrash2, lucideLayers, lucideEye, lucideSend })],
  template: `
    <div class="space-y-6 animate-in fade-in duration-300">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-extrabold text-foreground tracking-tight">Books Catalog</h1>
          <p class="text-sm text-muted-foreground mt-0.5">Browse, search, and view library inventory</p>
        </div>
        <!-- Only Librarians & Admins can add books -->
        <button
          *ngIf="authService.canManageBooks()"
          hlmBtn
          variant="default"
          (click)="openAddModal()"
          class="font-bold shadow-lg"
          [ngClass]="authService.isAdmin() ? '!bg-white !text-black hover:!bg-zinc-200 shadow-white/20 !border-0' : (authService.isLibrarian() ? '!bg-gradient-to-br !from-[#96ff00] !to-[#85e600] !text-black shadow-[#96ff00]/30 !border-0' : '!bg-gradient-to-br !from-brand-500 !to-brand-600 !text-white shadow-brand-500/30 !border-0')"
        >
          <ng-icon name="lucidePlus" class="mr-2 text-base" [class.text-black]="authService.isAdmin() || authService.isLibrarian()"></ng-icon>
          Add New Book
        </button>
      </div>

      <!-- Filters & Search Bar -->
      <div hlmCard class="p-4 flex flex-col md:flex-row items-center justify-between gap-4 border border-brand-500/20">
        <div class="relative w-full md:w-96">
          <ng-icon name="lucideSearch" class="absolute left-3 top-3 text-brand-400/50 text-base"></ng-icon>
          <input
            hlmInput
            type="text"
            [ngModel]="searchTerm()"
            (ngModelChange)="searchTerm.set($event)"
            placeholder="Search by Title, Author, or ISBN..."
            class="pl-10 focus:border-brand-500/50"
          />
        </div>

        <div class="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <button
            hlmBtn
            [variant]="selectedCategory() === '' ? 'default' : 'outline'"
            size="sm"
            (click)="selectedCategory.set('')"
            class="text-xs rounded-full font-bold transition-all"
            [ngClass]="selectedCategory() === '' ? (authService.isAdmin() ? '!bg-white !text-black !border-0 shadow-md shadow-white/20' : (authService.isLibrarian() ? '!bg-[#96ff00] !text-black !border-0 shadow-md shadow-[#96ff00]/20' : '!bg-gradient-to-br !from-brand-500 !to-brand-600 !text-white !border-0 shadow-md shadow-brand-500/20')) : (authService.isAdmin() ? 'border-white/30 text-white hover:bg-white/10' : (authService.isLibrarian() ? 'border-[#96ff00]/30 text-[#96ff00] hover:bg-[#96ff00]/10' : 'border-brand-500/30 text-brand-300 hover:bg-brand-500/10'))"
          >
            All Genres
          </button>
          <button
            *ngFor="let cat of categories()"
            hlmBtn
            [variant]="selectedCategory() === cat ? 'default' : 'outline'"
            size="sm"
            (click)="selectedCategory.set(cat)"
            class="text-xs rounded-full font-bold transition-all"
            [ngClass]="selectedCategory() === cat ? (authService.isAdmin() ? '!bg-white !text-black !border-0 shadow-md shadow-white/20' : (authService.isLibrarian() ? '!bg-[#96ff00] !text-black !border-0 shadow-md shadow-[#96ff00]/20' : '!bg-gradient-to-br !from-brand-500 !to-brand-600 !text-white !border-0 shadow-md shadow-brand-500/20')) : (authService.isAdmin() ? 'border-white/30 text-white hover:bg-white/10' : (authService.isLibrarian() ? 'border-[#96ff00]/30 text-[#96ff00] hover:bg-[#96ff00]/10' : 'border-brand-500/30 text-brand-300 hover:bg-brand-500/10'))"
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <!-- Data Table -->
      <div hlmCard class="p-0 overflow-hidden shadow-xl border border-brand-500/20">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-muted/50 text-xs uppercase text-muted-foreground border-b border-border">
              <tr>
                <th class="py-4 px-6 font-semibold">Title & Author</th>
                <th class="py-4 px-4 font-semibold">ISBN</th>
                <th class="py-4 px-4 font-semibold">Category</th>
                <th class="py-4 px-4 font-semibold text-center">Total Copies</th>
                <th class="py-4 px-4 font-semibold text-center">Available</th>
                <th class="py-4 px-4 font-semibold text-center">Status</th>
                <th class="py-4 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border/40">
              <tr *ngFor="let book of filteredBooks()" class="hover:bg-brand-500/5 transition-colors">
                <td class="py-4 px-6">
                  <div class="font-bold text-foreground">{{ book.title }}</div>
                  <div class="text-xs text-muted-foreground">by {{ book.author }}</div>
                </td>
                <td class="py-4 px-4 font-mono text-xs text-muted-foreground">{{ book.isbn }}</td>
                <td class="py-4 px-4">
                  <span hlmBadge variant="outline" class="text-[10px] text-brand-300 border-brand-500/30 bg-brand-500/10">
                    {{ book.category || 'General' }}
                  </span>
                </td>
                <td class="py-4 px-4 text-center font-bold text-foreground">{{ book.totalCopies }}</td>
                <td class="py-4 px-4 text-center font-bold" [class.text-white]="book.availableCopies > 0" [class.text-zinc-500]="book.availableCopies === 0">
                  {{ book.availableCopies }} / {{ book.totalCopies }}
                </td>
                <td class="py-4 px-4 text-center">
                  <span hlmBadge [variant]="book.availableCopies > 0 ? 'outline' : 'secondary'" class="text-[10px] font-bold {{ book.availableCopies > 0 ? 'text-emerald-400 border-emerald-500/30' : 'text-red-400' }}">
                    {{ book.availableCopies > 0 ? 'In Stock' : 'Out of Stock' }}
                  </span>
                </td>
                <td class="py-4 px-6 text-right space-x-2">
                  <!-- View Details Modal Trigger for all users -->
                  <button
                    hlmBtn
                    variant="ghost"
                    size="sm"
                    (click)="openDetailsModal(book)"
                    class="text-xs text-zinc-300 hover:text-white hover:bg-zinc-800"
                  >
                    <ng-icon name="lucideEye" class="mr-1 text-xs"></ng-icon>
                    Details
                  </button>

                  <!-- Borrow Button for Students -->
                  <button
                    *ngIf="authService.isStudent()"
                    hlmBtn
                    size="sm"
                    [disabled]="book.availableCopies <= 0"
                    (click)="borrowBook(book)"
                    class="text-xs font-bold {{ book.availableCopies > 0 ? '!bg-brand-500 text-black hover:!bg-brand-400' : 'bg-zinc-800 text-zinc-500' }}"
                  >
                    <ng-icon name="lucideSend" class="mr-1 text-xs"></ng-icon>
                    Borrow
                  </button>

                  <!-- Edit & Delete Buttons for Librarians & Admins ONLY -->
                  <ng-container *ngIf="authService.canManageBooks()">
                    <button
                      hlmBtn
                      variant="ghost"
                      size="icon"
                      (click)="openEditModal(book)"
                      class="h-8 w-8 text-zinc-400 hover:text-brand-300 hover:bg-brand-500/10"
                    >
                      <ng-icon name="lucidePencil" class="text-sm"></ng-icon>
                    </button>
                    <button
                      hlmBtn
                      variant="ghost"
                      size="icon"
                      (click)="deleteBook(book.id!)"
                      class="h-8 w-8 text-zinc-400 hover:text-red-400 hover:bg-red-500/10"
                    >
                      <ng-icon name="lucideTrash2" class="text-sm"></ng-icon>
                    </button>
                  </ng-container>
                </td>
              </tr>
              <tr *ngIf="filteredBooks().length === 0">
                <td colspan="7" class="py-12 text-center text-muted-foreground">
                  <ng-icon name="lucideBookOpen" class="text-3xl text-brand-500/30 mb-2"></ng-icon>
                  <p class="text-sm">No books matching your criteria.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- View Book Details Dialog Modal -->
      <app-spartan-dialog
        [(isOpen)]="isDetailsModalOpen"
        [title]="selectedBookDetails?.title || 'Book Details'"
        description="Comprehensive information and availability status for this title."
      >
        <div *ngIf="selectedBookDetails" class="space-y-4 text-sm">
          <div class="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
            <div class="flex justify-between">
              <span class="text-zinc-400">Author:</span>
              <span class="font-bold text-white">{{ selectedBookDetails.author }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-zinc-400">Category / Genre:</span>
              <span class="font-bold text-brand-400">{{ selectedBookDetails.category || 'General' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-zinc-400">ISBN Code:</span>
              <span class="font-mono text-zinc-300">{{ selectedBookDetails.isbn }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-zinc-400">Total Copies:</span>
              <span class="font-bold text-white">{{ selectedBookDetails.totalCopies }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-zinc-400">Available Copies:</span>
              <span class="font-bold text-emerald-400">{{ selectedBookDetails.availableCopies }}</span>
            </div>
          </div>

          <div class="flex justify-between items-center pt-2">
            <button
              *ngIf="authService.isStudent() && selectedBookDetails.availableCopies > 0"
              hlmBtn
              variant="default"
              (click)="borrowBook(selectedBookDetails); isDetailsModalOpen = false"
              class="font-bold bg-brand-500 text-black hover:bg-brand-400"
            >
              <ng-icon name="lucideSend" class="mr-2 text-sm"></ng-icon>
              Borrow This Book Now
            </button>
            <button hlmBtn variant="outline" class="ml-auto" (click)="isDetailsModalOpen = false">Close</button>
          </div>
        </div>
      </app-spartan-dialog>

      <!-- Add/Edit Book Modal Dialog (Librarian/Admin Only) -->
      <app-spartan-dialog
        [(isOpen)]="isModalOpen"
        [title]="isEditMode ? 'Edit Book Record' : 'Add New Book to Inventory'"
        [description]="isEditMode ? 'Update book details and copy counts.' : 'Fill out details to register a new book in the catalog.'"
      >
        <form (ngSubmit)="saveBook()" class="space-y-4">
          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-foreground">Title</label>
            <input hlmInput type="text" [(ngModel)]="currentBook.title" name="title" required placeholder="e.g. Clean Architecture" class="focus:border-brand-500/60" />
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-foreground">Author</label>
            <input hlmInput type="text" [(ngModel)]="currentBook.author" name="author" required placeholder="e.g. Robert C. Martin" class="focus:border-brand-500/60" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-foreground">ISBN</label>
              <input hlmInput type="text" [(ngModel)]="currentBook.isbn" name="isbn" required placeholder="978-0134494166" class="focus:border-brand-500/60" />
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-foreground">Category / Genre</label>
              <input hlmInput type="text" [(ngModel)]="currentBook.category" name="category" required placeholder="Software Engineering" class="focus:border-brand-500/60" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-foreground">Total Copies</label>
              <input hlmInput type="number" [(ngModel)]="currentBook.totalCopies" name="totalCopies" min="1" required class="focus:border-brand-500/60" />
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-foreground">Available Copies</label>
              <input hlmInput type="number" [(ngModel)]="currentBook.availableCopies" name="availableCopies" min="0" required class="focus:border-brand-500/60" />
            </div>
          </div>

          <div class="flex justify-end space-x-3 pt-4 border-t border-border">
            <button hlmBtn variant="outline" type="button" (click)="isModalOpen = false">Cancel</button>
            <button
              hlmBtn
              variant="default"
              type="submit"
              class="font-bold shadow-lg"
              [ngClass]="authService.isAdmin() ? '!bg-white !text-black hover:!bg-zinc-200 shadow-white/20 !border-0' : (authService.isLibrarian() ? '!bg-[#96ff00] !text-black hover:!bg-[#85e600] shadow-[#96ff00]/30 !border-0' : '!bg-gradient-to-br !from-brand-500 !to-brand-600 !text-white shadow-brand-500/30 !border-0')"
            >
              {{ isEditMode ? 'Save Changes' : 'Add Book' }}
            </button>
          </div>
        </form>
      </app-spartan-dialog>
    </div>
  `
})
export class BooksComponent implements OnInit {
  bookService = inject(BookService);
  borrowingService = inject(BorrowingService);
  authService = inject(AuthService);

  searchTerm = signal('');
  selectedCategory = signal('');

  isModalOpen = false;
  isEditMode = false;
  isDetailsModalOpen = false;
  selectedBookDetails: Book | null = null;

  currentBook: Book = {
    title: '',
    author: '',
    isbn: '',
    category: '',
    totalCopies: 1,
    availableCopies: 1
  };

  categories = computed(() => {
    const cats = this.bookService.books().map(b => b.category).filter(Boolean);
    return Array.from(new Set(cats));
  });

  filteredBooks = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const cat = this.selectedCategory();
    return this.bookService.books().filter(b => {
      const matchesSearch =
        !term ||
        b.title.toLowerCase().includes(term) ||
        b.author.toLowerCase().includes(term) ||
        b.isbn.toLowerCase().includes(term);
      const matchesCategory = !cat || b.category === cat;
      return matchesSearch && matchesCategory;
    });
  });

  ngOnInit() {
    this.bookService.loadAll().subscribe();
  }

  openDetailsModal(book: Book) {
    this.selectedBookDetails = book;
    this.isDetailsModalOpen = true;
  }

  borrowBook(book: Book) {
    if (confirm(`Borrow a copy of "${book.title}"?`)) {
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
          alert(`Successfully borrowed "${book.title}"!`);
          this.bookService.loadAll().subscribe();
          this.borrowingService.loadAll().subscribe();
        },
        error: (err) => alert(err.error?.message || 'Failed to borrow book')
      });
    }
  }

  openAddModal() {
    if (!this.authService.canManageBooks()) return;
    this.isEditMode = false;
    this.currentBook = {
      title: '',
      author: '',
      isbn: '',
      category: 'Fiction',
      totalCopies: 5,
      availableCopies: 5
    };
    this.isModalOpen = true;
  }

  openEditModal(book: Book) {
    if (!this.authService.canManageBooks()) return;
    this.isEditMode = true;
    this.currentBook = { ...book };
    this.isModalOpen = true;
  }

  saveBook() {
    if (!this.authService.canManageBooks()) return;
    if (this.isEditMode && this.currentBook.id) {
      this.bookService.update(this.currentBook.id, this.currentBook).subscribe(() => {
        this.isModalOpen = false;
      });
    } else {
      this.bookService.create(this.currentBook).subscribe(() => {
        this.isModalOpen = false;
      });
    }
  }

  deleteBook(id: string) {
    if (!this.authService.canManageBooks()) return;
    if (confirm('Are you sure you want to delete this book?')) {
      this.bookService.delete(id).subscribe();
    }
  }
}


