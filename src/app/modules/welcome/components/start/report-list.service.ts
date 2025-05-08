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

    listAllReport(): Observable<ReportResponse> {
        const url = `${environment.API}conteo_estados/`;
        return this.http.get<ReportResponse>(url);
    }
}