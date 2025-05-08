import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SharedModule } from "./modules/shared/shared.module";
import { WelcomeModule } from './modules/welcome/welcome.module';
import { Router, NavigationEnd } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [
      RouterOutlet, 
      SharedModule,
      WelcomeModule,
      HttpClientModule
    ]
})
export class AppComponent {
  title = 'ProyIncapacidades';
}


