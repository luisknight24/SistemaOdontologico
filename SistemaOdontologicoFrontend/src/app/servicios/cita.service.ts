import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseApi } from '../interfaces/response-api';
import { Cita } from '../interfaces/cita';
import { Reporte } from '../interfaces/reporte';
import{ environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  private urlApi: string=environment.endpoint + "Cita/";
  constructor(private http: HttpClient) { }
 
  registrarCita(request: Cita): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${this.urlApi}Registrar`, request)
  }
 
  reporteCita(fechaInicio: string, fechaFin: string): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.urlApi}Reporte?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
   }

  obtenerCita(): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.urlApi}Reporte2`)
  }

  obtenerCitaId(id: number): Observable<Reporte>{
    return this.http.get<Reporte>(`${this.urlApi}${id}`);
  }

  eliminarCita(id: number): Observable<ResponseApi> {
    return this.http.delete<ResponseApi>(`${this.urlApi}Eliminar/${id}`);
  }

  editarCita(request: Cita): Observable<ResponseApi> {
    return this.http.put<ResponseApi>(`${this.urlApi}Editar`, request);
  }
}
