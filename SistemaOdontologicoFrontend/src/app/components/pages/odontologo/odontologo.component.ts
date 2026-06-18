
import { Component, OnInit,AfterViewInit, ViewChild} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ModalOdontologoComponent } from '../modales/modal-odontologo/modal-odontologo.component';
import { ModalEliminarOdontologoComponent } from '../modales/modal-eliminar-odontologo/modal-eliminar-odontologo.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import {Odontologo } from '../../../interfaces/odontologo';
import { OdontologoService } from '../../../servicios/odontologo.service';
import { ModalVerOdontologoComponent } from 'src/app/components/pages/modales/modal-ver-odontologo/modal-ver-odontologo.component';
const ELEMENT_DATA: Odontologo[] = [
  {    
  id:1,
  nombre: "a",
  apellido: "b",
  experiencia: 12,
  especialidad: "ortodoncia",
  edad: 23,
  email: "ansmmdmk"
  }];
@Component({
  selector: 'app-odontologo',
  templateUrl: './odontologo.component.html',
  styleUrls: ['./odontologo.component.css']
})
export class OdontologoComponent {
  displayedColumns: string[] = ['idOdontologo','nombre', 'apellido', 'experiencia', 'especialidad','edad', 'email', 'acciones','acc','consultar'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  constructor(
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _odontologoServicio: OdontologoService
  ) {
  }
  ngOnInit(): void {
    this.mostrarOdontologo();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  searchValue: string = '';
  filtro: string = '';
  onSearchInput() {
    if (this.searchValue === '') {
      this.filtro = '';
    }
  }
  mostrarOdontologo() {
    this._odontologoServicio.ObtenerOdontologo().subscribe({
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
  agregarOdontologo() {
    this.dialog.open(ModalOdontologoComponent, {
      disableClose: true
    }).afterClosed().subscribe(result => {
      if (result === "agregado") {
        this.mostrarOdontologo();
      }
    });
  }
  editarOdontologo(odontologo: Odontologo) {   
    this.dialog.open(ModalOdontologoComponent, {
      disableClose: true,
      data: odontologo
    }).afterClosed().subscribe(result => {
      if (result === "editado")
        this.mostrarOdontologo();
        this.searchValue = '';
        this.dataSource.filter = '';
    });
  }
  eliminarOdontologo(odontologo: Odontologo) {
    this.dialog.open(ModalEliminarOdontologoComponent, {
      disableClose: true,
      data: odontologo
    }).afterClosed().subscribe(result => {
      if (result === "eliminar") {
        this._odontologoServicio.eliminarOdontologo(odontologo.id).subscribe({
          next: (data) => {
            if (data.status) {
              this.mostrarAlerta("El paciente fue eliminado", "Listo!")
              this.mostrarOdontologo();
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

  verOdontologo(odontologo: Odontologo) {
    this.dialog.open(ModalVerOdontologoComponent, {
      disableClose: true,
      data: { odontologo }
    }).afterClosed().subscribe(result => {
    });
  }

  mostrarAlerta(mensaje: string, tipo: string) {
    this._snackBar.open(mensaje, tipo, {
      horizontalPosition: "end",
      verticalPosition: "top",
      duration: 3000
    });
}
}