import { Component, OnInit } from '@angular/core';
import { ReportListService } from './table_report_disability.service';
import { MatDialog } from '@angular/material/dialog';
import { ReportDialogComponent } from '../modal/report-information.component';
import { RejectReportFormComponent } from '../modalRejectReport/reject-report-form.component';
import { modifyReportService } from '../modalRejectReport/change-report.service'; 
import { EmailTranscriptionComponent } from '../emailTranscription/email-transcription.component'; 
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
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss']
})

export class TableComponent implements OnInit {
    reports: any[] = [];
    selectedFilter: string = '';
    filterValue: string = '';
    emptyFilter: boolean = false;
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
        this._getAllReports();
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
                return 'El colaborador ingresó toda la documentación';
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

    /*
    * This method opens a dialog to reject the selected report
    * @param report
    */
    public showRejectReport(report: Report){
        this.dialog.open(RejectReportFormComponent, {
            data: {
                report: report,
                type_document: 'reporte'
            }
        });
    }

    /*
    * This method opens a dialog to transcribe the selected report
    * @param report
    */
    public showTranscribeReport(report: Report) {
        Swal.fire({
            icon: "info",
            title: 'Transcripción de la incapacidad',
            html: `Antes de continuar, verifica si la entidad 
            <strong>${report.name_entity}</strong> 
            permite la transcripción a través del correo 
            electrónico o solo a través de su portal.`,
            showDenyButton: true,
            confirmButtonText: 'Se transcribió por portal',
            denyButtonText: 'Transcribir por correo',
            customClass: {
                title: 'my-title-class'
            }
        }).then((result) => {
            if (result.isConfirmed) {

                const ReportData = {
                    report_status: 'Transcrita'
                }
              
                this._reportService.modifyReport(ReportData, report.id).subscribe({
                    next: () => {
                        Swal.fire({ 
                            title: '¡Incapacidad transcrita!', 
                            text: 'Se ha registrado la transcripción de la incapacidad.', 
                            icon: 'success',
                            confirmButtonText: 'OK'
                            }).then((result) => {
                            if (result.isConfirmed) {
                                location.reload();
                            }
                        });
                    },
                    error: (err) => {
                        Swal.fire({ 
                            title: 'Error', 
                            text: 'Hubo un error al registrar el cambio de estado de la incapacidad.', 
                            icon: 'error' 
                        });
                        console.error(err);
                    }
                });
                

            } else if (result.isDenied) {
                this.dialog.open(EmailTranscriptionComponent, {
                    data: report
                });
            }
        });
    }

    public approveInvoice(report: Report) {
        console.log (report);
        console.log ("report id",report.id);
        const createInvoiceData = {
            status: 'Cobrada',
            disability_dates: report.start_date,
            report_disability_id: report.id.toString(),
            collaborator_document: report.document,
            name_entity: report.name_entity
        }

        Swal.fire({
            title: 'Cambiar el estado de la incapacidad a "Aprobada"' ,
            html: `¿Estás seguro de que <strong>${report.name_entity}</strong> aprobó la incapacidad?`, 
            icon: 'warning',     
            showDenyButton: true,
            confirmButtonText: `Sí`,
            denyButtonText: `No`,
        }).then((result) => {
            if (result.isConfirmed) {
                const ReportData = {
                    report_status: 'Aprobada'
                }
              
                this._reportService.modifyReport(ReportData, report.id).subscribe({
                    next: () => {
                        Swal.fire({
                            title: '¡Incapacidad aprobada!',
                            text: 'La incapacidad está pendiente de pago.',
                            icon: 'success',
                        })
                    },
                    error: (err) => {
                        Swal.fire({ 
                            title: 'Error', 
                            text: 'Hubo un error al registrar el cambio de estado de la incapacidad.', 
                            icon: 'error' 
                        });
                        console.error(err);
                    }
                });
                this._createInvoicerService.createInvoice(createInvoiceData).subscribe({
                    next: () => {
                        this.router.navigate(['usuarios/facturas']).then(() => {
                            Swal.fire('¡Factura Cobrada!', 'Se ha creado la factura', 'success');
                        });   
                    },
                    error: (err) => {
                        if (err.error && err.error.detailed) {
                            Swal.fire('Error', err.error.detailed, 'error');
                        } else {
                            console.error(err);
                        }
                    }
                });
            }
        });
    }

    public applyFilter() {
        this.reports = [];
        // Call your service with the selected filter and value
        if(this.selectedFilter === 'all'){
            this._getAllReports();
        }else{
            this.reportListService.listAllReport(
                this.selectedFilter === 'name_entity' ? this.filterValue : undefined,
                this.selectedFilter === 'document' ? this.filterValue : undefined,
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

    private _getAllReports() {
        this.reportListService.listAllReport().subscribe({
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
    
    public sortReportsByCollaborator() {
        this.reports.sort((a, b) => a.name.localeCompare(b.name));
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

}


