import { Component, OnInit, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ProyectoService } from '../../services/proyectoData.service';
import { servicios } from "../../servicios/servicios";
import { ServDashboard } from "../../servicios/dashboard";
import { environment } from '../../../environments/environment';
import { Chart } from 'chart.js/auto';

@Component({
    selector: 'app-dashboard2',
    templateUrl: './dashboard2.component.html',
    styleUrls: ['../dashboard2/dashboard2.component.scss'],
    animations: [routerTransition()]
    })

export class Dashboard2Component implements OnInit {
  // Variables globales
  dashboard2: any[] = [];
  assetsPath = environment.assetsPath;
  
  // ======= ======= CONSTRUCTOR ======= =======
      constructor(
        private proyectoService: ProyectoService,
        private servicios: servicios,
        private servDashboard: ServDashboard,
        private cdr: ChangeDetectorRef
      ) {}
  // ======= ======= HEADER SECTION  "NO TOCAR"======= =======
    idProyecto: any = parseInt(localStorage.getItem('currentIdProy'));
    idPersonaReg: any = parseInt(localStorage.getItem('currentIdPer'));
    namePersonaReg: any = localStorage.getItem('userFullName');
    currentPerProRol: any = localStorage.getItem('currentPerProRol');
    @Output() selectionChange = new EventEmitter<any>();
    onChildSelectionChange(selectedPro: any) {
      this.idProyecto = selectedPro.id_proyecto;
      localStorage.setItem('currentIdProy', (this.idProyecto).toString());
      this.proyectoService.seleccionarProyecto(this.idProyecto);
      this.currentPerProRol = selectedPro.rol; 

      this.getDashboardData();      
    }
  // ======= ======= HEADER SECTION  "NO TOCAR"======= =======
    // Contadores de Header
    headerDataNro01: any = 0;
    headerDataNro02: any = 0;
    headerDataNro03: any = 0;
    headerDataNro04: any = 0;
  // ====== ======= ====== ====== ======= ====== INIT VIEW FUN ====== ======= ====== ====== ======= ======
    ngOnInit() {
      this.getDashboardData();         
    } 
  // ====== ======= ====== ====== ======= ====== GET DASBOARD DATA ====== ======= ====== ====== ======= ======  
  // ====== Lógica para obtener datos del Dashboard ======
  getDashboardData() {
    this.servDashboard.getDashboardData(this.idProyecto).subscribe(
      (data) => {
        if (data && data[0]?.dato?.[0]) {
        //TARJETA 1  
          // Descargar archivo relacionado con el proyecto
          this.downloadFile(this.idProyecto);
          this.projectInfo = {
            proyecto: data[0].dato[0].proyecto || 'Sin nombre del proyecto',
            descripcion: data[0].dato[0].descrpcion || 'Sin descripción disponible'
          };          
        //TARJETA 2 
          this.proyectoScope = {
            fecha_inicio: data[0].dato[0].fecha_inicio,
            fecha_fin: data[0].dato[0].fecha_fin,
            fecha_fin_ampliada: data[0].dato[0].fecha_fin_ampliada,
            fecha_fin_real: data[0].dato[0].fecha_fin_real
          };
          this.calculatePeriodoActual();
        //TARJETA 3
          this.moneda_presupuesto = data[0].dato[0].moneda_presupuesto || 'Bs';      
          this.presupuesto_me = this.parseMonetaryValue(data[0].dato[0].presupuesto_me) || 0;
          this.presupuesto_mn = this.parseMonetaryValue(data[0].dato[0].presupuesto_mn) || 0;
          this.createPresupuestoChart();
        // TARJETA 4: PRESUPUESTOS DE LA GESTION
          this.presupuestoGestion = {
            ejecutado: this.parseMonetaryValue(data[0].dato[0].ejecutado) || 0,
            presupuesto_actividad: this.parseMonetaryValue(data[0].dato[0].presupuesto_actividad) || 0,
            ejecutado_avance: this.parseMonetaryValue(data[0].dato[0].ejecutado_avance) || 0
          };
          this.createGestionChart();
        // TARJETA 5: INDICADORES
          this.indicadores = data[0].dato[0].indicadores || [];
          this.createRadarChart();
        // TARJETA 6: RIESGOS

        // TARJETA 7: APRENDIZAJES
          if (data[0].dato[0].aprendizajes) {
            this.processAprendizajesData(data[0].dato[0].aprendizajes);
          }
        // TARJETA 8: ACTIVIDADES

        // TARJETA 9: LOGROS
          this.numeroLogros = data[0].dato[0].logros?.length || 0;
        // TARJETA 10: BENEFICIARIOS
          const beneficiarios = data[0].dato[0].beneficiarios || [];
          this.numeroMujeres = beneficiarios.reduce((sum, b) => sum + (b.mujeres || 0), 0);
          this.numeroHombres = beneficiarios.reduce((sum, b) => sum + (b.hombres || 0), 0);
          this.totalBeneficiarios = this.numeroMujeres + this.numeroHombres;
        // TARJETA 11: SIGUIENTES OBLIGACIONES
          this.obligaciones = data[0].dato[0].obligaciones || [];  
        }
      },
      (error) => {
        console.error('Error al obtener datos del dashboard:', error);
      }
    );
  }
  // ====== ======= ====== ====== ======= ====== PRIMERA TARGETA DE INFIORMACION Y IMAGEN ====== ======= ====== ====== ======= ======
    // Variables para tarjeta 1
    imageSrc: any = null;
    defaultImageSrc: any = environment.defaultImageSrc;
    projectInfo: {
      proyecto: string;
      descripcion: string;
    } = {
      proyecto: '',
      descripcion: ''
    };
    // ======= ======= UPLOAD IMAGE FUN ======= =======
          uploadFile(file: any, idRegistro: any, nombreRegistro: any){
            this.servicios.uploadFile(file, "persona", "ruta_foto", "id_persona", nombreRegistro, idRegistro).subscribe(
              (response) => {
              },
              (error) => {
                console.error('Error al subir el archivo:', error);
              }
            );
          }
        // ======= ======= DOWNLOAD IMAGE FUN ======= =======
        downloadFile(idRegistro: any){
          this.servicios.downloadFile("proyecto", "ruta_imagen", "id_proyecto", idRegistro).subscribe(
            (response: Blob) => {
              if (response instanceof Blob) {
                const url = window.URL.createObjectURL(response);
                this.imageSrc = url;
              } 
              else {
                this.imageSrc = null; 
              }
            },
            (error) => {
              if (error.status === 404) {
                this.imageSrc = null;
              }
            }
          );
        }

