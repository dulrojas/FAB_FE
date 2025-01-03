import { Component, OnInit, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ProyectoService } from '../../services/proyectoData.service';
import { servicios } from "../../servicios/servicios";
import { ServDashboard } from "../../servicios/dashboard";
import { environment } from '../../../environments/environment';
import { PlanifEstrategicaService } from '../../servicios/planifEstrategica';
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
        private planifEstrategicaService: PlanifEstrategicaService,
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
          this.presupuesto_mn = this.parseMonetaryValue(data[0].dato[0].presupuesto_mn) || 0;
          this.createPresupuestoChart();
        // TARJETA 4: PRESUPUESTOS DE LA GESTION
          this.procesarDatosPresupuesto(data[0].dato[0]);
          this.createGestionChart();
        // TARJETA 5: INDICADORES
          this.indicadores = data[0].dato[0].indicadores || [];
          this.createRadarChart();
        // TARJETA 6: RIESGOS          
          if (data[0].dato[0].riesgos) {
            this.riesgos = data[0].dato[0].riesgos;
            this.processRiskData(this.riesgos);
          }
        // TARJETA 7: APRENDIZAJES MOSTRAR LOS 9 
          if (data[0].dato[0].aprendizajes) {
            this.processAprendizajesData(data[0].dato[0].aprendizajes);
          }
        // TARJETA 8: ACTIVIDADES
          if (data[0].dato[0].actividades) {
            this.actividades = data[0].dato[0].actividades;
            this.processActivityStatus(this.actividades);
          }
        // TARJETA 9: LOGROS
          this.numeroLogros = data[0].dato[0].logros?.length || 0;
        // TARJETA 10: BENEFICIARIOS
          const beneficiarios = data[0].dato[0].beneficiarios || [];
          this.numeroMujeres = beneficiarios.reduce((sum, b) => sum + (b.mujeres || 0), 0);
          this.numeroHombres = beneficiarios.reduce((sum, b) => sum + (b.hombres || 0), 0);
          this.totalBeneficiarios = this.numeroMujeres + this.numeroHombres;
        // TARJETA 11: SIGUIENTES OBLIGACIONES
          this.obligaciones = data[0].dato[0].obligaciones || [];
          
        // Actualizar los contadores del header
        this.countHeaderData(data[0].dato[0]);  
        }
      },
      (error) => {
        console.error('Error al obtener datos del dashboard:', error);
      }
    );
    this.planifEstrategicaService.getAllPlanifElements().subscribe(
      (data) => {
        console.log('Datos recibidos del servicio:', data);
        if (data && data[0]?.dato) {
          const elementos = data[0].dato;
  
          const elementosProyecto = elementos.filter((elem: any) => elem.id_proyecto === this.idProyecto);
          console.log('Elementos filtrados por proyecto:', elementosProyecto);
  
          const conteoPlanificacion = elementosProyecto.filter((elem: any) => elem.id_meto_elemento === 2).length;
          const conteoResultados = elementosProyecto.filter((elem: any) => elem.id_meto_elemento === 3).length;
  
          console.log('Conteo planificación:', conteoPlanificacion, 'Conteo resultados:', conteoResultados);
  
          this.headerDataNro01 = conteoPlanificacion;
          this.headerDataNro02 = conteoResultados;
  
          console.log('Valor final headerDataNro01:', this.headerDataNro01);
          console.log('Valor final headerDataNro02:', this.headerDataNro02);
        }
      },
      (error) => {
        console.error('Error al obtener datos de planificación estratégica:', error);
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
        this.countHeaderData(this.proyectoScope);
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
      presupuesto_mn: number = 0;
      presupuesto_ejecutado: number = 0;
      chartPresupuesto: any;
      calcularPorcentajePresupuesto(): number {
        if (this.presupuesto_mn === 0) return 0;
        const porcentaje = (this.presupuesto_ejecutado / this.presupuesto_mn) * 100;
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
      procesarDatosPresupuesto(data: any) {
        // Obtener y convertir el presupuesto total
        this.presupuesto_mn = this.parseMonetaryValue(data.presupuesto_mn);
        
        // Calcular el total ejecutado sumando ambos valores
        const ejecutadoActividad = this.parseMonetaryValue(data.pro_act_ava_ejecutado);
        const ejecutadoPre = this.parseMonetaryValue(data.pro_pre_ava_ejecutado);
        this.presupuesto_ejecutado = ejecutadoActividad + ejecutadoPre;
        
        // Crear el gráfico con los nuevos datos
        this.createPresupuestoChart();
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
  // Variables para la gestión del presupuesto
  gestionActual: string = '';
  presupuestoGestion: {
    ejecutado: number;
    presupuesto_actividad: number;
    porcentaje_ejecutado: number;
    ejecutado_formateado: string;
    presupuesto_formateado: string;
  } = {
    ejecutado: 0,
    presupuesto_actividad: 0,
    porcentaje_ejecutado: 0,
    ejecutado_formateado: '',
    presupuesto_formateado: ''
  };
  chartGestion: any;
  procesarDatosPresupuestoGestion(data: any) {
    // Obtener la gestión actual
    this.gestionActual = data.gestion_actual || new Date().getFullYear().toString();
    
    // Obtener y convertir el presupuesto de la gestión
    const presupuestoGestion = this.parseMonetaryValue(data.pro_act_presupuesto_gestion);
    
    // Calcular el total ejecutado sumando ambos valores
    const ejecutadoActividad = this.parseMonetaryValue(data.pro_act_ava_ejecutado_gestion);
    const ejecutadoPre = this.parseMonetaryValue(data.pro_pre_ava_ejecutado_gestion);
    const ejecutadoTotal = ejecutadoActividad + ejecutadoPre;
  
    // Actualizar el objeto presupuestoGestion
    this.presupuestoGestion = {
      ejecutado: ejecutadoTotal,
      presupuesto_actividad: presupuestoGestion,
      porcentaje_ejecutado: presupuestoGestion > 0 ? (ejecutadoTotal / presupuestoGestion) * 100 : 0,
      ejecutado_formateado: this.formatearMoneda(ejecutadoTotal),
      presupuesto_formateado: this.formatearMoneda(presupuestoGestion)
    };
  
    // Crear el gráfico con los nuevos datos
    this.createGestionChart();
  }
  // Función para crear el gráfico de dona
  createGestionChart() {
    const ctx: any = document.getElementById('doughnutChart2024');
    if (!ctx) return;
  
    if (this.chartGestion) {
      this.chartGestion.destroy();
    }
  
    const porcentaje = Math.min(Math.round(this.presupuestoGestion.porcentaje_ejecutado), 100);
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
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: false
          }
        }
      },
      plugins: [{
        id: 'centerText',
        beforeDraw(chart: any) {
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
  // ====== ======= ====== ====== QUINTA TARJETA INDICADORES ====== ======= ====== ======
  // Variables para la quinta tarjeta
      indicadores: {
        id_indicador: number;
        codigo: string;
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

          labels.push(`${indicador.codigo}`);
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
      riesgos: {
        id_riesgo: number;
        impacto: string;
        probabilidad: string;
        nivel: string;
      }[] = [];

      // Matriz para almacenar los conteos de riesgos
      riskMatrix: number[][] = [
        [0, 0, 0], // Fila 1 (Impacto 3)
        [0, 0, 0], // Fila 2 (Impacto 2)
        [0, 0, 0]  // Fila 3 (Impacto 1)
      ];

      // Método para procesar los datos de riesgos
      processRiskData(riesgos: any[]) {
        // Reiniciar la matriz
        this.riskMatrix = [
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0]
        ];

        // Procesar cada riesgo
        riesgos.forEach(riesgo => {
          // Convertir strings a números
          const impacto = parseInt(riesgo.impacto);
          const probabilidad = parseInt(riesgo.probabilidad);
          const nivel = parseInt(riesgo.nivel);

          // Calcular índices para la matriz (restamos 1 porque los índices empiezan en 0)
          const impactoIndex = 3 - impacto; // Invertimos para que coincida con la visualización
          const probabilidadIndex = probabilidad - 1;

          // Incrementar el contador en la posición correspondiente
          if (impactoIndex >= 0 && impactoIndex < 3 && probabilidadIndex >= 0 && probabilidadIndex < 3) {
            this.riskMatrix[impactoIndex][probabilidadIndex]++;
          }
        });
      }
  

  // ====== ======= ====== ====== SEPTIMA TARJETA APRENDIZAJES ====== ======= ====== ======
  chartAprendizajes: any;
  aprendizajesData: any = {
    administrativos: 0,
    gerencia: 0,
    estrategia: 0,
    planificacion: 0,
    tecnicos: 0,
    contexto: 0,
    actores: 0,
    conflictos: 0,
    otros: 0
  };
  
  processAprendizajesData(data: any[]) {
    // Reiniciar los contadores
    this.aprendizajesData = {
      administrativos: 0,
      gerencia: 0,
      estrategia: 0,
      planificacion: 0,
      tecnicos: 0,
      contexto: 0,
      actores: 0,
      conflictos: 0,
      otros: 0
    };
  
    data.forEach(item => {
      switch (item.idp_aprendizaje_area) {
        case 1:
          this.aprendizajesData.administrativos++;
          break;
        case 2:
          this.aprendizajesData.gerencia++;
          break;
        case 3:
          this.aprendizajesData.estrategia++;
          break;
        case 4:
          this.aprendizajesData.planificacion++;
          break;
        case 5:
          this.aprendizajesData.tecnicos++;
          break;
        case 6:
          this.aprendizajesData.contexto++;
          break;
        case 7:
          this.aprendizajesData.actores++;
          break;
        case 8:
          this.aprendizajesData.conflictos++;
          break;
        case 9:
          this.aprendizajesData.otros++;
          break;
      }
    });
    this.createLearnDoughnutChart();
  }
  
  createLearnDoughnutChart() {
    const ctx: any = document.getElementById('learnDoughnutChart');
    if (!ctx) return;
  
    if (this.chartAprendizajes) {
      this.chartAprendizajes.destroy();
    }
  
    const data = [
      this.aprendizajesData.administrativos,
      this.aprendizajesData.gerencia,
      this.aprendizajesData.estrategia,
      this.aprendizajesData.planificacion,
      this.aprendizajesData.tecnicos,
      this.aprendizajesData.contexto,
      this.aprendizajesData.actores,
      this.aprendizajesData.conflictos,
      this.aprendizajesData.otros
    ];
  
    const labels = [
      'Administrativa',
      'Gerencia del proyecto',
      'Estrategia institucional',
      'Planificación y monitoreo',
      'Aspectos técnicos',
      'Contexto externo',
      'Actores claves',
      'Gestión de conflictos',
      'Otra'
    ];
  
    const colors = [
      '#2196F3', // Azul
      '#9C27B0', // Púrpura
      '#FF9800', // Naranja
      '#4CAF50', // Verde
      '#F44336', // Rojo
      '#00BCD4', // Cian
      '#FFC107', // Ámbar
      '#795548', // Marrón
      '#607D8B'  // Gris azulado
    ];
  
    // Filtrar solo los datos que tienen valores mayores a 0
    const filteredData = data.map((value, index) => ({
      value,
      label: labels[index],
      color: colors[index]
    })).filter(item => item.value > 0);
  
    this.chartAprendizajes = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: filteredData.map(item => item.label),
        datasets: [{
          data: filteredData.map(item => item.value),
          backgroundColor: filteredData.map(item => item.color),
          borderWidth: 0,
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
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            titleColor: '#333',
            bodyColor: '#666',
            borderColor: '#ddd',
            borderWidth: 1,
            padding: 8,
            callbacks: {
              label: (context) => {
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                const value = context.raw as number;
                const percentage = ((value / total) * 100).toFixed(1);
                return `${context.label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      },
      plugins: [{
        id: 'centerText',
        beforeDraw(chart: any) {
          const { ctx, width, height } = chart;
          ctx.restore();
          
          const total = chart.data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
          
          const fontSize = Math.min(width / 8, height / 8, 24);
          ctx.font = `bold ${fontSize}px sans-serif`;
          ctx.textBaseline = 'middle';
          ctx.textAlign = 'center';
          
          ctx.fillStyle = '#333';
          ctx.fillText(total.toString(), width / 2, height / 2);
          
          const labelFontSize = fontSize / 2;
          ctx.font = `${labelFontSize}px sans-serif`;
          ctx.fillStyle = '#666';
          ctx.fillText('Total', width / 2, height / 2 + fontSize);
          
          ctx.save();
        }
      }]
    });
  }

  getColor(key: string): string {
    const colorMap: { [key: string]: string } = {
      'administrativos': '#2196F3',
      'gerencia': '#9C27B0',
      'estrategia': '#FF9800',
      'planificacion': '#4CAF50',
      'tecnicos': '#F44336',
      'contexto': '#00BCD4',
      'actores': '#FFC107',
      'conflictos': '#795548',
      'otros': '#607D8B'
    };
    return colorMap[key] || '#607D8B';
  }
  
  getLabelName(key: string): string {
    const labelMap: { [key: string]: string } = {
      'administrativos': 'Administrativa',
      'gerencia': 'Gerencia del proyecto',
      'estrategia': 'Estrategia institucional',
      'planificacion': 'Planificación y monitoreo',
      'tecnicos': 'Aspectos técnicos',
      'contexto': 'Contexto externo',
      'actores': 'Actores claves',
      'conflictos': 'Gestión de conflictos',
      'otros': 'Otra'
    };
    return labelMap[key] || key;
  }

  // ====== ======= ====== ====== OCTAVA TARJETA ACTIVIDADES ====== ======= ====== ======
  actividades: {
    id_proy_actividad: number;
    idp_actividad_estado: number | null;
    fecha_inicio: string;
    fecha_fin: string;
  }[] = [];
  
  actividadesConteo = {
    vencidas: 0,
    porVencer: 0,
    vigentes: 0
  };
  
  processActivityStatus(actividades: any[]) {
    // Reiniciar contadores
    this.actividadesConteo = {
      vencidas: 0,
      porVencer: 0,
      vigentes: 0
    };
  
    // Obtener la fecha actual
    const today = new Date();
    const fechaActual = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    ); // Sin horas para evitar problemas de comparación
  
    actividades.forEach(actividad => {
      const { idp_actividad_estado, fecha_fin } = actividad;
  
      // Validar que el estado y la fecha fin sean válidos
      if (idp_actividad_estado === 1 && fecha_fin) {
        const fechaFin = new Date(fecha_fin);
        const diferenciaDias = Math.floor((fechaFin.getTime() - fechaActual.getTime()) / (1000 * 60 * 60 * 24));
  
        if (fechaActual > fechaFin) {
          // Actividad vencida
          this.actividadesConteo.vencidas++;
        } else if (diferenciaDias > 0 && diferenciaDias <= 7) {
          // Por vencer
          this.actividadesConteo.porVencer++;
        } else if (diferenciaDias > 7) {
          // Vigente
          this.actividadesConteo.vigentes++;
        }
      }
    });
  }
  

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
    private countHeaderData(data: any) {
      if (!data) return;
    
      // Objetivos Específicos (del proyecto)
      this.headerDataNro01 = this.headerDataNro01 ?? 0;
      console.log('Valor final headerDataNro01:', this.headerDataNro01);
    
      // Resultados (resultados esperados del proyecto)
      this.headerDataNro02 = this.headerDataNro02 ?? 0;
    
      // Indicadores (del proyecto)
      this.headerDataNro03 = data.indicadores?.length || 0;
    
      // Actividades Planificadas (actividades en estado planificado)
      this.headerDataNro04 = data.actividades?.filter((act: any) => 
        act.idp_actividad_estado === 1).length || 0;
    }
}