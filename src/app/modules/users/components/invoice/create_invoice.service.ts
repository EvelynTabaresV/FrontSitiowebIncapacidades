import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment.prod';

export interface InvoiceData {
    status: string;
    rejection_reason?: string | null | undefined;
    payment_detail?: string;
    days_paid_number?: string;
    disability_dates: string;
    payment_date?: string;
    report_disability_id: string;
    paid_amount?: string;
    collaborator_document: string;
    name_entity: string;
}
@Injectable()
export class createInvoicerService {
    constructor(private http: HttpClient) {}

    createInvoice(invoiceData: InvoiceData) {
        const url = `${environment.API}registro_factura/`; 
        return this.http.post(url, invoiceData);
    }
}