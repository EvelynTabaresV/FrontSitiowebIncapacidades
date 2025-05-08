
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ReportDialogComponent } from '../modal/report-information.component';
import { RejectReportFormComponent } from '../modalRejectReport/reject-report-form.component';
import Swal from 'sweetalert2';
import {InvoiceListService} from './invoice.service';
import {PayReportComponent} from '../payReport/pay-report.component';
import { UsersService } from '../infoUsers/users.service';
    
interface ReportResponse {
    id: number;
    payment_detail: string;
    days_paid_number: number;
    status: string;
    disability_dates: string;
    payment_date: string;
    report_disability_id: number;
    paid_amount: string;
    rejection_reason: string | null;
    collaborator_document: string;
    name_entity: string;
    disability_type: string;
}
    
@Component({
    selector: 'app-invoice',
    templateUrl: './invoice.component.html',
    styleUrls: ['./invoice.component.scss']
})

export class InvoiceComponent implements OnInit {
    invoices: any[] = [];
    selectedFilter: string = '';
    filterValue: string = '';
    emptyFilter: boolean = false;
    disabilityTypeMap = {
        'Enfermedad_general': 'Enfermedad general',
        'Accidente_de_tránsito': 'Accidente de tránsito',
        'Accidente_laboral': 'Accidente laboral',
        'Licencia_de_maternidad': 'Licencia de maternidad',
        'Licencia_de_paternidad': 'Licencia de paternidad'
    };
    
    constructor(
        private dialog: MatDialog,
        private _invoiceListService: InvoiceListService,
        private _userService: UsersService
    ) {
        this.getALlInvoices();
    }

    ngOnInit() {
       
    }

    public getALlInvoices() {
        this._invoiceListService.listAllInvoice().subscribe({
         next: (data: ReportResponse[]) => {
                this.invoices = data.map(invoice => ({
                    ...invoice,
                    disability_type: this.disabilityTypeMap[invoice.disability_type as keyof typeof this.disabilityTypeMap] || invoice.disability_type
                }));
            },
            error: () => {
                Swal.fire('Error', 'Hubo un error al cargar las facturas.', 'error');
            }
        });
    }

    public getTitle(status: string): string {
        switch (status) {
            case 'Pagada':
                return 'La entidad pagó la incapacidad';
            case 'Rechazada':
                return 'Rechazado por la entidad';
            case 'Cobrada':
                return 'La entidad aceptó la incapacidad, pero no ha pagado';
            default:
                return '';
        }
    }
    public showRejectInvoice(invoice: ReportResponse) {
       this.dialog.open(RejectReportFormComponent, {
            data: {
                invoice: invoice,
                type_document: 'factura'
            }
        });
    }
    public showInvoce(invoice: ReportResponse) {
        this.dialog.open(ReportDialogComponent, {
            data: invoice
        });
    }

    public showCollaboratorInfo(invoice: ReportResponse) {
        this._userService.getUser(invoice.collaborator_document).subscribe({
         next: (data: any) => {
        Swal.fire({
            icon: 'info',
            html: `
                <div style="color: #0e2362; font-size: 23px;"><strong>Información del colaborador</strong></div>
                <br><br>
                <p style="text-align: left; margin-left: 20px;"><i class="fa fa-user"></i> <strong>Nombre:</strong> ${data.first_name} ${data.last_name}</p>
                <p style="text-align: left; margin-left: 20px;"><i class="fa fa-id-card"></i> <strong>Documento:</strong> ${data.document}</p>
                <p style="text-align: left; margin-left: 20px;"><i class="fa fa-envelope"></i> <strong>Correo:</strong> ${data.email}</p>
                <p style="text-align: left; margin-left: 20px;"><i class="fa fa-phone"></i> <strong>Teléfono:</strong> ${data.cellphone}</p>
                <p style="text-align: left; margin-left: 20px;"><i class="fa fa-birthday-cake"></i> <strong>Fecha de nacimiento:</strong> ${data.birthdate}</p>
            `
        });
            },
            error: () => {
                Swal.fire('Error', 'Hubo un error al cargar la información del colaborador.', 'error');
            }
        });

        
    }

    public payInvoice(invoice: ReportResponse) {
        this.dialog.open(PayReportComponent, {
            data: invoice
        });
    }

    public applyFilter() {
        this.invoices = [];
        // Call your service with the selected filter and value
        if(this.selectedFilter === 'all'){
            this.getALlInvoices();
        }else{
            this._invoiceListService.listAllInvoice(
                this.selectedFilter === 'name_entity' ? this.filterValue : undefined,
                this.selectedFilter === 'status' ? this.filterValue : undefined,
                this.selectedFilter === 'collaborator_document' ? this.filterValue : undefined,
                this.selectedFilter === 'payment_date' ? this.filterValue : undefined,
                this.selectedFilter === 'disability_dates' ? this.filterValue : undefined,
            ).subscribe({
                next: (response:  ReportResponse[]) => {
                    this.invoices = response;
                    // If no data is found, set emptyFilter to true
                    if (this.invoices.length === 0) {
                        this.emptyFilter = true;
                    } else {
                        this.emptyFilter = false;
                    }
                    console.log(response);
                },
                error: (error) => {
                    console.error('Error occurred:', error);
                    this.emptyFilter = true;
                }
            });
        }
    }

    public  onFilterChange() {
        if (this.selectedFilter === 'all') {
            this.filterValue = '';
        }
    }
    public sortByDate() {
        this.invoices.sort((a, b) => {
            const dateA = new Date(a.disability_dates);
            const dateB = new Date(b.disability_dates);
            return dateB.getTime() - dateA.getTime();
        });
    }
    public sortByPaidDate() {
        this.invoices.sort((a, b) => {
            const dateA = new Date(a.payment_date);
            const dateB = new Date(b.payment_date);
            return dateB.getTime() - dateA.getTime();
        });
    }
    public sortByStatus() {
        this.invoices.sort((a, b) => a.status.localeCompare(b.status));
    }
    public sortByTypeDIsability() {
        this.invoices.sort((a, b) => a.disability_type.localeCompare(b.disability_type));
    }
     public sortByDocument() {
        this.invoices.sort((a, b) => a.collaborator_document.localeCompare(b.collaborator_document));
    }
    public sortByName(){
        this.invoices.sort((a, b) => a.employee_full_name.localeCompare(b.employee_full_name));
    }

    public sortByPaidDays () {
        this.invoices.sort((a, b) => a.days_paid_number - b.days_paid_number);
    }
    
    public sortById() {
        this.invoices.sort((a, b) => a.id - b.id);
    }

    public sortByEntity() {
        this.invoices.sort((a, b) => a.name_entity.localeCompare(b.name_entity));
    }
 
}