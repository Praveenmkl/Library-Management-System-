import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MemberService } from '../../core/services/member.service';
import { BookService } from '../../core/services/book.service';
import { BorrowingService } from '../../core/services/borrowing.service';
import { AuthService } from '../../core/services/auth.service';
import { Member } from '../../core/models/member.model';
import { HlmButtonDirective } from '../../shared/spartan/button/hlm-button.directive';
import { HlmInputDirective } from '../../shared/spartan/input/hlm-input.directive';
import { HlmBadgeDirective } from '../../shared/spartan/badge/hlm-badge.directive';
import { HlmCardDirective } from '../../shared/spartan/card/hlm-card.directive';
import { SpartanDialogComponent } from '../../shared/spartan/dialog/spartan-dialog.component';
import { provideIcons, NgIconComponent } from '@ng-icons/core';
import {
  lucideShield,
  lucideUsers,
  lucideUserPlus,
  lucideBookOpen,
  lucideBookmarkCheck,
  lucideSettings,
  lucideActivity,
  lucideTrash2,
  lucidePencil,
  lucideUserCheck,
  lucideUserX,
  lucideLock
} from '@ng-icons/lucide';

export interface LibrarianAccount {
  id: string;
  name: string;
  email: string;
  role: 'Librarian';
  isActive: boolean;
  createdAt: string;
}

