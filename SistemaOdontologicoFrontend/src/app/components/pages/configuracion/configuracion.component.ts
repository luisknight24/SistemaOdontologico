import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent implements OnInit {

  // Configuraciones visuales
  temaOscuro: boolean = true;
  animaciones: boolean = true;

  // Notificaciones
  alertasSistema: boolean = true;
  correosNuevasCitas: boolean = true;
  correosRecordatorios: boolean = false;

  constructor() { }

  ngOnInit(): void {
    // Cargar desde localStorage si existen
    const configStr = localStorage.getItem('appConfig');
    if (configStr) {
      try {
        const config = JSON.parse(configStr);
        this.temaOscuro = config.temaOscuro ?? true;
        this.animaciones = config.animaciones ?? true;
        this.alertasSistema = config.alertasSistema ?? true;
        this.correosNuevasCitas = config.correosNuevasCitas ?? true;
        this.correosRecordatorios = config.correosRecordatorios ?? false;
        
        // Aplicar los estilos al cargar
        this.aplicarCambiosVisuales();
      } catch (e) {
        console.error('Error al cargar configuración:', e);
      }
    }
  }

  aplicarCambiosVisuales(): void {
    // Aplicar Modo Oscuro / Claro
    if (this.temaOscuro) {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
    }

    // Aplicar animaciones
    if (this.animaciones) {
      document.body.classList.remove('no-animations');
    } else {
      document.body.classList.add('no-animations');
    }
  }

  onTemaOscuroChange(event: any): void {
    this.temaOscuro = event.checked;
    this.aplicarCambiosVisuales();
  }

  onAnimacionesChange(event: any): void {
    this.animaciones = event.checked;
    this.aplicarCambiosVisuales();
  }

  guardarConfiguracion(): void {
    this.aplicarCambiosVisuales();

    // Guardar en localStorage
    const config = {
      temaOscuro: this.temaOscuro,
      animaciones: this.animaciones,
      alertasSistema: this.alertasSistema,
      correosNuevasCitas: this.correosNuevasCitas,
      correosRecordatorios: this.correosRecordatorios
    };
    localStorage.setItem('appConfig', JSON.stringify(config));

    // Simulación de guardado
    Swal.fire({
      icon: 'success',
      title: '¡Preferencias guardadas!',
      text: 'Tus configuraciones han sido actualizadas correctamente.',
      confirmButtonColor: '#14b8a6',
      background: this.temaOscuro ? '#1e222a' : '#ffffff',
      color: this.temaOscuro ? '#f8fafc' : '#0f172a'
    });
  }
}
