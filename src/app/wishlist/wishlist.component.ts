import { Component, inject } from '@angular/core';
import { ProductCardComponent } from '../shared/product-card/product-card.component';
import { ProductsService } from '../shared/services/products.service';
import { TopTabComponent } from '../shared/top-tab/top-tab.component';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [TopTabComponent, ProductCardComponent],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss',
})
export class WishlistComponent {
  private productsService = inject(ProductsService);
  products = this.productsService.loadedProducts();
}
