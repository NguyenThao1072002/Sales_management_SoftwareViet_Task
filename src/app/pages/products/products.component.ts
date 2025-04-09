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
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
    selector: 'app-products',
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
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
    products: Product[] = [];
    isLoading = false;
    pageSize = 10;
    pageIndex = 1;
    totalItems = 0;
    searchKeyword = '';

    constructor(
        private productService: ProductService,
        private message: NzMessageService
    ) { }

    ngOnInit(): void {
        this.loadProducts();
    }

    loadProducts(): void {
        this.isLoading = true;
        this.productService.getProducts({
            search: this.searchKeyword,
            pageSize: this.pageSize,
            pageNumber: this.pageIndex
        }).subscribe({
            next: (response) => {
                this.products = response.data;
                this.totalItems = response.total;
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error loading products:', error);
                this.message.error('Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.');
                this.isLoading = false;
            }
        });
    }

    onSearch(): void {
        this.pageIndex = 1; // Reset về trang đầu tiên khi tìm kiếm
        this.loadProducts();
    }

    onPageIndexChange(pageIndex: number): void {
        this.pageIndex = pageIndex;
        this.loadProducts();
    }

    onPageSizeChange(pageSize: number): void {
        this.pageSize = pageSize;
        this.pageIndex = 1; // Reset về trang đầu tiên khi thay đổi số lượng item
        this.loadProducts();
    }
}
