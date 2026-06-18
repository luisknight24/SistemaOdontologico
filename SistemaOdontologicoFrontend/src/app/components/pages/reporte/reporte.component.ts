import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { Reporte } from '../../../interfaces/reporte';
import { CitaService } from '../../../servicios/cita.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};
@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class ReporteComponent implements OnInit {
  formGroup: FormGroup;
  ELEMENT_DATA: Reporte[] = [
  ];
  displayedColumns: string[] = ['numero','fechaRegistro','odontologo','paciente','servicio','precio'];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(
    private fb: FormBuilder,
    private _CitaServicio: CitaService,
    private _snackBar: MatSnackBar,
  ) {
    this.formGroup = this.fb.group({
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required]
    })
  }
  ngOnInit(): void {
    this._CitaServicio.obtenerCita().subscribe({
      next: (data) => {
        if (data.status) {
          this.ELEMENT_DATA = data.value;
          this.dataSource.data = data.value;
        } else {
          this.ELEMENT_DATA = [];
          this.dataSource.data = [];
        }
      },
      error: (e) => {},
      complete: () => {}
    });
  }

  createPdf(){
    const _fechaInicio: any = moment(this.formGroup.value.fechaInicio).format('DD/MM/YYYY');
    const _fechaFin: any = moment(this.formGroup.value.fechaFin).format('DD/MM/YYYY');
    const docDefinition = {
      content: [
        { text: 'Reporte', style: 'header' },
        { text: 'Fecha de inicio: ' + _fechaInicio, style: 'subheader' },
        { text: 'Fecha de fin: ' + _fechaFin, style: 'subheader' },
        '\n',
        {
          table: {
            headerRows: 1,
            widths: ['auto','auto','auto','auto','auto','auto'],
            body: [
              [ 'Codigo','Paciente','Odontologo','Servicio','Precio','Fecha de Reserva'],
             ...this.ELEMENT_DATA.map(row => [ row.numeroDocumento,row.paciente,row.odontologo,row.servicio,row.precio,row.fechaReserva])
            ]
          }
        }
      ],
    };

    pdfMake.createPdf(docDefinition).open();
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  FiltrarCitaFecha() {
    const _fechaInicio: any = moment(this.formGroup.value.fechaInicio).format('DD/MM/YYYY')
    const _fechaFin: any = moment(this.formGroup.value.fechaFin).format('DD/MM/YYYY')
    if (_fechaInicio === "Invalid date" || _fechaFin === "Invalid date") {
      this._snackBar.open("Debe ingresar ambas fechas", 'Oops!', { duration: 2000 });
      this._CitaServicio.obtenerCita().subscribe({
        next: (data) => {
          if (data.status) {
            this.ELEMENT_DATA = data.value;
            this.dataSource.data = data.value;
          } else {
            this.ELEMENT_DATA = [];
            this.dataSource.data = [];
          }
        },
        error: (e) => {},
        complete: () => {}
      });
      return;
    }

    this._CitaServicio.reporteCita(
      _fechaInicio,
      _fechaFin,
    ).subscribe({
      next: (data) => {
        if (data.status) {
          this.ELEMENT_DATA = data.value;
          this.dataSource.data = data.value;
        }
        else {
          this.ELEMENT_DATA = [];
          this.dataSource.data = [];
          this._snackBar.open("No se encontraron datos", 'Oops!', { duration: 2000 });
        } 
      },
      error: (e) => {
      },
      complete: () => {
      }
    })
  }
 
}