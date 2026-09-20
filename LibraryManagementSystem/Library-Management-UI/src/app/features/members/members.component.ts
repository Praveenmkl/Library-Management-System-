import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MemberService } from '../../core/services/member.service';
import { AuthService } from '../../core/services/auth.service';
import { Member } from '../../core/models/member.model';
import { HlmButtonDirective } from '../../shared/spartan/button/hlm-button.directive';
import { HlmInputDirective } from '../../shared/spartan/input/hlm-input.directive';
import { HlmBadgeDirective } from '../../shared/spartan/badge/hlm-badge.directive';
import { HlmCardDirective } from '../../shared/spartan/card/hlm-card.directive';
import { SpartanDialogComponent } from '../../shared/spartan/dialog/spartan-dialog.component';
import { provideIcons, NgIconComponent } from '@ng-icons/core';
import { lucideUsers, lucideUserPlus, lucideSearch, lucidePencil, lucideTrash2, lucideMail, lucidePhone, lucideCircleCheck, lucideCircleX } from '@ng-icons/lucide';

@Component({
  selector: 'app-members',
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
  providers: [provideIcons({ lucideUsers, lucideUserPlus, lucideSearch, lucidePencil, lucideTrash2, lucideMail, lucidePhone, lucideCircleCheck, lucideCircleX })],
  template: `
    <div class="space-y-6 animate-in fade-in duration-300">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-extrabold text-foreground tracking-tight">Member Directory</h1>
          <p class="text-sm text-muted-foreground mt-0.5">Manage library memberships and contact records</p>
        </div>
        <button
          *ngIf="authService.canManageStudents()"
          hlmBtn
          variant="default"
          (click)="openAddModal()"
          class="font-bold !bg-gradient-to-br !from-brand-500 !to-brand-600 !text-white !border-0 shadow-lg shadow-brand-500/30 hover:!from-brand-600 hover:!to-brand-700"
        >
          <ng-icon name="lucideUserPlus" class="mr-2 text-base"></ng-icon>
          Register Member
        </button>
      </div>

      <!-- Search & Filter Bar -->
      <div hlmCard class="p-4 flex items-center justify-between border border-brand-500/20">
        <div class="relative w-full md:w-96">
          <ng-icon name="lucideSearch" class="absolute left-3 top-3 text-brand-400/50 text-base"></ng-icon>
          <input
            hlmInput
            type="text"
            [ngModel]="searchTerm()"
            (ngModelChange)="searchTerm.set($event)"
            placeholder="Search member by Name, Email, or Phone..."
            class="pl-10 focus:border-brand-500/50"
          />
        </div>
      </div>

      <!-- Data Table -->
      <div hlmCard class="p-0 overflow-hidden shadow-xl border border-brand-500/20">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-muted/50 text-xs uppercase text-muted-foreground border-b border-border">
              <tr>
                <th class="py-4 px-6 font-semibold">Member Info</th>
                <th class="py-4 px-4 font-semibold">Email</th>
                <th class="py-4 px-4 font-semibold">Phone</th>
                <th class="py-4 px-4 font-semibold">Address</th>
                <th class="py-4 px-4 font-semibold text-center">Status</th>
                <th *ngIf="authService.canManageStudents()" class="py-4 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border/40">
              <tr *ngFor="let member of filteredMembers()" class="hover:bg-brand-500/5 transition-colors">
                <td class="py-4 px-6">
                  <div class="flex items-center space-x-3">
                    <div class="w-9 h-9 rounded-full !bg-gradient-to-br !from-brand-500 !to-brand-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-brand-500/20">
                      {{ member.name.charAt(0).toUpperCase() }}
                    </div>
                    <div>
                      <div class="font-bold text-foreground">{{ member.name }}</div>
                      <div class="text-[11px] font-mono text-muted-foreground">ID: {{ member.id }}</div>
                    </div>
                  </div>
                </td>
                <td class="py-4 px-4 text-muted-foreground text-xs">{{ member.email }}</td>
                <td class="py-4 px-4 text-muted-foreground text-xs font-mono">{{ member.phone }}</td>
                <td class="py-4 px-4 text-muted-foreground text-xs truncate max-w-xs">{{ member.address }}</td>
                <td class="py-4 px-4 text-center">
                  <span
                    hlmBadge
                    variant="outline"
                    class="text-[10px] font-bold {{ member.isActive ? 'border-brand-500/30 text-brand-300 bg-brand-500/10' : 'text-zinc-400 border-zinc-700' }}"
                  >
                    {{ member.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td *ngIf="authService.canManageStudents()" class="py-4 px-6 text-right space-x-2">
                  <button
                    hlmBtn
                    variant="ghost"
                    size="icon"
                    (click)="openEditModal(member)"
                    class="h-8 w-8 text-zinc-400 hover:text-brand-300 hover:bg-brand-500/10"
                  >
                    <ng-icon name="lucidePencil" class="text-sm"></ng-icon>
                  </button>
                  <button
                    *ngIf="authService.isAdmin()"
                    hlmBtn
                    variant="ghost"
                    size="icon"
                    (click)="deleteMember(member.id!)"
                    class="h-8 w-8 text-zinc-400 hover:text-red-400 hover:bg-red-500/10"
                  >
                    <ng-icon name="lucideTrash2" class="text-sm"></ng-icon>
                  </button>
                </td>
              </tr>
              <tr *ngIf="filteredMembers().length === 0">
                <td [attr.colspan]="authService.isAuthenticated() ? 6 : 5" class="py-12 text-center text-muted-foreground">
                  <ng-icon name="lucideUsers" class="text-3xl text-brand-500/30 mb-2"></ng-icon>
                  <p class="text-sm">No members found.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add/Edit Member Dialog Modal -->
      <app-spartan-dialog
        [(isOpen)]="isModalOpen"
        [title]="isEditMode ? 'Edit Member Profile' : 'Register New Member'"
        [description]="isEditMode ? 'Update member contact information.' : 'Enter new member contact details to register.'"
      >
        <form (ngSubmit)="saveMember()" class="space-y-4">
          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-foreground">Full Name</label>
            <input hlmInput type="text" [(ngModel)]="currentMember.name" name="name" required placeholder="e.g. Alice Smith" class="focus:border-brand-500/60" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-foreground">Email Address</label>
              <input hlmInput type="email" [(ngModel)]="currentMember.email" name="email" required placeholder="alice@example.com" class="focus:border-brand-500/60" />
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-foreground">Phone Number</label>
              <input hlmInput type="text" [(ngModel)]="currentMember.phone" name="phone" required placeholder="+1 555-0192" class="focus:border-brand-500/60" />
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-foreground">Postal Address</label>
            <input hlmInput type="text" [(ngModel)]="currentMember.address" name="address" required placeholder="123 Science Park Way" class="focus:border-brand-500/60" />
          </div>

          <div class="flex items-center space-x-2 pt-2">
            <input type="checkbox" [(ngModel)]="currentMember.isActive" name="isActive" id="isActive" class="rounded border-input text-brand-600 focus:ring-brand-500" />
            <label for="isActive" class="text-xs font-semibold text-foreground">Active Member Account</label>
          </div>

          <div class="flex justify-end space-x-3 pt-4 border-t border-border">
            <button hlmBtn variant="outline" type="button" (click)="isModalOpen = false">Cancel</button>
            <button hlmBtn variant="default" type="submit" class="font-bold !bg-gradient-to-br !from-brand-500 !to-brand-600 !text-white !border-0 shadow-lg shadow-brand-500/30 hover:!from-brand-600 hover:!to-brand-700">
              {{ isEditMode ? 'Save Profile' : 'Register Member' }}
            </button>
          </div>
        </form>
      </app-spartan-dialog>
    </div>
  `
})
export class MembersComponent implements OnInit {
  memberService = inject(MemberService);
  authService = inject(AuthService);

