import { Component, inject } from '@angular/core';
import { BestSellerCardComponent } from './best-seller-card/best-seller-card.component';
import { ProductCardComponent } from '../shared/product-card/product-card.component';
import { QuickViewWindowComponent } from '../shared/quick-view-window/quick-view-window.component';
import { RouterOutlet } from '@angular/router';
import { ProductsService } from '../shared/services/products.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    BestSellerCardComponent,
    ProductCardComponent,
    QuickViewWindowComponent,
    RouterOutlet,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private productsService = inject(ProductsService);

  products = this.productsService.loadedProducts();
}
