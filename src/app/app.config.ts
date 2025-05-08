import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    SharedModule,
    HttpClientModule,
    provideRouter(routes),
    provideClientHydration(), provideAnimationsAsync()
  ]
};
