import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HlmButtonDirective } from '../button/hlm-button.directive';
import { provideIcons, NgIconComponent } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';

@Component({
  selector: 'app-spartan-dialog',
  standalone: true,
  imports: [CommonModule, HlmButtonDirective, NgIconComponent],
  providers: [provideIcons({ lucideX })],
  template: `
    <div
      *ngIf="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
    >
      <div
        class="relative w-full max-w-lg rounded-2xl border border-border bg-card/90 backdrop-blur-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200"
        (click)="$event.stopPropagation()"
      >
        <!-- Header -->
        <div class="flex items-center justify-between pb-4 border-b border-border/50">
          <div>
            <h3 class="text-xl font-bold text-foreground">{{ title }}</h3>
            <p *ngIf="description" class="text-xs text-muted-foreground mt-0.5">{{ description }}</p>
          </div>
          <button
            hlmBtn
            variant="ghost"
            size="icon"
            (click)="close()"
            class="h-8 w-8 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground"
          >
            <ng-icon name="lucideX" class="text-lg"></ng-icon>
          </button>
        </div>

        <!-- Body -->
        <div class="py-4">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `
})
export class SpartanDialogComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() description = '';
  @Output() isOpenChange = new EventEmitter<boolean>();

  close() {
    this.isOpen = false;
    this.isOpenChange.emit(false);
  }
}
