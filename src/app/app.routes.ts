import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./home/home.component').then((c) => c.HomeComponent),
    children: [
      {
        path: 'quick-view/:productId',
        loadComponent: () =>
          import('./shared/quick-view-fixed/quick-view-fixed.component').then(
            (c) => c.QuickViewFixedComponent
          ),
      },
      {
        path: 'cart-menu',
        loadComponent: () =>
          import('./shared/cart-menu/cart-menu.component').then(
            (c) => c.CartMenuComponent
          ),
      },
    ],
  },
  {
    path: 'products/:productId',
    loadComponent: () =>
      import('./product-details/product-details.component').then(
        (c) => c.ProductDetailsComponent
      ),
  },
  {
    path: 'wishlist',
    loadComponent: () =>
      import('./wishlist/wishlist.component').then((c) => c.WishlistComponent),
  },
  {
    path: 'shop',
    loadComponent: () =>
      import('./shop/shop.component').then((c) => c.ShopComponent),
  },
];
