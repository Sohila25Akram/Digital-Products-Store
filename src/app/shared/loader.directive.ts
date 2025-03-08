import {
  Directive,
  ElementRef,
  inject,
  input,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
} from '@angular/core';

@Directive({
  selector: '[appLoader]',
  standalone: true,
})
export class LoaderDirective implements OnChanges {
  isLoading = input(false, { alias: 'appLoader' });
  @Input() addContainer: boolean = false;

  private renderer = inject(Renderer2);
  private el = inject(ElementRef);

  private ourSpan: HTMLElement;
  constructor() {
    this.ourSpan = this.renderer.createElement('span');

    const spinner = this.renderer.createElement('i');
    this.renderer.addClass(spinner, 'fa-solid');
    this.renderer.addClass(spinner, 'fa-spinner');
    this.ourSpan.appendChild(spinner);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isLoading']) {
      if (this.isLoading()) {
        this.showLoading();
      } else {
        this.hideLoading();
      }
    }
  }

  showLoading() {
    const originEl = this.el.nativeElement.querySelector('div');
    if (originEl) {
      if (this.addContainer == true) {
        const spinnerContainer = this.renderer.createElement('p');
        this.renderer.addClass(spinnerContainer, 'add-container');
        this.renderer.setStyle(this.ourSpan, 'font-size', '38px');
        this.renderer.appendChild(spinnerContainer, this.ourSpan);
        this.renderer.appendChild(originEl, spinnerContainer);
      } else {
        this.renderer.setStyle(this.ourSpan, 'font-size', '16px');
        this.renderer.appendChild(originEl, this.ourSpan);
      }
      const originSpan = originEl.querySelector('span');
      if (originSpan) {
        this.renderer.setStyle(originSpan, 'display', 'none');
      }
    }
  }
  hideLoading() {
    const originEl = this.el.nativeElement.querySelector('div');
    if (originEl) {
      if (this.addContainer) {
        const spinnerContainer = originEl.querySelector('.add-container');
        if (spinnerContainer) {
          this.renderer.removeChild(originEl, spinnerContainer);
        }
      } else if (this.ourSpan && originEl.contains(this.ourSpan)) {
        this.renderer.removeChild(originEl, this.ourSpan);
      }

      const originSpan = originEl.querySelector('span');
      if (originSpan) {
        this.renderer.removeStyle(originSpan, 'display');
      }
    }
  }
}
