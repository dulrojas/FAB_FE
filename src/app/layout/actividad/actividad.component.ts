import { Component, OnInit, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { servicios } from "../../servicios/servicios";
import { servActividad } from "../../servicios/actividad";
import { servActAvance } from "../../servicios/actividadAvance";


import { Chart } from 'chart.js/auto'; // Importación de Chart.js

@Component({
    selector: 'app-actividades',
    templateUrl: './actividad.component.html',
    styleUrls: ['./actividad.component.scss'],
    animations: [routerTransition()]
})

export class ActividadComponent implements OnInit {

  actividades: any[] = [];
  tareas: any[] = []; // Array para almacenar las tareas del Gantt
  links: any[] = [];  // Array para almacenar las relaciones entre tareas
  mainPage = 1;
  mainPageSize = 10;
  totalLength = 0;
    constructor(
      private modalService: NgbModal,
      private servicios: servicios,
      private servActividad: servActividad,
      private servActAvance: servActAvance,
        private cdr: ChangeDetectorRef
    ) {}
    idProyecto: any = 1;
    idPersonaReg: any = 1;

    headerDataNro01: any = 0;
    headerDataNro02: any = 0;
    headerDataNro03: any = 0;
    headerDataNro04: any = 0;

    declaraciones: any = [];
    nuevoEjecutado: any = [];
    motivo: any = [];
    

    // ======= ======= NGMODEL VARIABLES SECTION ======= =======
    modalAction: any = "";
    modalTitle: any = "";
    // ======= ======= INIT VIEW FUN ======= =======
    ngOnInit(): void{
      this.getParametricas();
      this.getActividad();
      this.createDoughnutChart();
      this.createDoughnutChart2024();
      
    }
// ======= ======= ======= ======= =======
    // ======= ======= ======= ======= =======
    // ======= ======= GET PARAMETRICAS ======= =======
    getParametricas(){
    }
    // ======= ======= ======= ======= =======
    // ======= ======= OPEN MODALS FUN ======= =======
    openModal(content: TemplateRef<any>) {
      this.modalService.open(content, { size: 'xl' });
    }
    // ======= ======= ======= ======= =======
    // ======= ======= GET MODAL TITLE FUN ======= =======
    getModalTitle(modalAction: any){
      this.modalTitle = (modalAction == "add")?("Añadir Actividad"):(this.modalTitle);
      this.modalTitle = (modalAction == "edit")?("Editar Actividad"):(this.modalTitle);
      return this.modalTitle;
    }
    // ======= ======= ======= ======= =======
    // ======= ======= INIT PERSONA ROLES NGMODEL ======= =======
    initActividadModel(){
      this.modalTitle = "";
    }
    // ======= ======= ======= ======= =======
    // ======= ======= COUNT HEADER DATA FUCTION ======= =======
    countHeaderData(){
      this.headerDataNro01 = this.actividades.length;
      this.actividades.forEach(actividad =>{
      });
    }
    // ======= ======= ======= ======= =======
    // ======= ======= GET PERSONAS ======= =======
    getActividad(){
      this.servActividad.getActividadesByIdProy(this.idProyecto).subscribe(
        (data) => {
          this.actividades = data[0].dato;
          this.actividades.forEach((actividad)=>{
            this.servActAvance.getActAvanceByIdAct(actividad.id_proy_actividad).subscribe(
              (data) =>{
                actividad.actAvances = data[0].dato;
              },
              (error) => {
                console.error(error);
              }
            );
          });
          console.log(this.actividades);
          this.countHeaderData();
        },
        (error) => {
          console.error(error);
        }
      );

    }
    // ======= ======= ======= ======= =======
    // ======= ======= INIT ADD PERSONA ROLES ======= =======
    initAddActividad(modalScope: TemplateRef<any>){
      this.initActividadModel();

      this.modalAction = "add";
      this.modalTitle = this.getModalTitle("add");

      this.openModal(modalScope);
    }
    // ======= ======= ======= ======= =======
    // ======= ======= EDIT APRENDIZAJE ======= =======
    addActividad(){
      const objActividad = {
        p_id_proy_actividad: 0,
      };

      this.servActividad.addActividad(objActividad).subscribe(
        (data) => {
          this.getActividad();
        },
        (error) => {
          console.error(error);
        }
      );
    }
    // ======= ======= ======= ======= =======
    // ======= ======= INIT EDIT PERSONA ROLES ======= =======
    initEditActividad(modalScope: TemplateRef<any>){
      this.initActividadModel();

      this.modalAction = "edit";
      this.modalTitle = this.getModalTitle("edit");

      this.openModal(modalScope);
    }
    // ======= ======= ======= ======= =======
    // ======= ======= EDIT APRENDIZAJE ======= =======
    editActividad(){
      const objActividad = {
        p_id_proy_aprende: 0,
        p_id_proyecto: parseInt(this.idProyecto,10),
        p_fecha_hora_reg: null
      };

      this.servActividad.editActividad(objActividad).subscribe(
        (data) => {
          this.getActividad();
        },
        (error) => {
          console.error(error);
        }
      );

    }
    // ======= ======= ======= ======= =======
    // ======= ======= INIT DELETE PERSONA ROLES ======= =======
    initDeleteActividad(){
      
    }
    // ======= ======= ======= ======= =======
    // ======= ======= SUBMIT FORM ======= =======
    onSubmit(): void {
      if(this.modalAction == "add"){
        this.addActividad();
      }
      else{
        //this.editActividad();
      }
    }
    // ======= ======= ======= ======= =======

    // ====== ======= ====== Primer Grafico Ejecucucion financiera ====== ======= ======
        createDoughnutChart() {
        const ctx: any = document.getElementById('doughnutChart') as HTMLCanvasElement;

        new Chart(ctx, {
                type: 'doughnut',
          data: {
            labels: ['Gastado', 'Restante'], // Etiquetas
            datasets: [
              {
                label: 'Presupuesto 2024',
                data: [25, 75], // Porcentajes
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

    // ====== ======= ====== Segundo Grafico Ejecucucion financiera 2024 ====== ======= ======
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

    
}