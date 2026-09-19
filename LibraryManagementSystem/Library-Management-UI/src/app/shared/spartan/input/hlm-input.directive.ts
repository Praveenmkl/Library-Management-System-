import { Directive, Input, computed, signal } from '@angular/core';
import { hlm } from '../utils';

@Directive({
  selector: '[hlmInput]',
  standalone: true,
  host: {
    '[class]': '_computedClass()'
  }
})
export class HlmInputDirective {
  private readonly _userClass = signal<string>('');

  @Input()
  set class(value: string) {
    this._userClass.set(value);
  }

  protected _computedClass = computed(() =>
    hlm(
      'flex h-10 w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 transition-all backdrop-blur-sm',
      this._userClass()
    )
  );
}
