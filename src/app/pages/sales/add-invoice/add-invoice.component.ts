import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { ProductService } from '../../../services/product.service';

import { Customer } from '../../../models/customer.model';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { InvoiceService } from '../../../services/invoice.service';
import { CustomerService } from '../../../services/customer.service';
import { Invoice } from '../../../models/invoice.model';
export interface SelectableProduct extends Product {
    selected?: boolean;
    quantity: number;
    notes?: string;
}
export interface InvoiceProduct {
    productId: number;      // ID của sản phẩm
    productCode: string;    // Mã sản phẩm
    productName: string;    // Tên sản phẩm
    price: number;          // Giá bán
    stockQuantity: number;  // Số lượng tồn kho
    quantity: number;       // Số lượng sản phẩm trong hóa đơn
    createdDate: string;    // Ngày tạo sản phẩm
    unit: string;         // Đơn vị tính
    debitAccount: string;
    creditAccount: string;
    notes: string;
    total: number;
}
interface Product {
    productId: number;      // ID của sản phẩm
    productCode: string;    // Mã sản phẩm
    productName: string;    // Tên sản phẩm
    price: number;          // Giá bán
    stockQuantity: number;  // Số lượng tồn kho
    createdDate: string;    // Ngày tạo sản phẩm
    unit: string;         // Đơn vị tính
}
@Component({
    selector: 'app-add-invoice',
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
        NzPaginationModule

    ],
    templateUrl: './add-invoice.component.html',
    styleUrls: ['./add-invoice.component.scss']
})
export class AddInvoiceComponent implements OnInit {
    invoiceForm!: FormGroup;

    invoice = {
        code: '',
        date: new Date(),
        accountingDate: new Date(),
        deliveryDate: new Date(),
        customer: '',
        phoneNumber: '',
        address: '',
        deliveryAddress: '',
        createdBy: 'Admin',
        total: 0,
        status: 'Mới',
        deliveryPerson: '',
        paymentMethod: '',
        referenceCode: '',
        notes: '',
        //referenceCode: 'CTTC' + Math.floor(100000 + Math.random() * 900000)
    };
    // customers: Customer[] = [];
    selectedCustomer: Customer | null = null;
    customers: any[] = [];
    searchKeyword = '';
    customerName: string = '';

    products: InvoiceProduct[] = [];
    lastAddedIndex: number = -1;

    convertToISOString(date: Date | string): string {
        return new Date(date).toISOString();
    }

    // Thông tin cho popup thêm sản phẩm
    isProductModalVisible = false;
    newProduct: InvoiceProduct = {
        productId: 0,
        productCode: '',
        productName: '',
        debitAccount: '',
        creditAccount: '',
        unit: '',
        stockQuantity: 0,
        quantity: 1,
        price: 0,
        total: 0,
        notes: '',
        createdDate: new Date().toISOString()

    };

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

    filteredProducts: SelectableProduct[] = [];
    availableProducts: SelectableProduct[] = [];

    onCustomerInput(event: any): void {
        const keyword = event.target.value;
        if (keyword && keyword.length >= 2) {
            this.customerService.searchCustomers(keyword).subscribe((res) => {
                this.customers = res.data || [];
            });
        } else {
            this.customers = [];
        }
    }

    selectCustomer(customer: any): void {
        this.selectedCustomer = customer;
        this.invoiceForm.patchValue({
            customer: customer.customerName,
            phoneNumber: customer.phoneNumber,
            address: customer.address
        });
        this.customers = [];
    }


    // Chọn tất cả sản phẩm
    allChecked = false;
    indeterminate = false;

    // Discount và phí giao hàng
    discountPercent = 0;
    discountAmount = 0;
    shippingFee = 0;
    subtotal = 0;
    pageIndex = 1;      // Trang hiện tại
    pageSize = 10;      // Số lượng sản phẩm mỗi trang
    totalProducts = 0;  // Tổng số sản phẩm


    constructor(
        private message: NzMessageService,
        private fb: FormBuilder,
        private productService: ProductService,
        private invoiceService: InvoiceService,
        private customerService: CustomerService,
        private modal: NzModalRef
    ) { }

    ngOnInit(): void {
        this.initForm();
        this.getNextInvoiceCode();
        this.loadProducts(); // Load products from API or service
    }

