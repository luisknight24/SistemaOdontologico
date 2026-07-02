import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../servicios/dashboard.service';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  totalPacientes: number = 0;
  totalOdontologos: number = 0;
  totalCitas: number = 0;
  totalIngresos: string = "0";

  constructor(private _dashboardService: DashboardService) { }

  ngOnInit(): void {
    this._dashboardService.obtenerResumen().subscribe({
      next: (data) => {
        if (data.estado) {
          this.totalPacientes = data.valor.totalPacientes;
          this.totalOdontologos = data.valor.totalOdontologos;
          this.totalCitas = data.valor.totalCitas;
          this.totalIngresos = data.valor.totalIngresos;

          const graficoDatos = data.valor.graficoCitas;
          if (graficoDatos && graficoDatos.length > 0) {
            const labels = graficoDatos.map((item: any) => item.mes);
            const valores = graficoDatos.map((item: any) => item.cantidad);
            this.mostrarGrafico(labels, valores);
          } else {
            this.mostrarGrafico(['Sin datos'], [0]);
          }
        }
      },
      error: (e) => {
        console.error("Error al cargar resumen de dashboard", e);
        this.mostrarGrafico(['Sin datos'], [0]);
      }
    });
  }

  mostrarGrafico(labels: string[], valores: number[]) {
    const ctx = document.getElementById('chartCitas') as HTMLCanvasElement;
    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Número de Citas',
            data: valores,
            backgroundColor: [
              'rgba(21, 126, 142, 0.7)',
              'rgba(38, 166, 154, 0.7)',
              'rgba(106, 90, 205, 0.7)',
              'rgba(255, 112, 67, 0.7)'
            ],
            borderColor: [
              'rgba(21, 126, 142, 1)',
              'rgba(38, 166, 154, 1)',
              'rgba(106, 90, 205, 1)',
              'rgba(255, 112, 67, 1)'
            ],
            borderWidth: 2,
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1
              }
            }
          },
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });
    }
  }
}
