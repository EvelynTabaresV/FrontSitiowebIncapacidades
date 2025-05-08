import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { RegisterService } from './register.service'; // Asegúrate de que esta es la ruta correcta a tu servicio
import { UserData } from 'src/app/interfaces/register.interface';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
 
  registerForm = this.formBuilder.group({
    nombres: ['', Validators.required],
    apellidos: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]],
    fechaNacimiento: ['', Validators.required],
    telefonoCelular: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    numeroDocumento: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
    genero: ['', Validators.required],
    contraseña: ['', [Validators.required, Validators.minLength(8)]],
    charge: ['colaborador'] // Asegúrate de que 'colaborador' es el valor correcto
  });
  constructor(
    private formBuilder: FormBuilder,
    private _registerService: RegisterService
  ) {} 


  public getFechaMinima(): string {
    const fechaActual = new Date();
    const fechaMinima = new Date(fechaActual.getFullYear() - 62, 0, 1);
    return fechaMinima.toISOString().split('T')[0];
  }

  public getFechaMaxima(): string {
    const fechaActual = new Date();
    const fechaMaxima = new Date(fechaActual.getFullYear() - 18, fechaActual.getMonth(), fechaActual.getDate());
    return fechaMaxima.toISOString().split('T')[0];
  }
  public fechaNacimientoValidator(control: FormControl): { [key: string]: boolean } | null {
    if (control.value) {
      const fechaNacimiento = new Date(control.value);
      const fechaActual = new Date();
      const fechaMinima = new Date(fechaActual.getFullYear() - 62, 0, 1); // Hace 62 años desde el primer día del año actual
      const fechaMaxima = new Date(fechaActual.getFullYear() - 18, fechaActual.getMonth(), fechaActual.getDate()); // Hace 18 años desde hoy

      if (fechaNacimiento < fechaMinima || fechaNacimiento > fechaMaxima) {
        return { 'fechaInvalida': true };
      }
    }
    return null;
  }

  get correo() {
    return this.registerForm.get('correo');
  }

  get fechaNacimiento() {
    return this.registerForm.get('fechaNacimiento');
  }

  get telefonoCelular() {
    return this.registerForm.get('telefonoCelular');
  }

  get numeroDocumento() {
    return this.registerForm.get('numeroDocumento');
  }

  get genero() {
    return this.registerForm.get('genero');
  }

  get contraseña() {
    return this.registerForm.get('contraseña');
  }
  public registrar() {
    if (this.registerForm.valid) {
      let { nombres, apellidos, correo, fechaNacimiento, telefonoCelular, numeroDocumento, genero, contraseña } = this.registerForm.value;
      const userData: UserData = {
        first_name: nombres?.toString() ?? '',
        last_name: apellidos?.toString() ?? '',
        document: numeroDocumento?.toString() ?? '',
        cellphone: telefonoCelular?.toString() ?? '',
        birthdate: fechaNacimiento?.toString() ?? '',
        gender: genero?.toString() ?? '',
        email: correo?.toString() ?? '',
        password: contraseña?.toString() ?? '',
        charge: 'colaborador' // Asegúrate de que 'colaborador' es el valor correcto
      };
      this._registerService.registerUser(userData).subscribe({
        next: (response) => {
          console.log(response);
          Swal.fire('Success', 'Usuario registrado correctamente', 'success');
        },
        error: (error) => {
          console.log(error);
          Swal.fire('Error', 'Hubo un error registrando el usuario', 'error');
        }
      });
    } else {
      Swal.fire('Error', 'El formulario no es válido. Por favor, revise los campos marcados.', 'error');    
    }
  }
}
