import { Routes } from '@angular/router';
// import { QuickViewWindowComponent } from './shared/quick-view-window/quick-view-window.component';
import { QuickViewFixedComponent } from './shared/quick-view-fixed/quick-view-fixed.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./home/home.component').then((c) => c.HomeComponent),
    children: [{ path: 'quick-view', component: QuickViewFixedComponent }],
  },
];
