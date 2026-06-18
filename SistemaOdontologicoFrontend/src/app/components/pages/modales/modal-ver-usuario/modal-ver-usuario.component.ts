import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Usuario } from '../../../../interfaces/usuario';
import { ResponseApi } from '../../../../interfaces/response-api';
import { UsuarioService} from '../../../../servicios/usuario.service';

@Component({
  selector: 'app-modal-ver-usuario',
  templateUrl: './modal-ver-usuario.component.html',
  styleUrls: ['./modal-ver-usuario.component.css']
})
export class ModalVerUsuarioComponent {

  id!: number;
  usuario!: Usuario;

  loading: boolean = false;

 
  constructor(
    private _servicioService: UsuarioService,
    public dialogRef: MatDialogRef<ModalVerUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { usuario: Usuario }
  ) {}

 
  ngOnInit(): void {
    this.obtenerServicio();
  }

  obtenerServicio() {
    this.loading = true;
    const usuarioId = this.data.usuario.id; 
  
    // Obtiene el ID del objeto odontologo de los datos
    this._servicioService.ObtenerUsuarioId(usuarioId).subscribe(data => {
      this.usuario = data;
      this.loading = false;
    });
  }
}
