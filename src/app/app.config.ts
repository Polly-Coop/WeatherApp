import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { YaConfig, AngularYandexMapsModule } from 'angular8-yandex-maps';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

const config: YaConfig = {
  apikey: 'API_KEY',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(AngularYandexMapsModule.forRoot(config))
  ]
};
