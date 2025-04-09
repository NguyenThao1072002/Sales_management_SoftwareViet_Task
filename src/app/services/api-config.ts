/**
 * Cấu hình API cho toàn bộ ứng dụng
 */

export const environment = {
    production: false,
    apiUrl: 'https://localhost:7217/api',  // URL API cơ sở thực tế
};

// Cấu trúc endpoint cho từng đối tượng
export const apiEndpoints = {
    invoices: {
        base: `${environment.apiUrl}/SalesInvoice`,
        getAll: `${environment.apiUrl}/SalesInvoice/getAllSaleInvoice`,
        getNextCode: `${environment.apiUrl}/SalesInvoice/getNextInvoiceCode`,
        getPaged: `${environment.apiUrl}/SalesInvoice/getPaged`,
        getById: (invoiceId: number) => `${environment.apiUrl}/SalesInvoice/getById/${invoiceId}`,
        getByInvoiceCode: `${environment.apiUrl}/SalesInvoice/getByInvoiceCode`,
        create: `${environment.apiUrl}/SalesInvoice/create`,
        update: `${environment.apiUrl}/SalesInvoice/update`,
        delete: `${environment.apiUrl}/SalesInvoice/delete`,
    },
    products: {
        base: `${environment.apiUrl}/Product`,
        getAll: `${environment.apiUrl}/Product/getAll`,
        getPaged: `${environment.apiUrl}/Product/getPaged`,
        getById: (id: string) => `${environment.apiUrl}/Product/getProduct/${id}`,
        search: `${environment.apiUrl}/Product/searchProduct`
    },
    customers: {
        base: `${environment.apiUrl}/Customer`,
        getAll: `${environment.apiUrl}/Customer/getAllCustomer`,
        getSearch: `${environment.apiUrl}/Customer/getSearch`,
        getPaged: `${environment.apiUrl}/Customer/getPaged`,
        getById: (id: string) => `${environment.apiUrl}/Customer/getCustomer/${id}`,
    }
}; 