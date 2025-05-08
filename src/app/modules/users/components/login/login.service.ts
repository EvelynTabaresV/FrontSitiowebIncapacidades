import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment.prod';

@Injectable()
export class LoginService {
    constructor(private http: HttpClient) {}

    login(username: string, password: string) {
        const url = `${environment.API}inicio_sesion/`;
        const body = { username, password };

        return this.http.post(url, body);
    }
}