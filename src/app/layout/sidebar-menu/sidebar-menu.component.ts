import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { CommonModule } from '@angular/common';

interface MenuItem {
  title: string;
  icon: string;
  path?: string;
  children?: MenuItem[];
  expanded?: boolean;
}

@Component({
  selector: 'app-sidebar-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NzLayoutModule,
    NzMenuModule,
    NzIconModule,
    RouterLink,
    RouterLinkActive,
    NzToolTipModule,
    NzDividerModule,
    NzAvatarModule,
    NzDropDownModule
  ],
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss']
})
export class SidebarMenuComponent {
  @Input() isCollapsed = false;
  @Output() toggleCollapsed = new EventEmitter<boolean>();

  userName = 'Admin User';
  userRole = 'Administrator';

  selectedMenuItem: string = '';

  // Danh sách menu
  menuItems: MenuItem[] = [
    {
      title: 'Tổng quan',
      icon: 'dashboard',
      path: '/dashboard'
    },
    {
      title: 'Bán hàng',
      icon: 'shopping-cart',
      expanded: true,
      path: '/sales'
    },
    {
      title: 'Khách hàng',
      icon: 'user',
      path: '/customers'
    },
    {
      title: 'Sản phẩm',
      icon: 'shopping',
      path: '/products'
    },
    {
      title: 'Báo cáo',
      icon: 'bar-chart',
      children: [
        {
          title: 'Doanh thu',
          path: '/reports/revenue',
          icon: 'rise'
        },
        {
          title: 'Công nợ',
          path: '/reports/debt',
          icon: 'fund'
        },
        {
          title: 'Tồn kho',
          path: '/reports/inventory',
          icon: 'inbox'
        }
      ]
    },
    {
      title: 'Cài đặt',
      icon: 'setting',
      path: '/settings'
    }
  ];

  constructor() {
    console.log('✅ Sidebar loaded!');
  }

  // Đổi trạng thái thu gọn menu
  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
    this.toggleCollapsed.emit(this.isCollapsed);
  }

  // Xử lý khi click vào menu item
  onMenuItemClick(menuItem: MenuItem): void {
    this.selectedMenuItem = menuItem.title;
  }

  // Đăng xuất
  logout(): void {
    console.log('Logging out...');
    // Implement logic to logout here
  }
}