    initForm(): void {
        this.invoiceForm = this.fb.group({
            customer: [this.invoice.customer, [Validators.required, Validators.maxLength(100)]],
            phoneNumber: [this.invoice.phoneNumber, [Validators.pattern(/^[0-9]{10,11}$/)]],
            address: [this.invoice.address, [Validators.maxLength(200)]],
            code: [{ value: this.invoice.code, disabled: true }],
            date: [this.invoice.date, [Validators.required]],
            accountingDate: [this.invoice.accountingDate, [Validators.required]],
            deliveryDate: [this.invoice.deliveryDate, [Validators.required]],
            deliveryPerson: [this.invoice.deliveryPerson, [Validators.required]],
            paymentMethod: [this.invoice.paymentMethod, [Validators.required]],
            createdBy: [{ value: this.invoice.createdBy, disabled: true }],
            referenceCode: [this.invoice.referenceCode],
            deliveryAddress: [this.invoice.deliveryAddress, [Validators.required, Validators.maxLength(200)]],
            discountPercent: [this.discountPercent, [Validators.min(0), Validators.max(100)]],
            shippingFee: [this.shippingFee, [Validators.min(0)]],
            notes: [this.invoice.notes, [Validators.maxLength(500)]]
        });

        // Cập nhật giảm giá khi thay đổi phần trăm
        this.invoiceForm.get('discountPercent')?.valueChanges.subscribe(value => {
            this.discountPercent = value || 0;
            this.updateTotals();
        });

        // Cập nhật tổng khi thay đổi phí giao hàng
        this.invoiceForm.get('shippingFee')?.valueChanges.subscribe(value => {
            this.shippingFee = value || 0;
            this.updateTotals();
        });
    }

    searchCustomers(searchTerm: string): void {
        if (searchTerm.trim()) {
            this.customerService.searchCustomers(searchTerm).subscribe(response => {
                this.customers = response.data; // Assuming `response.data` contains the list of customers
            });
        } else {
            this.customers = [];  // Clear the customer list if the searchTerm is empty
        }
    }

    // selectCustomer(customer: any): void {
    //     this.selectedCustomer = customer;
    //     this.customerName = customer.customerName;
    //     this.invoiceForm.patchValue({
    //         customer: customer.customerName,
    //         phoneNumber: customer.phoneNumber,
    //         address: customer.address
    //     });
    //     this.customers = [];
    // }

    getNextInvoiceCode(): void {
        this.invoiceService.getNextInvoiceCode().subscribe(
            (response) => {
                if (response && response.status === 1) {
                    this.invoice.code = response.data;
                } else {
                    console.error('Lỗi khi lấy mã hóa đơn tiếp theo');
                }
            },
            (error) => {
                console.error('Lỗi khi gọi API lấy mã hóa đơn:', error);
            }
        );
    }

    loadProducts(page: number = 1, search: string = ''): void {
        const params = {
            pageNumber: page,
            pageSize: this.pageSize,
            searchTerm: search
        };

        this.productService.getProducts(params).subscribe(
            (response) => {
                if (response && response.data) {
                    // Convert data to SelectableProduct format
                    const newProducts = response.data.map((product: Product) => ({
                        ...product,
                        selected: this.availableProducts.find(p => p.productId === product.productId)?.selected || false,
                        quantity: this.availableProducts.find(p => p.productId === product.productId)?.quantity || 1
                    }));

                    this.availableProducts = [...this.availableProducts.filter(p =>
                        !response.data.some((newP: Product) => newP.productId === p.productId)
                    ), ...newProducts];

                    this.filteredProducts = newProducts;
                    this.totalProducts = response.total;

                    // Refresh check status after loading new page
                    this.refreshCheckStatus();
                } else {
                    this.availableProducts = [];
                    this.filteredProducts = [];
                    console.warn('No products found');
                }
            },
            (error) => {
                this.message.error('Failed to load products');
                console.error('Error fetching products:', error);
            }
        );
    }

    priceFormatter = (value: number): string => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    priceParser = (value: string): string => value.replace(/\$\s?|(,*)/g, '');

    // Hiển thị modal thêm sản phẩm
    showProductModal(): void {
        if (!this.selectedCustomer) {
            this.message.warning('Vui lòng chọn khách hàng trước khi thêm sản phẩm');
            return;
        }

        this.resetNewProduct();
        this.searchKeyword = '';
        this.resetProductSelection();
        this.filteredProducts = [...this.availableProducts];

        this.pageIndex = 1;
        this.loadProducts(this.pageIndex);
        this.isProductModalVisible = true;
    }

    // Reset lựa chọn sản phẩm
    resetProductSelection(): void {
    }

    // Đóng modal
    handleCancel(): void {
        this.isProductModalVisible = false;
    }

