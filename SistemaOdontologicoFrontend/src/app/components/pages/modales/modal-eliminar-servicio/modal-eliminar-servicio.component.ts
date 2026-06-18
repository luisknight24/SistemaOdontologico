import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Servicio } from '../../../../interfaces/servicio';

@Component({
  selector: 'app-modal-eliminar-servicio',
  templateUrl: './modal-eliminar-servicio.component.html',
  styleUrls: ['./modal-eliminar-servicio.component.css']
})
export class ModalEliminarServicioComponent {

  constructor(
    private dialogoReferencia: MatDialogRef<ModalEliminarServicioComponent>,
    @Inject(MAT_DIALOG_DATA) public servicioEliminar: Servicio
  ) {

  }

  ngOnInit(): void {
  }

  eliminarServicio() {
    if (this.servicioEliminar) {
      this.dialogoReferencia.close('eliminar')
    }
  }
}
