import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-product-snapshot',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './product-snapshot.component.html',
  styleUrl: './product-snapshot.component.scss',
})
export class ProductSnapshotComponent {
  product = { newPrice: '300', originPrice: '1000' };
}
