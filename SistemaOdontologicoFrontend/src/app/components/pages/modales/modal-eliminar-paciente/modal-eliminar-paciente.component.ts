import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Paciente } from '../../../../interfaces/paciente';

@Component({
  selector: 'app-modal-eliminar-paciente',
  templateUrl: './modal-eliminar-paciente.component.html',
  styleUrls: ['./modal-eliminar-paciente.component.css']
})
export class ModalEliminarPacienteComponent {
  constructor(
    private dialogoReferencia: MatDialogRef<ModalEliminarPacienteComponent>,
    @Inject(MAT_DIALOG_DATA) public PacienteEliminar: Paciente
  ) {

  }

  ngOnInit(): void {
  }

   eliminarPaciente() {
     if (this.PacienteEliminar) {
      this.dialogoReferencia.close('eliminar')
     }
  }
}
