import { CurrencyPipe, PercentPipe } from '@angular/common';
import { Component, Input, input } from '@angular/core';
import { Product } from '../models/product.model';
import { QuickViewWindowComponent } from '../quick-view-window/quick-view-window.component';
import { OpenWindowDirective } from '../open-window.directive';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CurrencyPipe, PercentPipe, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  @Input() product!: Product;
}
