import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Paciente } from '../../../../interfaces/paciente';
import { PacienteService } from '../../../../servicios/paciente.service';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-modal-paciente',
  templateUrl: './modal-paciente.component.html',
  styleUrls: ['./modal-paciente.component.css']
})
export class ModalPacienteComponent implements OnInit {
  formPaciente: FormGroup;
  accion: string = "Agregar"
  accionBoton: string = "Guardar";
  genero: string[] = ['Masculino', 'Femenino'];
  constructor(
    private dialogoReferencia: MatDialogRef<ModalPacienteComponent>,
    @Inject(MAT_DIALOG_DATA) public pacienteEditar: Paciente,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _pacienteServices: PacienteService
  ) {
    this.formPaciente = this.fb.group({
      nombre: ['', Validators.required],
      edad: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', Validators.required],
      genero: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
    })
    if (this.pacienteEditar) {
      this.accion = "Editar";
      this.accionBoton = "Actualizar";
    }
  }
  ngOnInit(): void {
    if (this.pacienteEditar) {
      console.log(this.pacienteEditar)
      this.formPaciente.patchValue({
        nombre: this.pacienteEditar.nombre,
        apellido: this.pacienteEditar.apellido,
        edad: this.pacienteEditar.edad,
        genero: this.pacienteEditar.genero,
        direccion: this.pacienteEditar.direccion,
        telefono: this.pacienteEditar.telefono,
        email: this.pacienteEditar.email
      })
    }
  }
  agregarEditarPaciente() {
    const _paciente: Paciente = {
      id: this.pacienteEditar == null ? 0 : this.pacienteEditar.id,
      nombre: this.formPaciente.value.nombre,
      apellido: this.formPaciente.value.apellido,
      edad: this.formPaciente.value.edad,
      genero: this.formPaciente.value.genero,
      direccion: this.formPaciente.value.direccion,
      telefono: this.formPaciente.value.telefono,
      email: this.formPaciente.value.email
    }

    if (this.pacienteEditar) {
      this._pacienteServices.editarPaciente(_paciente).subscribe({
        next: (data) => {
          if (data.status) {
            this.mostrarAlerta("El paciente fue editado", "Exito");
            this.dialogoReferencia.close('editado')
          } else {
            this.mostrarAlerta("No se pudo editar el paciente", "Error");
          }
        },
        error: (e) => {
          console.log(e)
        },
        complete: () => {
        }
      })
    } else {
      this._pacienteServices.guardarPaciente(_paciente).subscribe({
        next: (data) => {
          if (data.status) {
            this.mostrarAlerta("El paciente fue registrado", "Exito");
            this.dialogoReferencia.close('agregado')
          } else {
            this.mostrarAlerta("No se pudo registrar el paciente", "Error");
          }
        },
        error: (e) => {
        },
        complete: () => {
        }
      })
    }
  }
  mostrarAlerta(mensaje: string, tipo: string) {
    this._snackBar.open(mensaje, tipo, {
      horizontalPosition: "end",
      verticalPosition: "top",
      duration: 3000
    });
  }
}
