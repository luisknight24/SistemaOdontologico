import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from "./components/login/login.component";
import { AppComponent } from "./app.component";
import { NavegacionComponent } from "./components/pages/navegacion/navegacion.component";

const routes: Routes = [{path:'',redirectTo:'login',pathMatch:'full'},
{path:'',redirectTo:'login',pathMatch:'full'},
{ path: "login", component: LoginComponent, pathMatch: "full" },
{ path: 'pages', loadChildren: () => import('./components/pages/pages.module').then(x => x.PagesModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
