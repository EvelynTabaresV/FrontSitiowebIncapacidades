import { Component, OnInit } from '@angular/core';
import { UsersService } from './users.service'; // replace with the actual path to the service
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';


@Component({
    selector: 'app-info-users',
    templateUrl: './info-users.component.html',
    styleUrls: ['./info-users.component.scss']
})
export class InfoUserComponent implements OnInit {
    userData: any;
    userDocument: string = '';
    userName: string = '';
    userInformation: FormGroup = new FormGroup({});
    isEditing = false;

    constructor(
        private usersService: UsersService,
        private formBuilder: FormBuilder
    ) {
        this.userInformation = this.formBuilder.group({
            firstName: [{value: '', disabled: true}, Validators.required],
            lastName: [{value: '', disabled: true}, Validators.required],
            document: [{value: '', disabled: true},[Validators.pattern(/^\d+$/), Validators.required ] ],
            phoneNumber: [{value: '', disabled: true}, [ Validators.pattern(/^\d{10}$/), Validators.required]],
            email: [{value: '', disabled: true}, [Validators.required, Validators.email]]
        });

        if (typeof window !== 'undefined') {
            const user = JSON.parse(localStorage.getItem('user') as string);
            if (user) {
                this.userDocument = user.document;
                this.userName = user.username;
                this.usersService.getUser(this.userDocument).subscribe({
                    next: (data) => {
                        this.userData = data;
                        this.userInformation.patchValue({
                            firstName: this.userData.first_name,
                            lastName: this.userData.last_name,
                            document: this.userData.document,
                            phoneNumber: this.userData.cellphone,
                            email: this.userData.email
                        });
                    },
                    error: (error) => {
                        console.error('Error:', error);
                    }
                });
            }
        }
    }

   ngOnInit() {
    
   }
   submitForm() {
        if (this.userInformation.valid) {
            console.log(this.userInformation.value);
            const userData={
                first_name: this.userInformation.value.firstName,
                last_name: this.userInformation.value.lastName,
                document: this.userInformation.value.document,
                cellphone: this.userInformation.value.phoneNumber,
                email: this.userInformation.value.email
            }
            this.usersService.updateUser(this.userDocument, userData).subscribe({
                next: (data) => {
                    Swal.fire({
                        title: 'Actualizado',
                        text: 'Usuario actualizado',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                },
                error: (error) => {
                    Swal.fire({
                        title: 'Error',
                        text: 'Error al actualizar el usuario',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    }).then((result) => {
                        if(result.isConfirmed){
                            location.reload();
                        }
                    });
                }
            });
        }
    }
   
    toggleEdit() {
        this.isEditing = !this.isEditing;
        if (this.isEditing) {
            this.userInformation.enable();
        } else {
            this.submitForm();
            this.userInformation.disable();
        }
    }
}