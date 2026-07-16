import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class InterceptorJwt implements HttpInterceptor {
  // Intercepta las solicitudes salientes para adjuntar el token de autenticación
  intercept(peticion: HttpRequest<any>, siguiente: HttpHandler): Observable<HttpEvent<any>> {
    const usuarioCadena = localStorage.getItem("usuario");
    if (usuarioCadena) {
      const usuario = JSON.parse(usuarioCadena);
      const token = usuario?.token;

      // Si el token existe, se clona la petición original adjuntando la cabecera Bearer
      if (token) {
        const peticionClonada = peticion.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
        return siguiente.handle(peticionClonada);
      }
    }
    return siguiente.handle(peticion);
  }
}
