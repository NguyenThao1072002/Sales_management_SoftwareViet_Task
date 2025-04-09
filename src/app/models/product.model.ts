/**
 * Model định nghĩa cấu trúc dữ liệu cho sản phẩm theo API thực tế
 */

// Interface cho sản phẩm từ API
export interface Product {
    productId: number;      // ID của sản phẩm
    productCode: string;    // Mã sản phẩm
    productName: string;    // Tên sản phẩm
    price: number;          // Giá bán
    stockQuantity: number;  // Số lượng tồn kho
    createdDate: string;    // Ngày tạo sản phẩm
    unit: string;         // Đơn vị tính
}

// Cấu trúc danh sách sản phẩm từ API
export interface ProductItems {
    items: Product[];
    totalRecords: number;
}

// Cấu trúc đối tượng data từ API
export interface ProductData {
    productDtos: ProductItems;
}

// Cấu trúc response từ API
export interface ProductApiResponse {
    status: number;
    message: string | null;
    data: ProductData;
}

// Tham số truyền vào khi gọi API lấy danh sách sản phẩm
export interface ProductQueryParams {
    search?: string;        // Từ khóa tìm kiếm
    pageNumber?: number;    // Trang hiện tại
    pageSize?: number;
}

// Phản hồi đã được xử lý để sử dụng trong component
export interface ProductListResponse {
    data: Product[];
    total: number;          // Tổng số sản phẩm (để phân trang)
} 