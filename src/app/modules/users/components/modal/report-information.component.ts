import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReportDocumentsService } from './report-documents.service'; // Asegúrate de reemplazar esto con la ruta correcta a tu servicio
import { environment } from '@environments/environment.prod';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UploadPdfService } from '../ReportDisability/upload-pdf.service';

@Component({
    selector: 'app-report-information',
    templateUrl: './report-information.component.html',
})
export class ReportDialogComponent implements OnInit {
    documents: any[] = [];
    public type_document: string = '';
    editReportdisability: FormGroup;
 

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private reportDocumentsService: ReportDocumentsService,
        private formBuilder: FormBuilder,
        private uploadPdfService: UploadPdfService
    ) {
        this.editReportdisability = this.formBuilder.group({
            FechaExpedicion: [this.data.start_date, Validators.required],
            FechaVencimiento: [this.data.expiration_date, Validators.required],
            certificadoIncapacidad: [null],
            epicrisisSoporte: [null],
            FURIPS: [null],
            certificadoNacidoVivo: [null],
            registroCivil: [null],
            docIdentidadMadre: [null]
        });
    }

    ngOnInit() {
        if (this.data.report_status === 'Rechazada' && this.data.isEditable === true) {
            this.type_document = 'editReporte';
            this.reportDocumentsService.reportDocumentsList(this.data.id).subscribe(response => {
                this.documents = response.data;
            });
        }
        else if(this.data.report_status){// si tiene el campo report_status es un reporte
            this.type_document = 'reporte';
            this.reportDocumentsService.reportDocumentsList(this.data.id).subscribe(response => {
                this.documents = response.data;
            });
        }
        else if (this.data.status === 'Pagada'){// si tiene el campo status es una factura
            this.type_document = 'factura';
        }
        else if (this.data.status === 'Rechazada'){// si tiene el campo status es una factura
            this.type_document = 'factura_rechazada';
        }
      
    }
    openDocument(document: any) {
        const url = `${environment.API}media/${document.pdf_file}`;
        window.open(url, '_blank');
    }

    onFileChange(event: any, field: string) {
        if (event.target.files.length > 0) {
        const file = event.target.files[0];
        this.editReportdisability.get(field)?.setValue(file);
        }
    }
     
    onSubmit() {
        this.uploadPDFs(this.data.id);
        const reportData = {
            start_date: this.editReportdisability.value.FechaExpedicion,
            expiration_date: this.editReportdisability.value.FechaVencimiento,
            report_status: 'Diligenciada',
        }
        this.reportDocumentsService.editReport(this.data.id, reportData).subscribe({
            next: () => {
                Swal.fire({
                title: '¡Editado!',
                text: '¡Reporte enviado para revisión con éxito!',   
                icon: 'success',
                confirmButtonText: 'OK'
                }).then((result) => {
                if (result.isConfirmed) {
                    location.reload();
                }
                });            },
            error: (error: any) => {
                Swal.fire('Error', 'Hubo un error al editar el reporte: ' + error.error.detailed, 'error');
            }
        });
        

        console.log(this.editReportdisability.value);
    }
    uploadPDFs(reportDisabilityId: number) {
        const pdfFields = {
            'Enfermedad general': ['certificadoIncapacidad', 'epicrisisSoporte'],
            'Accidente de tránsito': ['certificadoIncapacidad', 'epicrisisSoporte', 'FURIPS'],
            'Accidente laboral': ['certificadoIncapacidad', 'epicrisisSoporte'],
            'Licencia de maternidad': ['certificadoIncapacidad', 'epicrisisSoporte', 'certificadoNacidoVivo', 'registroCivil', 'docIdentidadMadre'],
            'Licencia de paternidad': ['epicrisisSoporte', 'certificadoNacidoVivo', 'registroCivil', 'docIdentidadMadre']
        };
        console.log("tipo de incapacidad",this.data.disability_type);
        const fieldsToUpload = pdfFields[this.data.disability_type as keyof typeof pdfFields];
        if (fieldsToUpload) {
            fieldsToUpload.forEach(field => {
                const file: File = this.editReportdisability.get(field)?.value;
                if (file) {
                    const formData = new FormData();
                    formData.append('name', field); // Add the 'name' field to the formData
                    formData.append('pdf_file', file, file.name);
                    this.uploadPdfService.editPDF(reportDisabilityId, field, formData).subscribe({
                        next: (uploadResponse: any) => {
                            console.log(`PDF ${field} subido con éxito. Respuesta del servidor:`, uploadResponse);
                        },
                        error: (uploadError: any) => {
                            Swal.fire('Error', `Hubo un error al subir el PDF ${field}: ` + uploadError.error.detailed, 'error');
                        }
                    });
                }
            });
        }
    }
}