@Component({
  selector: 'app-admin-portal',
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
      lucideShield,
      lucideUsers,
      lucideUserPlus,
      lucideBookOpen,
      lucideBookmarkCheck,
      lucideSettings,
      lucideActivity,
      lucideTrash2,
      lucidePencil,
      lucideUserCheck,
      lucideUserX,
      lucideLock
    })
  ],
  template: `
    <div class="space-y-8 animate-in fade-in duration-300">
      <!-- Admin Hero Banner -->
      <div class="relative overflow-hidden rounded-3xl bg-white/5 p-8 border border-white/20 backdrop-blur-xl">
        <div class="relative z-10 max-w-2xl">
          <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-white mb-3">
            <ng-icon name="lucideShield" class="text-sm"></ng-icon>
            <span>Executive Admin Control Center</span>
          </div>
          <h1 class="text-3xl font-extrabold text-foreground tracking-tight">System Control & Staff Governance</h1>
          <p class="text-muted-foreground mt-2 text-sm leading-relaxed">
            Provision librarian credentials, monitor staff active state, manage catalog integrity, and audit student accounts.
          </p>
        </div>
      </div>

      <!-- Quick System Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div hlmCard class="p-5 glass-card border-border hover:border-white/40">
          <p class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Librarians</p>
          <h3 class="text-3xl font-black text-foreground mt-1">{{ librarians().length }}</h3>
          <p class="text-xs text-zinc-300 mt-1 font-bold">Admin Provisioned Staff</p>
        </div>

        <div hlmCard class="p-5 glass-card border-border hover:border-white/40">
          <p class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Registered Students</p>
          <h3 class="text-3xl font-black text-foreground mt-1">{{ studentMembers().length }}</h3>
          <p class="text-xs text-zinc-300 mt-1 font-bold">Public Student Accounts</p>
        </div>

        <div hlmCard class="p-5 glass-card border-border hover:border-white/40">
          <p class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Catalog Titles</p>
          <h3 class="text-3xl font-black text-foreground mt-1">{{ bookService.books().length }}</h3>
          <p class="text-xs text-zinc-300 mt-1 font-bold">Managed Inventory</p>
        </div>

        <div hlmCard class="p-5 glass-card border-border hover:border-white/40">
          <p class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Loans Issued</p>
          <h3 class="text-3xl font-black text-foreground mt-1">{{ borrowingService.borrowings().length }}</h3>
          <p class="text-xs text-zinc-300 mt-1 font-bold">Lifetime Circulation</p>
        </div>
      </div>

      <!-- Section 1: Librarian Management (Admin Only Provisioning) -->
      <div hlmCard class="p-6 space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div class="flex items-center space-x-2">
              <h3 class="text-xl font-bold text-foreground">Librarian Staff Management</h3>
              <span hlmBadge variant="outline" class="text-[10px] text-white bg-white/10 border-white/20">Admin Protected</span>
            </div>
            <p class="text-xs text-muted-foreground mt-0.5">
              Librarians have no public registration. Only Admins can create, edit, or deactivate librarian accounts.
            </p>
          </div>
          <button hlmBtn variant="default" (click)="openCreateLibrarianModal()" class="shadow-lg shadow-white/10">
            <ng-icon name="lucideUserPlus" class="mr-2 text-base"></ng-icon>
            Create New Librarian
          </button>
        </div>

        <!-- Librarians Table -->
        <div class="overflow-x-auto border border-border/60 rounded-2xl">
          <table class="w-full text-left text-sm">
            <thead class="bg-muted/50 text-xs uppercase text-muted-foreground border-b border-border">
              <tr>
                <th class="py-3.5 px-6 font-semibold">Librarian Name</th>
                <th class="py-3.5 px-4 font-semibold">Email</th>
                <th class="py-3.5 px-4 font-semibold">Assigned Role</th>
                <th class="py-3.5 px-4 font-semibold text-center">Account Status</th>
                <th class="py-3.5 px-6 font-semibold text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border/40">
              <tr *ngFor="let librarian of librarians()" class="hover:bg-muted/20 transition-colors">
                <td class="py-4 px-6 font-bold text-foreground">
                  <div class="flex items-center space-x-2">
                    <div class="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xs font-bold text-white">
                      {{ librarian.name.charAt(0).toUpperCase() }}
                    </div>
                    <span>{{ librarian.name }}</span>
                  </div>
                </td>
                <td class="py-4 px-4 text-xs text-muted-foreground font-mono">{{ librarian.email }}</td>
                <td class="py-4 px-4">
                  <span hlmBadge variant="outline" class="text-xs font-bold text-white border-white/20 bg-white/10">
                    {{ librarian.role }}
                  </span>
                </td>
                <td class="py-4 px-4 text-center">
                  <span
                    hlmBadge
                    [variant]="librarian.isActive ? 'outline' : 'secondary'"
                    class="text-[10px] font-bold"
                  >
                    {{ librarian.isActive ? 'Active' : 'Deactivated' }}
                  </span>
                </td>
                <td class="py-4 px-6 text-right space-x-2">
                  <!-- Toggle Deactivate / Activate -->
                  <button
                    hlmBtn
                    variant="outline"
                    size="sm"
                    (click)="toggleLibrarianStatus(librarian)"
                    class="text-xs text-white border-white/20 hover:bg-white/10 font-bold"
                  >
                    <ng-icon [name]="librarian.isActive ? 'lucideUserX' : 'lucideUserCheck'" class="mr-1 text-xs"></ng-icon>
                    {{ librarian.isActive ? 'Deactivate' : 'Activate' }}
                  </button>

                  <!-- Edit -->
                  <button
                    hlmBtn
                    variant="ghost"
                    size="icon"
                    (click)="openEditLibrarianModal(librarian)"
                    class="h-8 w-8 text-zinc-400 hover:text-white"
                  >
                    <ng-icon name="lucidePencil" class="text-sm"></ng-icon>
                  </button>

                  <!-- Delete -->
                  <button
                    hlmBtn
                    variant="ghost"
                    size="icon"
                    (click)="deleteLibrarian(librarian.id)"
                    class="h-8 w-8 text-zinc-400 hover:text-white"
                  >
                    <ng-icon name="lucideTrash2" class="text-sm"></ng-icon>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Section 2: Student Members Directory -->
      <div hlmCard class="p-6 space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xl font-bold text-foreground">Registered Students Directory</h3>
            <p class="text-xs text-muted-foreground">Accounts created via public student registration</p>
          </div>
        </div>

        <!-- Student Table -->
        <div class="overflow-x-auto border border-border/60 rounded-2xl">
          <table class="w-full text-left text-sm">
            <thead class="bg-muted/50 text-xs uppercase text-muted-foreground border-b border-border">
              <tr>
                <th class="py-3.5 px-6 font-semibold">Student Name</th>
                <th class="py-3.5 px-4 font-semibold">Email / Username</th>
                <th class="py-3.5 px-4 font-semibold">Assigned Role</th>
                <th class="py-3.5 px-4 font-semibold text-center">Status</th>
                <th class="py-3.5 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border/40">
              <tr *ngFor="let member of studentMembers()" class="hover:bg-muted/20 transition-colors">
                <td class="py-4 px-6 font-bold text-foreground">{{ member.name }}</td>
                <td class="py-4 px-4 text-xs text-muted-foreground font-mono">{{ member.email }}</td>
                <td class="py-4 px-4">
                  <span hlmBadge variant="secondary" class="text-xs">Student</span>
                </td>
                <td class="py-4 px-4 text-center">
                  <span hlmBadge [variant]="member.isActive ? 'outline' : 'secondary'" class="text-[10px]">
                    {{ member.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="py-4 px-6 text-right space-x-2">
                  <button hlmBtn variant="ghost" size="icon" (click)="deleteUser(member.id!)" class="h-8 w-8 text-zinc-400 hover:text-white">
                    <ng-icon name="lucideTrash2" class="text-sm"></ng-icon>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Create Librarian Modal -->
      <app-spartan-dialog
        [(isOpen)]="isCreateModalOpen"
        title="Provision New Librarian Account"
        description="Creates a staff Librarian account. The system assigns the Librarian role automatically."
      >
        <form (ngSubmit)="saveLibrarian()" class="space-y-4">
          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-foreground">Full Name</label>
            <input hlmInput type="text" [(ngModel)]="librarianName" name="libName" required placeholder="e.g. Eleanor Vance" />
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-foreground">Email Address</label>
            <input hlmInput type="email" [(ngModel)]="librarianEmail" name="libEmail" required placeholder="eleanor@library.org" />
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-foreground">Assigned Role</label>
            <input hlmInput type="text" value="Librarian (Automatic)" disabled class="bg-muted/50 cursor-not-allowed font-bold text-white" />
          </div>

          <div class="flex justify-end space-x-3 pt-4 border-t border-border">
            <button hlmBtn variant="outline" type="button" (click)="isCreateModalOpen = false">Cancel</button>
            <button hlmBtn variant="default" type="submit" class="shadow-lg shadow-white/10">
              Create Librarian
            </button>
          </div>
        </form>
      </app-spartan-dialog>

      <!-- Edit Librarian Modal -->
      <app-spartan-dialog
        [(isOpen)]="isEditModalOpen"
        title="Update Librarian Details"
        description="Modify staff details or account status."
      >
        <form (ngSubmit)="updateLibrarian()" class="space-y-4">
          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-foreground">Full Name</label>
            <input hlmInput type="text" [(ngModel)]="editingLibrarian.name" name="editLibName" required />
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-foreground">Email Address</label>
            <input hlmInput type="email" [(ngModel)]="editingLibrarian.email" name="editLibEmail" required />
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-foreground">Account Status</label>
            <select hlmInput [(ngModel)]="editingLibrarian.isActive" name="editLibActive" class="appearance-none bg-background/50">
              <option [ngValue]="true">Active</option>
              <option [ngValue]="false">Deactivated</option>
            </select>
          </div>

          <div class="flex justify-end space-x-3 pt-4 border-t border-border">
            <button hlmBtn variant="outline" type="button" (click)="isEditModalOpen = false">Cancel</button>
            <button hlmBtn variant="default" type="submit" class="shadow-lg shadow-white/10">
              Save Changes
            </button>
          </div>
        </form>
      </app-spartan-dialog>
    </div>
  `
})
export class AdminPortalComponent implements OnInit {
  authService = inject(AuthService);
  memberService = inject(MemberService);
  bookService = inject(BookService);
  borrowingService = inject(BorrowingService);

