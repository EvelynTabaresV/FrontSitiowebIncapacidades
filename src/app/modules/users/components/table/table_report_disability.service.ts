import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment.prod';
import { Observable } from 'rxjs';

interface ReportResponse {
  code: string;
  detailed: string;
  data: any[];
}

@Injectable()
export class ReportListService {
    constructor(private http: HttpClient) {}

    listAllReport(name_entity?: string, document?: string,
       report_status?: string, disability_type?: string,
        id?: string, all?: boolean): Observable<ReportResponse> {

        const url = `${environment.API}reportes_incapacidad_lista/`;

        // Define the parameters
        let params = new HttpParams();
     
        if (document) {
          params = params.append('document', document);
          if(name_entity){
            params = params.append('name_entity', name_entity);
          }
          if(report_status){
            params = params.append('report_status', report_status);
          }
          if(disability_type){
            params = params.append('disability_type', disability_type);
          }
          if(id){
            params = params.append('id', id);
          }
          return this.http.get<ReportResponse>(url, { params });
        }
        if (name_entity) {
          params = params.append('name_entity', name_entity);
        }
        if (report_status) {
          params = params.append('report_status', report_status);
        }
        if (disability_type) {
          params = params.append('disability_type', disability_type);
        }
        if(id){
          params = params.append('id', id);
        
        }
        if (all) {
          return this.http.get<ReportResponse>(url);
        }

        return this.http.get<ReportResponse>(url, { params });
    }
}