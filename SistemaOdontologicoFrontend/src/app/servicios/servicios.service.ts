import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Servicio } from '../interfaces/servicio';
import { ResponseApi } from '../interfaces/response-api';

import{ environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ServiciosService {
 private urlApi: string=environment.endpoint + "Servicio/";
  constructor(private http: HttpClient){
  }

  obtenerServicio(): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.urlApi}Lista`)
  }

  obtenerServicioId(id: number): Observable<Servicio>{
    return this.http.get<Servicio>(`${this.urlApi}${id}`);
  }

  guardarServicio(request: Servicio): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${this.urlApi}Guardar`, request )
  }

  editarServicio(request: Servicio ): Observable<ResponseApi> {
    return this.http.put<ResponseApi>(`${this.urlApi}Editar`, request)
  }

  eliminarServicio(id: number): Observable<ResponseApi> {
    return this.http.delete<ResponseApi>(`${this.urlApi}Eliminar/${id}`);
  }
}
