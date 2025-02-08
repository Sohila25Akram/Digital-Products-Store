import { Component } from '@angular/core';
import { QuickViewWindowComponent } from '../quick-view-window/quick-view-window.component';

@Component({
  selector: 'app-quick-view-fixed',
  standalone: true,
  imports: [QuickViewWindowComponent],
  templateUrl: './quick-view-fixed.component.html',
  styleUrl: './quick-view-fixed.component.scss',
})
export class QuickViewFixedComponent {}
