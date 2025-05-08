import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment.prod';
// export interface InvoiceData {
//     status: string;
//     // rejection_type?: string | null | undefined;
//     rejection_reason?: string | null | undefined;
// }

   
interface InvoiceData {
    payment_detail?: string;
    days_paid_number?: number;
    status: string;
    payment_date?: string;
    paid_amount?: string;
    rejection_type?: string | null;
    rejection_reason?: string | null;
}
    
@Injectable()
export class modifyInvoiceService {
    constructor(private http: HttpClient) {}

    modifyInvoice(reportData: InvoiceData, invoiceId: number) {
        const url = `${environment.API}actualizar_factura/${invoiceId}/`;
        return this.http.patch(url, reportData);
    }
}