  searchTerm = signal('');

  isModalOpen = false;
  isEditMode = false;

  currentMember: Member = {
    name: '',
    email: '',
    phone: '',
    address: '',
    isActive: true
  };

  filteredMembers = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    return this.memberService.members().filter(m => {
      return (
        !term ||
        m.name.toLowerCase().includes(term) ||
        m.email.toLowerCase().includes(term) ||
        m.phone.toLowerCase().includes(term)
      );
    });
  });

  ngOnInit() {
    this.memberService.loadAll().subscribe();
  }

  openAddModal() {
    this.isEditMode = false;
    this.currentMember = {
      name: '',
      email: '',
      phone: '',
      address: '',
      isActive: true
    };
    this.isModalOpen = true;
  }

  openEditModal(member: Member) {
    this.isEditMode = true;
    this.currentMember = { ...member };
    this.isModalOpen = true;
  }

  saveMember() {
    if (this.isEditMode && this.currentMember.id) {
      this.memberService.update(this.currentMember.id, this.currentMember).subscribe(() => {
        this.isModalOpen = false;
      });
    } else {
      this.memberService.create(this.currentMember).subscribe(() => {
        this.isModalOpen = false;
      });
    }
  }

  deleteMember(id: string) {
    if (confirm('Are you sure you want to remove this member?')) {
      this.memberService.delete(id).subscribe();
    }
  }
}

