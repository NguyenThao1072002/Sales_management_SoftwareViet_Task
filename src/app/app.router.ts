import { Routes } from '@angular/router';
import { LayoutAdminComponent } from './layout/layout-admin/layout-admin.component';

export const routes: Routes = [
    {
        path: '',
        component: LayoutAdminComponent,
        children: [
            {
                path: 'sales',
                loadChildren: () => import('./pages/sales/sales.router').then(m => m.salesRoutes)
            },
            {
                path: 'products',
                loadChildren: () => import('./pages/products/products.router').then(m => m.productsRoutes)
            },
            {
                path: 'customers',
                loadChildren: () => import('./pages/customers/customers.router').then(m => m.customersRoutes)
            },
            { path: '', redirectTo: 'sales', pathMatch: 'full' },
        ],
    },
];
