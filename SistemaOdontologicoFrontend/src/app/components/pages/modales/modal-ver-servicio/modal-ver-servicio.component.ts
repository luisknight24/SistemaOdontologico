import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Servicio } from '../../../../interfaces/servicio';
import { ResponseApi } from '../../../../interfaces/response-api';
import { ServiciosService } from '../../../../servicios/servicios.service';

@Component({
  selector: 'app-modal-ver-servicio',
  templateUrl: './modal-ver-servicio.component.html',
  styleUrls: ['./modal-ver-servicio.component.css']
})
export class ModalVerServicioComponent {

  id!: number;
  servicio!: Servicio;
  loading: boolean = false;
  constructor(
    private _servicioService: ServiciosService,
    public dialogRef: MatDialogRef<ModalVerServicioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { servicio: Servicio }
  ) { }

  ngOnInit(): void {
    this.obtenerServicio();
  }

  obtenerServicio() {
    this.loading = true;
    const servicioId = this.data.servicio.id; // Obtiene el ID del objeto odontologo de los datos
    this._servicioService.obtenerServicioId(servicioId).subscribe(data => {
      this.servicio = data;
      this.loading = false;
    });
  }
}
