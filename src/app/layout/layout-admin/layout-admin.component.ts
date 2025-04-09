import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { SidebarMenuComponent } from '../sidebar-menu/sidebar-menu.component';

@Component({
  selector: 'app-layout-admin',
  standalone: true,
  imports: [
    CommonModule,
    NzMenuModule,
    NzIconModule,
    RouterOutlet,
    NzLayoutModule,
    NzBreadCrumbModule,
    NzDropDownModule,
    NzAvatarModule,
    SidebarMenuComponent
  ],
  templateUrl: './layout-admin.component.html',
  styleUrls: ['./layout-admin.component.scss']
})
export class LayoutAdminComponent {
  isCollapsed = false;

  onToggleCollapsed(collapsed: boolean): void {
    this.isCollapsed = collapsed;
  }
}
