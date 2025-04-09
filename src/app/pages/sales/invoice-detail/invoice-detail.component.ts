import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { InvoiceService } from '../../../services/invoice.service';
import { Invoice } from '../../../models/invoice.model';

// Interface cho sản phẩm trong hóa đơn
interface InvoiceProduct {
    barcode: string;
    code: string;
    name: string;
    debitAccount: string;
    creditAccount: string;
    unit: string;
    quantity: number;
    price: number;
    total: number;
    isEdited?: boolean; // Flag to highlight edited products
    notes?: string; // Product notes
}

@Component({
    selector: 'app-invoice-detail',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NzInputModule,
        NzDatePickerModule,
        NzSelectModule,
        NzButtonModule,
        NzTableModule,
        NzModalModule,
        NzFormModule,
        NzInputNumberModule,
        NzGridModule,
        NzIconModule,
        NzCheckboxModule,
        NzMessageModule,
    ],
    templateUrl: './invoice-detail.component.html',
    styleUrls: ['./invoice-detail.component.scss']
})
export class InvoiceDetailComponent implements OnInit {
    invoiceForm!: FormGroup;
    originalProductData: InvoiceProduct[] = []; // Store original product data for comparison
    invoiceId: string = '';
    isViewOnly: boolean = false; // Mặc định là chế độ chỉnh sửa
    pageTitle: string = 'Chi tiết hóa đơn bán hàng';
    loading: boolean = false;

    // Dữ liệu hóa đơn từ API
    currentInvoice: Invoice | null = null;

    // Danh sách sản phẩm trong hóa đơn
    products: InvoiceProduct[] = [];

    // Danh sách nhân viên giao hàng
    deliveryPersons = [
        { value: 'Nguyễn Văn A', label: 'Nguyễn Văn A' },
        { value: 'Nguyễn Văn B', label: 'Nguyễn Văn B' },
        { value: 'Nguyễn Văn C', label: 'Nguyễn Văn C' }
    ];

    // Danh sách phương thức thanh toán
    paymentMethods = [
        { value: 'Tiền mặt', label: 'Tiền mặt' },
        { value: 'Chuyển khoản', label: 'Chuyển khoản' },
        { value: 'Thẻ tín dụng', label: 'Thẻ tín dụng' },
        { value: 'Công nợ', label: 'Công nợ' }
    ];

    // Discount và phí giao hàng
    discountPercent = 0;
    discountAmount = 0;
    shippingFee = 0;
    subtotal = 0;
    invoiceNotes = '';

    constructor(
        private message: NzMessageService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private invoiceService: InvoiceService
    ) { }