    // Thêm sản phẩm vào hóa đơn
    addProduct(): void {
        this.newProduct.total = this.newProduct.price * this.newProduct.quantity;
        this.products = [...this.products, { ...this.newProduct }];
        this.lastAddedIndex = this.products.length - 1;
        this.isProductModalVisible = false;
        this.updateTotals();

        if (this.selectedCustomer) {
            this.invoiceForm.patchValue({
                customer: this.selectedCustomer.customerName,
                phoneNumber: this.selectedCustomer.phoneNumber,
                address: this.selectedCustomer.address
            });
        }


        this.message.success(`Đã thêm sản phẩm ${this.newProduct.productName} vào hóa đơn`);
        this.scrollToProductTable();
    }

    // Thêm nhiều sản phẩm cùng lúc
    addMultipleProducts(): void {
        const selectedProducts = this.availableProducts.filter(p => p.selected);

        if (selectedProducts.length === 0) {
            this.message.warning('Vui lòng chọn ít nhất một sản phẩm');
            return;
        }

        const startIndex = this.products.length;
        const newProducts: InvoiceProduct[] = selectedProducts.map(p => ({
            ...p,
            debitAccount: '0',
            creditAccount: '0',
            total: (p.quantity || 1) * p.price,
            createdDate: new Date().toISOString(),
            notes: p.notes || '',
        }));

        this.products = [...this.products, ...newProducts];
        this.lastAddedIndex = startIndex;
        this.isProductModalVisible = false;
        this.updateTotals();

        if (this.selectedCustomer) {
            this.invoiceForm.patchValue({
                customer: this.selectedCustomer.customerName,
                phoneNumber: this.selectedCustomer.phoneNumber,
                address: this.selectedCustomer.address
            });
        }


        this.message.success(`Đã thêm ${selectedProducts.length} sản phẩm vào hóa đơn`);
        this.scrollToProductTable();
    }

    // Cập nhật tổng tiền, giảm giá và thành tiền
    updateTotals(): void {
        // Tính tổng tiền hàng
        this.subtotal = this.products.reduce((sum, product) => sum + (product.quantity * product.price), 0);

        // Tính giảm giá
        this.discountAmount = this.subtotal * (this.discountPercent / 100);

        // Tính tổng tiền sau giảm giá và phí giao hàng
        this.invoice.total = this.subtotal - this.discountAmount + this.shippingFee;
    }