  // Librarians State
  librarians = signal<LibrarianAccount[]>([
    { id: 'lib-1', name: 'Sarah Jenkins', email: 'sarah.jenkins@library.com', role: 'Librarian', isActive: true, createdAt: '2025-01-10' },
    { id: 'lib-2', name: 'Marcus Vance', email: 'marcus.vance@library.com', role: 'Librarian', isActive: true, createdAt: '2025-02-01' },
    { id: 'lib-3', name: 'Elena Rostova', email: 'elena.rostova@library.com', role: 'Librarian', isActive: false, createdAt: '2025-03-15' }
  ]);

  studentMembers = computed(() => this.memberService.members());

  isCreateModalOpen = false;
  isEditModalOpen = false;

  librarianName = '';
  librarianEmail = '';

  editingLibrarian: LibrarianAccount = {
    id: '',
    name: '',
    email: '',
    role: 'Librarian',
    isActive: true,
    createdAt: ''
  };

  ngOnInit() {
    this.memberService.loadAll().subscribe();
    this.bookService.loadAll().subscribe();
    this.borrowingService.loadAll().subscribe();
  }

  openCreateLibrarianModal() {
    this.librarianName = '';
    this.librarianEmail = '';
    this.isCreateModalOpen = true;
  }

  saveLibrarian() {
    if (!this.librarianName || !this.librarianEmail) {
      alert('Please fill out Name and Email for the Librarian.');
      return;
    }

    const newLib: LibrarianAccount = {
      id: 'lib-' + (this.librarians().length + 1),
      name: this.librarianName,
      email: this.librarianEmail,
      role: 'Librarian',
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0]
    };

    this.librarians.update(list => [...list, newLib]);
    alert(`Librarian account "${newLib.name}" created successfully with role Librarian!`);
    this.isCreateModalOpen = false;
  }

  openEditLibrarianModal(lib: LibrarianAccount) {
    this.editingLibrarian = { ...lib };
    this.isEditModalOpen = true;
  }

  updateLibrarian() {
    if (!this.editingLibrarian.name || !this.editingLibrarian.email) {
      alert('Name and Email cannot be empty');
      return;
    }

    this.librarians.update(list =>
      list.map(item => item.id === this.editingLibrarian.id ? { ...this.editingLibrarian } : item)
    );

    alert(`Librarian details updated successfully!`);
    this.isEditModalOpen = false;
  }

  toggleLibrarianStatus(lib: LibrarianAccount) {
    const newState = !lib.isActive;
    const actionText = newState ? 'Activate' : 'Deactivate';
    if (confirm(`${actionText} librarian account for "${lib.name}"?`)) {
      this.librarians.update(list =>
        list.map(item => item.id === lib.id ? { ...item, isActive: newState } : item)
      );
    }
  }

  deleteLibrarian(id: string) {
    if (confirm('Delete this librarian account permanently?')) {
      this.librarians.update(list => list.filter(item => item.id !== id));
    }
  }

  deleteUser(id: string) {
    if (confirm('Delete student record?')) {
      this.memberService.delete(id).subscribe();
    }
  }
}

