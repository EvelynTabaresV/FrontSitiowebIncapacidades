import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment.prod';
import { Observable } from 'rxjs';

interface InvoiceDataResponse {
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
    employee_full_name: string;
}

@Injectable()export class InvoiceListService {
    constructor(private http: HttpClient) {}

    listAllInvoice(name_entity?: string, status?: string, collaborator_document?:string, payment_date?: string, disability_dates?: string,  all?: boolean): Observable<InvoiceDataResponse[]> {

        const url = `${environment.API}facturas/`;
        let params = new HttpParams();
        if (name_entity) {
            params = params.append('name_entity', name_entity);
        }
        if (status) {
            params = params.append('status', status);
        }
        if (payment_date) {
            params = params.append('payment_date', payment_date);
        }
        if (disability_dates) {
            params = params.append('disability_dates', disability_dates);
        }
        if (collaborator_document){
            params = params.append('document', collaborator_document);
        }
        if (all) {
            return this.http.get<InvoiceDataResponse[]>(url);
          }
  
        return this.http.get<InvoiceDataResponse[]>(url, { params });
    }
}