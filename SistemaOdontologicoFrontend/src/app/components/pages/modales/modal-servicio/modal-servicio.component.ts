import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Servicio } from '../../../../interfaces/servicio';
import { ServiciosService } from '../../../../servicios/servicios.service';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-modal-servicio',
  templateUrl: './modal-servicio.component.html',
  styleUrls: ['./modal-servicio.component.css']
})
export class ModalServicioComponent {
  formServicio: FormGroup;
  accion: string = "Agregar"
  accionBoton: string = "Guardar";

  constructor(
    private dialogoReferencia: MatDialogRef<ModalServicioComponent>,
    @Inject(MAT_DIALOG_DATA) public servicioEditar: Servicio,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    //private _categoriaServicio: CategoriaService,
    private _servicioService: ServiciosService
  ) {
    this.formServicio = this.fb.group({
      nombreServicio: ['', Validators.required],
      precio: ['', Validators.required]
    })
    if (this.servicioEditar) {

      this.accion = "Editar";
      this.accionBoton = "Actualizar";
    }
  }
  ngOnInit(): void {
    if (this.servicioEditar) {
      console.log(this.servicioEditar)
      this.formServicio.patchValue({
        nombreServicio: this.servicioEditar.nombreServicio,
        precio: this.servicioEditar.precio
        //idCategoria: String(this.pacienteEditar.idCategoria),
      })
    }
  }

  agregarEditarServicio() {
    const _Servicio: Servicio = {
      id: this.servicioEditar == null ? 0 : this.servicioEditar.id,
      nombreServicio: this.formServicio.value.nombreServicio,
      precio: this.formServicio.value.precio,
    }
    if (this.servicioEditar) {
      this._servicioService.editarServicio(_Servicio).subscribe({
        next: (data) => {
          if (data.status) {
            this.mostrarAlerta("El servicio fue editado", "Exito");
            this.dialogoReferencia.close('editado')
          } else {
            this.mostrarAlerta("No se pudo editar el servicio", "Error");
          }
        },
        error: (e) => {
          console.log(e)
        },
        complete: () => {
        }
      })
    } else {

      this._servicioService.guardarServicio(_Servicio).subscribe({
        next: (data) => {
          if (data.status) {
            this.mostrarAlerta("El servicio fue registrado", "Exito");
            this.dialogoReferencia.close('agregado')
          } else {
            this.mostrarAlerta("No se pudo registrar el servicio", "Error");
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
