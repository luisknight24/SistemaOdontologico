import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ProyectoFinal';

  ngOnInit(): void {
    const configStr = localStorage.getItem('appConfig');
    if (configStr) {
      try {
        const config = JSON.parse(configStr);
        const temaOscuro = config.temaOscuro ?? true;
        const animaciones = config.animaciones ?? true;

        // Aplicar Modo Oscuro / Claro
        if (temaOscuro) {
          document.body.classList.remove('light-mode');
        } else {
          document.body.classList.add('light-mode');
        }

        // Aplicar Animaciones
        if (animaciones) {
          document.body.classList.remove('no-animations');
        } else {
          document.body.classList.add('no-animations');
        }
      } catch (e) {
        console.error('Error al cargar la configuración inicial:', e);
      }
    }
  }
}

