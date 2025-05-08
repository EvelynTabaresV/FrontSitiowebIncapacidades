import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment.prod';
import { Observable } from 'rxjs';

interface EntityData {
    id: number,
    name: string,
    email: string,
    address: string,
    phone_number: string,
}

@Injectable()
export class EntityService {
    constructor(private http: HttpClient) {}

    getEntities(): Observable<EntityData[]> {
        const url = `${environment.API}lista_entidades/`;
        return this.http.get<EntityData[]>(url);
    }
}