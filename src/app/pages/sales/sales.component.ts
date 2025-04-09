// File: sales.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { AddInvoiceComponent } from './add-invoice/add-invoice.component';
import { Router, RouterModule } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { InvoiceService } from '../../services/invoice.service';
import { Invoice, InvoiceQueryParams } from '../../models/invoice.model';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-sales',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        NzTableModule,
        NzDatePickerModule,
        NzInputModule,
        NzButtonModule,
        NzIconModule,
        NzPaginationModule,
        RouterModule,
        NzModalModule,
        NzMessageModule
    ],
    templateUrl: './sales.component.html',
    styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit {
    fromDate: Date | null = null;
    toDate: Date | null = null;
    searchText: string = '';
    selectedStatus: string = '';
    isAddModalVisible = false;

    // Các thuộc tính phân trang
    currentPage: number = 1;
    pageSize: number = 10;
    totalItems: number = 0;

    // Dữ liệu hóa đơn
    salesData: Invoice[] = [];
    filteredData: Invoice[] = [];

    // Trạng thái loading
    loading: boolean = false;

    constructor(
        private modal: NzModalService,
        private router: Router,
        private message: NzMessageService,
        private invoiceService: InvoiceService,
        private location: Location
    ) { }

    ngOnInit(): void {
        const state = this.location.getState() as { updated?: boolean };

        if (state?.updated) {
            this.message.success('Cập nhật hóa đơn thành công!');
        }

        this.loadInvoices();
    }



    loadInvoices(): void {
        this.loading = true;
        console.log('⏳ Bắt đầu tải danh sách hóa đơn...');

        // Chuẩn bị tham số cho API
        const params: InvoiceQueryParams = {
            pageNumber: this.currentPage,
            pageSize: this.pageSize,
            searchTerm: this.searchText || undefined,  // Nếu không có từ khóa tìm kiếm, sử dụng undefined
            invoiceStatus: this.selectedStatus || undefined,  // Nếu không có trạng thái, sử dụng undefined
            invoiceDate: this.fromDate ? this.formatDate(this.fromDate) : undefined,  // Định dạng ngày nếu có
            paymentDate: this.toDate ? this.formatDate(this.toDate) : undefined  // Định dạng ngày nếu có
        };


        // Gọi API để tải danh sách hóa đơn
        this.invoiceService.getInvoices(params)
            .pipe(
                finalize(() => {
                    this.loading = false;
                })
            )
            .subscribe({
                next: (response) => {

                    if (response && response.data) {
                        this.salesData = response.data;
                        this.filteredData = [...this.salesData];
                        this.totalItems = response.total;
                    } else {
                        this.message.error('Dữ liệu trả về không hợp lệ. Vui lòng thử lại sau.');
                    }
                },
                error: (error) => {
                    this.message.error('Không thể tải danh sách hóa đơn. Vui lòng thử lại sau.');
                }
            });
    }


    getInvoiceStatusText(status: string): string {
        switch (status) {
            case 'Paid':
                return 'Đã thanh toán';
            case 'Unpaid':
                return 'Chưa thanh toán';
            case 'Rejected':
                return 'Bị từ chối';
            default:
                return 'Không xác định';
        }
    }


    // Định dạng ngày thành chuỗi YYYY-MM-DD để gửi lên API
    private formatDate(date: Date): string {
        return date.toISOString().split('T')[0];
    }

    // Tìm kiếm hóa đơn
    onSearch() {
        this.currentPage = 1;
        this.loadInvoices();
    }

    // Lọc theo trạng thái
    filterByStatus(status: string) {
        this.selectedStatus = status;
        this.currentPage = 1;
        this.loadInvoices();
    }

    // Mở modal thêm mới hóa đơn
    onAdd() {
        const modalRef = this.modal.create({
            nzTitle: 'Thêm mới hóa đơn bán hàng',
            nzContent: AddInvoiceComponent,
            nzWidth: 1200,
            nzFooter: null,
            nzClosable: true,
            nzMaskClosable: false,
            nzStyle: { top: '20px' },
            nzClassName: 'add-invoice-modal',
            nzData: {
                // Có thể truyền tham số cho component nếu cần
            }
        });

        // Đăng ký callback sau khi modal đóng
        modalRef.afterClose.subscribe((result: any) => {
            // Nếu kết quả trả về là true (đã tạo hóa đơn thành công)
            if (result) {
                this.loadInvoices(); // Tải lại danh sách hóa đơn
            }
        });
    }

    // Mở giao diện xem chi tiết hoá đơn (chỉ xem)
    viewInvoice(invoiceId: string) {
        this.router.navigate(['/sales/invoice-detail', invoiceId], { queryParams: { mode: 'view' } });
    }

    // Mở giao diện chỉnh sửa hoá đơn
    editInvoice(invoiceId: string) {
        this.router.navigate(['/sales/invoice-update', invoiceId], { queryParams: { mode: 'edit' } });
    }

    // Mở giao diện chỉnh sửa hóa đơn
    onEdit(item: any) {
        console.log('📝 Sửa:', item);
        this.editInvoice(item.invoiceCode);
    }

    // Xóa hóa đơn và chi tiết
    onDelete(item: any) {
        this.modal.confirm({
            nzTitle: 'Xác nhận xóa hóa đơn',
            nzContent: `Bạn có chắc chắn muốn xóa hóa đơn ${item.invoiceCode} không? 
                       <br><br>
                       <strong>Lưu ý:</strong> Hành động này sẽ xóa cả hóa đơn và chi tiết hóa đơn. 
                       Dữ liệu sẽ không thể khôi phục.`,
            nzOkText: 'Xóa',
            nzOkType: 'primary',
            nzOkDanger: true,
            nzOnOk: () => this.deleteInvoice(item.invoiceCode),
            nzCancelText: 'Hủy',
            nzWidth: 420,
            nzCentered: true,
            nzClassName: 'custom-delete-modal'
        });
    }

    // Thực hiện xóa hóa đơn và chi tiết
    deleteInvoice(invoiceCode: string) {
        this.loading = true;

        this.invoiceService.deleteInvoice(invoiceCode)
            .pipe(finalize(() => this.loading = false))
            .subscribe({
                next: () => {
                    // Sau khi xóa thành công, tải lại danh sách
                    this.message.success('Xóa hóa đơn thành công');
                    this.loadInvoices();
                },
                error: (error) => {
                    console.error('Error deleting invoice:', error);
                    this.message.error('Không thể xóa hóa đơn. Vui lòng thử lại sau.');
                }
            });
    }

    // Xử lý sự kiện thay đổi trang
    onPageChange(pageIndex: number): void {
        this.currentPage = pageIndex;
        this.loadInvoices();
    }

    // Xử lý sự kiện thay đổi số lượng mục trên mỗi trang
    onPageSizeChange(size: number): void {
        this.pageSize = size;
        this.currentPage = 1; // Reset về trang đầu tiên khi thay đổi kích thước trang
        this.loadInvoices();
    }
}