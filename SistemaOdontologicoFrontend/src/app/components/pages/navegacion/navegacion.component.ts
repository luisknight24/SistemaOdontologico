import { Component, OnInit   } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { Router } from '@angular/router';
import{Menu }from 'src/app/interfaces/menu'
import{HttpClient} from '@angular/common/http';
//import{Observable} from 'rxjs';
import{MenuService} from 'src/app/servicios/menu.service';
import{RolNavegacionService} from 'src/app/servicios/rol-navegacion.service'


@Component({
  selector: 'app-navegacion',
  templateUrl: './navegacion.component.html',
  styleUrls: ['./navegacion.component.css']
})
export class NavegacionComponent implements OnInit {

  listaMenu:Menu[]=[];
correoUsuario:string="";
rolUsuario:string="";

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

constructor(private breakpointObserver: BreakpointObserver,private router:Router,
  private _menuServicio:MenuService,
  private _rolUsuario:RolNavegacionService
) {}



ngOnInit(): void {

  
  const usuario =this._rolUsuario.obtenerSession();
  if(usuario!=null){
    this.correoUsuario=usuario.correo;
    this.rolUsuario=usuario.rolDescripcion;
    this._menuServicio.getRoles(usuario.id).subscribe({
      next: (data)=>{

        if(data.status)this.listaMenu=data.value;


      },
      error:(e)=>{}



    })

  }
}

cerrarSession(){

  this._rolUsuario.eliminarSession();
  this.router.navigate(['login']);

}
}
