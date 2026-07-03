import { Component, Inject, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Rol } from '../../../../interfaces/rol';
import { Usuario } from '../../../../interfaces/usuario';

import { UsuarioService} from '../../../../servicios/usuario.service';
import { RolService } from '../../../../servicios/rol.service';
import { ModalOtpComponent } from '../modal-otp/modal-otp.component';
import { MatDialog } from '@angular/material/dialog';

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
  isPublicRegistration: boolean = false;
  usuarioEditar: any = null;

  constructor(
    private dialogoReferencia: MatDialogRef<ModalUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public dataObj: any,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _rolServicio:  RolService,
    private _usuarioServicio: UsuarioService,
    private _dialog: MatDialog
  )
  {
    this.formUsuario = this.fb.group({
      nombreApellido: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      id: ['', Validators.required],
      clave: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/(?=.*[A-Z])/)]],
      esActivo: ['1', Validators.required],
    })
    if (this.dataObj && this.dataObj.isPublicRegistration) {
      this.isPublicRegistration = true;
      this.usuarioEditar = null;
    } else {
      this.isPublicRegistration = false;
      this.usuarioEditar = this.dataObj;
    }

    if (this.usuarioEditar != null) {
      this.accion = "Editar";
      this.accionBoton = "Actualizar";
    }
    this._rolServicio.getRoles().subscribe({
      next: (data) => {
        if (data.estado) {
          this.listaRoles = data.valor;
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
    
    if (this.isPublicRegistration) {
      this.formUsuario.get('id')?.clearValidators();
      this.formUsuario.get('id')?.updateValueAndValidity();
    }
  }

  ngAfterViewInit() {   
  }
  
  agregarEditarUsuario() {
    const _usuario: Usuario = {
      id: this.usuarioEditar == null ? 0 : this.usuarioEditar.id,
      nombreApellidos: this.formUsuario.value.nombreApellido,
      correo: this.formUsuario.value.correo,
      rolId: this.isPublicRegistration ? 3 : this.formUsuario.value.id, // 3 is usually Paciente, we'll verify
      rolDescripcion : "",
      clave: this.formUsuario.value.clave,
      esActivo: this.isPublicRegistration ? 0 : parseInt(this.formUsuario.value.esActivo)
    }
    if (this.usuarioEditar==null) {
      if (this.isPublicRegistration) {
        this._usuarioServicio.RegistroPendiente(_usuario).subscribe({
          next: (data) => {
            if (data.estado) {
              this.mostrarAlerta("Se ha enviado un código de verificación a su correo", "Exito");
              
              this._dialog.open(ModalOtpComponent, {
                disableClose: true,
                panelClass: 'force-dark-theme',
                data: { correo: this.formUsuario.value.correo }
              }).afterClosed().subscribe(result => {
                if (result === 'activado') {
                   this.dialogoReferencia.close('agregado');
                }
              });
            } else {
              const errorMsg = data.mensaje ? data.mensaje : "No se pudo registrar el usuario";
              this.mostrarAlerta(errorMsg, "Error");
            }
          },
          error: (e) => {
          },
          complete: () => {
          }
        });
      } else {
        this._usuarioServicio.GuardarUsuario(_usuario).subscribe({
          next: (data) => {
            if (data.estado) {
              this.mostrarAlerta("El usuario fue registrado", "Exito");
              this.dialogoReferencia.close('agregado');
            } else {
              const errorMsg = data.mensaje ? data.mensaje : "No se pudo registrar el usuario";
              this.mostrarAlerta(errorMsg, "Error");
            }
          },
          error: (e) => {
          },
          complete: () => {
          }
        });
      }
    } else {
      this._usuarioServicio.EditarUsuario(_usuario).subscribe({
        next: (data) => {
          if (data.estado) {
            this.mostrarAlerta("El usuario fue editado", "Exito");
            this.dialogoReferencia.close('editado')
          } else {
            const errorMsg = data.mensaje ? data.mensaje : "No se pudo editar el usuario";
            this.mostrarAlerta(errorMsg, "Error");
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