import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { HttpClientModule } from '@angular/common/http';

const serverConfig: ApplicationConfig = {
  providers: [
    HttpClientModule,
    provideServerRendering()
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
