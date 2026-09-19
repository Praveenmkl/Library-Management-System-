import { Directive, Input, computed, signal } from '@angular/core';
import { hlm } from '../utils';

@Directive({
  selector: '[hlmCardHeader]',
  standalone: true,
  host: {
    '[class]': '_computedClass()'
  }
})
export class HlmCardHeaderDirective {
  private readonly _userClass = signal<string>('');
  @Input() set class(value: string) { this._userClass.set(value); }
  protected _computedClass = computed(() => hlm('flex flex-col space-y-1.5 p-6', this._userClass()));
}

@Directive({
  selector: '[hlmCardTitle]',
  standalone: true,
  host: {
    '[class]': '_computedClass()'
  }
})
export class HlmCardTitleDirective {
  private readonly _userClass = signal<string>('');
  @Input() set class(value: string) { this._userClass.set(value); }
  protected _computedClass = computed(() => hlm('text-xl font-bold leading-none tracking-tight text-foreground', this._userClass()));
}

@Directive({
  selector: '[hlmCardDescription]',
  standalone: true,
  host: {
    '[class]': '_computedClass()'
  }
})
export class HlmCardDescriptionDirective {
  private readonly _userClass = signal<string>('');
  @Input() set class(value: string) { this._userClass.set(value); }
  protected _computedClass = computed(() => hlm('text-sm text-muted-foreground', this._userClass()));
}

@Directive({
  selector: '[hlmCardContent]',
  standalone: true,
  host: {
    '[class]': '_computedClass()'
  }
})
export class HlmCardContentDirective {
  private readonly _userClass = signal<string>('');
  @Input() set class(value: string) { this._userClass.set(value); }
  protected _computedClass = computed(() => hlm('p-6 pt-0', this._userClass()));
}
