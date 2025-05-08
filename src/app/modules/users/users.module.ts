import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { UsersRoutingModule } from "./users.routes";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { LoginService } from "./components/login/login.service";
import { RegisterService } from "./components/register/register.service";
import { TableComponent } from "./components/table/table.component";
import { ReportListService } from "./components/table/table_report_disability.service"; 
import { MatDialogModule } from '@angular/material/dialog';
import { ReportDialogComponent } from './components/modal/report-information.component';
import { ReportDocumentsService } from './components/modal/report-documents.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RejectReportFormComponent } from './components/modalRejectReport/reject-report-form.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule} from '@angular/material/form-field';
import { modifyReportService } from "./components/modalRejectReport/change-report.service";
import { EmailTranscriptionComponent } from './components/emailTranscription/email-transcription.component';
import { InvoiceListService } from './components/invoice/invoice.service';
import { InvoiceComponent } from './components/invoice/invoice.component';
import { modifyInvoiceService } from './components/invoice/modify-invoice.service';
import { createInvoicerService } from './components/invoice/create_invoice.service';
import { PayReportComponent } from './components/payReport/pay-report.component';
import { CurrencyPipe } from '@angular/common';
import { UsersService } from './components/infoUsers/users.service';
import { EntityService } from './components/infoEntities/entities.service';
import { EntityComponent } from "./components/infoEntities/entity.component";
import { ReportDisabilityComponent } from './components/ReportDisability/ReportDisability.component';
import { ReportDisabilityService } from './components/ReportDisability/ReportDisability.service';
import { UploadPdfService } from './components/ReportDisability/upload-pdf.service';
import { consultStateDisabilityComponent } from './components/consultStateDisability/consult-state-disability.component';
import { WelcomeModule } from "@app/welcome/welcome.module";
import { InfoUserComponent } from './components/infoUsers/info-users.component'; 
@NgModule({
    declarations: [
        LoginComponent,
        RegisterComponent,
        TableComponent,
        ReportDialogComponent,
        RejectReportFormComponent,
        EmailTranscriptionComponent,
        InvoiceComponent,
        PayReportComponent,
        EntityComponent,
        ReportDisabilityComponent,
        consultStateDisabilityComponent,
        InfoUserComponent

    ],
    providers: [
        LoginService,
        RegisterService,
        ReportListService,
        ReportDocumentsService,
        modifyReportService,
        InvoiceListService,
        modifyInvoiceService,
        createInvoicerService,
        CurrencyPipe,
        UsersService,
        EntityService,
        ReportDisabilityService,
        UploadPdfService
    ],
    imports: [
        UsersRoutingModule,
        CommonModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatFormFieldModule,
        WelcomeModule
          ]
})
export class UsersModule { }
