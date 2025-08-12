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
    path: 'shop/:categoryValue',
    loadComponent: () =>
      import('./shop/shop.component').then((c) => c.ShopComponent),
  },
  {
     path: 'auth',
    loadComponent: () => import('./auth/auth.component').then(c => c.AuthComponent),
    loadChildren: () => import('../app/auth/auth.routes').then(r => r.authRoutes)
  },
  {
    path: 'payment',
    loadComponent: () => import('./payment/payment.component').then(c => c.PaymentComponent)
  },
  {
    path: 'orders',
    loadComponent: () => import('./orders/orders.component').then(c => c.OrdersComponent)
  }
];
