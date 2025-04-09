import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { apiEndpoints } from './api-config';
import {
    Customer,
    CustomerApiResponse,
    CustomerListResponse,
    CustomerQueryParams
} from '../models/customer.model';

@Injectable({
    providedIn: 'root'
})
export class CustomerService {
    constructor(private http: HttpClient) { }

    // Lấy danh sách khách hàng
    getCustomers(params?: CustomerQueryParams): Observable<CustomerListResponse> {
        console.log('🚀 Gọi API customers với params:', params);
        console.log('🔗 URL API customers:', apiEndpoints.customers.getPaged);

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });

        return this.http.post<CustomerApiResponse>(apiEndpoints.customers.getPaged, params, { headers })
            .pipe(
                tap(response => {
                }),
                map(response => {                   
                    if (response && response.status === 1 && response.data) {
                    
                        return {
                            data: response.data.customerDtos?.items || [],
                            total: response.data.customerDtos?.totalRecords || 0
                        };
                    } else {
                        return { data: [], total: 0 };
                    }
                }),
                catchError(this.handleError<CustomerListResponse>('getCustomers', { data: [], total: 0 }))
            );
    }

    // Lấy chi tiết một khách hàng
    getCustomerById(id: string): Observable<Customer> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });

        return this.http.get<CustomerApiResponse>(`${apiEndpoints.customers.getById(id)}`, { headers })
            .pipe(
                map(response => {
                    if (response.status === 1 && response.data) {
                        return response.data as unknown as Customer;
                    } else {
                        throw new Error('Customer not found');
                    }
                }),
                catchError(this.handleError<Customer>('getCustomerById'))
            );
    }

    searchCustomers(searchTerm: string): Observable<any> {
        // Wrap the searchTerm in an object with a valid structure
        const body = { searchTerm: searchTerm };

        // Set up HTTP headers to specify JSON content type
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',  // Ensure Content-Type is application/json
            }),
        };

        // Send the searchTerm as part of the body in the POST request
        return this.http.post<any>(`${apiEndpoints.customers.getSearch}`, body, httpOptions);
    }


    // Xử lý lỗi
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            return of(result as T);
        };
    }
} 