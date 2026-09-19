import { Directive, Input, computed, signal } from '@angular/core';
import { cva, VariantProps } from 'class-variance-authority';
import { hlm } from '../utils';

export const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-white/20 bg-white/10 text-white font-bold',
        secondary: 'border-white/10 bg-zinc-800 text-zinc-300',
        destructive: 'border-zinc-700 bg-zinc-900 text-zinc-400 font-bold',
        success: 'border-white/30 bg-white/15 text-white font-bold',
        warning: 'border-white/20 bg-zinc-800 text-zinc-200 font-bold',
        outline: 'text-white/80 border-white/20'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);

export type BadgeVariants = VariantProps<typeof badgeVariants>;

@Directive({
  selector: '[hlmBadge]',
  standalone: true,
  host: {
    '[class]': '_computedClass()'
  }
})
export class HlmBadgeDirective {
  private readonly _variant = signal<BadgeVariants['variant']>('default');
  private readonly _userClass = signal<string>('');

  @Input()
  set variant(value: BadgeVariants['variant']) {
    this._variant.set(value);
  }

  @Input()
  set class(value: string) {
    this._userClass.set(value);
  }

  protected _computedClass = computed(() =>
    hlm(badgeVariants({ variant: this._variant() }), this._userClass())
  );
}
