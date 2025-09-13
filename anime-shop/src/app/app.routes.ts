import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/home/home').then(m => m.Home)
  },
  {
    path: 'products',
    loadComponent: () => import('./pages/products/products').then(m => m.Products)
  },
  {
    path: 'product/:id',
    loadComponent: () => import('./pages/product-detail/product-detail').then(m => m.ProductDetail)
  },
  {
    path: 'cart',
    loadComponent: () => import('./pages/cart/cart').then(m => m.Cart)
  },
  {
    path: 'checkout',
    loadComponent: () => import('./pages/checkout/checkout').then(m => m.Checkout)
  },
  {
    path: 'wallet',
    loadComponent: () => import('./pages/wallet/wallet').then(m => m.WalletComponent)
  },
  {
    path: 'admin/ingest',
    loadComponent: () => import('./pages/admin-ingest/admin-ingest').then(m => m.AdminIngestComponent)
  },
  { path: '**', redirectTo: '' }
];
