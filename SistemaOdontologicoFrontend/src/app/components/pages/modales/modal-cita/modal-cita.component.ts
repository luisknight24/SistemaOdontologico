import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { DetalleCita } from 'src/app/interfaces/detalle-cita';
import { Paciente } from 'src/app/interfaces/paciente';
import { Servicio } from 'src/app/interfaces/servicio';
import { Odontologo } from 'src/app/interfaces/odontologo';
import { CitaService } from 'src/app/servicios/cita.service';
import { ServiciosService } from  'src/app/servicios/servicios.service';
import { OdontologoService } from  'src/app/servicios/odontologo.service';
import { PacienteService } from  'src/app/servicios/paciente.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
//import { ModalCitaComponent } from '../modales/modal-cita/modal-cita.component';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-modal-cita',
  templateUrl: './modal-cita.component.html',
  styleUrls: ['./modal-cita.component.css']
})
export class ModalCitaComponent  implements OnInit {
   
 constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
 
 ngOnInit(): void {
}

}
