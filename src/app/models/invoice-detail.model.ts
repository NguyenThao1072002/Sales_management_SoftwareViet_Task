// File: sales-invoice-detail-response.dto.ts

export interface SalesInvoiceDetailResponseDto {
    InvoiceDetailId: number;       // Invoice Detail ID (Primary Key)
    InvoiceId: number;             // Foreign Key to SalesInvoices table
    ProductId: number;             // Foreign Key to Products table
    ProductCode: string;           // Product code (e.g., barcode)
    ProductName: string;           // Product name
    OutstandingDebt: number;      // Outstanding debt amount
    Unit: string;                  // Unit of measurement (e.g., piece, box, etc.)
    Quantity: number;             // Quantity of products
    UnitPrice: number;            // Price per unit
    TotalPrice: number;           // Total price (Quantity * UnitPrice)
    Discount: number;             // Discount applied to this product
    TaxRate: number;              // Tax rate applicable to the product
    TaxAmount: number;            // Amount of tax (Quantity * UnitPrice * TaxRate)
    LineNote: string;             // Optional note for this line item
    isEdited?: boolean;
}
