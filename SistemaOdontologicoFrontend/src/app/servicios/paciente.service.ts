import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../interfaces/usuario';
import { ResponseApi } from '../interfaces/response-api';
import { Paciente } from '../interfaces/paciente';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  private urlApi: string = environment.endpoint + "Paciente/";
  constructor(private http: HttpClient) {
  }
  obtenerPaciente(): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.urlApi}Lista`)
  }

  obtenerPacienteId(id: number): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.urlApi}${id}`);
  }

  guardarPaciente(request: Paciente): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${this.urlApi}Guardar`, request)
  }

  editarPaciente(request: Paciente): Observable<ResponseApi> {
    return this.http.put<ResponseApi>(`${this.urlApi}Editar`, request)
  }

  eliminarPaciente(id: number): Observable<ResponseApi> {
    return this.http.delete<ResponseApi>(`${this.urlApi}Eliminar/${id}`);
  }
}








