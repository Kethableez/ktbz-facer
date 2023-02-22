
import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({ selector: '[ktbzDisableAutofill]' })
export class DisableAutofillDirective {
  constructor(private elRef: ElementRef, private renderer: Renderer2) {
    this.disable();
  }

  disable() {
    this.renderer.setAttribute(this.elRef.nativeElement, 'autocomplete', 'new-password');
    const rndnm = Math.random().toString(36).replace(/[^a-z]+/g, '').substring(0, 10);
    this.renderer.setAttribute(this.elRef.nativeElement, 'username', rndnm);
  }
}
