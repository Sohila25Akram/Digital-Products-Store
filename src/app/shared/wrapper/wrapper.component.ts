import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-wrapper',
  standalone: true,
  imports: [],
  templateUrl: './wrapper.component.html',
  styleUrl: './wrapper.component.scss',
})
export class WrapperComponent {
  @Input() isOpen!: boolean;
  @Input() component!: string;
  @Output() closeEvent = new EventEmitter<boolean>();

  onClose() {
    this.closeEvent.emit(false);
  }
}
