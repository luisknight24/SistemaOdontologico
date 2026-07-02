import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseApi } from '../interfaces/response-api';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private urlApi: string = environment.endpoint + "Dashboard/";

  constructor(private http: HttpClient) { }

  obtenerResumen(): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.urlApi}Resumen`);
  }
}
