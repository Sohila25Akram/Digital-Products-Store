import { CurrencyPipe } from '@angular/common';
import {
  Component,
  DestroyRef,
  inject,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Product } from '../models/product.model';
import { ProductsService } from '../services/products.service';

@Component({
  selector: 'app-quick-view-window',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './quick-view-window.component.html',
  styleUrl: './quick-view-window.component.scss',
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class QuickViewWindowComponent implements OnInit {
  @Input() isExpanded?: boolean = false;
  private productsService = inject(ProductsService);
  products = this.productsService.loadedProducts();
  product!: Product;
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const subscription = this.activatedRoute.paramMap.subscribe({
      next: (paramMap) => {
        const productId = paramMap.get('productId');
        if (productId) {
          this.product = this.products.find((p) => p.id === productId)!;
        }
      },
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
  onSubmit() {
    this.router.navigate(['/cart-menu']);
  }
}
