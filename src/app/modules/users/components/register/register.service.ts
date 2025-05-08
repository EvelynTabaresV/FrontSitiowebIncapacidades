import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment.prod';
import { UserData } from 'src/app/interfaces/register.interface'; // Asegúrate de que esta es la ruta correcta a tu interfaz
@Injectable()
export class RegisterService {
    constructor(private http: HttpClient) {}

    registerUser(userData: UserData) {
    const url = `${environment.API}registro/`; // Asegúrate de que esta es la URL correcta para la API de registro de usuarios
    return this.http.post(url, userData);
    }
}