    ngOnInit(): void {
        // Get invoice ID and mode from route parameters
        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if (id) {
                this.invoiceId = id;

                // Kiểm tra query parameters để xác định chế độ hiển thị
                this.route.queryParamMap.subscribe(queryParams => {
                    const mode = queryParams.get('mode');
                    this.isViewOnly = mode === 'view';

                    if (this.isViewOnly) {
                        this.pageTitle = 'Xem chi tiết hóa đơn bán hàng';
                    } else {
                        this.pageTitle = 'Cập nhật hóa đơn bán hàng';
                    }

                    // Fetch invoice data based on ID
                    this.fetchInvoiceData(id);
                });
            } else {
                this.message.error('Không tìm thấy mã hóa đơn!');
            }
        });
    }

    fetchInvoiceData(id: string): void {
        this.loading = true;
        const invoiceCode = id;

        this.invoiceService.getInvoiceByCode(invoiceCode)
            .pipe(finalize(() => this.loading = false))
            .subscribe({
                next: (response: Invoice) => {
                    this.currentInvoice = response;
                    this.loadInvoiceData();
                    this.initForm();
                },
                error: (error) => {
                    console.error(`Error fetching invoice ${id}:`, error);
                    this.message.error('Không thể tải dữ liệu hóa đơn. Vui lòng thử lại sau.');
                }
            });

    }
    loadInvoiceData(): void {
        if (!this.currentInvoice) {
            this.message.error('Không có dữ liệu hóa đơn!');
            return;
        }
        deliveryPersons: this.currentInvoice.deliveryPerson || '', // Không có trong response

        this.products = (this.currentInvoice.items || []).map(detail => ({
            barcode: detail.productCode, // Không có thông tin barcode trong response
            code: detail.productCode, // Có thể tạo mã giả nếu cần
            name: detail.productName || '',  // Dùng lineNote làm tên sản phẩm
            debitAccount: '', // Không có trong response
            creditAccount: '', // Không có trong response
            unit: detail.unit || '',
            quantity: detail.quantity || 0,
            price: detail.unitPrice || 0,
            total: detail.totalPrice || 0,
            notes: detail.lineNote || ''
        }));
        console.log('Dữ liệu sản phẩm (products):', this.products);


        // Store original product data
        this.originalProductData = this.products.map(product => ({ ...product }));

        // Calculate totals
        this.updateTotals();
    }

    initForm(): void {
        if (!this.currentInvoice) return;

        // Trong chế độ chỉ xem, tất cả trường đều bị vô hiệu hóa
        const notesDisabled = this.isViewOnly;

        this.invoiceForm = this.fb.group({
            customer: [{ value: this.currentInvoice.customerName, disabled: true }],
            phone: [{ value: this.currentInvoice.customerPhone || '', disabled: true }],
            address: [{ value: this.currentInvoice.deliveryAddress, disabled: true }],
            code: [{ value: this.currentInvoice.invoiceCode, disabled: true }],
            date: [{ value: new Date(this.currentInvoice.invoiceDate), disabled: true }],
            deliveryDate: [{ value: new Date(this.currentInvoice.deliveryDate), disabled: true }],
            paymentDate: [{ value: new Date(this.currentInvoice.paymentDate), disabled: true }],
            deliveryPerson: [{ value: this.currentInvoice.deliveryPerson, disabled: true }],
            paymentMethod: [{ value: 'Tiền mặt', disabled: true }],
            referenceCode: [{ value: this.currentInvoice.referenceInvoiceNumber, disabled: true }],
            deliveryAddress: [{ value: this.currentInvoice.deliveryAddress, disabled: true }],
            discountPercent: [{ value: this.currentInvoice.discount, disabled: true }],
            invoiceNotes: [{ value: this.currentInvoice.notes, disabled: notesDisabled }]
        });

        this.discountPercent = this.currentInvoice.discount;
        this.invoiceNotes = this.currentInvoice.notes;
        this.subtotal = this.currentInvoice.subTotal;
        this.discountAmount = this.currentInvoice.totalDiscount;
    }

    // Formatter và parser cho input số tiền
    priceFormatter = (value: number): string => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    priceParser = (value: string): string => value.replace(/\$\s?|(,*)/g, '');

    // Update product quantity
    updateProductQuantity(product: InvoiceProduct, index: number): void {
        // Trong chế độ chỉ xem thì không được sửa
        if (this.isViewOnly) return;

        // Mark product as edited if quantity changed
        if (product.quantity !== this.originalProductData[index].quantity) {
            product.isEdited = true;
        } else {
            product.isEdited = false;
        }

        // Recalculate total for this product
        product.total = product.quantity * product.price;

        // Update invoice totals
        this.updateTotals();
    }

    // Update product notes
    updateProductNotes(product: InvoiceProduct, index: number): void {
        // Trong chế độ chỉ xem thì không được sửa
        if (this.isViewOnly) return;

        // Mark as edited if notes changed
        if (product.notes !== this.originalProductData[index].notes) {
            product.isEdited = true;
        } else if (product.quantity === this.originalProductData[index].quantity) {
            product.isEdited = false;
        }
    }

    // Cập nhật tổng tiền, giảm giá và thành tiền
    updateTotals(): void {
        // Tính tổng tiền hàng
        this.subtotal = this.products.reduce((sum, product) => sum + product.total, 0);

        // Tính giảm giá
        this.discountAmount = this.subtotal * (this.discountPercent / 100);

        // Cập nhật tổng tiền nếu có currentInvoice
        if (this.currentInvoice) {
            this.currentInvoice.totalAmount = this.subtotal - this.discountAmount;
        }
    }

    // Quay trở lại trang danh sách hóa đơn
    goBack(): void {
        // // Nếu có thay đổi chưa lưu và không phải chế độ chỉ xem, hiển thị thông báo xác nhận
        // if (!this.isViewOnly && this.hasChanges()) {
        //     const confirmMessage = 'Bạn có thay đổi chưa lưu. Bạn có chắc chắn muốn thoát không?';
        //     if (confirm(confirmMessage)) {
        //         this.router.navigate(['/sales']);
        //     }
        // } else {
        //     this.router.navigate(['/sales']);
        // }
        this.router.navigate(['/sales']);

    }

    // // Kiểm tra xem có thay đổi chưa lưu không
    // hasChanges(): boolean {
    //     // Kiểm tra sự thay đổi ở các sản phẩm
    //     for (let i = 0; i < this.products.length; i++) {
    //         if (this.products[i].isEdited) {
    //             return true;
    //         }
    //     }

    //     // Kiểm tra sự thay đổi ở ghi chú hóa đơn
    //     if (this.currentInvoice && this.invoiceNotes !== this.currentInvoice.notes) {
    //         return true;
    //     }

    //     return false;
    // }

    // Lưu hóa đơn và các sản phẩm
    onSubmit() {
        if (this.isViewOnly) return;

        if (!this.currentInvoice) {
            this.message.error('Không có dữ liệu hóa đơn để cập nhật!');
            return;
        }

        this.loading = true;

        // // Cập nhật thông tin hóa đơn
        // const updatedInvoice: Partial<Invoice> = {
        //     notes: this.invoiceForm.get('invoiceNotes')?.value,
        //     discount: this.discountPercent,
        //     subTotal: this.subtotal,
        //     totalDiscount: this.discountAmount,
        //     totalAmount: this.currentInvoice.totalAmount
        // };

        // // Cập nhật chi tiết sản phẩm nếu có sự thay đổi
        // const updatedDetails = this.products
        //     .filter((product, index) => product.isEdited)
        //     .map(product => ({
        //         productCode: product.code,
        //         quantity: product.quantity,
        //         notes: product.notes
        //     }));

        // if (updatedDetails.length > 0) {
        //     updatedInvoice.Items = updatedDetails;
        // }

        // this.invoiceService.updateInvoice(this.invoiceId, updatedInvoice)
        //     .pipe(finalize(() => this.loading = false))
        //     .subscribe({
        //         next: () => {
        //             this.message.success('Cập nhật hóa đơn thành công!');
        //             // Đặt lại giá trị ban đầu
        //             this.originalProductData = this.products.map(product => ({ ...product }));
        //             this.products.forEach(p => p.isEdited = false);

        //             // Quay lại trang danh sách sau khi lưu thành công
        //             this.router.navigate(['/sales']);
        //         },
        //         error: (error) => {
        //             console.error('Error updating invoice:', error);
        //             this.message.error('Không thể cập nhật hóa đơn. Vui lòng thử lại sau.');
        //         }
        //     });
    }

    // Hủy các thay đổi và quay lại
    onCancel() {
        // if (this.hasChanges()) {
        //     const confirmMessage = 'Bạn có chắc chắn muốn hủy các thay đổi?';
        //     if (confirm(confirmMessage)) {
        //         // Khôi phục dữ liệu ban đầu và quay lại trang danh sách
        //         this.router.navigate(['/sales']);
        //     }
        // } else {
        //     this.router.navigate(['/sales']);
        // }
        const confirmMessage = 'Bạn có chắc chắn muốn hủy các thay đổi?';
        if (confirm(confirmMessage)) {
            this.router.navigate(['/sales']);
        }
    }

    // Kiểm tra xem có hiển thị nút Lưu hay không
    shouldShowSaveButton(): boolean {
        return !this.isViewOnly;

        // return !this.isViewOnly && this.hasChanges();
    }
}
