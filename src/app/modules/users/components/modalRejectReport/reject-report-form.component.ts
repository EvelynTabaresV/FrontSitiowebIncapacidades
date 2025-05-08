import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { modifyReportService } from './change-report.service'; 
import {modifyInvoiceService } from '../invoice/modify-invoice.service';
import Swal from 'sweetalert2';
import { error } from 'console';


@Component({
    selector: 'app-reject-report-form',
    templateUrl: './reject-report-form.component.html',
})
export class RejectReportFormComponent implements OnInit {
    documents: any[] = [];
    type_document: boolean = true;

 
    rejectForm = new FormGroup({
        rejectionReason: new FormControl('', Validators.required),
        observations: new FormControl('', Validators.required),
    });
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _reportService: modifyReportService,
        private _invoiceService: modifyInvoiceService
    )
    {
      if (this.data.type_document == 'factura') {
          this.type_document = true;
      } else if (this.data.type_document == 'reporte') {
          this.type_document = false;
      }
    }
  ngOnInit() {

     
  }

  public onSubmit() {
    if (this.type_document === true) {
      // Si data tiene un campo name_entity, es una factura
      this.showConfirmationDialog('factura');
    } else if (this.type_document === false) {
      this.showConfirmationDialog('reporte');
    }
  }

  public showConfirmationDialog(type: string) {
    const reportData = {
      report_status: 'Rechazada',
      rejection_type: this.rejectForm.value.rejectionReason,
      rejection_reason: this.rejectForm.value.observations
    };
    const reportDataInvoice = {
      status: 'Rechazada',
      rejection_type: this.rejectForm.value.rejectionReason,
      rejection_reason: this.rejectForm.value.observations
    };

    let title = '';
    if (type === 'factura') {
        title = '¿Estás seguro de rechazar la factura?';
    } else if (type === 'reporte') {
        title = '¿Estás seguro de rechazar el reporte?';
    }
    
    Swal.fire({
        title: title,
        text: 'No podrás revertir esta acción.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, rechazar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        if (type === 'reporte') {
          this._reportService.modifyReport(reportData, this.data.report.id).subscribe(() => {
            next: () => {
            }
            error: () => {
              Swal.fire('Error', 'Hubo un error al rechazar el reporte.', 'error');
            }

          });
        } else if (type === 'factura') {
            this._invoiceService.modifyInvoice(reportDataInvoice, this.data.invoice.id).subscribe(() => {
              next: () => {
                this._reportService.modifyReport(reportData, this.data.report.id).subscribe(() => {
                  next: () => {
                  }
                  error: () => {
                    Swal.fire('Error', 'Hubo un error al rechazar el reporte.', 'error');
                  }
                });
              }
              error: () => {
                Swal.fire('Error', 'Hubo un error al rechazar la factura.', 'error');
              }
            });
         }
      let title = '';
      if (type === 'factura') {
          title = '¡Factura rechazada!';
      } else if (type === 'reporte') {
          title = '¡Reporte rechazado!';
      }

      Swal.fire(
          title,
          'Se notificará al colaborador la causa del rechazo.',
          'success'
      ).then(() => {
          location.reload(); // Recarga la página
      });
      }
    });
  }
}