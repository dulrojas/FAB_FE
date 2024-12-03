import { Component, OnInit, TemplateRef, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ProyectoService } from '../../services/proyectoData.service';
import { servicios } from "../../servicios/servicios";
import { Chart } from 'chart.js/auto'; // Importación de Chart.js

@Component({
    selector: 'app-dashboard2',
    templateUrl: './dashboard2.component.html',
    styleUrls: ['../dashboard2/dashboard2.component.scss'],
    animations: [routerTransition()]
    })

export class Dashboard2Component implements OnInit {

    dashboard2: any[] = [];
    dashboard2Selected: any = null;
    obligaciones: any[] = [];

    constructor(
        private modalService: NgbModal,
        private proyectoService: ProyectoService,
        private servicios: servicios,
        private cdr: ChangeDetectorRef
    ) {}
    // ======= ======= HEADER SECTION ======= =======
    idProyecto: any = parseInt(localStorage.getItem('currentIdProy'));
    idPersonaReg: any = parseInt(localStorage.getItem('currentIdPer'));
    @Output() selectionChange = new EventEmitter<any>();
    onChildSelectionChange(selectedId: any) {
      this.idProyecto = selectedId;
      localStorage.setItem('currentIdProy', (this.idProyecto).toString());
      this.proyectoService.seleccionarProyecto(this.idProyecto);
      // ======= *ADD A GETTER DOWN HERE* =======
      // this.getLogros();
    }

    headerDataNro01: any = 0;
    headerDataNro02: any = 0;
    headerDataNro03: any = 0;
    headerDataNro04: any = 0;
    // ======= ======= ======= ======= =======

    proyectoScope: any = {};
    currentDateGap: number = 0;
    finalDateGap: number = 0;
    realFinalDate: any = '';

    ngOnInit() {
        this.createDoughnutChart(); // Grafico Presupuesto
        this.createDoughnutChart2024() // Grafico Presupuesto 2024
        this.createRadarChart(); // Grafico Indicadores
        this.createLearnDoughnutChart(); // Grafico Aprendizajes
    }

        getCurrentDateDaysGap(iniDate: any){
            iniDate = (new Date(iniDate)).getTime();
            return (Math.floor((new Date().getTime()-iniDate)/(1000*3600*24)));
        }
        getDateDaysGap(iniDate: any, endDate: any){
            iniDate = new Date(iniDate).getTime();
            endDate = new Date(endDate).getTime();
            return (Math.floor((endDate-iniDate)/(1000*3600*24))+1);
        }
        getProyectDateGaps(){          
            this.realFinalDate = this.proyectoScope.fecha_fin;
            this.realFinalDate = (this.proyectoScope.fecha_fin_ampliada)?(this.proyectoScope.fecha_fin_ampliada):(this.realFinalDate);
            this.realFinalDate = (this.proyectoScope.fecha_fin_real)?(this.proyectoScope.fecha_fin_real):(this.realFinalDate);
    
            this.currentDateGap = this.getCurrentDateDaysGap(this.proyectoScope.fecha_inicio);
            this.finalDateGap = this.getDateDaysGap(this.proyectoScope.fecha_inicio, this.realFinalDate);
    
            this.currentDateGap = (this.currentDateGap <= this.finalDateGap)?(this.currentDateGap):(this.finalDateGap);
        
            this.countHeaderData();
        }

        // ====== ======= ======
        getCurrentDateTime(): string {
            const date: Date = new Date();
            
            const day: string = String(date.getDate()).padStart(2, '0');
            const month: string = String(date.getMonth() + 1).padStart(2, '0');
            const year: number = date.getFullYear();
            
            const hours: string = String(date.getHours()).padStart(2, '0');
            const minutes: string = String(date.getMinutes()).padStart(2, '0');
            const seconds: string = String(date.getSeconds()).padStart(2, '0');
            
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        }    

    countHeaderData() {
       
      }
      
