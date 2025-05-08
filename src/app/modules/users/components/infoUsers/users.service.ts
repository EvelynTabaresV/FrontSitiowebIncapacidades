import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment.prod';
import { Observable } from 'rxjs';

interface userData {
    id: number,
    first_name: string,
    last_name: string,
    document: string,
    cellphone: string,
    birthdate: string,
    gender: string,
    email: string,
    charge: string,
}

@Injectable()
export class UsersService {
    constructor(private http: HttpClient) {}

    getUser(document:string): Observable<userData> {
        const url = `${environment.API}usuario/${document}/`;
        return this.http.get<userData>(url);
    }
    updateUser(user_document: string, data: Partial<userData>): Observable<userData> {
        const url = `${environment.API}actualizar/${user_document}/`;
        return this.http.patch<userData>(url, data);
    }
}