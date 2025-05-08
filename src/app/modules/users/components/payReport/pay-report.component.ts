import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {modifyInvoiceService} from'../invoice/modify-invoice.service';
import Swal from 'sweetalert2';
import { Form, FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CurrencyPipe } from '@angular/common';
import {ReportDocumentsService} from '../modal/report-documents.service';
import { report } from 'process';

export interface InvoiceData {
    status: string;
    payment_detail?: string;
    days_paid_number?: string;
    payment_date?: string;
    paid_amount?: string;
}
@Component({
    selector: 'app-pay-report',
    templateUrl: './pay-report.component.html',
})
export class PayReportComponent implements OnInit {
    documents: any[] = [];
    selectedFiles: File[] = [];
    form: FormGroup;
    formattedValue: string = '';


    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _invoiceService: modifyInvoiceService,
        private formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<PayReportComponent>,
        private currencyPipe: CurrencyPipe,
        private reportDocumentsService: ReportDocumentsService
    ) 
    {
       this.form = this.formBuilder.group({
        paymentDetail: ['', [Validators.required, Validators.maxLength(200)]],
        paidDays: [, [Validators.required, Validators.min(1), Validators.max(180)]],
        paymentDate: ['', [Validators.required, this._dateValidator()]],
        paidValue: [, [Validators.required, Validators.min(10000), Validators.max(20000000)]]
        });
       
    }

    ngOnInit() {
       
    }

    public changeStatusInvoice() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
        }else{
            const invoiceData = {
                status: 'Pagada',
                payment_detail: this.form.value.paymentDetail,
                days_paid_number: this.form.value.paidDays,
                payment_date: this.form.value.paymentDate.toString(),
                paid_amount: this.form.value.paidValue.toString(),
            }
            this._invoiceService.modifyInvoice(invoiceData, this.data.id).subscribe({
                next: () => {
                    this.dialogRef.close();
                    Swal.fire({
                        title: '¡Se registró el pago!',
                        text: 'Se notificará el pago al colaborador',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            location.reload();
                              //     const reportStatus = 'Pagada';
                        //     this.reportDocumentsService.editReport(this.data.report_disability_id, reportStatus).subscribe({
                        //         next: () => {
                        //             this.dialogRef.close();
                        //             location.reload();
                        //         },
                        //         error: () =>{
                        //             Swal.fire('Error', 'Hubo un error al registrar el pago', 'error');
                        //         }
                        //    });
                        }
                    });  
                },
                error: () =>{
                    Swal.fire('Error', 'Hubo un error al registrar el pago', 'error');
                }
    
            });

        }

       
    }

    private _dateValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            const forbidden = new Date(control.value).getFullYear() < 2020;
            return forbidden ? { 'forbiddenYear': { value: control.value } } : null;
        };
    }

    formatValue(value: number | null) {
        return this.currencyPipe.transform(value || 0, 'USD', 'symbol', '1.0-0') || '';
      }

}