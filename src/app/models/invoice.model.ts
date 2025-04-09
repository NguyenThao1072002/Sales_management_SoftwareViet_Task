/**
 * Model định nghĩa cấu trúc dữ liệu cho hóa đơn
 */

import { SalesInvoiceDetailResponseDto } from "./invoice-detail.model";

// Interface cho sản phẩm trong hóa đơn
export interface InvoiceProduct {
    barcode: string;
    code: string;
    name: string;
    debitAccount: string;
    creditAccount: string;
    unit: string;
    quantity: number;
    price: number;
    total: number;
    isNew?: boolean;    // Flag để đánh dấu sản phẩm mới thêm (chỉ dùng ở UI)
    isEdited?: boolean; // Flag để đánh dấu sản phẩm đã chỉnh sửa (chỉ dùng ở UI)
    notes?: string;     // Ghi chú cho sản phẩm
}


// Interface cho hóa đơn từ API
export interface Invoice {
    invoiceId: number | string;       // ID của hóa đơn, có thể là số hoặc chuỗi
    invoiceCode: string;              // Mã hóa đơn
    invoiceDate: string;              // Ngày hóa đơn
    deliveryDate: string;             // Ngày giao hàng
    paymentDate: string;              // Ngày thanh toán
    customerId: number | string;      // ID khách hàng
    customerName: string;             // Tên khách hàng
    customerCode?: string;            // Mã khách hàng
    customerPhone?: string;           // Số điện thoại khách hàng
    // customerEmail?: string;           // Email khách hàng
    customerAddress?: string;         // Địa chỉ khách hàng
    deliveryAddress: string;          // Địa chỉ giao hàng
    vatinvoice?: boolean;             // Có xuất hóa đơn VAT không
    referenceInvoiceNumber?: string;  // Số hóa đơn tham chiếu
    notes: string;                    // Ghi chú
    deliveryPerson: string;           // Người giao hàng
    paymentMethod: string;         // Phương thức thanh toán
    invoiceStatus: string;            // Trạng thái hóa đơn
    subTotal: number;                 // Tổng tiền trước thuế
    totalDiscount: number;            // Tổng chiết khấu
    totalTaxAmount: number;           // Tổng thuế
    totalAmount: number;              // Tổng tiền
    discount: number;                 // Chiết khấu
    customer?: any;                   // Thông tin khách hàng
    items?: any[];      // Chi tiết hóa đơn
    shipments?: any[];                // Thông tin vận chuyển
    status?: number;                  // Trạng thái (số)
}

// Tham số truyền vào khi gọi API lấy danh sách hóa đơn có phân trang
export interface InvoiceQueryParams {
    pageNumber: number;
    pageSize: number;
    invoiceId?: number | string;
    invoiceCode?: string;
    invoiceDate?: string;
    paymentDate?: string;
    deliveryDate?: string;
    deliveryAddress?: string;
    invoiceStatus?: string;
    totalAmount?: number;
    customerName?: string;
    customerPhone?: string;
    searchTerm?: string;
}

// Cấu trúc danh sách hóa đơn từ API
export interface InvoiceItems {
    saleInvoices: Invoice[];
    totalRecord: number;
}

// Cấu trúc response từ API
export interface InvoiceApiResponse {
    status: number;
    message: string | null;
    data: InvoiceItems;
}

// Phản hồi đã được xử lý để sử dụng trong component
export interface InvoiceListResponse {
    data: Invoice[];
    total: number;
} 