import { Component, inject, OnInit } from '@angular/core';
import { QuickViewWindowComponent } from '../shared/quick-view-window/quick-view-window.component';
import { Product } from '../shared/models/product.model';
import { ActivatedRoute } from '@angular/router';
import { DummyProducts } from '../../assets/data/dummy-products';
import { ShippingComponent } from '../shared/shipping/shipping.component';
import { TopTabComponent } from '../shared/top-tab/top-tab.component';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [TopTabComponent, QuickViewWindowComponent, ShippingComponent],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit {
  products: Product[] = DummyProducts;
  productName: string = '';

  private activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (paramMap) => {
        const productId = paramMap.get('productId');
        if (productId) {
          this.productName = this.products.find(
            (p) => p.id === productId
          )!.title;
        }
      },
    });
  }
}
