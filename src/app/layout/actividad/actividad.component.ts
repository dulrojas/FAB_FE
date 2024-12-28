import { Component, OnInit, TemplateRef, EventEmitter, Output } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { ProyectoService } from '../../services/proyectoData.service';
import { servicios } from "../../servicios/servicios";
import { servActividad } from "../../servicios/actividad";
import { servActAvance } from "../../servicios/actividadAvance";
import { servPresupuesto } from "../../servicios/presupuesto";
import { servPresuAvance } from "../../servicios/presuAvance";

import { Chart } from 'chart.js/auto';

@Component({
    selector: 'app-actividades',
    templateUrl: './actividad.component.html',
    styleUrls: ['../../../styles/styles.scss'],
    animations: [routerTransition()]
})

export class ActividadComponent implements OnInit {
    mainPage = 1;
    mainPageSize = 10;
    totalLength = 0;
    constructor(
      private modalService: NgbModal,
      private proyectoService: ProyectoService,
      private servicios: servicios,
      private servActividad: servActividad,
      private servActAvance: servActAvance,
      private servPresupuesto: servPresupuesto,
      private servPresuAvance: servPresuAvance
    ) {}

    // ======= ======= HEADER SECTION ======= =======
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

      this.getActividades();
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

    monto: any = 0;
    periodo: any = "";
    presupuestoProy: any = 0;
    ejecutadoProy: any = 0;
    gestion: any = "";
    presupuestoGest: any = 0;
    ejecutadoGest: any = 0;

    actividades: any[] = [];
    presuAvances: any[] = [];

    tareas: any[] = [];
    links: any[] = [];

    meses = ['En', 'Fe', 'Ma', 'Ab', 'My', 'Ju', 'Jl', 'Ag', 'Se', 'Oc', 'No', 'Di'];
    seleccionados: number[] = [];
    
