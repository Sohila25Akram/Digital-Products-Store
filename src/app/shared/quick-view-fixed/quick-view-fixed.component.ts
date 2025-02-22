import { Component, OnInit } from '@angular/core';
import { QuickViewWindowComponent } from '../quick-view-window/quick-view-window.component';
import { LoaderDirective } from '../loader.directive';

@Component({
  selector: 'app-quick-view-fixed',
  standalone: true,
  imports: [QuickViewWindowComponent, LoaderDirective],
  templateUrl: './quick-view-fixed.component.html',
  styleUrl: './quick-view-fixed.component.scss',
})
export class QuickViewFixedComponent implements OnInit {
  isLoading: boolean = false;

  ngOnInit(): void {
    this.isLoading = true;
    setTimeout(() => {
      console.log('loading...');
      this.isLoading = false;
    }, 3000);
  }
}
