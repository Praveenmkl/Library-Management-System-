import { Directive, Input, computed, signal } from '@angular/core';
import { hlm } from '../utils';

@Directive({
  selector: '[hlmCard]',
  standalone: true,
  host: {
    '[class]': '_computedClass()'
  }
})
export class HlmCardDirective {
  private readonly _userClass = signal<string>('');

  @Input()
  set class(value: string) {
    this._userClass.set(value);
  }

  protected _computedClass = computed(() =>
    hlm(
      'rounded-2xl border border-border bg-card/60 backdrop-blur-xl text-card-foreground shadow-xl transition-all duration-300 hover:border-primary/30',
      this._userClass()
    )
  );
}
