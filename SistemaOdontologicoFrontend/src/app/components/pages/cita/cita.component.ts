import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { DetalleCita } from '../../../interfaces/detalle-cita';
import { Paciente } from '../../../interfaces/paciente';
import { Odontologo } from '../../../interfaces/odontologo';
import { Cita } from '../../../interfaces/cita';
import { Reporte } from '../../../interfaces/reporte';
import { Servicio } from '../../../interfaces/servicio';
import { MatPaginator } from '@angular/material/paginator';
import { PacienteService } from '../../../servicios/paciente.service';
import { ServiciosService } from '../../../servicios/servicios.service';
import { OdontologoService } from '../../../servicios/odontologo.service';
import { ModalEditarCitaComponent } from '../modales/modal-editar-cita/modal-editar-cita.component';
import { CitaService } from '../../../servicios/cita.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalCitaComponent } from '../modales/modal-cita/modal-cita.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from 'moment';
import { ModalVerCitaComponent } from 'src/app/components/pages/modales/modal-ver-cita/modal-ver-cita.component';
import { Directive, ElementRef, HostListener } from '@angular/core';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import Swal from 'sweetalert2';
export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
    dateTimeInput: 'DD/MM/YYYY HH:mm'
  },
};
@Component({
  selector: 'app-cita',
  templateUrl: './cita.component.html',
  styleUrls: ['./cita.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class CitaComponent implements OnInit {

  @ViewChild('autoOdontologo') autoOdontologo!: ElementRef<HTMLInputElement>;
  @ViewChild('autoOdontologoTrigger') autoOdontologoTrigger!: MatAutocompleteTrigger;
  openAutocompletePanel(): void {
    this.autoOdontologoTrigger.openPanel();
  }

  options3: Paciente[] = [];
  options2: Servicio[] = [];
  options: Odontologo[] = [];
  ELEMENT_DATA: DetalleCita[] = [
  ];
  deshabilitado: boolean = false;
  filteredPacientes!: Paciente[];
  filteredServicios!: Servicio[];
  filteredOdontologo!: Odontologo[];
  agregarPaciente!: Paciente;
  agregarCita!: DetalleCita;
  agregarCita1!: Cita;
  agregarServicio!: Servicio;
  agregarOdontologo!: Odontologo;
  fechaReserva: string = "";
  totalPagar: number = 0;
  formGroup: FormGroup;
  displayedColumns: string[] = ['numero', 'paciente', 'servicio', 'odontologo', 'fechaReserva', 'precio', 'acciones', 'accion'];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private _pacienteServicio: PacienteService,
    private _citaServicio: CitaService,
    private _odontologoServicio: OdontologoService,
    private _servicioServicio: ServiciosService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _CitaServicios: CitaService,

  ) {
    this.formGroup = this.fb.group({
      paciente: ['', Validators.required],
      servicio: ['', Validators.required],
      odontologo: ['', Validators.required],
      fechaReserva: ['', Validators.required],
      descripcionPaciente: ['', Validators.required]
    })

    this.formGroup.get('servicio')?.valueChanges.subscribe(value => {
      this.filteredServicios = this._filterServicio(value)
    })

    this.formGroup.get('odontologo')?.valueChanges.subscribe(value => {
      this.filteredOdontologo = this._filterOdontologo(value)
    })
    this.formGroup.get('paciente')?.valueChanges.subscribe(value => {
      this.filteredPacientes = this._filterPacientes(value)
    })

    this._servicioServicio.obtenerServicio().subscribe({
      next: (data) => {
        if (data.status)
          this.options2 = data.value;
      },
      error: (e) => {
      },
      complete: () => {

      }
    })
    this._odontologoServicio.ObtenerOdontologo().subscribe({
      next: (data) => {
        if (data.status)
          this.options = data.value;
      },
      error: (e) => {
      },
      complete: () => {
      }
    })
    this._pacienteServicio.obtenerPaciente().subscribe({
      next: (data) => {
        if (data.status)
          this.options3 = data.value;
      },
      error: (e) => {
      },
      complete: () => {
      }
    })
  }

  private _filterPacientes(value1: any): Paciente[] {
    const filterValue = typeof value1 === "string" ? value1.toLowerCase() : value1.apellido.toLowerCase();
    return this.options3.filter(option => option.apellido.toLowerCase().includes(filterValue));
  }
  private _filterOdontologo(value: any): Odontologo[] {
    const filterValue = typeof value === "string" ? value.toLowerCase() : value.apellido.toLowerCase();
    return this.options.filter(options => options.apellido.toLowerCase().includes(filterValue));
  }
  private _filterServicio(value: any): Servicio[] {
    const filterValue = typeof value === "string" ? value.toLowerCase() : value.nombreServicio.toLowerCase();
    return this.options2.filter(option => option.nombreServicio.toLowerCase().includes(filterValue));
  }

  ngOnInit(): void {

    this._CitaServicios.obtenerCita().subscribe({
      next: (data) => {
        if (data.status) {

          this.dataSource.data = data.value;
        } else {
          this._snackBar.open("No se encontraron datos", 'Oops!', { duration: 2000 });
        }
      },
      error: (e) => { },
      complete: () => { }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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

  mostrarServicio() {
    this._servicioServicio.obtenerServicio().subscribe({
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

  displayPaciente(paciente: Paciente): string {
    if (paciente && paciente.apellido && paciente.nombre) {
      return paciente.apellido + " " + paciente.nombre;
    } else {
      return "";
    }
  }
  displayServicio(servicio: Servicio): string {
    return servicio.nombreServicio;
  }
  displayOdontologo(odontologo: Odontologo): string {
    // return odontologo.apellido ;
    if (odontologo && odontologo.apellido && odontologo.nombre) {
      return odontologo.apellido + " " + odontologo.nombre;
    } else {
      return "";
    }
  }
  pacienteSeleccionado(event: any) {
    this.agregarPaciente = event.option.value;
  }
  servicioSeleccionado(event: any) {
    this.agregarServicio = event.option.value;
  }
  odontologoSeleccionado(event: any) {
    this.agregarOdontologo = event.option.value;
  }

  verCita(cita: Reporte) {
    console.log(cita);
    this.dialog.open(ModalVerCitaComponent, {
      disableClose: true,
      data: { cita }
    }).afterClosed().subscribe(result => {
    });
  }

  registrarCita() {
    const _fechaReserva: any = moment(this.formGroup.value.fechaReserva, 'dd/mm/yyyy');
    const _cantidad: number = this.formGroup.value.cantidad;
    const _precio: number = parseFloat(this.agregarServicio.precio);
    const _total: number = _precio;
    this.totalPagar = this.totalPagar + _total;

    const nuevaCita: DetalleCita = {
      id: this.agregarCita == null ? 0 : this.agregarCita.id,
      pacienteid: this.agregarPaciente.id,
      odontologoid: this.agregarOdontologo.id,
      servicioid: this.agregarServicio.id,
      descripcionPaciente: this.agregarPaciente.nombre,
      descripcionOdontologo: this.agregarOdontologo.apellido,
      servicio: this.agregarServicio.nombreServicio,
      fechaReserva: _fechaReserva,
      precioTexto: this.agregarServicio.precio
    };
    this.ELEMENT_DATA = [nuevaCita]; // Agregar la nueva cita al inicio del arreglo
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    this.formGroup.patchValue({
      paciente: '',
      servicio: '',
      odontologo: '',
      fechaReserva: ''
    });
    if (this.ELEMENT_DATA.length > 0) {
      this.deshabilitado = true;
      const citaDTO: Cita = {
        id: this.agregarCita1 == null ? 0 : this.agregarCita1.id,
        totalTexto: String(this.totalPagar.toFixed(0)),
        DetalleCita: this.ELEMENT_DATA,
      };
      this._citaServicio.registrarCita(citaDTO).subscribe({
        next: (data) => {
          if (data.status) {
            this.dialog.open(ModalCitaComponent, {
              data: {
                numero: data.value.numeroDocumento
              },
            });
          } else {
            this._snackBar.open("No se pudo registrar la cita", "Oops", {
              horizontalPosition: "end",
              verticalPosition: "top",
              duration: 3000
            });
          }
        },
        error: (e) => { },
        complete: () => {
          this.deshabilitado = false;
          this._CitaServicios.obtenerCita().subscribe({
            next: (data) => {
              if (data.status) {
                this.dataSource.data = data.value;
              } else {
                this._snackBar.open("No se encontraron datos", 'Oops!', { duration: 2000 });
              }
            },
            error: (e) => { },
            complete: () => { }
          });
        }
      });
    }

  }

  mostrarAlerta(mensaje: string, tipo: string) {
    this._snackBar.open(mensaje, tipo, {
      horizontalPosition: "end",
      verticalPosition: "top",
      duration: 3000
    });
  }

  editarCita(cita: Cita) {
    console.log(cita);
    console.log('paciente:', cita.id);
    const dialogRef = this.dialog.open(ModalEditarCitaComponent, {
      disableClose: true,
      data: cita
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === "editado") {
        this._CitaServicios.obtenerCita().subscribe({
          next: (data) => {
            if (data.status) {
              this.dataSource.data = data.value;
            } else {
              this._snackBar.open("No se encontraron datos", 'Oops!', { duration: 2000 });
            }
          },
          error: (e) => { },
          complete: () => { }
        });
      }
    });
  }

  eliminarUsuario(reporte
    : Reporte) {
    Swal.fire({
      title: "Desea eliminar la cita",
      text: reporte.numeroDocumento,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      showCancelButton: true,
      cancelButtonColor: '#3085d6',
    }).then(result => {
      if (result.isConfirmed)
        this._citaServicio.eliminarCita(reporte.id).subscribe({
          next: (data) => {
            if (data.status) {
              this.mostrarAlerta("La cita fue eliminada", "Listo!")
              this._CitaServicios.obtenerCita().subscribe({
                next: (data) => {
                  if (data.status) {
                    this.dataSource.data = data.value;
                  } else {
                    this._snackBar.open("No se encontraron datos", 'Oops!', { duration: 2000 });
                  }
                },
                error: (e) => { },
                complete: () => { }
              });
            } else {
              this.mostrarAlerta("No se pudo eliminar el usuario", "Error");
            }
          },
          error: (e) => { }
        })
    })
  }
}