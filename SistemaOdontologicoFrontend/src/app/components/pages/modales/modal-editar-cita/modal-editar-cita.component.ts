import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DetalleCita } from 'src/app/interfaces/detalle-cita';
import { Reporte } from 'src/app/interfaces/reporte';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { CitaService } from 'src/app/servicios/cita.service';
import { Odontologo } from 'src/app/interfaces/odontologo';
import { Paciente } from 'src/app/interfaces/paciente';
import { Servicio } from 'src/app/interfaces/servicio';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { Cita } from 'src/app/interfaces/cita';
import { PacienteService } from 'src/app/servicios/paciente.service';
import { ServiciosService } from 'src/app/servicios/servicios.service';;
import { OdontologoService } from 'src/app/servicios/odontologo.service';;
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
  selector: 'app-modal-editar-cita',
  templateUrl: './modal-editar-cita.component.html',
  styleUrls: ['./modal-editar-cita.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class ModalEditarCitaComponent implements OnInit {
  filteredPacientes!: Paciente[];
  filteredServicios!: Servicio[];
  filteredOdontologo!: Odontologo[];
  options3: Paciente[] = [];
  options2: Servicio[] = [];
  options: Odontologo[] = [];
  formCita: FormGroup;
  citaEditar!: Reporte;
  cita1!: Cita;
  agregarCita1!: DetalleCita;
  agregarPaciente!: Paciente;
  agregarCita!: DetalleCita;
  agregarServicio!: Servicio;
  agregarOdontologo!: Odontologo;
  fechaReserva: string = "";
  totalPagar: number = 0;
  ELEMENT_DATA: DetalleCita[] = [
  ];
  cita: DetalleCita | null = null;
  constructor(
    private dialogoReferencia: MatDialogRef<ModalEditarCitaComponent>,
    @Inject(MAT_DIALOG_DATA) public cita12: Reporte,
    private fb: FormBuilder,
    private _CitaServicio: CitaService,
    private _odontologoServicio: OdontologoService,
    private _pacienteServicio: PacienteService,
    private _servicioServicio: ServiciosService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {
    this.formCita = this.fb.group({
      paciente: ['', Validators.required],
      odontologo: ['', Validators.required],
      servicio: ['', Validators.required],
      fechaRegistro: ['', Validators.required],
      fechaReserva: ['', Validators.required]
    });
    this.formCita.get('servicio')?.valueChanges.subscribe(value => {
      this.filteredServicios = this._filterServicio(value)
    })

    this.formCita.get('odontologo')?.valueChanges.subscribe(value => {
      this.filteredOdontologo = this._filterOdontologo(value)
    })
    this.formCita.get('paciente')?.valueChanges.subscribe(value => {
      this.filteredPacientes = this._filterPaciente(value)
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

  private _filterPaciente(value1: any): Paciente[] {
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
    this.citaEditar = { ...this.cita12 };
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

  editarCita() {
    const _fechaReserva: any = moment(this.formCita.value.fechaReserva, 'dd/mm/yyyy');
    const _cantidad: number = this.formCita.value.cantidad;
    const _precio: number = this.agregarServicio ? parseFloat(this.agregarServicio.precio) : 0;
    const _total: number = _precio;
    this.totalPagar = this.totalPagar + _total;
    const nuevaCita: DetalleCita = {
      id: this.cita12 == null ? 0 : this.cita12.id,
      pacienteid: this.agregarPaciente.id,
      odontologoid: this.agregarOdontologo.id,
      servicioid: this.agregarServicio.id,
      descripcionPaciente: this.agregarPaciente.nombre,
      descripcionOdontologo: this.agregarOdontologo.apellido,
      servicio: this.agregarServicio.nombreServicio,
      fechaReserva: _fechaReserva,
      precioTexto: this.agregarServicio.precio,
    };
    this.ELEMENT_DATA = [nuevaCita];

    if (this.ELEMENT_DATA.length > 0) {

      const citaDTO: Cita = {
        id: this.cita12 == null ? 0 : this.cita12.id,
        totalTexto: String(this.totalPagar.toFixed(0)),
        DetalleCita: this.ELEMENT_DATA,
      };
      this._CitaServicio.editarCita(citaDTO).subscribe({
        next: (data) => {
          if (data.status) {
            this.mostrarAlerta("La Cita fue editada", "Exito");
            this.dialogoReferencia.close('editado')
          } else {
            this.mostrarAlertaError("No se pudo editar la cita", "Error", "Error específico: la cita no se pudo editar debido a ...");
          }
        },
        error: (e) => { },
        complete: () => {
          this._CitaServicio.obtenerCita().subscribe({
            next: (data) => {
              if (data.status) {

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

  mostrarAlertaError(mensaje: string, tipo: string, mensajeError?: string) {
    if (tipo === "Error" && mensajeError) {
      console.error(mensajeError);
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
