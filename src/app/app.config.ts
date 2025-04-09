import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.router';
import { icons } from './icons-provider';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { NZ_I18N, vi_VN } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import vi from '@angular/common/locales/vi';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ZORRO_PROVIDERS } from './shared/ng-zorro.module';
// Đăng ký locale tiếng Việt
registerLocaleData(vi);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideNzIcons(icons),
    { provide: NZ_I18N, useValue: vi_VN },
    ZORRO_PROVIDERS,
    importProvidersFrom(
      BrowserAnimationsModule,
      HttpClientModule,
      FormsModule),
    provideAnimationsAsync(),
    provideHttpClient()]




};
