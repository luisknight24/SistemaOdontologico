import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { ReusableModule } from './components/reusable/reusable.module';

//Modulos
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';



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
 
  bootstrap: [AppComponent]
})
export class AppModule { }