      // ====== ======= ====== Grafico Presupuesto ====== ======= ======
      createDoughnutChart() {
        const ctx: any = document.getElementById('doughnutChart') as HTMLCanvasElement;
      
        new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['Gastado', 'Restante'], // Etiquetas
            datasets: [
              {
                label: 'Presupuesto',
                data: [25, 75], // Porcentajes
                backgroundColor: ['#BF5F3B', '#E0E0E0'], // Colores de la gráfica
                borderWidth: 0,
              },
            ],
          },
          options: {
            responsive: true,
            cutout: '70%', // Hace el efecto de dona
            plugins: {
              tooltip: {
                callbacks: {
                  label: (tooltipItem) =>
                    `${tooltipItem.label}: ${tooltipItem.raw}%`, // Muestra porcentajes
                },
              },
              legend: {
                display: false, // Oculta la leyenda
              },
            },
          },
          plugins: [
            {
              id: 'centerText', // Identificador del plugin
              beforeDraw(chart: any) {
                const width = chart.width;
                const height = chart.height;
                const ctx = chart.ctx;
                ctx.restore();
      
                const fontSize = (height / 100).toFixed(2); // Ajusta el tamaño de la fuente
                ctx.font = `${fontSize}em sans-serif`;
                ctx.textBaseline = 'middle';
      
                const text = '25%'; // Texto al centro (porcentaje)
                const textX = Math.round((width - ctx.measureText(text).width) / 2);
                const textY = height / 2;
      
                ctx.fillStyle = '#000'; // Color del texto
                ctx.fillText(text, textX, textY);
                ctx.save();
              },
            },
          ],
        });
      }

      // ====== ======= ====== Grafico Presupuesto 2024 ====== ======= ======
      createDoughnutChart2024() {
        const ctx: any = document.getElementById('doughnutChart2024') as HTMLCanvasElement;
      
        new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['Gastado', 'Restante'], // Etiquetas
            datasets: [
              {
                label: 'Presupuesto 2024',
                data: [75, 25], // Porcentajes
                backgroundColor: ['#BF5F3B', '#E0E0E0'], // Colores de la gráfica
                borderWidth: 0,
              },
            ],
          },
          options: {
            responsive: true,
            cutout: '75%', // Hace el efecto de dona
            plugins: {
              tooltip: {
                callbacks: {
                  label: (tooltipItem) =>
                    `${tooltipItem.label}: ${tooltipItem.raw}%`, // Muestra porcentajes
                },
              },
              legend: {
                display: false, // Oculta la leyenda
              },
            },
          },
          plugins: [
            {
              id: 'centerText', // Identificador del plugin
              beforeDraw(chart: any) {
                const width = chart.width;
                const height = chart.height;
                const ctx = chart.ctx;
                ctx.restore();
      
                const fontSize = (height / 100).toFixed(2); // Ajusta el tamaño de la fuente
                ctx.font = `${fontSize}em sans-serif`;
                ctx.textBaseline = 'middle';
      
                const text = '75%'; // Texto al centro (porcentaje)
                const textX = Math.round((width - ctx.measureText(text).width) / 2);
                const textY = height / 2;
      
                ctx.fillStyle = '#000'; // Color del texto
                ctx.fillText(text, textX, textY);
                ctx.save();
              },
            },
          ],
        });
      }

      // ====== ======= ====== Grafico Indicadores ====== ======= ======
      createRadarChart() {
        const ctx: any = document.getElementById('radarChart') as HTMLCanvasElement;
      
        new Chart(ctx, {
          type: 'radar',
          data: {
            labels: [
              '1.0.0.1',
              '1.0.0.2',
              '1.0.0.3',
              '1.0.0.4',
              '1.0.0.5',
              '1.0.0.6',
              '1.0.0.7',
              '1.1.0.1',
              '1.1.1.1',
              '1.1.1.2',
              '1.1.1.3',
            ],
            datasets: [
              {
                label: 'Indicadores',
                data: [100, 80, 60, 50, 70, 40, 90, 30, 100, 70, 50], // Datos para cada punto
                borderColor: '#FF5722', // Color del borde
                backgroundColor: 'rgba(255, 87, 34, 0.2)', // Color de relleno (transparente)
                borderWidth: 2,
                pointBackgroundColor: '#FF5722', // Color de los puntos
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              r: {
                angleLines: {
                  color: '#e0e0e0', // Color de las líneas radiales
                },
                grid: {
                  color: '#e0e0e0', // Color de las líneas de la cuadrícula
                },
                suggestedMin: 0, // Valor mínimo del eje
                suggestedMax: 100, // Valor máximo del eje
                ticks: {
                  backdropColor: '#ffffff', // Fondo de los números en las líneas
                  color: '#333333', // Color de los números
                },
                pointLabels: {
                  color: '#333333', // Color de las etiquetas
                  font: {
                    size: 10, // Tamaño de fuente de las etiquetas
                  },
                },
              },
            },
            plugins: {
              legend: {
                display: false, // Oculta la leyenda
              },
            },
          },
        });
      }   

      // ====== ======= ====== Grafico Aprendizajes ====== ======= ======
      createLearnDoughnutChart() {
        const ctx: any = document.getElementById('learnDoughnutChart') as HTMLCanvasElement;
      
        new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['Administrativos', 'Gerencia de Proyecto', 'Actores Claves', 'Otros'], // Etiquetas
            datasets: [
              {
                label: 'Aprendizajes',
                data: [2, 2, 1, 1], // Datos de cada segmento
                backgroundColor: ['#6A1B9A', '#8E24AA', '#FFEB3B', '#E91E63'], // Colores
                borderWidth: 0,
              },
            ],
          },
          options: {
            responsive: true,
            cutout: '70%', // Hace el efecto de dona
            plugins: {
              tooltip: {
                callbacks: {
                  label: (tooltipItem) =>
                    `${tooltipItem.label}: ${tooltipItem.raw}`, // Muestra el valor
                },
              },
              legend: {
                display: false, // Oculta la leyenda integrada
              },
            },
          },
          plugins: [
            {
              id: 'centerText', // Plugin para el texto central
              beforeDraw(chart: any) {
                const width = chart.width;
                const height = chart.height;
                const ctx = chart.ctx;
                ctx.restore();
      
                const fontSize = (height / 100).toFixed(2); // Tamaño dinámico
                ctx.font = `${fontSize}em sans-serif`;
                ctx.textBaseline = 'middle';
      
                const total = chart.data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
                const text = `${total}`; // Total al centro
                const textX = Math.round((width - ctx.measureText(text).width) / 2);
                const textY = height / 2;
      
                ctx.fillStyle = '#6A1B9A'; // Color del texto
                ctx.fillText(text, textX, textY);
                ctx.save();
              },
            },
          ],
        });
      }

}