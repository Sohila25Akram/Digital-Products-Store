import { Injectable, signal } from '@angular/core';
import { Product } from '../models/product.model';
import { DummyProducts } from '../../../assets/data/dummy-products';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  products = signal<Product[]>(DummyProducts);

  loadedProducts = this.products.asReadonly();
}
