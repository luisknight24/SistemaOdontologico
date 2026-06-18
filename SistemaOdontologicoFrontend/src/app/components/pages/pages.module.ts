import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { NavegacionComponent } from './navegacion/navegacion.component';
import { ReusableModule } from '../reusable/reusable.module';
import { PagesComponent } from './pages.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { ModalUsuarioComponent } from './modales/modal-usuario/modal-usuario.component';
import { PacienteComponent } from './paciente/paciente.component';
import { OdontologoComponent } from './odontologo/odontologo.component';
import { ServicioComponent } from './servicio/servicio.component';
import { CitaComponent } from './cita/cita.component';
import { ModalPacienteComponent } from './modales/modal-paciente/modal-paciente.component';
import { ModalOdontologoComponent } from './modales/modal-odontologo/modal-odontologo.component';
import { ModalEliminarUsuarioComponent } from './modales/modal-eliminar-usuario/modal-eliminar-usuario.component';
import { ModalEliminarOdontologoComponent } from './modales/modal-eliminar-odontologo/modal-eliminar-odontologo.component';
import { ModalEliminarPacienteComponent } from './modales/modal-eliminar-paciente/modal-eliminar-paciente.component';
import { ReporteComponent } from './reporte/reporte.component';
import { ModalCitaComponent } from './modales/modal-cita/modal-cita.component';
import { ModalServicioComponent } from './modales/modal-servicio/modal-servicio.component';
import { ModalEliminarServicioComponent } from './modales/modal-eliminar-servicio/modal-eliminar-servicio.component';

//Modulos
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';



//controles para la fecha
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MomentDateModule } from '@angular/material-moment-adapter';
import { ModalEditarCitaComponent } from './modales/modal-editar-cita/modal-editar-cita.component';
import { ModalVerOdontologoComponent } from './modales/modal-ver-odontologo/modal-ver-odontologo.component';
import { ModalVerServicioComponent } from './modales/modal-ver-servicio/modal-ver-servicio.component';
import { ModalVerPacienteComponent } from './modales/modal-ver-paciente/modal-ver-paciente.component';
import { ModalVerUsuarioComponent } from './modales/modal-ver-usuario/modal-ver-usuario.component';
import { ModalVerCitaComponent } from './modales/modal-ver-cita/modal-ver-cita.component'; /*npm install moment --save | npm i @angular/material-moment-adapter*/


@NgModule({
  declarations: [
    PagesComponent,
    NavegacionComponent,
    UsuarioComponent,
    ModalUsuarioComponent,
    PacienteComponent,
    OdontologoComponent,
    ServicioComponent,
    CitaComponent,
    ModalPacienteComponent,
    ModalOdontologoComponent,
    ModalEliminarUsuarioComponent,
    ModalEliminarOdontologoComponent,
    ModalEliminarPacienteComponent,
    ReporteComponent,
    ModalCitaComponent,
    ModalServicioComponent,
    ModalEliminarServicioComponent,
    ModalEditarCitaComponent,
    ModalVerOdontologoComponent,
    ModalVerServicioComponent,
    ModalVerPacienteComponent,
    ModalVerUsuarioComponent,
    ModalVerCitaComponent,
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
   ReusableModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MomentDateModule
  ],
  exports: [
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
   MomentDateModule
  ],
  providers: [
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class PagesModule { }
