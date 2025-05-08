import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment.prod';
export interface ReportData {
    report_status: string;
    rejection_type?: string | null | undefined;
    rejection_reason?: string | null | undefined;
}
@Injectable()
export class modifyReportService {
    constructor(private http: HttpClient) {}

    modifyReport(reportData: ReportData, reportId: number) {
        const url = `${environment.API}reportes_incapacidad_modificar/${reportId}/`; // Asegúrate de que esta es la URL correcta para la API de modificación de reportes
        return this.http.patch(url, reportData);
    }
}