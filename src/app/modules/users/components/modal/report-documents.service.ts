import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment.prod';
import { Observable } from 'rxjs';

interface ReportResponse {
  code: string;
  detailed: string;
  data: any[];
}

@Injectable()
export class ReportDocumentsService {
    constructor(private http: HttpClient) {}
    /**
     *@description Lista de documentos PDF de un reporte
     * @param reportId 
     * @returns 
     */
    reportDocumentsList(reportId: number): Observable<ReportResponse> {
        const url = `${environment.API}obtener_archivos/${reportId}/`;
        return this.http.get<ReportResponse>(url);
    }
    /**
     *@description Editar la información de un reporte mas no sus pdfs
     * @param reportId 
     * @param formData 
     * @returns 
     */
    editReport(reportId: number, reportData: any): Observable<any> {
      const url = `${environment.API}reportes_incapacidad_modificar/${reportId}/`;
      return this.http.patch<any>(url, reportData);
    }
}