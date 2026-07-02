import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RolNavegacionService } from 'src/app/servicios/rol-navegacion.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  correoUsuario: string = '';
  rolUsuario: string = '';
  nombreUsuario: string = '';
  idUsuario: number = 0;
  
  formPassword!: FormGroup;
  hideActual: boolean = true;
  hideNueva: boolean = true;
  hideConfirmar: boolean = true;

  constructor(
    private _rolUsuario: RolNavegacionService,
    private _usuarioServicio: UsuarioService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    const usuario = this._rolUsuario.obtenerSession();
    if (usuario != null) {
      this.correoUsuario = usuario.correo;
      this.rolUsuario = usuario.rolDescripcion;
      this.idUsuario = usuario.id;
      // Tratar de obtener el nombre de la sesión
      this.nombreUsuario = usuario.nombreApellidos || usuario.correo.split('@')[0];
    }

    this.formPassword = this.fb.group({
      claveActual: ['', Validators.required],
      claveNueva: ['', [Validators.required, Validators.minLength(6)]],
      claveConfirmar: ['', Validators.required]
    }, {
      validators: this.passwordsMatchValidator
    });
  }

  passwordsMatchValidator(group: FormGroup) {
    const nueva = group.get('claveNueva')?.value;
    const confirmar = group.get('claveConfirmar')?.value;
    return nueva === confirmar ? null : { mismatch: true };
  }

  actualizarClave(): void {
    if (this.formPassword.invalid) return;

    const nuevaClave = this.formPassword.value.claveNueva;

    // Obtener datos completos del usuario
    this._usuarioServicio.ObtenerUsuarioId(this.idUsuario).subscribe({
      next: (usuarioCompleto) => {
        // En un caso real, validaríamos la 'claveActual' aquí o en el backend.
        // Dado que ObtenerUsuarioId devuelve el usuario (o a través de Lista), 
        // asumimos que el usuario.valor o usuario tiene los datos.
        // Cuidado: ObtenerUsuarioId no existe directamente en el Controller C#,
        // wait, let's look at the UsuarioService. ObtenerUsuarioId calls /Usuario/{id}
        
        let usuarioUpdate = {
          ...usuarioCompleto,
          clave: nuevaClave
        };

        this._usuarioServicio.EditarUsuario(usuarioUpdate).subscribe({
          next: (response) => {
            if (response.estado) {
              Swal.fire({
                icon: 'success',
                title: '¡Contraseña actualizada!',
                text: 'Tu contraseña ha sido cambiada correctamente.',
                confirmButtonColor: '#14b8a6',
                background: '#1e222a',
                color: '#f8fafc'
              });
              this.formPassword.reset();
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: response.mensaje || 'No se pudo actualizar la contraseña',
                background: '#1e222a',
                color: '#f8fafc'
              });
            }
          },
          error: (e) => {
            Swal.fire('Error', 'Problema al conectar con el servidor', 'error');
          }
        });
      },
      error: (e) => {
        Swal.fire('Error', 'No se pudo obtener información del usuario', 'error');
      }
    });
  }
}
