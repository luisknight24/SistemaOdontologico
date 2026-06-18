import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Odontologo } from '../../../../interfaces/odontologo';


@Component({
  selector: 'app-modal-eliminar-odontologo',
  templateUrl: './modal-eliminar-odontologo.component.html',
  styleUrls: ['./modal-eliminar-odontologo.component.css']
})
export class ModalEliminarOdontologoComponent {
  constructor(
    private dialogoReferencia: MatDialogRef<ModalEliminarOdontologoComponent>,
    @Inject(MAT_DIALOG_DATA) public OdontologoEliminar: Odontologo
  ) {

  }

  ngOnInit(): void {
  }

   eliminarOdontologo() {
     if (this.OdontologoEliminar) {
      this.dialogoReferencia.close('eliminar')
     }
  }

}
