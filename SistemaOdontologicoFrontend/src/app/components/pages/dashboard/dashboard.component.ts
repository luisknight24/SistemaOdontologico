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
              'rgba(217, 119, 6, 0.7)',
              'rgba(251, 191, 36, 0.7)',
              'rgba(146, 64, 14, 0.7)',
              'rgba(253, 230, 138, 0.7)'
            ],
            borderColor: [
              'rgba(217, 119, 6, 1)',
              'rgba(251, 191, 36, 1)',
              'rgba(146, 64, 14, 1)',
              'rgba(253, 230, 138, 1)'
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