    // ====== ======= ====== CHARTS CONFIG SECTION ====== ======= ======
    chartLabels: any = [
      "Ejecutado",
      "Restante"
    ];
    chartBgColors: any = [
      "#BF5F3B",
      "#FFFFFF"
    ];
    // ====== ======= ====== ======= ====== ======= ======
    // ====== ======= ====== PRESUPUESTO PROYECTO SECTION ====== ======= ======
    createDoughnutChartProyecto() {
      const ctx: any = document.getElementById('doughnutChartProyecto') as HTMLCanvasElement;

      let porcentajeGrafico = parseFloat((100*(this.ejecutadoProy / this.presupuestoProy)).toFixed(2));

      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: this.chartLabels,
          datasets: [
            {
              label: 'Presupuesto del proyecto',
              data: [
                porcentajeGrafico, 
                100 - porcentajeGrafico
              ],
              backgroundColor: this.chartBgColors,
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          cutout: '75%',
          plugins: {
            tooltip: {
              callbacks: {
                label: (tooltipItem) =>
                  `${tooltipItem.label}: ${tooltipItem.raw}%`,
              },
            },
            legend: {
              display: false,
            },
          },
        },
        plugins: [
          {
            id: 'centerText',
            beforeDraw(chart: any) {
              const width = chart.width;
              const height = chart.height;
              const ctx = chart.ctx;
              ctx.restore();
    
              const fontSize = (height / 100).toFixed(2);
              ctx.font = `${fontSize}em sans-serif`;
              ctx.textBaseline = 'middle';
    
              const text = porcentajeGrafico+'%';
              const textX = Math.round((width - ctx.measureText(text).width) / 2);
              const textY = height / 2;
    
              ctx.fillStyle = '#000';
              ctx.fillText(text, textX, textY);
              ctx.save();
            },
          },
        ],
      });
    }
    // ====== ======= ====== ======= ====== ======= ======
    // ====== ======= ====== PRESUPUESTO GESTION SECTION ====== ======= ======
    createDoughnutChartGestion() {
      const ctx: any = document.getElementById('doughnutChartGestion') as HTMLCanvasElement;

      let porcentajeGrafico = parseFloat((100*(this.ejecutadoGest / this.presupuestoGest)).toFixed(2));
    
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: this.chartLabels,
          datasets: [
            {
              label: 'Presupuesto del proyecto',
              data: [
                porcentajeGrafico, 
                100 - porcentajeGrafico
              ],
              backgroundColor: this.chartBgColors,
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          cutout: '75%',
          plugins: {
            tooltip: {
              callbacks: {
                label: (tooltipItem) =>
                  `${tooltipItem.label}: ${tooltipItem.raw}%`,
              },
            },
            legend: {
              display: false,
            },
          },
        },
        plugins: [
          {
            id: 'centerText',
            beforeDraw(chart: any) {
              const width = chart.width;
              const height = chart.height;
              const ctx = chart.ctx;
              ctx.restore();
    
              const fontSize = (height / 100).toFixed(2);
              ctx.font = `${fontSize}em sans-serif`;
              ctx.textBaseline = 'middle';
    
              const text = porcentajeGrafico+'%';
              const textX = Math.round((width - ctx.measureText(text).width) / 2);
              const textY = height / 2;
    
              ctx.fillStyle = '#000';
              ctx.fillText(text, textX, textY);
              ctx.save();
            },
          },
        ],
      });
    }
    // ====== ======= ====== ======= ====== ======= ======
    // ======= ======= INIT VIEW FUN ======= =======
    ngOnInit(): void{
      this.getParametricas();
      this.getPresupuestoEjecutado();
      this.getPresuAvance();
      this.getActividades();
    }
    // ======= ======= ======= ======= =======
    // ======= ======= OPEN MODALS FUN ======= =======
    modalAction: any = "";
    modalTitle: any = "";

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
    getModalTitle(modalAction: any){
      this.modalTitle = (modalAction == "add")?("Añadir Actividad"):(this.modalTitle);
      this.modalTitle = (modalAction == "edit")?("Editar Actividad"):(this.modalTitle);
      return this.modalTitle;
    }
    // ======= ======= ======= ======= =======

    // ======= ======= GET PARAMETRICAS ======= =======
    getParametricas(){
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

    // ======= ======= ACTIVIDADES FUN ======= =======
    parseAmountStrToFloat(amount: any): number {
      amount = amount.replace(',', '');
      amount = parseFloat(amount);

      return amount;
    }
    parseAmountFloatToStr(amount: any): string {
      amount = amount.toFixed(2);
      amount = amount.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

      return amount;
    }
    // ======= ======= ======= ======= =======
    // ======= ======= INIT ACTIVIDAD NGMODEL ======= =======
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
    // ======= ======= GET PRESUPUESTO EJECUTADO ======= =======
    getPresupuestoEjecutado(){
      this.servicios.getPresupuestoEjecutadoByIdProy(this.idProyecto).subscribe(
        (data) => {
          let dataReq = data[0].dato[0];

          dataReq.presupuesto_mn = this.parseAmountStrToFloat(dataReq.presupuesto_mn.slice(1));

          dataReq.pro_act_ava_ejecutado = this.parseAmountStrToFloat(dataReq.pro_act_ava_ejecutado.slice(1));
          dataReq.pro_pre_ava_ejecutado = this.parseAmountStrToFloat(dataReq.pro_pre_ava_ejecutado.slice(1));

          dataReq.pro_act_presupuesto_gestion = this.parseAmountStrToFloat(dataReq.pro_act_presupuesto_gestion.slice(1))
          dataReq.pro_act_ava_ejecutado_gestion = this.parseAmountStrToFloat(dataReq.pro_act_ava_ejecutado_gestion.slice(1))
          dataReq.pro_pre_ava_ejecutado_gestion = this.parseAmountStrToFloat(dataReq.pro_pre_ava_ejecutado_gestion.slice(1))

          this.monto = 0;
    
          this.presupuestoProy = dataReq.presupuesto_mn;
          this.ejecutadoProy = dataReq.pro_act_ava_ejecutado + dataReq.pro_pre_ava_ejecutado;
    
          this.gestion = dataReq.gestion_actual;
          this.presupuestoGest = dataReq.pro_act_presupuesto_gestion;
          this.ejecutadoGest = dataReq.pro_act_ava_ejecutado_gestion + dataReq.pro_pre_ava_ejecutado_gestion;
          
          this.createDoughnutChartProyecto();
          this.createDoughnutChartGestion();
        },
        (error) => {
          console.error(error);
        }
      );

    }
    // ======= ======= ======= ======= =======
    // ======= ======= GET PRESU AVANCE ======= =======
    getPresuAvance(){
      this.servPresuAvance.getPresuAvanceByIdProy(this.idProyecto).subscribe(
        (data) => {
          this.presuAvances = data[0].dato;
        },
        (error) => {
          console.error(error);
        }
      );

    }
    // ======= ======= ======= ======= =======
    // ======= ======= GET ACTIVIDADES ======= =======
    getActividades(){
      this.servActividad.getActividadesByIdProy(this.idProyecto).subscribe(
        (data) => {
          this.actividades = data[0].dato;

          this.actividades.forEach((actividad)=>{
            actividad.presupuesto = (actividad.presupuesto)?(this.parseAmountStrToFloat(actividad.presupuesto.slice(1))):(0);
          });
          
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
          this.getActividades();
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
          this.getActividades();
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
}