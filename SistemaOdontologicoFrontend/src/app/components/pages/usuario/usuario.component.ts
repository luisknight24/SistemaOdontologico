
import { Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioService } from '../../../servicios/usuario.service';
import { ModalUsuarioComponent } from '../modales/modal-usuario/modal-usuario.component';
import { Usuario } from '../../../interfaces/usuario';
import { ModalEliminarUsuarioComponent } from '../modales/modal-eliminar-usuario/modal-eliminar-usuario.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { ModalVerUsuarioComponent } from 'src/app/components/pages/modales/modal-ver-usuario/modal-ver-usuario.component';

import { Title } from 'chart.js';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent  implements OnInit, AfterViewInit{
  estadoFiltro: string = '';
  displayedColumns: string[] = ['idUsuario','nombreApellidos', 'correo', 'rolDescripcion','estado','acciones','acc', 'consultar'];
  ELEMENT_DATA: Usuario[]=[];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  isActivoChecked: boolean = true;
  isNoActivoChecked: boolean = false;
  radioButtonSeleccionado = 'Todos';
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _usuarioServicio: UsuarioService
  )
  { 
  }
  ngOnInit(): void {
    this.filtro = 'todos'; 
   
    this.mostrarUsuarios();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    
  }
  applyFilter(event: Event) {
    this.searchValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = this.searchValue;
  }

  searchValue: string = '';
  onSearchInput() {
    if (this.searchValue === '') {
      this.filtro = 'todos';
      this.applyFilterEstado();
    }
  }

  mostrarUsuarios() {
    this._usuarioServicio.ObtenerUsuarios().subscribe({
      next: (data) => {
        if(data.status)
          this.dataSource.data = data.value;
        else
          this._snackBar.open("No se encontraron datos", 'Oops!', { duration: 2000 });
      },
      error: (e) => {
      },
      complete: () => {
      }
    })
  }
  filtro: string = 'todos';

defaultFilterPredicate(data: Usuario, filter: string): boolean {
  const filterValue = filter.trim().toLowerCase();
  if (this.filtro === 'no activo') {
    return data.esActivo === 0 && (
      data.nombreApellidos.toLowerCase().includes(filterValue) ||
      data.rolDescripcion.toLowerCase().includes(filterValue) ||
      data.correo.toLowerCase().includes(filterValue) ||
      data.id.toFixed(2).includes(filterValue)
      
    );
  } else if(this.filtro === 'todos'){
    return (
      data.nombreApellidos.toLowerCase().includes(filterValue) ||
      data.rolDescripcion.toLowerCase().includes(filterValue) ||
      data.correo.toLowerCase().includes(filterValue) ||
      data.id.toFixed(2).includes(filterValue) 
    );
  }else if(this.filtro === 'activo' || ''){
    return (
      data.nombreApellidos.toLowerCase().includes(filterValue) ||
      data.rolDescripcion.toLowerCase().includes(filterValue) ||
      data.correo.toLowerCase().includes(filterValue) ||
      data.id.toFixed(2).includes(filterValue)
    );
  }else{
    return (
      data.nombreApellidos.toLowerCase().includes(filterValue) ||
      data.rolDescripcion.toLowerCase().includes(filterValue) ||
      data.correo.toLowerCase().includes(filterValue) ||
      data.id.toFixed(2).includes(filterValue)
    );
  }
  return true;
}

applyFilterEstado() {
  switch (this.filtro) {
    case 'todos':
      this.dataSource.filterPredicate = this.defaultFilterPredicate;
      this.dataSource.filter = '';
      this.mostrarUsuarios();
      break;
    case 'no activo':
      this.dataSource.filterPredicate = (data: Usuario, filter1: string) => {
        const filterValue = filter1.toLowerCase();
        return data.esActivo === 0;
      };
      this.dataSource.filter = 'no activo'; 
    this.dataSource.filterPredicate = this.defaultFilterPredicate;
      break;
    case 'activo':
      this.dataSource.filterPredicate = (data: Usuario, filter1: string) => {
        const filterValue = filter1.toLowerCase();
        return data.esActivo === 1;
      };
      this.dataSource.filter = 'activo';
      this.dataSource.filterPredicate = this.defaultFilterPredicate;
      break;
    default:
      this.dataSource.filter = '';
      this.dataSource.filterPredicate = this.defaultFilterPredicate;
      break;
  }
  if (this.filtro !== 'todos' && this.dataSource.filteredData.length === 0) {
    console.log('No existe usuario con el filtro seleccionado.');
  }
}
  mostrarAlerta(mensaje:string,tipo:string) {
    this._snackBar.open(mensaje, tipo, {
      horizontalPosition: "end",
      verticalPosition: "top",
      duration:3000
    });
  }

  agregarUsuario() {
    this.dialog.open(ModalUsuarioComponent, {
        disableClose: true
      }).afterClosed().subscribe(result => {
        if (result === "agregado") {
          this.mostrarUsuarios();
        }
      });
  }

  editarUsuario(usuario: Usuario) {
    this.dialog.open(ModalUsuarioComponent, {
      disableClose: true,
      data: usuario
    }).afterClosed().subscribe(result => {
      if (result === "editado")
        this.filtro = 'todos'; 
         this.applyFilterEstado();
         this.searchValue = '';
    });
  }
  eliminarUsuario(usuario: Usuario) {
    this.dialog.open(ModalEliminarUsuarioComponent, {
      disableClose: true,
      data: usuario
    }).afterClosed().subscribe(result => {
      if (result === "eliminar") {
        this._usuarioServicio.EliminarUsuario(usuario.id).subscribe({
          next: (data) => {
            if (data.status) {
              this.mostrarAlerta("El usuario fue eliminado", "Listo!")
              this.mostrarUsuarios();
            } else {
              this.mostrarAlerta("No se pudo eliminar el usuario", "Error");
            }
          },
          error: (e) => {
          },
          complete: () => {
          }
        })
      }
    });
  }

  verUsuario(usuario: Usuario) {
    this.dialog.open(ModalVerUsuarioComponent, {
      disableClose: true,
      data: { usuario }
    }).afterClosed().subscribe(result => {
    });
  }


}