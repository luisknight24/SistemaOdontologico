import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ModalPacienteComponent } from '../modales/modal-paciente/modal-paciente.component';
import { ModalEliminarPacienteComponent } from '../modales/modal-eliminar-paciente/modal-eliminar-paciente.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Paciente } from '../../../interfaces/paciente';
import { ModalVerPacienteComponent } from 'src/app/components/pages/modales/modal-ver-paciente/modal-ver-paciente.component';
import { PacienteService } from '../../../servicios/paciente.service';
const ELEMENT_DATA: Paciente[] = [
  {
    id: 1,
    nombre: "Anderson",
    apellido: "Jordan",
    edad: 2,
    genero: "Masculino",
    direccion: "Playas de villl¿ami",
    telefono: "12234242",
    email: "andjor3sdfsfsfsdfsfsf",

  }

];
@Component({
  selector: 'app-paciente',
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.css']
})
export class PacienteComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['idPaciente', 'nombre', 'apellido', 'edad', 'genero', 'direccion', 'telefono', 'email', 'acciones', 'acc', 'consultar'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _pacienteServicio: PacienteService
  ) {

  }

  ngOnInit(): void {
    this.mostrarPaciente();
    this.filtro = 'todos';
    this.applyFilterGenero();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  mostrarPaciente() {
    this._pacienteServicio.obtenerPaciente().subscribe({
      next: (data) => {
        if (data.status)
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

  agregarPaciente() {
    this.dialog.open(ModalPacienteComponent, {
      disableClose: true
    }).afterClosed().subscribe(result => {
      if (result === "agregado") {
        this.mostrarPaciente();
      }
    });
  }

  editarPaciente(paciente: Paciente) {
    this.dialog.open(ModalPacienteComponent, {
      disableClose: true,
      data: paciente
    }).afterClosed().subscribe(result => {
      if (result === "editado")
        this.filtro = 'todos';
      this.applyFilterGenero();
      this.searchValue = '';
    });
  }

  verPaciente(paciente: Paciente) {
    this.dialog.open(ModalVerPacienteComponent, {
      disableClose: true,
      data: { paciente }  
    }).afterClosed().subscribe(result => {
    });
  }


  eliminarPaciente(paciente: Paciente) {
    this.dialog.open(ModalEliminarPacienteComponent, {
      disableClose: true,
      data: paciente
    }).afterClosed().subscribe(result => {

      if (result === "eliminar") {

        this._pacienteServicio.eliminarPaciente(paciente.id).subscribe({
          next: (data) => {
            if (data.status) {
              this.mostrarAlerta("El paciente fue eliminado", "Listo!")
              this.mostrarPaciente();
            } else {
              this.mostrarAlerta("No se pudo eliminar el paciente", "Error");
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

  mostrarAlerta(mensaje: string, tipo: string) {
    this._snackBar.open(mensaje, tipo, {
      horizontalPosition: "end",
      verticalPosition: "top",
      duration: 3000
    });
  }
  searchValue: string = '';
  onSearchInput() {
    if (this.searchValue === '') {
      this.filtro = 'todos'; // Marcar automáticamente la opción "todos" en el filtro
      this.applyFilterGenero();
    }
  }

  filtro: string = '';
  applyFilterGenero() {
    switch (this.filtro) {
      case 'todos':
        this.dataSource.filter = '';
        this.mostrarPaciente();
        break;
      case 'Masculino':
        this.dataSource.filter = 'Masculino';

        break;
      case 'Femenino':
        this.dataSource.filter = 'Femenino';
        break;
      default:
        this.dataSource.filter = '';
        break;
    }
  }
}
