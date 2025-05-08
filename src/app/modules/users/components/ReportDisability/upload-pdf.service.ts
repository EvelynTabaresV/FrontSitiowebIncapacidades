import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment.prod';

@Injectable()
export class UploadPdfService {
  constructor(private http: HttpClient) {}

  uploadPDF(reportDisabilityId: number, name: string, formData: FormData) {
    const url = `${environment.API}subida_archivos/${reportDisabilityId}/`; 

    return this.http.post(url, formData);
  }
  editPDF(reportDisabilityId: number, name: string, formData: FormData) {
    const url = `${environment.API}subida_archivos/${reportDisabilityId}/`; 

    return this.http.patch(url, formData);
  }
}