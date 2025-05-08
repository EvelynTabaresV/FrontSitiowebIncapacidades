import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { WelcomeRoutingModule } from "./welcome.routes";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { StartComponent } from "./components/start/start.component";
import { FooterComponent } from "./components/footer/footer.component";
import { HorizontalBarComponent } from "./components/horizontal-bar/horizontal-bar.component";
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { InvoiceCountService } from "./components/start/invoice-count.service";
import {ReportListService} from './components/start/report-list.service';
import { AuthService } from "@app/users/components/login/auth.service";
@NgModule({
  declarations: [
    StartComponent,
    FooterComponent,
    HorizontalBarComponent,
  ],

  imports: [
    WelcomeRoutingModule,
    CommonModule,
    HttpClientModule,
    NgxChartsModule
  ],
  exports: [
    StartComponent,
    FooterComponent,
    HorizontalBarComponent,
  ],
  providers: [
    InvoiceCountService,
    ReportListService,
    AuthService
  ],
})
export class WelcomeModule { }
