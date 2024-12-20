import { Component, OnInit, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { ProyectoService } from '../../services/proyectoData.service';
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
  meses = ['En', 'Fe', 'Ma', 'Ab', 'My', 'Ju', 'Jl', 'Ag', 'Se', 'Oc', 'No', 'Di'];
seleccionados: number[] = []; // Días seleccionados

toggleCheckbox(dia: number): void {
  if (this.seleccionados.includes(dia)) {
    // Si el día ya está seleccionado, lo eliminamos
    this.seleccionados = this.seleccionados.filter(d => d !== dia);
    console.log(`Día ${dia} deseleccionado. Seleccionados: ${this.seleccionados}`);
  } else {
    // Si el día no está seleccionado, lo agregamos
    this.seleccionados.push(dia);
    console.log(`Día ${dia} seleccionado. Seleccionados: ${this.seleccionados}`);
  }
}



  actividades: any[] = [];
  tareas: any[] = []; // Array para almacenar las tareas del Gantt
  links: any[] = [];  // Array para almacenar las relaciones entre tareas
  mainPage = 1;
  mainPageSize = 10;
  totalLength = 0;
    constructor(
      private modalService: NgbModal,
      private proyectoService: ProyectoService,
      private servicios: servicios,
      private servActividad: servActividad,
      private servActAvance: servActAvance
    ) {}

    // ======= ======= HEADER SECTION ======= =======
    idProyecto: any = parseInt(localStorage.getItem('currentIdProy'));
    idPersonaReg: any = parseInt(localStorage.getItem('currentIdPer'));
    namePersonaReg: any = localStorage.getItem('userFullName');
    onChildSelectionChange(selectedId: any) {
      this.idProyecto = selectedId;
      localStorage.setItem('currentIdProy', (this.idProyecto).toString());
      this.proyectoService.seleccionarProyecto(this.idProyecto);
      // ======= *ADD A GETTER DOWN HERE* =======
      //this.getLogros();
    }

    headerDataNro01: any = 0;
    headerDataNro02: any = 0;
    headerDataNro03: any = 0;
    headerDataNro04: any = 0;
    // ======= ======= ======= ======= =======

    declaraciones: any = [];
    nuevoEjecutado: any = [];
    motivo: any = [];

    id_proy_actividad: any = "";
    id_proyecto: any = "";
    id_proy_elemento_padre: any = "";
    codigo: any = "";
    actividad: any = "";
    descripcion: any = "";
    orden: any = "";
    id_proy_acti_repro: any = "";
    presupuesto: any = "";
    fecha_inicio: any = "";
    fecha_fin: any = "";
    resultado: any = "";
    idp_actividad_estado: any = "";
    

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
    jsonToString(json: object): string {
      return JSON.stringify(json);
    }
    stringToJson(jsonString: string): object {
      return JSON.parse(jsonString);
    }
    getDescripcionSubtipo(idRegistro: any, paramList: any): string{
      const subtipo = paramList.find(elem => elem.id_subtipo == idRegistro);
      return subtipo ? subtipo.descripcion_subtipo : 'Null';
    }
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
    // ======= ======= ======= ======= =======
    // ======= ======= GET PARAMETRICAS ======= =======
    getParametricas(){
    }
    // ======= ======= ======= ======= =======
    // ======= ======= OPEN MODALS FUN ======= =======
    private modalRef: NgbModalRef | null = null;
        openModal(content: TemplateRef<any>) {
          this.modalRef = this.modalService.open(content, { size: 'xl' });
        }
    
        closeModal() {
          if (this.modalRef) {
            this.modalRef.close(); 
            this.modalRef = null;
          }
        }
    // ======= ======= ======= ======= =======
    // ======= ======= GET MODAL TITLE FUN ======= =======
    getModalTitle(modalAction: any){
      this.modalTitle = (modalAction == "add")?("Añadir Actividad"):(this.modalTitle);
      this.modalTitle = (modalAction == "edit")?("Editar Actividad"):(this.modalTitle);
      return this.modalTitle;
    }
    // ======= ======= ======= ======= =======
    actividadSelected: any = null;

    checkboxChanged(actividadSel: any){
      this.actividad.forEach(actividad => {
        if(actividadSel.id.proy_actividad == actividad.id.proy_actividad){
          if(actividadSel.selected){
            actividad.selected = true;
            this.actividadSelected = actividad;
          }
        }
      })
    }

    // ======= ======= INIT PERSONA ROLES NGMODEL ======= =======
    initActividadModel(){
      this.modalTitle = "";

      this.id_proy_actividad = "";
      this.id_proyecto = "";
      this.id_proy_elemento_padre = "";
      this.codigo = "";
      this.actividad = "";
      this.descripcion = "";
      this.orden = "";
      this.id_proy_acti_repro = "";
      this.presupuesto = "";
      this.fecha_inicio = "";
      this.fecha_fin = "";
      this.resultado = "";
      this.idp_actividad_estado = "";
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
          console.log ('estas son las actividades : ',this.actividades);
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
        p_id_proyecto: parseInt(this.idProyecto,10),
        p_id_proy_elemento_padre: parseInt(this.id_proy_elemento_padre,10),
        p_codigo: this.codigo,
        p_actividad: this.actividad,
        p_descripcion: this.descripcion,
        p_orden: parseInt(this.orden,10),
        p_id_proy_acti_repro: parseInt(this.id_proy_acti_repro,10),
        p_presupuesto: parseInt(this.presupuesto,10),
        p_fecha_inicio: this.fecha_inicio,
        p_fecha_fin: this.fecha_fin,
        p_resultado: this.resultado,
        p_idp_actividad_estado: parseInt(this.idp_actividad_estado,10)
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

      this.id_proy_actividad = this.actividadSelected.id.proy_actividad;

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