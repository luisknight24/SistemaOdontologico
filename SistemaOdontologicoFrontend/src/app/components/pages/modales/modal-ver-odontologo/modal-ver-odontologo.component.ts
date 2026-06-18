//import { Component } from '@angular/core';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Odontologo } from '../../../../interfaces/odontologo';
import { ResponseApi } from '../../../../interfaces/response-api';
import { OdontologoService} from '../../../../servicios/odontologo.service';

@Component({
  selector: 'app-modal-ver-odontologo',
  templateUrl: './modal-ver-odontologo.component.html',
  styleUrls: ['./modal-ver-odontologo.component.css']
})
export class ModalVerOdontologoComponent {
  id!: number;
  odontologo!: Odontologo;

  loading: boolean = false;

  constructor(
    private _odontologoService: OdontologoService,
    public dialogRef: MatDialogRef<ModalVerOdontologoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { odontologo: Odontologo }
  ) {}

  ngOnInit(): void {
    this.obtenerOdontologo();
  }

  obtenerOdontologo() {
    this.loading = true;
    const odontologoId = this.data.odontologo.id; // Obtiene el ID del objeto odontologo de los datos
    this._odontologoService.ObtenerOdontologoId(odontologoId).subscribe(data => {
      this.odontologo = data;
      this.loading = false;
    });
  }
}
