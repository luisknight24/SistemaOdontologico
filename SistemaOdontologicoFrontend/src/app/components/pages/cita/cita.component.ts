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
import { RolNavegacionService } from '../../../servicios/rol-navegacion.service';
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
  minDate: Date = new Date();
  currentUser: any;
  isPaciente: boolean = false;
  formGroup: FormGroup;
  displayedColumns: string[] = ['numero', 'paciente', 'servicio', 'odontologo', 'fechaReserva', 'precio', 'estado', 'acciones', 'accion'];
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
    private _rolNavegacion: RolNavegacionService
  ) {
    this.currentUser = this._rolNavegacion.obtenerSession();
    if (this.currentUser && this.currentUser.rolDescripcion === 'Paciente') {
      this.isPaciente = true;
    }

    this.formGroup = this.fb.group({
      paciente: ['', Validators.required],
      servicio: ['', Validators.required],
      odontologo: [this.isPaciente ? 'Auto-asignado' : '', this.isPaciente ? [] : [Validators.required]],
      fechaReserva: ['', Validators.required]
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
        if (data.estado) {
          this.options2 = data.valor;
          this.filteredServicios = data.valor;
        }
      },
      error: (e) => {
      },
      complete: () => {

      }
    })
    this._odontologoServicio.ObtenerOdontologo().subscribe({
      next: (data) => {
        if (data.estado) {
          this.options = data.valor;
          this.filteredOdontologo = data.valor;
        }
      },
      error: (e) => {
      },
      complete: () => {
      }
    })
    this._pacienteServicio.obtenerPaciente().subscribe({
      next: (data) => {
        if (data.estado) {
          this.options3 = data.valor;
          this.filteredPacientes = data.valor;
          if (this.isPaciente) {
            const currentPaciente = this.options3.find(p => p.email && this.currentUser.correo && p.email.toLowerCase() === this.currentUser.correo.toLowerCase());
            if (currentPaciente) {
              this.agregarPaciente = currentPaciente;
              this.formGroup.patchValue({ paciente: currentPaciente });
              this.formGroup.get('paciente')?.disable();
            } else {
              // Auto-crear ficha clínica si la cuenta está activa en localStorage pero no en la base de datos (por reinicios)
              const nombres = this.currentUser.nombreApellidos ? this.currentUser.nombreApellidos.split(' ') : ['Paciente'];
              const nombre = nombres[0] || 'Paciente';
              const apellido = nombres.slice(1).join(' ') || 'Registrado';
              
              const nuevoPaciente: Paciente = {
                id: 0,
                nombre: nombre,
                apellido: apellido,
                email: this.currentUser.correo,
                edad: 0,
                genero: 'No especificado',
                direccion: 'No especificada',
                telefono: 'No especificado'
              };
              
              this._pacienteServicio.guardarPaciente(nuevoPaciente).subscribe({
                next: (res) => {
                  if (res.estado) {
                    this._pacienteServicio.obtenerPaciente().subscribe({
                      next: (newData) => {
                        if (newData.estado) {
                          this.options3 = newData.valor;
                          this.filteredPacientes = newData.valor;
                          const createdPaciente = this.options3.find(p => p.email && this.currentUser.correo && p.email.toLowerCase() === this.currentUser.correo.toLowerCase());
                          if (createdPaciente) {
                            this.agregarPaciente = createdPaciente;
                            this.formGroup.patchValue({ paciente: createdPaciente });
                            this.formGroup.get('paciente')?.disable();
                          }
                        }
                      }
                    });
                  }
                }
              });
            }
          }
        }
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
        if (data.estado) {
          this.setTableData(data.valor);
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

  private setTableData(citas: any[]) {
    if (this.isPaciente) {
      this.dataSource.data = citas.filter((cita: any) => 
        cita.pacienteEmail && this.currentUser.correo && cita.pacienteEmail.toLowerCase() === this.currentUser.correo.toLowerCase()
      );
    } else {
      this.dataSource.data = citas;
    }
  }

  mostrarOdontologo() {
    this._odontologoServicio.ObtenerOdontologo().subscribe({
      next: (data) => {
        if (data.estado)
          this.dataSource.data = data.valor;
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
        if (data.estado)
          this.dataSource.data = data.valor;
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
        if (data.estado)
          this.dataSource.data = data.valor;
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
    const selectedDate = moment(this.formGroup.value.fechaReserva);
    const today = moment().startOf('day');
    if (selectedDate.isBefore(today)) {
      this._snackBar.open("La fecha de la reservación no puede ser menor a la fecha actual.", "Entendido", {
        horizontalPosition: "end",
        verticalPosition: "top",
        duration: 5000
      });
      return;
    }

    const _fechaReserva: any = moment(this.formGroup.value.fechaReserva).format('DD/MM/YYYY');
    const _precio: number = parseFloat(this.agregarServicio.precio);
    const _total: number = _precio;

    const nuevaCita: DetalleCita = {
      id: this.agregarCita == null ? 0 : this.agregarCita.id,
      pacienteid: this.agregarPaciente.id,
      odontologoid: this.isPaciente ? (this.options.length > 0 ? this.options[0].id : 0) : this.agregarOdontologo.id,
      servicioid: this.agregarServicio.id,
      descripcionPaciente: this.agregarPaciente.nombre,
      descripcionOdontologo: this.isPaciente ? (this.options.length > 0 ? this.options[0].apellido : 'Pendiente') : this.agregarOdontologo.apellido,
      servicio: this.agregarServicio.nombreServicio,
      fechaReserva: _fechaReserva,
      precioTexto: this.agregarServicio.precio
    };

    const tempTotalPagar = this.totalPagar + _total;
    const tempElementData = [nuevaCita];

    this.deshabilitado = true;

    const citaDTO: Cita = {
      id: this.agregarCita1 == null ? 0 : this.agregarCita1.id,
      totalTexto: String(tempTotalPagar.toFixed(0)),
      DetalleCita: tempElementData,
    };

    this._citaServicio.registrarCita(citaDTO).subscribe({
      next: (data) => {
        if (data.estado) {
          // Si el registro fue exitoso, actualizamos los datos locales y limpiamos el formulario
          this.totalPagar = tempTotalPagar;
          this.ELEMENT_DATA = tempElementData;
          this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);

          if (this.isPaciente) {
            this.formGroup.patchValue({
              paciente: this.agregarPaciente,
              servicio: '',
              odontologo: 'Auto-asignado',
              fechaReserva: ''
            });
          } else {
            this.formGroup.patchValue({
              paciente: '',
              servicio: '',
              odontologo: '',
              fechaReserva: ''
            });
          }

          this.dialog.open(ModalCitaComponent, {
            data: {
              numero: data.valor.numeroDocumento,
              isPaciente: this.isPaciente
            },
          });
        } else {
          // Si falló, mostramos el mensaje de error específico enviado por el servidor
          this._snackBar.open(data.mensaje || "No se pudo registrar la cita", "Oops", {
            horizontalPosition: "end",
            verticalPosition: "top",
            duration: 5000
          });
        }
      },
      error: (e) => {
        this._snackBar.open("Error al conectar con el servidor", "Oops", {
          horizontalPosition: "end",
          verticalPosition: "top",
          duration: 5000
        });
      },
      complete: () => {
        this.deshabilitado = false;
        this._CitaServicios.obtenerCita().subscribe({
          next: (data) => {
            if (data.estado) {
              this.setTableData(data.valor);
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
            if (data.estado) {
              this.setTableData(data.valor);
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
            if (data.estado) {
              this.mostrarAlerta("La cita fue eliminada", "Listo!")
               this._CitaServicios.obtenerCita().subscribe({
                 next: (data) => {
                   if (data.estado) {
                     this.setTableData(data.valor);
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