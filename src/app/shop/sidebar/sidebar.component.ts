import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  @Output() closeEvent = new EventEmitter();

  closeMenu() {
    this.closeEvent.emit(); // Notify parent to close the sidebar
  }
}
