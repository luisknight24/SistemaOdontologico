import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { PacienteComponent } from './paciente/paciente.component';
import { OdontologoComponent } from './odontologo/odontologo.component';
import { ReporteComponent } from './reporte/reporte.component';
import { CitaComponent } from './cita/cita.component';
import { ServicioComponent } from './servicio/servicio.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PerfilComponent } from './perfil/perfil.component';
import { ConfiguracionComponent } from './configuracion/configuracion.component';

const routes: Routes = [
  {
    path: '', component: PagesComponent, children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'usuario', component: UsuarioComponent },
      { path: 'paciente', component: PacienteComponent },
      { path: 'odontologo', component: OdontologoComponent },
      { path: 'reporte', component: ReporteComponent },
      { path: 'cita', component: CitaComponent },
      { path: 'servicio', component: ServicioComponent },
      { path: 'perfil', component: PerfilComponent },
      { path: 'configuracion', component: ConfiguracionComponent },
    ]



  }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {




 }
