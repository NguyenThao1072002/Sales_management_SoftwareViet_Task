import { importProvidersFrom } from '@angular/core';

// Form, input, date
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';

// Table, layout
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

// Buttons, actions
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

// Feedback & modal
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzNotificationModule } from 'ng-zorro-antd/notification';

// Overlay
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzPopoverModule } from 'ng-zorro-antd/popover';

// Upload & media
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzLayoutModule } from 'ng-zorro-antd/layout';


//KHJAC
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';


export const ZORRO_PROVIDERS = importProvidersFrom(
    // Forms
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzDatePickerModule,

    // Table, layout
    NzTableModule,
    NzPaginationModule,
    NzCardModule,
    NzCollapseModule,
    NzTabsModule,
    NzLayoutModule,
    // Controls
    NzButtonModule,
    NzTagModule,
    NzBadgeModule,
    NzDropDownModule,

    // Modal & Notifications
    NzModalModule,
    NzMessageModule,
    NzNotificationModule,

    // Tooltip & popover
    NzToolTipModule,
    NzPopoverModule,

    // Upload, Image
    NzUploadModule,
    NzImageModule,

    //KHÁC
    NzIconModule,
    NzMenuModule
);
