import { Component, Inject, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Rol } from '../../../../interfaces/rol';
import { Usuario } from '../../../../interfaces/usuario';

import { UsuarioService} from '../../../../servicios/usuario.service';
import { RolService } from '../../../../servicios/rol.service';

@Component({
  selector: 'app-modal-usuario',
  templateUrl: './modal-usuario.component.html',
  styleUrls: ['./modal-usuario.component.css']
})
export class ModalUsuarioComponent implements OnInit, AfterViewInit {

  formUsuario: FormGroup;
  hide: boolean = true;
  accion:string ="Agregar"
  accionBoton: string = "Guardar";
  listaRoles: Rol[] = [];

  constructor(
    private dialogoReferencia: MatDialogRef<ModalUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public usuarioEditar: Usuario,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _rolServicio:  RolService,
    private _usuarioServicio: UsuarioService
  )
  {
    this.formUsuario = this.fb.group({
      nombreApellido: ['', Validators.required],
      correo: ['', Validators.required],
      id: ['', Validators.required],
      clave: ['', Validators.required],
      esActivo: ['1', Validators.required],
    })
    if (this.usuarioEditar!=null) {
      this.accion = "Editar";
      this.accionBoton = "Actualizar";
    }
    this._rolServicio.getRoles().subscribe({
      next: (data) => {
        if (data.status) {
          this.listaRoles = data.value;
        }
      },
      error: (e) => {
      },
      complete: () => {
      }
    })
  }
  ngOnInit(): void {
    if (this.usuarioEditar !=null) {
      this.formUsuario.patchValue({
        nombreApellido: this.usuarioEditar.nombreApellidos,
        correo: this.usuarioEditar.correo,
        id: this.usuarioEditar.rolId,
        clave:this.usuarioEditar.clave,
        esActivo: this.usuarioEditar.esActivo.toString()
      })
    }
  }

  ngAfterViewInit() {   
  }
  
  agregarEditarUsuario() {
    const _usuario: Usuario = {
      id: this.usuarioEditar == null ? 0 : this.usuarioEditar.id,
      nombreApellidos: this.formUsuario.value.nombreApellido,
      correo: this.formUsuario.value.correo,
      rolId: this.formUsuario.value.id,
      rolDescripcion : "",
      clave: this.formUsuario.value.clave,
      esActivo: parseInt(this.formUsuario.value.esActivo)
    }
    if (this.usuarioEditar==null) {
      this._usuarioServicio.GuardarUsuario(_usuario).subscribe({
        next: (data) => {
          if (data.status) {
            this.mostrarAlerta("El usuario fue registrado", "Exito");
            this.dialogoReferencia.close('agregado')
          } else {
            this.mostrarAlerta("No se pudo registrar el usuario", "Error");
          }
        },
        error: (e) => {
        },
        complete: () => {
        }
      })
    } else {
      this._usuarioServicio.EditarUsuario(_usuario).subscribe({
        next: (data) => {
          if (data.status) {
            this.mostrarAlerta("El usuario fue editado", "Exito");
            this.dialogoReferencia.close('editado')
          } else {
            this.mostrarAlerta("No se pudo editar el usuario", "Error");
          }
        },
        error: (e) => {
          console.log(e)
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