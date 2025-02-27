import { CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Product } from '../../shared/models/product.model';

@Component({
  selector: 'app-searched-product',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './searched-product.component.html',
  styleUrl: './searched-product.component.scss',
})
export class SearchedProductComponent {
  @Input() product!: Product;
}
