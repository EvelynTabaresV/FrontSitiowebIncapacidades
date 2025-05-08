import { Component } from '@angular/core';
import { LoginService } from './login.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public signUpMode = true;
  public email: string = '';
  public password: string = '';
  private role: string = '';

  constructor(
    private _loginService: LoginService,
    private _router: Router
  ) {}

  public login() {
    this._loginService.login(this.email, this.password).subscribe({
      next: (response) => {
        // Guarda el usuario en el almacenamiento local
        localStorage.setItem('user', JSON.stringify(response));
        const user = JSON.parse(localStorage.getItem('user') as string);
        if (user) {
          this.role = user.charge;
        }

        Swal.fire({
          title: '¡Bienvenido!',
          text: 'Esperamos que disfrutes tu visita.',
          icon: 'success',
          timer: 2000,
        }).then(() => {
          this._router.navigate(['inicio/bienvenida'], { state: { userRole: this.role } }).then(() => {
          });
        });
      },
      error: (error) => {
        Swal.fire('Error', 'Hubo un error al iniciar sesión.', 'error');
      }
    });
  }
}