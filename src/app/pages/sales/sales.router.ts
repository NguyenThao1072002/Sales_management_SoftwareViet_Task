import { Routes } from '@angular/router';

export const salesRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./sales.component').then(m => m.SalesComponent)
    },
    {
        path: 'add-invoice',
        loadComponent: () => import('./add-invoice/add-invoice.component').then(m => m.AddInvoiceComponent)
    },
    {
        path: 'invoice-detail/:id',
        loadComponent: () => import('./invoice-detail/invoice-detail.component').then(m => m.InvoiceDetailComponent)
    },
    {
        path: 'invoice-update/:id',
        loadComponent: () => import('./invoice-update/invoice-update.component').then(m => m.InvoiceUpdateComponent)
    }

];
