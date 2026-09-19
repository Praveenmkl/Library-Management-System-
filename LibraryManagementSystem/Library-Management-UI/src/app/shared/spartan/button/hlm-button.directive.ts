import { Directive, Input, computed, signal } from '@angular/core';
import { cva, VariantProps } from 'class-variance-authority';
import { hlm } from '../utils';

export const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default: 'bg-white text-black font-bold shadow-md hover:bg-zinc-200 hover:shadow-white/20',
        destructive: 'bg-destructive text-destructive-foreground shadow-md hover:bg-destructive/90',
        outline: 'border border-border bg-background/50 backdrop-blur-md hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        glass: 'bg-white/10 text-white backdrop-blur-lg border border-white/20 hover:bg-white/20 shadow-lg'
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-12 rounded-xl px-8 text-base',
        icon: 'h-10 w-10'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;

@Directive({
  selector: '[hlmBtn]',
  standalone: true,
  host: {
    '[class]': '_computedClass()'
  }
})
export class HlmButtonDirective {
  private readonly _variant = signal<ButtonVariants['variant']>('default');
  private readonly _size = signal<ButtonVariants['size']>('default');
  private readonly _userClass = signal<string>('');

  @Input()
  set variant(value: ButtonVariants['variant']) {
    this._variant.set(value);
  }

  @Input()
  set size(value: ButtonVariants['size']) {
    this._size.set(value);
  }

  @Input()
  set class(value: string) {
    this._userClass.set(value);
  }

  protected _computedClass = computed(() =>
    hlm(buttonVariants({ variant: this._variant(), size: this._size() }), this._userClass())
  );
}
