import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { apiEndpoints } from './api-config';
import {
    Invoice,
    InvoiceApiResponse,
    InvoiceListResponse,
    InvoiceQueryParams
} from '../models/invoice.model';

@Injectable({
    providedIn: 'root'
})
export class InvoiceService {
    constructor(private http: HttpClient) { }
    getInvoices(params: InvoiceQueryParams): Observable<InvoiceListResponse> {

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',   // For JSON content
            'Accept': 'application/json'
        });

        return this.http.post<InvoiceApiResponse>(apiEndpoints.invoices.getPaged, params, { headers })
            .pipe(

                map(response => {
                    if (response && response.status === 1 && response.data) {
                        return {
                            data: response.data.saleInvoices || [],
                            total: response.data.totalRecord || 0
                        };
                    } else {
                        console.log('❌ Không có dữ liệu hoặc status khác 1');
                        return { data: [], total: 0 };
                    }
                }),
                catchError(this.handleError<InvoiceListResponse>('getInvoices', { data: [], total: 0 }))
            );
    }


    getNextInvoiceCode(): Observable<any> {
        return this.http.post<any>(`${apiEndpoints.invoices.getNextCode}`, {});
    }
    // getInvoiceById(invoiceId: number): Observable<Invoice> {
    //     const headers = new HttpHeaders({
    //         'Content-Type': 'application/json',
    //         'Accept': 'application/json'
    //     });

    //     // Gửi yêu cầu POST với invoiceCode là chuỗi
    //     return this.http.get<InvoiceApiResponse>(`${apiEndpoints.invoices.getById(invoiceId)}`, { invoiceCode }, { headers })
    //         .pipe(
    //             map(response => {
    //                 if (response.status === 1 && response.data) {
    //                     return response.data as unknown as Invoice;
    //                 } else {
    //                     throw new Error('Invoice not found');
    //                 }
    //             }),
    //             catchError(this.handleError<Invoice>('getInvoiceById'))
    //         );
    // }

    getInvoiceByCode(invoiceCode: string): Observable<Invoice> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });

        // Gửi yêu cầu POST với invoiceCode là chuỗi
        return this.http.post<InvoiceApiResponse>(`${apiEndpoints.invoices.getByInvoiceCode}`, { invoiceCode: invoiceCode }, { headers })
            .pipe(
                map(response => {
                    if (response.status === 1 && response.data) {
                        return response.data as unknown as Invoice;
                    } else {
                        throw new Error('Invoice not found');
                    }
                }),
                catchError(this.handleError<Invoice>('getInvoiceById'))
            );
    }

    // Tạo hóa đơn mới
    createInvoice(invoice: Invoice): Observable<Invoice> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });

        return this.http.post<InvoiceApiResponse>(apiEndpoints.invoices.create, invoice, { headers })
            .pipe(
                map(response => {
                    if (response.status === 1 && response.data) {
                        return response.data as unknown as Invoice;
                    } else {
                        throw new Error('Failed to create invoice');
                    }
                }),
                catchError(this.handleError<Invoice>('createInvoice'))
            );
    }

    // Cập nhật hóa đơn
    updateInvoice( invoice: Partial<Invoice>): Observable<Invoice> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });

        return this.http.post<InvoiceApiResponse>(apiEndpoints.invoices.update, invoice, { headers })
            .pipe(
                map(response => {
                    if (response.status === 1 && response.data) {
                        return response.data as unknown as Invoice;
                    } else {
                        throw new Error('Failed to update invoice');
                    }
                }),
                catchError(this.handleError<Invoice>('updateInvoice'))
            );
    }

    deleteInvoice(invoiceCode: string): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });

        // Gửi invoiceCode vào body của yêu cầu
        return this.http.post<InvoiceApiResponse>(apiEndpoints.invoices.delete,
            { invoiceCode: invoiceCode }, // Đảm bảo gửi invoiceCode trong body
            { headers } // Thêm headers vào yêu cầu
        ).pipe(
            map(response => {
                if (response.status === 1) {
                    return { success: true };
                } else {
                    throw new Error('Failed to delete invoice');
                }
            }),
            catchError(this.handleError<any>('deleteInvoice'))
        );
    }

    // Xử lý lỗi
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error(`❌ ${operation} failed:`, error);
            console.error('🔍 Error details:', error);

            return of(result as T);
        };
    }
} 