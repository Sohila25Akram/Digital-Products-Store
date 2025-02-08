import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-quick-view-window',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './quick-view-window.component.html',
  styleUrl: './quick-view-window.component.scss',
})
export class QuickViewWindowComponent {
  onSubmit() {}
}
