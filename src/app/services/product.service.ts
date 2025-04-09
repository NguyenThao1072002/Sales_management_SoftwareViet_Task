import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { apiEndpoints } from './api-config';
import {
    Product,
    ProductApiResponse,
    ProductListResponse,
    ProductQueryParams
} from '../models/product.model';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    constructor(private http: HttpClient) { }

    getProducts(params?: ProductQueryParams): Observable<ProductListResponse> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });

        const httpOptions = {
            headers: headers,
            withCredentials: false
        };

        return this.http.post<ProductApiResponse>(apiEndpoints.products.getAll, params, httpOptions)
            .pipe(
                map(response => {
                    if (response && response.status === 1 && response.data) {
                        // Kiểm tra và lọc dữ liệu nếu search có giá trị
                        if (params?.search) {
                            const searchKeyword = params.search.toLowerCase();
                            response.data.productDtos.items = response.data.productDtos.items.filter(product =>
                                product.productCode.toLowerCase().includes(searchKeyword) ||
                                product.productName.toLowerCase().includes(searchKeyword)
                            );
                        }
                        // Trả về dữ liệu đã lọc với thông tin phân trang
                        return {
                            data: response.data.productDtos?.items || [],
                            total: response.data.productDtos?.totalRecords || 0
                        };
                    } else {
                        console.log('❌ Không có dữ liệu products hoặc status khác 1');
                        return { data: [], total: 0 };
                    }
                }),
                catchError(this.handleError<ProductListResponse>('getProducts', { data: [], total: 0 }))
            );
    }



    // Lấy chi tiết một sản phẩm
    getProductById(id: string): Observable<Product> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });

        return this.http.get<ProductApiResponse>(`${apiEndpoints.products.getById(id)}`, { headers })
            .pipe(
                map(response => {
                    if (response.status === 1 && response.data) {
                        // Giả định API chi tiết sản phẩm trả về cấu trúc tương tự
                        return response.data as unknown as Product;
                    } else {
                        throw new Error('Product not found');
                    }
                }),
                catchError(this.handleError<Product>('getProductById'))
            );
    }

    // Tìm kiếm sản phẩm theo từ khóa
    searchProducts(keyword: string): Observable<Product[]> {
        const params = new HttpParams().set('q', keyword);
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });

        return this.http.get<ProductApiResponse>(apiEndpoints.products.search, { params, headers })
            .pipe(
                map(response => {
                    if (response.status === 1 && response.data) {
                        return response.data.productDtos?.items || [];
                    } else {
                        return [];
                    }
                }),
                catchError(this.handleError<Product[]>('searchProducts', []))
            );
    }

    // Xử lý lỗi
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            // Log ra console
            console.error(`❌ ${operation} failed:`, error);
            console.error('🔍 Error details:', error);

            // Trả về kết quả an toàn
            return of(result as T);
        };
    }
} 