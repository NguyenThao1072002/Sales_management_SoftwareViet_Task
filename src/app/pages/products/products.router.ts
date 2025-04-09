import { Routes } from '@angular/router';

export const productsRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./products.component').then(m => m.ProductsComponent)
    }
];