  // ====== ======= ====== ====== SEGUNDA TARJETA DE FECHA DE INICIO-FIN Y PERIODO ACTUAL DEL PROYECTO ====== ======= ====== ====== 
    // Variables para tarjeta 2
      proyectoScope: any = {
        fecha_inicio: '',
        fecha_fin: '',
        fecha_fin_ampliada: '',
        fecha_fin_real: '',
      };
      currentDateGap: number = 0;
      finalDateGap: number = 0;
      realFinalDate: string = '';
      periodoActual: string = '';

      getProyectDateGaps() {
        // Paso 1: Asignar fecha final inicial desde `fecha_fin`
        this.realFinalDate = this.proyectoScope.fecha_fin;
        // Paso 2: Verificar y sobrescribir con `fecha_fin_ampliada` si está disponible
        if (this.proyectoScope.fecha_fin_ampliada) {
            this.realFinalDate = this.proyectoScope.fecha_fin_ampliada;
        }
        // Paso 3: Verificar y sobrescribir con `fecha_fin_real` si está disponible
        if (this.proyectoScope.fecha_fin_real) {
            this.realFinalDate = this.proyectoScope.fecha_fin_real;
        }
        // Paso 4: Actualizar el periodo actual formateado a DD/MM/AAAA
        this.calculatePeriodoActual();
        // Paso 5: Actualizar los contadores del header
        this.countHeaderData();
        }
        calculatePeriodoActual() {
          // Obtener la fecha actual
          const today = new Date();
          const day = today.getDate().toString().padStart(2, '0');  // Aseguramos 2 dígitos para el día
          const month = (today.getMonth() + 1).toString().padStart(2, '0');  // El mes empieza desde 0, por eso sumamos 1
          const year = today.getFullYear().toString(); // Año como cadena
          // Actualizar la variable `periodoActual` con el formato DD/MM/AAAA de la fecha actual
          this.periodoActual = `${day}/${month}/${year}`;         
        }

