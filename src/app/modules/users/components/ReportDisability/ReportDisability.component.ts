import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EntityService } from '../infoEntities/entities.service';
import { ReportDisabilityService } from './ReportDisability.service';
import Swal from 'sweetalert2';
import { UploadPdfService } from './upload-pdf.service';

export interface ReportDisabilityData {
  start_date: string;
  expiration_date: string;
  report_status: string;
  disability_type: string;
  document: string;
  rejection_type?: string;
  rejection_reason?: string;
  name_entity?: string;
}
@Component({
  selector: 'app-ReportDisability',
  templateUrl: './ReportDisability.component.html',
  styleUrls: ['./ReportDisability.component.scss']
})
export class ReportDisabilityComponent {
  entities: any[] = [];
  registerdisability: FormGroup;
  selectedType: string = '';
  public userDocument: string = '';



  constructor(
    private formBuilder: FormBuilder,
    private entityService: EntityService,
    private reportDisabilityService: ReportDisabilityService,
    private uploadPdfService: UploadPdfService

  ) {
    this.registerdisability = this.formBuilder.group({
      Tipoincapacidad: [null, Validators.required],
      NombreEntidad: ['', Validators.required],
      FechaExpedicion: ['', Validators.required],
      FechaVencimiento: ['', Validators.required],
      certificadoIncapacidad: [null],
      epicrisisSoporte: [null],
      FURIPS: [null],
      certificadoNacidoVivo: [null],
      registroCivil: [null],
      docIdentidadMadre: [null]
    }, { validator: this.dateLessThan('FechaExpedicion', 'FechaVencimiento') });
   
  }
   
  dateLessThan(from: string, to: string) {
    return (group: FormGroup): {[key: string]: any} => {
      let f = group.controls[from];
      let t = group.controls[to];
      if (f.value > t.value) {
        return {
          dates: "La fecha de vencimiento no puede ser menor que la fecha de inicio"
        };
      }
      return {};
    }
  }

  ngOnInit() {
    this.entityService.getEntities().subscribe(data => {
      this.entities = data;
    });
  }
  onTypeChange(event: any) {
    this.selectedType = event.target.value;

    const pdfFields = {
      'Enfermedad general': ['certificadoIncapacidad', 'epicrisisSoporte'],
      'Accidente de tránsito': ['certificadoIncapacidad', 'epicrisisSoporte', 'FURIPS'],
      'Accidente laboral': ['certificadoIncapacidad', 'epicrisisSoporte'],
      'Licencia de maternidad': ['certificadoIncapacidad', 'epicrisisSoporte', 'certificadoNacidoVivo', 'registroCivil', 'docIdentidadMadre'],
      'Licencia de paternidad': ['epicrisisSoporte', 'certificadoNacidoVivo', 'registroCivil', 'docIdentidadMadre']
    };

    const fieldsToValidate = pdfFields[this.selectedType as keyof typeof pdfFields];
    if (fieldsToValidate) {
      fieldsToValidate.forEach(field => {
        this.registerdisability.get(field)?.setValidators(Validators.required);
        this.registerdisability.get(field)?.updateValueAndValidity();
      });
    }
}

  submitForm() {

   if (this.isFormValid()) {
    const formValues = this.registerdisability.value;
    console.log('Formulario válido. Datos del formulario:', formValues);
    const user = JSON.parse(localStorage.getItem('user') as string);
    if (user) {
      this.userDocument = user.document;
    }
      const formData: ReportDisabilityData = {
          start_date: formValues.FechaExpedicion,
          expiration_date: formValues.FechaVencimiento,
          report_status: 'Diligenciada',
          disability_type: formValues.Tipoincapacidad,
          document: this.userDocument,
          name_entity: formValues.NombreEntidad
      };
      this.reportDisabilityService.postReportDisability(formData).subscribe({
        next: (response: any) => {
          this.uploadPDFs(response.data.id, formValues.Tipoincapacidad);
          Swal.fire({
            title: 'Incapacidad registrada',
            text: 'La incapacidad ha sido registrada con éxito',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result.isConfirmed) {
              location.reload();
            }
          });        },
        error: (error: any) => {
          Swal.fire('Error', 'Hubo un error al registrar la incapacidad: ' + error.error.detailed, 'error');
        }
      });
    }else {
      this.registerdisability.markAllAsTouched();
        console.log('El formulario es inválido. Realiza las validaciones necesarias.');
    }
  }

  isFormValid() {
    const fieldsToValidate = ['Tipoincapacidad', 'NombreEntidad', 'FechaExpedicion', 'FechaVencimiento'];
    return fieldsToValidate.every(field => this.registerdisability.get(field)?.valid);
  }

  onFileChange(event: any, field: string) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.registerdisability.get(field)?.setValue(file);
    }
  }
  uploadPDFs(reportDisabilityId: number, disabilityType: string) {
    const pdfFields = {
      'Enfermedad general': ['certificadoIncapacidad', 'epicrisisSoporte'],
      'Accidente de tránsito': ['certificadoIncapacidad', 'epicrisisSoporte', 'FURIPS'],
      'Accidente laboral': ['certificadoIncapacidad', 'epicrisisSoporte'],
      'Licencia de maternidad': ['certificadoIncapacidad', 'epicrisisSoporte', 'certificadoNacidoVivo', 'registroCivil', 'docIdentidadMadre'],
      'Licencia de paternidad': ['epicrisisSoporte', 'certificadoNacidoVivo', 'registroCivil', 'docIdentidadMadre']
    };

    const fieldsToUpload = pdfFields[disabilityType as keyof typeof pdfFields];
    if (fieldsToUpload) {
      fieldsToUpload.forEach(field => {
        const file: File = this.registerdisability.get(field)?.value;
        if (file) {
          const formData = new FormData();
          formData.append('name', field); // Add the 'name' field to the formData
          formData.append('pdf_file', file, file.name);
          this.uploadPdfService.uploadPDF(reportDisabilityId, field, formData).subscribe({
            next: (uploadResponse: any) => {
              console.log(`PDF ${field} subido con éxito. Respuesta del servidor:`, uploadResponse);
            },
            error: (uploadError: any) => {
              Swal.fire('Error', `Hubo un error al subir el PDF ${field}: ` + uploadError.error.detailed, 'error');
            }
          });
        }
      });
    }
  }
}
