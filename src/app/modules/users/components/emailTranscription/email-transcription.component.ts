import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReportDocumentsService } from '../modal/report-documents.service'; // Asegúrate de reemplazar esto con la ruta correcta a tu servicio
import { modifyReportService } from '../modalRejectReport/change-report.service'; 
import { environment } from '@environments/environment.prod';
import Swal from 'sweetalert2';


@Component({
    selector: 'app-email-transcription',
    templateUrl: './email-transcription.component.html',
})
export class EmailTranscriptionComponent implements OnInit {
    documents: any[] = [];
    selectedFiles: File[] = [];


    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private reportDocumentsService: ReportDocumentsService,
        private _reportService: modifyReportService
    ) {}

    ngOnInit() {
        this.reportDocumentsService.reportDocumentsList(this.data.id).subscribe(response => {
            this.documents = response.data;
        });
    }

    removeDocument(index: number) {
        this.documents.splice(index, 1);
    }

    openDocument(document: any) {
        const url = `${environment.API}media/${document.pdf_file}`;
        window.open(url, '_blank');
    }

   
    handleFileInput(event: Event) {
        const target = event.target as HTMLInputElement;
        const file = target.files as FileList;
        this.selectedFiles.push(file[0]);
        target.value = '';
    }

    removeFile(index: number) {
        this.selectedFiles.splice(index, 1);
    }
    
   public sendEmail() {
        const ReportData = {
            report_status: 'Transcrita'
        }
        this._reportService.modifyReport(ReportData, this.data.id).subscribe({
            next: () => {
                Swal.fire({ 
                    title: '¡Incapacidad envia!', 
                    text: 'Se ha registrado la transcripción de la incapacidad .', 
                    icon: 'success' 
                }).then(() => {
                    location.reload();
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
   }
}