
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
//import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { UsuarioComponent } from 'src/app/components/pages/usuario/usuario.component';
import { Login } from 'src/app/interfaces/login';
import { RolNavegacionService } from 'src/app/servicios/rol-navegacion.service';

import { ModalUsuarioComponent } from 'src/app/components/pages/modales/modal-usuario/modal-usuario.component';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  formLogin: FormGroup;
  hidePassword: boolean = true;
  loading: boolean = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private _usuarioServicio: UsuarioService,

    private _rolNavegacion: RolNavegacionService
  ) {
    this.formLogin = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  ngOnInit(): void {
  }

  mostrarAlerta(mensaje: string, tipo: string) {
    this._snackBar.open(mensaje, tipo, {
      horizontalPosition: "end",
      verticalPosition: "top",
      duration: 3000
    });
  }
  agregarUsuario() {
    this.dialog.open(ModalUsuarioComponent, {
      disableClose: true
    }).afterClosed().subscribe(result => {

      if (result === "agregado") {
        //this.agregarUsuario();
      }
    });

  }

  mostrarUsuarios() {
    this._usuarioServicio.ObtenerUsuarios();
  }

  onLogin() {
    this.loading = true;
    const request: Login = {

      correo: this.formLogin.value.email,
      clave: this.formLogin.value.password
    }
    this._usuarioServicio.ObtenerIniciarSesion(request).subscribe({
      next: (data) => {

        if (data.status) {
          this._rolNavegacion.guardarSesionUsuario(data.value);
          this.router.navigate(['pages'])
        } else {
          this._snackBar.open("No se encontraron coincidencias", 'Oops!', { duration: 3000 });
        }

      },
      error: (e) => {
        this._snackBar.open("hubo un error", 'Oops!', { duration: 3000 });
      },
      complete: () => {
        this.loading = false;
      }
    })

  }
}
