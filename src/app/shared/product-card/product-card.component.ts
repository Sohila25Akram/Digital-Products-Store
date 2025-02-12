import { CurrencyPipe, PercentPipe } from '@angular/common';
import { Component, inject, Input, input } from '@angular/core';
import { Product } from '../models/product.model';
import { QuickViewWindowComponent } from '../quick-view-window/quick-view-window.component';
import { OpenWindowDirective } from '../open-window.directive';
import { Router, RouterLink } from '@angular/router';
import { ProductsService } from '../services/products.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CurrencyPipe, PercentPipe, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() inWishlist: boolean = false;

  private productsService = inject(ProductsService);
  private router = inject(Router);

  addToWishlist() {
    this.productsService.addProductToWishlist(this.product.id);
    this.router.navigateByUrl('/wishlist');
  }
  deleteFromWishlist() {
    this.productsService.deleteProductFromWishlist(this.product.id);
  }
}
