//import { Component } from '@angular/core';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Cita } from '../../../../interfaces/cita';
import { Reporte } from '../../../../interfaces/reporte';
import { ResponseApi } from '../../../../interfaces/response-api';
import { CitaService} from '../../../../servicios/cita.service';

@Component({
  selector: 'app-modal-ver-cita',
  templateUrl: './modal-ver-cita.component.html',
  styleUrls: ['./modal-ver-cita.component.css']
})
export class ModalVerCitaComponent {
  id!: number;
  reporte!:  Reporte;
  loading: boolean = false;

  constructor(
    private _citaService: CitaService,
    public dialogRef: MatDialogRef<ModalVerCitaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { cita: Cita }
  ) {}

  ngOnInit(): void {
    this.obtenerCita();
  }

  obtenerCita() {
    this.loading = true;
    const citaId = 1; // Obtiene el ID del objeto odontologo de los datos
    this._citaService.obtenerCitaId(citaId).subscribe(data => {
      this.reporte = data;
      this.loading = false;
    });
  }
}
