import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../interfaces/usuario';
import { ResponseApi } from '../interfaces/response-api';
import {  Odontologo} from '../interfaces/odontologo';
import{ environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OdontologoService {
private urlApi: string=environment.endpoint + "Odontologo/";
  constructor(private http: HttpClient){
  }

  ObtenerOdontologo(): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.urlApi}Lista`)
  }
  ObtenerOdontologoId(id: number): Observable<Odontologo>{
    return this.http.get<Odontologo>(`${this.urlApi}${id}`);
  }

  guardarOdontologo(request: Odontologo): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${this.urlApi}Guardar`, request)
  }

  editarOdontologo(request: Odontologo): Observable<ResponseApi> {
    return this.http.put<ResponseApi>(`${this.urlApi}Editar`, request)
  }

  eliminarOdontologo(id: number): Observable<ResponseApi> {
    return this.http.delete<ResponseApi>(`${this.urlApi}Eliminar/${id}`);
  }
}