import { Component, computed, DestroyRef, effect, inject, OnInit } from '@angular/core';
import { QuickViewWindowComponent } from '../shared/quick-view-window/quick-view-window.component';
import { ActivatedRoute } from '@angular/router';
import { ShippingComponent } from '../shared/shipping/shipping.component';
import { TopTabComponent } from '../shared/top-tab/top-tab.component';
import { ProductsService } from '../shared/services/products.service';
import { Product } from '../shared/models/product.model';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [TopTabComponent, QuickViewWindowComponent, ShippingComponent],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit {
  private productsService = inject(ProductsService);

  // products = computed(() => this.productsService.loadedProducts());

  product!: Product;
  productName: string = '';

  productId: string | null = null;

  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  constructor(){
    effect(() => {
       const products = this.productsService.loadedProducts();
      if (!products?.length || !this.productId) return;

      const found = products.find(p => p.id === this.productId);
      if (found) {
        this.product = found;
        this.productName = found.title;
      }
    })

  }
  ngOnInit(): void {
    const supscription = this.activatedRoute.paramMap.subscribe({
      next: (paramMap) => {
        this.productId = paramMap.get('productId');
      },
    });
    this.destroyRef.onDestroy(() => supscription.unsubscribe());
  }
}
