import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ModalServicioComponent } from '../modales/modal-servicio/modal-servicio.component';
import { ModalEliminarServicioComponent } from '../modales/modal-eliminar-servicio/modal-eliminar-servicio.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Servicio } from '../../../interfaces/servicio';
import { ServiciosService } from '../../../servicios/servicios.service';
import { ModalVerServicioComponent } from 'src/app/components/pages/modales/modal-ver-servicio/modal-ver-servicio.component';

@Component({
  selector: 'app-servicio',
  templateUrl: './servicio.component.html',
  styleUrls: ['./servicio.component.css']
})
export class ServicioComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['idServicio', 'nombre', 'precio', 'editar', 'eliminar', 'consultar'];
  ELEMENT_DATA: Servicio[] = [];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _Servicio: ServiciosService
  ) {
  }

  ngOnInit(): void {
    this.mostrarServicio();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  searchValue: string = '';
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  mostrarServicio() {
    this._Servicio.obtenerServicio().subscribe({
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
  mostrarAlerta(mensaje: string, tipo: string) {
    this._snackBar.open(mensaje, tipo, {
      horizontalPosition: "end",
      verticalPosition: "top",
      duration: 3000
    });
  }

  agregarServicio() {
    this.dialog.open(ModalServicioComponent, {
      disableClose: true
    }).afterClosed().subscribe(result => {
      if (result === "agregado") {
        this.mostrarServicio();
      }
    });
  }

  verServicio(servicio: Servicio) {
    this.dialog.open(ModalVerServicioComponent, {
      disableClose: true,
      data: { servicio }  // Pasa el objeto odontologo como parte de un objeto con una propiedad llamada "odontologo"
    }).afterClosed().subscribe(result => {
      // Puedes realizar alguna acción después de cerrar el modal de ver
    });
  }

  editarServicio(servicio: Servicio) {
    this.dialog.open(ModalServicioComponent, {
      disableClose: true,
      data: servicio
    }).afterClosed().subscribe(result => {
      if (result === "editado")
        this.mostrarServicio();
      this.searchValue = '';
      this.dataSource.filter = '';
    });
  }

  eliminarServicio(servicio: Servicio) {
    this.dialog.open(ModalEliminarServicioComponent, {
      disableClose: true,
      data: servicio
    }).afterClosed().subscribe(result => {
      if (result === "eliminar") {
        this._Servicio.eliminarServicio(servicio.id).subscribe({
          next: (data) => {
            if (data.status) {
              this.mostrarAlerta("El servicio fue eliminado", "Listo!")
              this.mostrarServicio();
            } else {
              this.mostrarAlerta("No se pudo eliminar el servicio", "Error");
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
}