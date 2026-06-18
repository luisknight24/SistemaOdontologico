
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Paciente } from '../../../../interfaces/paciente';
import { ResponseApi } from '../../../../interfaces/response-api';
import { PacienteService } from '../../../../servicios/paciente.service';

@Component({
  selector: 'app-modal-ver-paciente',
  templateUrl: './modal-ver-paciente.component.html',
  styleUrls: ['./modal-ver-paciente.component.css']
})
export class ModalVerPacienteComponent {
  id!: number;
  paciente!: Paciente;
  loading: boolean = false;

  constructor(
    private _PacienteService: PacienteService,
    public dialogRef: MatDialogRef<ModalVerPacienteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { paciente: Paciente }
  ) { }


  ngOnInit(): void {
    this.obtenerPaciente();
  }

  obtenerPaciente() {
    this.loading = true;
    const odontologoId = this.data.paciente.id; // Obtiene el ID del objeto odontologo de los datos
    this._PacienteService.obtenerPacienteId(odontologoId).subscribe(data => {
      this.paciente = data;
      this.loading = false;
    });
  }
}
