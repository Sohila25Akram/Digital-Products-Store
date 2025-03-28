import { Component, inject, NgZone, OnInit, signal } from '@angular/core';
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
  private ngZone = inject(NgZone);
  isLoading = signal(false);

  ngOnInit(): void {
    this.isLoading.set(true);

    this.ngZone.runOutsideAngular(() =>
      setTimeout(() => {
        this.ngZone.run(() => this.isLoading.set(false));
      }, 3000)
    );
  }
}
