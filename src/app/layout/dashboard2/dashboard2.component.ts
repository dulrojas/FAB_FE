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
  obligaciones: any[] = [];
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
      this.getProyectDateGaps();
      
    }
  // ======= ======= HEADER SECTION  "NO TOCAR"======= =======
    // Contadores de Header
    headerDataNro01: any = 0;
    headerDataNro02: any = 0;
    headerDataNro03: any = 0;
    headerDataNro04: any = 0;
  // ====== ======= ====== ====== ======= ====== INIT VIEW FUN ====== ======= ====== ====== ======= ======
    ngOnInit() {
      console.log("Estado inicial del componente:", this.proyectoScope);
      this.getDashboardData();
      this.getProyectDateGaps();
         
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
          
        //TARJETA 2 
          // Actualizar datos del proyecto
          this.proyectoScope = {
            fecha_inicio: data[0].dato[0].fecha_inicio,
            fecha_fin: data[0].dato[0].fecha_fin,
            fecha_fin_ampliada: data[0].dato[0].fecha_fin_ampliada,
            fecha_fin_real: data[0].dato[0].fecha_fin_real
          };
          // Llamar a la función para calcular y actualizar el periodo actual
          this.calculatePeriodoActual();

        //TARJETA 3
        this.moneda_presupuesto = data[0].dato[0].moneda_presupuesto || 'Bs';
        this.presupuesto_me = Number(data[0].dato[0].presupuesto_me) || 0;
        this.presupuesto_mn = Number(data[0].dato[0].presupuesto_mn) || 0;
        this.createPresupuestoChart();
          
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
    // ======= ======= UPLOAD IMAGE FUN ======= =======
          uploadFile(file: any, idRegistro: any, nombreRegistro: any){
            this.servicios.uploadFile(file, "persona", "ruta_foto", "id_persona", nombreRegistro, idRegistro).subscribe(
              (response) => {
                //console.log('Archivo subido correctamente:', response);
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
                //console.warn('La respuesta no es un Blob:', response);
                this.imageSrc = null; 
              }
            },
            (error) => {
              if (error.status === 404) {
                //console.warn('No se encontró imagen para el registro:', idRegistro);
                this.imageSrc = null;
              } else {
                //console.error('Error al descargar la imagen:', error);
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
      periodoActual: string = ''; // Esta variable ya está presente pero se optimiza el cálculo.
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
          console.log("Periodo actual calculado:", this.periodoActual);
        }

  // ====== ======= ====== ====== TERCERA TARJETA DONA DE PRESUPUESTO DEL PROYECTO ====== ======= ====== ======   
      moneda_presupuesto: string = '';
      presupuesto_me: number = 0;
      presupuesto_mn: number = 0;
      chartPresupuesto: any;

      calcularPorcentajePresupuesto(): number {
        if (this.presupuesto_me === 0) return 0;
        const porcentaje = (this.presupuesto_mn / this.presupuesto_me) * 100;
        return Math.min(Math.round(porcentaje), 100);
      }
      
      // Agregar este método para formatear números como moneda
      formatearMoneda(valor: number): string {
        return new Intl.NumberFormat('es-BO', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(valor);
      }
      
      // Método para crear y actualizar el gráfico
      createPresupuestoChart() {
        const ctx: any = document.getElementById('presupuestoChart') as HTMLCanvasElement;
        if (this.chartPresupuesto) {
          this.chartPresupuesto.destroy();
        }
      
        const porcentaje = this.calcularPorcentajePresupuesto();
        const restante = 100 - porcentaje;
      
        this.chartPresupuesto = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['Ejecutado', 'Restante'],
            datasets: [{
              data: [porcentaje, restante],
              backgroundColor: ['#4CAF50', '#E0E0E0'],
              borderWidth: 0
            }]
          },
          options: {
            responsive: true,
            cutout: '75%',
            plugins: {
              tooltip: {
                callbacks: {
                  label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw}%`
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
              
              const fontSize = height / 8;
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


  // ====== ======= ====== ====== ======= ====== ====== ======= ====== ====== ======= ====== ====== ======= ======  ======= ======


    // ====== Contar datos del header ======
    countHeaderData(): void {
      this.headerDataNro01 = this.obligaciones.length;
      this.headerDataNro02 = this.obligaciones.filter((o) => o.estado === 'Cumplida').length;
      this.headerDataNro03 = this.obligaciones.filter((o) => o.estado === 'Incumplida').length;
      this.headerDataNro04 = this.obligaciones.filter((o) => o.estado === 'En proceso').length;
    }

      

}