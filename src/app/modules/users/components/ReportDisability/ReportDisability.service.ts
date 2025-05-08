import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment.prod';

export interface ReportDisabilityData {
    start_date: string;
    expiration_date: string;
    report_status: string;
    disability_type: string;
    document: string;
    rejection_type?: string;
    rejection_reason?: string;
    name_entity?: string;
}
@Injectable()
export class ReportDisabilityService {
    constructor(private http: HttpClient) {}

    postReportDisability(reportData: ReportDisabilityData) {
        const url = `${environment.API}reportar_incapacidad/`; 
        return this.http.post(url, reportData);
    }
}