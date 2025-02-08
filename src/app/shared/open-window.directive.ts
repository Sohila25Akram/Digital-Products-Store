import {
  Directive,
  ElementRef,
  inject,
  Input,
  Renderer2,
  SimpleChanges,
} from '@angular/core';

@Directive({
  selector: '[appOpenWindow]',
  standalone: true,
  host: { '(click)': 'onToggle()' },
})
export class OpenWindowDirective {
  isOpen: boolean = false;
  private renderer = inject(Renderer2);
  private el = inject(ElementRef);

  onToggle() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.openWindow();
    } else {
      this.closeWindow();
    }
    console.log('is open: ', this.isOpen);
  }

  openWindow() {
    const ourWindow = this.el.nativeElement.parentElement.closest('article');
    if (ourWindow) {
      this.renderer.setStyle(ourWindow, 'display', 'block');
    }
  }
  closeWindow() {
    const ourWindow = this.el.nativeElement.parentElement.closest('article');
    if (ourWindow) {
      this.renderer.removeStyle(ourWindow, 'display');
    }
  }
}
