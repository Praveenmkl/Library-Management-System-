import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../core/services/book.service';
import { AuthService } from '../../core/services/auth.service';
import { Book } from '../../core/models/book.model';
import { HlmButtonDirective } from '../../shared/spartan/button/hlm-button.directive';
import { HlmInputDirective } from '../../shared/spartan/input/hlm-input.directive';
import { HlmBadgeDirective } from '../../shared/spartan/badge/hlm-badge.directive';
import { HlmCardDirective } from '../../shared/spartan/card/hlm-card.directive';
import { SpartanDialogComponent } from '../../shared/spartan/dialog/spartan-dialog.component';
import { provideIcons, NgIconComponent } from '@ng-icons/core';
import { lucideBookOpen, lucidePlus, lucideSearch, lucidePencil, lucideTrash2, lucideLayers } from '@ng-icons/lucide';

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
  providers: [provideIcons({ lucideBookOpen, lucidePlus, lucideSearch, lucidePencil, lucideTrash2, lucideLayers })],
  template: `
    <div class="space-y-6 animate-in fade-in duration-300">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-extrabold text-foreground tracking-tight">Books Catalog</h1>
          <p class="text-sm text-muted-foreground mt-0.5">Browse, search, and manage library inventory</p>
        </div>
        <button
          *ngIf="authService.isAuthenticated()"
          hlmBtn
          variant="default"
          (click)="openAddModal()"
          class="shadow-lg shadow-orange-500/30"
        >
          <ng-icon name="lucidePlus" class="mr-2 text-base"></ng-icon>
          Add New Book
        </button>
      </div>

      <!-- Filters & Search Bar -->
      <div hlmCard class="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="relative w-full md:w-96">
          <ng-icon name="lucideSearch" class="absolute left-3 top-3 text-muted-foreground text-base"></ng-icon>
          <input
            hlmInput
            type="text"
            [ngModel]="searchTerm()"
            (ngModelChange)="searchTerm.set($event)"
            placeholder="Search by Title, Author, or ISBN..."
            class="pl-10"
          />
        </div>

        <div class="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <button
            hlmBtn
            [variant]="selectedCategory() === '' ? 'default' : 'outline'"
            size="sm"
            (click)="selectedCategory.set('')"
            class="text-xs rounded-full"
          >
            All Genres
          </button>
          <button
            *ngFor="let cat of categories()"
            hlmBtn
            [variant]="selectedCategory() === cat ? 'default' : 'outline'"
            size="sm"
            (click)="selectedCategory.set(cat)"
            class="text-xs rounded-full"
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <!-- Data Table -->
      <div hlmCard class="p-0 overflow-hidden shadow-xl border-border">
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
                <th *ngIf="authService.isAuthenticated()" class="py-4 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border/40">
              <tr *ngFor="let book of filteredBooks()" class="hover:bg-muted/20 transition-colors">
                <td class="py-4 px-6">
                  <div class="font-bold text-foreground">{{ book.title }}</div>
                  <div class="text-xs text-muted-foreground">by {{ book.author }}</div>
                </td>
                <td class="py-4 px-4 font-mono text-xs text-muted-foreground">{{ book.isbn }}</td>
                <td class="py-4 px-4">
                  <span hlmBadge variant="outline" class="text-xs">
                    {{ book.category || 'General' }}
                  </span>
                </td>
                <td class="py-4 px-4 text-center font-bold text-foreground">{{ book.totalCopies }}</td>
                <td class="py-4 px-4 text-center font-bold" [class.text-white]="book.availableCopies > 0" [class.text-zinc-500]="book.availableCopies === 0">
                  {{ book.availableCopies }} / {{ book.totalCopies }}
                </td>
                <td *ngIf="authService.isAuthenticated()" class="py-4 px-6 text-right space-x-2">
                  <button
                    hlmBtn
                    variant="ghost"
                    size="icon"
                    (click)="openEditModal(book)"
                    class="h-8 w-8"
                  >
                    <ng-icon name="lucidePencil" class="text-sm"></ng-icon>
                  </button>
                  <button
                    hlmBtn
                    variant="ghost"
                    size="icon"
                    (click)="deleteBook(book.id!)"
                    class="h-8 w-8 text-zinc-400 hover:text-white hover:bg-white/10"
                  >
                    <ng-icon name="lucideTrash2" class="text-sm"></ng-icon>
                  </button>
                </td>
              </tr>
              <tr *ngIf="filteredBooks().length === 0">
                <td [attr.colspan]="authService.isAuthenticated() ? 7 : 6" class="py-12 text-center text-muted-foreground">
                  <ng-icon name="lucideBookOpen" class="text-3xl text-muted-foreground/40 mb-2"></ng-icon>
                  <p class="text-sm">No books matching your criteria.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add/Edit Book Modal Dialog -->
      <app-spartan-dialog
        [(isOpen)]="isModalOpen"
        [title]="isEditMode ? 'Edit Book Record' : 'Add New Book to Inventory'"
        [description]="isEditMode ? 'Update book details and copy counts.' : 'Fill out details to register a new book in the catalog.'"
      >
        <form (ngSubmit)="saveBook()" class="space-y-4">
          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-foreground">Title</label>
            <input hlmInput type="text" [(ngModel)]="currentBook.title" name="title" required placeholder="e.g. Clean Architecture" />
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-foreground">Author</label>
            <input hlmInput type="text" [(ngModel)]="currentBook.author" name="author" required placeholder="e.g. Robert C. Martin" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-foreground">ISBN</label>
              <input hlmInput type="text" [(ngModel)]="currentBook.isbn" name="isbn" required placeholder="978-0134494166" />
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-foreground">Category / Genre</label>
              <input hlmInput type="text" [(ngModel)]="currentBook.category" name="category" required placeholder="Software Engineering" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-foreground">Total Copies</label>
              <input hlmInput type="number" [(ngModel)]="currentBook.totalCopies" name="totalCopies" min="1" required />
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-foreground">Available Copies</label>
              <input hlmInput type="number" [(ngModel)]="currentBook.availableCopies" name="availableCopies" min="0" required />
            </div>
          </div>

          <div class="flex justify-end space-x-3 pt-4 border-t border-border">
            <button hlmBtn variant="outline" type="button" (click)="isModalOpen = false">Cancel</button>
            <button hlmBtn variant="default" type="submit" class="shadow-lg shadow-orange-500/30">
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
  authService = inject(AuthService);

  searchTerm = signal('');
  selectedCategory = signal('');

  isModalOpen = false;
  isEditMode = false;

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

  openAddModal() {
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
    this.isEditMode = true;
    this.currentBook = { ...book };
    this.isModalOpen = true;
  }

  saveBook() {
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
    if (confirm('Are you sure you want to delete this book?')) {
      this.bookService.delete(id).subscribe();
    }
  }
}
