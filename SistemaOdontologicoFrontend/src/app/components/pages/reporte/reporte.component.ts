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
        if (data.estado) {
          this.ELEMENT_DATA = data.valor;
          this.dataSource.data = data.valor;
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

    // Calculate total if applicable
    const totalMonto = this.ELEMENT_DATA.reduce((acc, current) => {
      // Assuming precio is a string like "100.00" or similar
      const val = parseFloat(current.precio?.toString().replace(',', '.') || '0');
      return acc + (isNaN(val) ? 0 : val);
    }, 0);

    const docDefinition: any = {
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60],
      header: {
        text: 'SoftDental - Sistema de Reservaciones Odontológicas',
        margin: [40, 20, 40, 0],
        fontSize: 10,
        color: '#666666',
        alignment: 'right'
      },
      content: [
        { text: 'Reporte de Citas', style: 'header' },
        {
          columns: [
            { text: `Desde: ${_fechaInicio}`, style: 'subheader' },
            { text: `Hasta: ${_fechaFin}`, style: 'subheader', alignment: 'right' }
          ]
        },
        '\n',
        {
          table: {
            headerRows: 1,
            widths: ['auto', '*', '*', 'auto', 'auto', 'auto'],
            body: [
              [
                { text: 'CÓDIGO', style: 'tableHeader' },
                { text: 'PACIENTE', style: 'tableHeader' },
                { text: 'ODONTÓLOGO', style: 'tableHeader' },
                { text: 'SERVICIO', style: 'tableHeader' },
                { text: 'PRECIO', style: 'tableHeader' },
                { text: 'FECHA RESERVA', style: 'tableHeader' }
              ],
              ...this.ELEMENT_DATA.map(row => [
                { text: row.numeroDocumento, style: 'tableBody' },
                { text: row.paciente, style: 'tableBody' },
                { text: row.odontologo, style: 'tableBody' },
                { text: row.servicio, style: 'tableBody' },
                { text: `S/ ${row.precio}`, style: 'tableBody' },
                { text: row.fechaReserva, style: 'tableBody' }
              ])
            ]
          },
          layout: 'lightHorizontalLines'
        },
        '\n\n',
        {
          text: `Total Ingresos del Periodo: S/ ${totalMonto.toFixed(2)}`,
          style: 'totales'
        }
      ],
      styles: {
        header: {
          fontSize: 22,
          bold: true,
          color: '#157e8e',
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 12,
          color: '#555555',
          margin: [0, 5, 0, 5]
        },
        tableHeader: {
          bold: true,
          fontSize: 11,
          color: '#ffffff',
          fillColor: '#157e8e',
          alignment: 'center',
          margin: [0, 5, 0, 5]
        },
        tableBody: {
          fontSize: 10,
          margin: [0, 4, 0, 4]
        },
        totales: {
          fontSize: 14,
          bold: true,
          color: '#333333',
          alignment: 'right'
        }
      },
      defaultStyle: {
        font: 'Roboto'
      }
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
  onSubmitForm() {
    const _fechaInicio: any = moment(this.formGroup.value.fechaInicio).format('DD/MM/YYYY')
    const _fechaFin: any = moment(this.formGroup.value.fechaFin).format('DD/MM/YYYY')
    if (_fechaInicio === "Invalid date" || _fechaFin === "Invalid date") {
      this._snackBar.open("Debe ingresar ambas fechas", 'Oops!', { duration: 2000 });
      this._CitaServicio.obtenerCita().subscribe({
        next: (data) => {
          if (data.estado) {
            this.ELEMENT_DATA = data.valor;
            this.dataSource.data = data.valor;
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
        if (data.estado) {
          this.ELEMENT_DATA = data.valor;
          this.dataSource.data = data.valor;
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
  onSubmitForm1() {
    const _fechaInicio: any = moment(this.formGroup.value.fechaInicio, 'DD/MM/YYYY');
    const _fechaFin: any = moment(this.formGroup.value.fechaFin, 'DD/MM/YYYY');
    if (!_fechaInicio && !_fechaFin) {
    return;
  }
    if (!_fechaInicio.isValid() || !_fechaFin.isValid()) {
      this._snackBar.open("Debe ingresar ambas fechas", 'Oops!', { duration: 2000 });
      this.dataSource.data = this.ELEMENT_DATA;
      return;
    }
    const filteredData = this.ELEMENT_DATA.filter((item) => {
      const fechaReserva: any = moment(item.fechaReserva, 'DD/MM/YYYY');
      return fechaReserva.isBetween(_fechaInicio, _fechaFin, null, '[]');
    });
  
    if (filteredData.length > 0) {
      this.dataSource.data = filteredData;
    } else {
      this.dataSource.data = [];
      this._snackBar.open("No se encontraron datos", 'Oops!', { duration: 2000 });
    }
  }
}