import {
  Directive,
  effect,
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
  spinnerColor = input<string>("#666");

  private renderer = inject(Renderer2);
  private el = inject(ElementRef);

  private spinnerEl!: HTMLElement;
  constructor() {
   
      this.createSpinner();
  
    
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['spinnerColor']){
      this.createSpinner();
    }
    if (changes['isLoading']) {
      if (this.isLoading()) {
        this.hideLoading();
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
        const bigSpinner = this.createBigSpinner();
        this.renderer.appendChild(bigSpinner, this.spinnerEl);
        this.renderer.appendChild(originEl, bigSpinner);
      } else {
        this.renderer.setStyle(this.spinnerEl, 'font-size', '16px');
        this.renderer.appendChild(originEl, this.spinnerEl);
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
      } else {
        this.renderer.removeChild(originEl, this.spinnerEl);
      }

      const originSpan = originEl.querySelector('span');
      if (originSpan) {
        this.renderer.removeStyle(originSpan, 'display');
      }
    }
  }
  createSpinner(){
    this.spinnerEl = this.renderer.createElement('span');

    const spinner = this.renderer.createElement('i');
    this.renderer.addClass(spinner, 'fa-solid');
    this.renderer.addClass(spinner, 'fa-spinner');
    this.renderer.setStyle(spinner, 'color', this.spinnerColor())
    this.spinnerEl.appendChild(spinner);
  }
  createBigSpinner(){
    const spinnerContainer = this.renderer.createElement('p');
    this.renderer.addClass(spinnerContainer, 'add-container');
    this.renderer.setStyle(this.spinnerEl, 'font-size', '38px');

    return spinnerContainer;
  }
}
