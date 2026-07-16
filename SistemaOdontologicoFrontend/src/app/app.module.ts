import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { ReusableModule } from './components/reusable/reusable.module';

//Modulos
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InterceptorJwt } from './interceptors/jwt.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReusableModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,   
    
  ], exports: [
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,

    CommonModule,
   
  ],  
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorJwt, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
