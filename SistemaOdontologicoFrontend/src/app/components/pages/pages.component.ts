import { Component, OnInit  } from '@angular/core';
import { Router } from '@angular/router';
import{Menu }from 'src/app/interfaces/menu'
import{HttpClient} from '@angular/common/http';
import{Observable} from 'rxjs';
import{MenuService} from 'src/app/servicios/menu.service';
import{RolNavegacionService} from 'src/app/servicios/rol-navegacion.service'

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit {
listaMenu:Menu[]=[];
correoUsuario:string="";
rolUsuario:string="";

  constructor(
    private router:Router,
    private _menuServicio:MenuService,
    private _rolUsuario:RolNavegacionService

  ) { }



  ngOnInit(): void {

    const usuario =this._rolUsuario.obtenerSession();
    if(usuario!=null){
      this.correoUsuario=usuario.correo;
      this.rolUsuario=usuario.rolDescripcion;
      this._menuServicio.getRoles(usuario.idUsuario).subscribe({
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