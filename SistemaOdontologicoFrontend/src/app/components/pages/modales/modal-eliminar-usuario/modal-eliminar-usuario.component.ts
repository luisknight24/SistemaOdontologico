import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Usuario } from '../../../../interfaces/usuario';

@Component({
  selector: 'app-modal-eliminar-usuario',
  templateUrl: './modal-eliminar-usuario.component.html',
  styleUrls: ['./modal-eliminar-usuario.component.css']
})
export class ModalEliminarUsuarioComponent {
  constructor(
    private dialogoReferencia: MatDialogRef<ModalEliminarUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public usuarioEliminar: Usuario
  ) {

  }

  ngOnInit(): void {
  }

   eliminarUsuario() {
     if (this.usuarioEliminar) {
      this.dialogoReferencia.close('eliminar')
     }
  }
}