    // Cuộn trang đến bảng sản phẩm
    scrollToProductTable(): void {
        setTimeout(() => {
            const tableElement = document.querySelector('.scrollable-table');
            if (tableElement) {
                tableElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);
    }

    // Tính tổng tiền hóa đơn
    calculateInvoiceTotal(): void {
        this.updateTotals();
    }

    // Reset form thêm sản phẩm
    resetNewProduct(): void {
    }

    // Chọn sản phẩm từ danh sách có sẵn
    selectProduct(product: any): void {
        product.selected = !product.selected;
        this.newProduct = {
            ...product,
            quantity: product.quantity,
            total: product.price * product.quantity,
            notes: product.notes || ''
        };
    }

    // Xóa sản phẩm khỏi hóa đơn
    deleteProduct(index: number): void {
        this.products = this.products.filter((_, i) => i !== index);
        this.updateTotals();
    }

    searchProducts(): void {
        this.pageIndex = 1;
        this.loadProducts(this.pageIndex, this.searchKeyword);
    }

    // Xóa từ khóa tìm kiếm
    clearSearch(): void {
        this.searchKeyword = '';
        this.filteredProducts = [...this.availableProducts];
    }

    // Cập nhật trạng thái checkbox "Chọn tất cả"
    refreshCheckStatus(): void {
        const allChecked = this.filteredProducts.length > 0 && this.filteredProducts.every(product => product.selected);
        const allUnchecked = this.filteredProducts.every(product => !product.selected);

        this.allChecked = allChecked;
        this.indeterminate = !allChecked && !allUnchecked;
    }

    onAllCheckedChange(checked: boolean): void {
        this.filteredProducts.forEach(product => {
            product.selected = checked;
        });

        // Update the original products' selected state
        this.availableProducts.forEach(product => {
            const filteredProduct = this.filteredProducts.find(p => p.productId === product.productId);
            if (filteredProduct) {
                product.selected = checked;
            }
        });

        this.refreshCheckStatus();
    }

    onItemCheckedChange(): void {
        this.refreshCheckStatus();
    }

    getSelectedCount(): number {
        return this.availableProducts.filter(product => product.selected).length;
    }

    // Kiểm tra form có lỗi không
    isFieldInvalid(field: string): boolean {
        const control = this.invoiceForm.get(field);
        return !!(control && control.invalid && (control.dirty || control.touched));
    }

    // Lấy thông báo lỗi
    getErrorMessage(field: string): string {
        const control = this.invoiceForm.get(field);
        if (control?.errors?.['required']) {
            return 'Trường này là bắt buộc';
        }
        if (control?.errors?.['pattern']) {
            return 'Số điện thoại không hợp lệ';
        }
        if (control?.errors?.['maxlength']) {
            return `Không được vượt quá ${control.errors['maxlength'].requiredLength} ký tự`;
        }
        if (control?.errors?.['min']) {
            return `Giá trị phải lớn hơn hoặc bằng ${control.errors['min'].min}`;
        }
        if (control?.errors?.['max']) {
            return `Giá trị phải nhỏ hơn hoặc bằng ${control.errors['max'].max}`;
        }
        return '';
    }

    onSubmit() {
        // Kiểm tra form hợp lệ
        const form = this.invoiceForm;
        for (const key in form.controls) {
            form.controls[key].markAsDirty();
            form.controls[key].updateValueAndValidity();
        }

        if (form.invalid) {
            this.message.error('Vui lòng điền đầy đủ thông tin hóa đơn');
            return;
        }

        if (this.products.length === 0) {
            this.message.error('Vui lòng thêm ít nhất một sản phẩm vào hóa đơn');
            return;
        }

        // Lấy dữ liệu từ form
        const formValue = this.invoiceForm.getRawValue();

        // Tạo đối tượng hóa đơn
        const invoiceData: Invoice = {
            invoiceId: 0,  // hoặc null nếu để backend sinh
            invoiceCode: this.invoice.code,
            invoiceDate: this.convertToISOString(formValue.date),
            deliveryDate: this.convertToISOString(formValue.deliveryDate),
            paymentDate: this.convertToISOString(formValue.accountingDate),
            customerId: this.selectedCustomer?.customerId ?? '', // bạn cần set đúng ID KH
            customerCode: this.selectedCustomer?.customerCode || '', // bạn cần set đúng mã KH
            customerPhone: formValue.phoneNumber,
            customerName: formValue.customer,
            customerAddress: formValue.address,
            deliveryAddress: formValue.deliveryAddress,

            paymentMethod: formValue.paymentMethod,
            vatinvoice: false, // hoặc true nếu có check
            referenceInvoiceNumber: formValue.referenceCode,
            notes: formValue.notes, // nếu có ghi chú riêng
            deliveryPerson: formValue.deliveryPerson,
            invoiceStatus: 'Paid', // hoặc 'Unpaid' tùy theo trạng thái
            subTotal: this.subtotal,
            totalDiscount: this.discountAmount,
            discount: formValue.discountPercent || 0,
            totalTaxAmount: 0, // nếu không có VAT thì để 0
            totalAmount: this.invoice.total,
            items: this.products.map(p => ({
                ProductId: p.productId,
                barcode: p.productCode,
                code: p.productCode,
                name: p.productName,
                debitAccount: p.debitAccount,
                creditAccount: p.creditAccount,
                Unit: p.unit,
                quantity: p.quantity,
                UnitPrice: p.price,
                TotalPrice: p.total,
                LineNote : p.notes
            })),
            customer: this.selectedCustomer || undefined
        };

        console.log('📤 Dữ liệu hóa đơn chuẩn theo API:', invoiceData);

        this.invoiceService.createInvoice(invoiceData).subscribe({
            next: (res) => {
                this.message.success('✅ Tạo hóa đơn thành công!');
                this.modal.destroy(res);
            },
            error: (err) => {
                console.error('❌ Lỗi tạo hóa đơn:', err);
                this.message.error('Không thể tạo hóa đơn, vui lòng thử lại sau');
            }
        });

        // 5. Gọi API tạo hóa đơn
        // this.invoiceService.createInvoice(invoiceData).subscribe({
        //     next: (result) => {
        //         this.message.success('✅ Tạo hóa đơn thành công!');
        //         console.log('🧾 Hóa đơn trả về:', result);
        //         this.modal.destroy(result); // hoặc navigate đến danh sách hóa đơn
        //     },
        //     error: (err) => {
        //         console.error('❌ Lỗi khi tạo hóa đơn:', err);
        //         this.message.error('Không thể tạo hóa đơn, vui lòng thử lại sau');
        //     }
        // });
    }

    onCancel() {
        console.log('❌ Đã huỷ thao tác');
        // Đóng modal
        this.modal.destroy();
    }
}
