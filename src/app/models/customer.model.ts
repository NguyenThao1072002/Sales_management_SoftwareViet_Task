/**
 * Model định nghĩa cấu trúc dữ liệu cho khách hàng theo API thực tế
 */

// Interface cho khách hàng từ API
export interface Customer {
    customerId: number;      // ID của khách hàng
    customerCode: string;    // Mã khách hàng
    customerName: string;    // Tên khách hàng
    phoneNumber: string;     // Số điện thoại
    address: string;         // Địa chỉ
    email: string;           // Email
    taxCode?: string;
    createdDate: string;     // Ngày tạo
}

// Cấu trúc danh sách khách hàng từ API
export interface CustomerItems {
    items: Customer[];
    totalRecords: number;
}

// Cấu trúc đối tượng data từ API
export interface CustomerData {
    customerDtos: CustomerItems;
}

// Cấu trúc response từ API
export interface CustomerApiResponse {
    status: number;
    message: string | null;
    data: CustomerData;
}

// Tham số truyền vào khi gọi API lấy danh sách khách hàng
export interface CustomerQueryParams {
    search?: string;        // Từ khóa tìm kiếm
    pageNumber?: number;    // Trang hiện tại
    pageSize?: number;      // Số lượng item mỗi trang
}

// Phản hồi đã được xử lý để sử dụng trong component
export interface CustomerListResponse {
    data: Customer[];
    total: number;          // Tổng số khách hàng (để phân trang)
} 