import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer.model';

@Component({
    selector: 'app-customers',
    standalone: true,
    imports: [
        CommonModule,
        NzIconModule,
        NzTableModule,
        NzInputModule,
        NzButtonModule,
        NzFormModule,
        NzPaginationModule,
        NzSpinModule,
        NzMessageModule,
        FormsModule,
        ReactiveFormsModule
    ],
    templateUrl: './customers.component.html',
    styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
    customers: Customer[] = [];
    isLoading = false;
    pageSize = 10;
    pageIndex = 1;
    totalItems = 0;
    searchKeyword = '';

    constructor(
        private customerService: CustomerService,
        private message: NzMessageService
    ) { }

    ngOnInit(): void {
        this.loadCustomers();
    }

    loadCustomers(): void {
        this.isLoading = true;
        this.customerService.getCustomers({
            search: this.searchKeyword,
            pageSize: this.pageSize,
            pageNumber: this.pageIndex
        }).subscribe({
            next: (response) => {
                this.customers = response.data;
                this.totalItems = response.total;
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error loading customers:', error);
                this.message.error('Không thể tải danh sách khách hàng. Vui lòng thử lại sau.');
                this.isLoading = false;
            }
        });
    }

    onSearch(): void {
        this.pageIndex = 1; // Reset về trang đầu tiên khi tìm kiếm
        this.loadCustomers();
    }

    onPageIndexChange(pageIndex: number): void {
        this.pageIndex = pageIndex;
        this.loadCustomers();
    }

    onPageSizeChange(pageSize: number): void {
        this.pageSize = pageSize;
        this.pageIndex = 1; // Reset về trang đầu tiên khi thay đổi số lượng item
        this.loadCustomers();
    }
}
