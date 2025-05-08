import { Component, OnInit } from '@angular/core';
import { ReportListService } from '../table/table_report_disability.service';
import { MatDialog } from '@angular/material/dialog';
import { ReportDialogComponent } from '../modal/report-information.component';
import { modifyReportService } from '../modalRejectReport/change-report.service'; 
import { createInvoicerService } from '../invoice/create_invoice.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
interface Report {
    id: number;
    name: string;
    last_name: string;
    document: string;
    disability_type: 
        'Enfermedad general' |
        'Accidente de tránsito' |
        'Accidente laboral' | 
        'Licencia de maternidad'|
        'Licencia de paternidad';
    start_date: string;
    expiration_date: string;
    rejection_type: string;
    rejection_reason: string;
    entidad: string;
    report_status: string;
    name_entity: string;
  }
  
  interface ReportResponse {
    code: string;
    detailed: string;
    data: Report[];
  }
@Component({
    selector: 'app-consult-state-disability',
    templateUrl: './consult-state-disability.component.html',
    styleUrls: ['./consult-state-disability.component.scss']
})

export class consultStateDisabilityComponent implements OnInit {
    reports: any[] = [];
    selectedFilter: string = '';
    filterValue: string = '';
    emptyFilter: boolean = false;
    userDocument: string = '';
    name_entity: string = '';
    /*
    * This object maps the disability type to a more readable format
    */
    disabilityTypeMap = {
        'Enfermedad general': 'Enfermedad general',
        'Accidente de tránsito': 'Accidente de tránsito',
        'Accidente laboral': 'Accidente laboral',
        'Licencia de maternidad': 'Licencia de maternidad',
        'Licencia de paternidad': 'Licencia de paternidad'
    };

    constructor(
        private reportListService: ReportListService,
        private dialog: MatDialog,
        private _reportService: modifyReportService,
        private _createInvoicerService: createInvoicerService,
        private router: Router
    ) {
        if (typeof window !== 'undefined') {
            const user = JSON.parse(localStorage.getItem('user') as string);
            if (user) {
                this.userDocument = user.document;
            }
            this._getAllReports(this.name_entity, this.userDocument);
        }
    }

   ngOnInit() {
    }

    /*
    * This method returns the title of the report status
    * @param status
    */
    public getTitle(status: string): string {
        switch (status) {
            case 'Transcrita':
                return 'Enviado a la Entidad para aprobación';
            case 'Rechazada':
                return 'Rechazado por un admin';
            case 'Diligenciada':
                return 'Ingresó toda la documentación';
            case 'Aprobada':
                return 'La entidad aprobó la incapacidad';
            default:
                return '';
        }
    }
    
    /*
    * This method opens a dialog with the details of the selected report
    * @param report
    */
    public showReport(report: Report) {
        this.dialog.open(ReportDialogComponent, {
            data: report
        });
    }
   
    public applyFilter() {
        this.reports = [];
        // Call your service with the selected filter and value
        if(this.selectedFilter === 'all'){
            this._getAllReports(this.name_entity, this.userDocument);
        }else{
            this.reportListService.listAllReport(
                this.selectedFilter === 'name_entity' ? this.filterValue : undefined,
                this.userDocument,
                this.selectedFilter === 'report_status' ? this.filterValue : undefined,
                this.selectedFilter === 'disability_type' ? this.filterValue : undefined,
                this.selectedFilter === 'id'? this.filterValue : undefined
            ).subscribe({
                next: (response) => {
                    this.reports = response.data.map(report => ({
                        ...report,
                        disability_type: this.disabilityTypeMap[report.disability_type as keyof typeof this.disabilityTypeMap] ||
                         report.disability_type
                    }));
                    // If no data is found, set emptyFilter to true
                    if (this.reports.length === 0) {
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

    private _getAllReports(name_entity: string, userDocument: string) {
        this.reportListService.listAllReport(name_entity, userDocument).subscribe({
            next: (data: ReportResponse) => {
                this.reports = data.data
                    .filter(report => report.report_status !== 'Pendiente')
                    .map(report => ({
                        ...report,
                        disability_type: this.disabilityTypeMap[report.disability_type] ||
                         report.disability_type
                    }));
            },
            error: () => {
                Swal.fire('Error', 'Hubo un error al cargar los informes.', 'error');
            }
        });
    }

   public  onFilterChange() {
        if (this.selectedFilter === 'all') {
            this.filterValue = '';
        }
    }

    public sortReportsByDate() {
        this.reports.sort((a, b) => {
            const dateA = new Date(a.start_date);
            const dateB = new Date(b.start_date);
            return dateB.getTime() - dateA.getTime();
        });
    }

    public sortReportsByExpirationDate() {
        this.reports.sort((a, b) => {
            const dateA = new Date(a.expiration_date);
            const dateB = new Date(b.expiration_date);
            return dateB.getTime() - dateA.getTime();
        });
    }

    public sortReportsByEntity() {
        this.reports.sort((a, b) => a.name_entity.localeCompare(b.name_entity));
    }
    
    public sortReportsByDisabilityType() {
        this.reports.sort((a, b) => a.disability_type.localeCompare(b.disability_type));
    }

    public sortReportsById() {
        this.reports.sort((a, b) => a.id - b.id);
    }

    public sortReportByStatus() {
        this.reports.sort((a, b) => a.report_status.localeCompare(b.report_status));
    }
    editReport(report: any) {
        this.dialog.open(ReportDialogComponent, {
            data: {
                ...report,
                isEditable: true
            }
        });
    }

}