  // ====== ======= ====== ====== TERCERA TARJETA DONA DE PRESUPUESTO DEL PROYECTO ====== ======= ====== ======   
      // Variables para tarjeta 3
      moneda_presupuesto: string = '';
      presupuesto_me: number = 0;
      presupuesto_mn: number = 0;
      chartPresupuesto: any;
      calcularPorcentajePresupuesto(): number {
        if (this.presupuesto_me === 0) return 0;
        const porcentaje = (this.presupuesto_mn / this.presupuesto_me) * 100;
        return Math.min(Math.round(porcentaje), 100);
      }
      formatearMoneda(valor: number): string {
        return new Intl.NumberFormat('es-BO', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(valor);
      }
      private parseMonetaryValue(value: string): number {
        if (!value) return 0;
        return Number(value.replace(/[^0-9.-]+/g, ''));
      }      
      // Método para crear y actualizar el gráfico
      createPresupuestoChart() {
        const ctx: any = document.getElementById('presupuestoChart');
        if (!ctx) return;    
        if (this.chartPresupuesto) {
            this.chartPresupuesto.destroy();
        }    
        const porcentaje = this.calcularPorcentajePresupuesto();
        const restante = 100 - porcentaje;    
        this.chartPresupuesto = new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [porcentaje, restante],
                    backgroundColor: ['#D67600', '#E0E0E0'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true, 
                cutout: '65%',
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw}%`
                        }
                    },
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            font: {
                                size: 12
                            }
                        }
                    }
                }
            },
            plugins: [{
                id: 'centerText',
                beforeDraw(chart) {
                    const { ctx, width, height } = chart;
                    ctx.restore();
                    const fontSize = Math.min(height / 8, 30);
                    ctx.font = `bold ${fontSize}px sans-serif`;
                    ctx.textBaseline = 'middle';
                    ctx.textAlign = 'center';    
                    const text = `${porcentaje}%`;
                    ctx.fillStyle = '#000000';
                    ctx.fillText(text, width / 2, height / 2);    
                    ctx.save();
                }
            }]
        });
    }
  // ====== ======= ====== ====== CUARTA TARJETA DE PRESUPUESTOS DE LA GESTION ====== ======= ====== ======
  // Variables para la cuarta tarjeta
  presupuestoGestion: {
    ejecutado: number;
    presupuesto_actividad: number;
    ejecutado_avance: number;
  } = {
    ejecutado: 0,
    presupuesto_actividad: 0,
    ejecutado_avance: 0
  };
  chartGestion: any;
  calcularPorcentajeGestion(): number {
    if (this.presupuestoGestion.presupuesto_actividad === 0) return 0;
    const porcentaje = (this.presupuestoGestion.ejecutado / this.presupuestoGestion.presupuesto_actividad) * 100;
    return Math.min(Math.round(porcentaje), 100);
  }
  createGestionChart() {
    const ctx: any = document.getElementById('doughnutChart2024');
    if (!ctx) return;
  
    if (this.chartGestion) {
      this.chartGestion.destroy();
    }
    const porcentaje = this.calcularPorcentajeGestion();
    const restante = 100 - porcentaje;
    this.chartGestion = new Chart(ctx, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [porcentaje, restante],
          backgroundColor: ['#D67600', '#E0E0E0'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '65%',
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => `${tooltipItem.raw}%`
            }
          }
        },
        layout: {
          padding: {
            top: 10,
            bottom: 10
          }
        }
      },
      plugins: [{
        id: 'centerText',
        beforeDraw(chart) {
          const { ctx, width, height } = chart;
          ctx.restore();
          const fontSize = Math.min(width / 8, height / 8, 24);
          ctx.font = `bold ${fontSize}px sans-serif`;
          ctx.textBaseline = 'middle';
          ctx.textAlign = 'center';
          const text = `${porcentaje}%`;
          ctx.fillStyle = '#000000';
          ctx.fillText(text, width / 2, height / 2);
          ctx.save();
        }
      }]
    });
  }
  // ====== ======= ====== ====== QUINTA TARJETA INDICADORES ====== ======= ====== ======
  // Variables para la quinta tarjeta
      indicadores: {
        id_indicador: number;
        meta_final: string;
        valor_reportado: string;
      }[] = [];
      chartIndicadores: any;

      calcularPorcentajesIndicadores(): { labels: string[]; data: number[] } {
        const labels: string[] = [];
        const data: number[] = [];

        this.indicadores.forEach((indicador) => {
          const meta = this.parseMonetaryValue(indicador.meta_final);
          const reportado = this.parseMonetaryValue(indicador.valor_reportado);

          labels.push(`Indicador ${indicador.id_indicador}`);
          data.push(meta > 0 ? Math.min((reportado / meta) * 100, 100) : 0); // Porcentaje (máximo 100)
        });

        return { labels, data };
      }

      createRadarChart() {
        const ctx: any = document.getElementById('radarChart');
        if (!ctx) return;
      
        if (this.chartIndicadores) {
          this.chartIndicadores.destroy();
        }
      
        const { labels, data } = this.calcularPorcentajesIndicadores();
      
        this.chartIndicadores = new Chart(ctx, {
          type: 'radar',
          data: {
            labels: labels,
            datasets: [{
              label: 'Avance de Indicadores',
              data: data,
              borderColor: '#FF6B00',
              backgroundColor: 'rgba(255, 120, 23, 0.2)',
              borderWidth: 2,
              pointBackgroundColor: '#FF6B00',
              pointBorderColor: '#FF6B00',
              pointHoverBackgroundColor: '#FF6B00',
              pointHoverBorderColor: '#FF6B00',
              pointRadius: 4,
              pointHoverRadius: 5,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              r: {
                angleLines: {
                  display: true,
                  color: '#E0E0E0'
                },
                grid: {
                  color: '#E0E0E0'
                },
                pointLabels: {
                  color: '#666666',
                  font: {
                    size: 11,
                    weight: '500'
                  }
                },
                suggestedMin: 0,
                suggestedMax: 100,
                ticks: {
                  stepSize: 20,
                  backdropColor: 'transparent',
                  color: '#666666',
                  font: {
                    size: 10
                  }
                },
                beginAtZero: true
              }
            },
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                titleColor: '#333',
                bodyColor: '#666',
                borderColor: '#ddd',
                borderWidth: 1,
                padding: 10,
                displayColors: false,
                callbacks: {
                  label: function(context) {
                    return `${context.raw}%`;
                  }
                }
              }
            }
          }
        });
      }

  // ====== ======= ====== ====== SEXTA TARJETA DE RIESGOS ====== ======= ====== ======


  // ====== ======= ====== ====== SEPTIMA TARJETA APRENDIZAJES ====== ======= ====== ======
  chartAprendizajes: any;
  aprendizajesData: any = {
    administrativos: 0,
    gerencia: 0,
    actores: 0,
    otros: 0
  };
  
  // Method to process the aprendizajes data
  processAprendizajesData(data: any[]) {
    // Reset counters
    this.aprendizajesData = {
      administrativos: 0,
      gerencia: 0,
      actores: 0,
      otros: 0
    };
  
    // Count occurrences based on idp_aprendizaje_area
    data.forEach(item => {
      switch (item.idp_aprendizaje_area) {
        case 1:
          this.aprendizajesData.administrativos++;
          break;
        case 2:
          this.aprendizajesData.gerencia++;
          break;
        case 3:
          this.aprendizajesData.actores++;
          break;
        default:
          this.aprendizajesData.otros++;
          break;
      }
    });
  
    // Update the chart
    this.createLearnDoughnutChart();
  }
  
  // Updated chart creation method
  createLearnDoughnutChart() {
    const ctx: any = document.getElementById('learnDoughnutChart');
    if (!ctx) return;
    if (this.chartAprendizajes) {
      this.chartAprendizajes.destroy();
    }
    const data = [
      this.aprendizajesData.administrativos,
      this.aprendizajesData.gerencia,
      this.aprendizajesData.actores,
      this.aprendizajesData.otros
    ];
    const total = data.reduce((a, b) => a + b, 0);
    this.chartAprendizajes = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Administrativos', 'Gerencia de Proyecto', 'Actores Claves', 'Otros'],
        datasets: [{
          label: 'Aprendizajes',
          data: data,
          backgroundColor: ['#2a06f8', '#8E24AA', '#FFEB3B', '#E91E63'],
          borderWidth: 0,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        layout: {
          padding: {
            top: 10,
            bottom: 10
          }
        },
        plugins: {
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            titleColor: '#333',
            bodyColor: '#666',
            borderColor: '#ddd',
            borderWidth: 1,
            padding: 10,
            callbacks: {
              label: (context) => {
                const value = context.raw as number;
                const percentage = ((value / total) * 100).toFixed(1);
                return `${context.label}: ${value} (${percentage}%)`;
              }
            }
          },
          legend: {
            display: false
          }
        }
      },
      plugins: [{
        id: 'centerText',
        beforeDraw(chart: any) {
          const { ctx, width, height } = chart;
          ctx.restore();
          
          // Draw total number
          const fontSize = Math.min(height / 6, 30);
          ctx.font = `bold ${fontSize}px sans-serif`;
          ctx.textBaseline = 'middle';
          ctx.textAlign = 'center';
          
          const text = total.toString();
          ctx.fillStyle = '#6A1B9A';
          ctx.fillText(text, width / 2, height / 2);
          
          // Draw "Total" label
          const labelFontSize = fontSize / 2;
          ctx.font = `${labelFontSize}px sans-serif`;
          ctx.fillStyle = '#666666';
          ctx.fillText('Total', width / 2, height / 2 + fontSize);
          
          ctx.save();
        }
      }]
    });
  }

  // ====== ======= ====== ====== OCTAVA TARJETA ACTIVIDADES ====== ======= ====== ======


  // ====== ======= ====== ====== NOVENA TARJETA LOGROS ====== ======= ====== ======
    // Variables para la novena tarjeta
       numeroLogros: number = 0;

  // ====== ======= ====== ====== DECIMA TARJETA BENEFICIARIOS ====== ======= ====== ======
    // Variables para la décima tarjeta
      numeroMujeres: number = 0;
      numeroHombres: number = 0;
      totalBeneficiarios: number = 0;

  // ====== ======= ====== ====== UNDECIMA TARJETA DE SIGUIENTES OBLIGACIONES ====== ======= ====== ======
    // Variables para la undécima tarjeta
      obligaciones: any[] = [];   

  // ====== ======= ====== ====== ======= ====== ====== ======= ====== ====== ======= ====== ====== ======= ======  ======= ======
    // ====== Contar datos del header ======
    countHeaderData(): void {
      this.headerDataNro01 = this.obligaciones.length;
      this.headerDataNro02 = this.obligaciones.filter((o) => o.estado === 'Cumplida').length;
      this.headerDataNro03 = this.obligaciones.filter((o) => o.estado === 'Incumplida').length;
      this.headerDataNro04 = this.obligaciones.filter((o) => o.estado === 'En proceso').length;
    }  
}