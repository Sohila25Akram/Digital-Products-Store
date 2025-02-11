import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { QuickViewWindowComponent } from '../shared/quick-view-window/quick-view-window.component';
import { ActivatedRoute } from '@angular/router';
import { ShippingComponent } from '../shared/shipping/shipping.component';
import { TopTabComponent } from '../shared/top-tab/top-tab.component';
import { ProductsService } from '../shared/services/products.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [TopTabComponent, QuickViewWindowComponent, ShippingComponent],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit {
  private productsService = inject(ProductsService);

  products = this.productsService.loadedProducts();
  productName: string = '';

  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const supscription = this.activatedRoute.paramMap.subscribe({
      next: (paramMap) => {
        const productId = paramMap.get('productId');
        if (productId) {
          this.productName = this.products.find(
            (p) => p.id === productId
          )!.title;
        }
      },
    });
    this.destroyRef.onDestroy(() => supscription.unsubscribe());
  }
}
