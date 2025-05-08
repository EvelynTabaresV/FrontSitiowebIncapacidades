import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment.prod';
import { Observable } from 'rxjs';

interface invoiceData {
    paid_count: number,
    charged_count: number,
    rejected_count: number,
    disability_counts: any[],
    disability_counts_month: any[]
}

@Injectable()
export class InvoiceCountService {
    constructor(private http: HttpClient) {}

    getCount(): Observable<invoiceData> {
        const url = `${environment.API}conteo_estados_factura/`;
        return this.http.get<invoiceData>(url);
    }
}