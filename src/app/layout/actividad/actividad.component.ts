import { Component, OnInit, TemplateRef, EventEmitter, Output, QueryList, ViewChildren, ElementRef, AfterViewChecked } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { ProyectoService } from '../../services/proyectoData.service';
import { servicios } from "../../servicios/servicios";
import { ElementosService } from "../../servicios/elementos";
import { servActividad } from "../../servicios/actividad";
import { servActAvance } from "../../servicios/actividadAvance";
import { servPresupuesto } from "../../servicios/presupuesto";
import { servPresuAvance } from "../../servicios/presuAvance";

import { Chart } from 'chart.js/auto';
import { log } from 'console';

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
      private ElementosService: ElementosService,
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
      
      this.getPresupuestoEjecutado();
      this.getPresuAvance();
      this.getActividades();
    }

    headerDataNro01: any = 0;
    headerDataNro02: any = 0;
    headerDataNro03: any = 0;
    headerDataNro04: any = 0;
    // ======= ======= ======= ======= =======
    id_proy_actividad: any = "";
    id_proyecto: any = "";
    id_proy_elemento_padre: any = "";
    proy_elemento_padre: any = "";
    codigo: any = "";
    actividadText: any = "";
    descripcion: any = "";
    orden: any = "";
    id_proy_acti_repro: any = "";
    proy_acti_repro: any = "";
    presupuesto: any = "";
    fecha_inicio: any = "";
    fecha_fin: any = "";
    resultado: any = "";
    idp_actividad_estado: any = "";

    periodo: any = "";
    presupuestoProy: any = 0;
    ejecutadoProy: any = 0;
    gestion: any = "";
    presupuestoGest: any = 0;
    ejecutadoGest: any = 0;

    doughnutChartProy: any = null;
    doughnutChartGest: any = null;
    halfCircleChart: any = null;

    montoNuevoEjecutado: any = null;
    motivoNuevoEjecutado: any = null;

    elementos: any[] = [];

    elementosGant: any[] = [];

    actividades: any[] = [];
    presuAvances: any[] = [];
    
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

      if(this.doughnutChartProy) {
        this.doughnutChartProy.destroy();
        this.doughnutChartProy = null;
      }

      let porcentajeGrafico = parseFloat((100*(this.ejecutadoProy / this.presupuestoProy)).toFixed(2));

      this.doughnutChartProy = new Chart(ctx, {
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

      if(this.doughnutChartGest) {
        this.doughnutChartGest.destroy();
        this.doughnutChartGest = null;
      }

      let porcentajeGrafico = parseFloat((100*(this.ejecutadoGest / this.presupuestoGest)).toFixed(2));
    
      this.doughnutChartGest = new Chart(ctx, {
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
    // ====== ======= ====== HALF CIRCLE SECTION ====== ======= ====== 
    @ViewChildren('canvas') canvases!: QueryList<ElementRef>;

    ngAfterViewInit() {
      console.log('Elementos Gant:', this.elementosGant);
      console.log('Canvas encontrados:', this.canvases.length);

      setTimeout(() => {
        console.log('Canvas después del setTimeout:', this.canvases.length);
        this.initializeCharts();
      }, 0);
    }
    
    initializeCharts() {
      this.canvases.forEach((canvasRef, index) => {
        const ctx = canvasRef.nativeElement.getContext('2d');
        const actividad = this.elementosGant[0].childrens[index];
        this.createHalfCircleChart(ctx, actividad.ejecutado, actividad.presupuesto);
      });
    }
  
    createHalfCircleChart(ctx: CanvasRenderingContext2D, ejecutado: number, presupuesto: number) {
      const porcentajeAvance = 25;
      const porcentajeRestante = 100 - porcentajeAvance;
  
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Avance', 'Restante'],
          datasets: [
            {
              data: [porcentajeAvance, porcentajeRestante],
              backgroundColor: ['#4caf50', '#e0e0e0'],
            },
          ],
        },
        options: {
          responsive: true,
          rotation: -90,
          circumference: 180,
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
      });
    }
    // ======= ======= ======= ======= ======= ======= =======
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
      this.ElementosService.getElementosByProyecto(this.idProyecto).subscribe(
        (data) => {
          this.elementos = (data[0].dato)?(data[0].dato):([]);
        },
        (error) => {
          console.error(error);
        }
      );
    }
    // ======= ======= ======= ======= =======
    actividadSelected: any = null;

    checkboxChanged(actividadSel: any){
      this.actividades.forEach(actividad => {
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
    onChangedMontoNuevoEjecutado(){
      if(/[a-zA-Z]/.test(this.montoNuevoEjecutado)) {
        this.montoNuevoEjecutado = "0.00";
        return;
      }
      this.montoNuevoEjecutado = this.parseAmountStrToFloat(this.montoNuevoEjecutado);
      this.montoNuevoEjecutado = this.parseAmountFloatToStr(this.montoNuevoEjecutado);
    }

    onPadreChanged(){
      let elementoScope = (this.elementos.find((elemento)=>(elemento.id_proy_elemento == this.id_proy_elemento_padre)));
      this.proy_elemento_padre = elementoScope.elemento;
    }
    // ======= ======= ======= ======= =======
    // ======= ======= INIT ACTIVIDAD NGMODEL ======= =======
    initActividadModel(){
      this.modalTitle = "";

      this.id_proy_actividad = "";
      this.id_proyecto = "";
      this.id_proy_elemento_padre = "";
      this.codigo = "";
      this.actividadText = "";
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
    valMontoNuevoEjecutado: any = true;
    validateMontoNuevoEjecutado(){
      if((this.montoNuevoEjecutado)&&((this.parseAmountStrToFloat(this.montoNuevoEjecutado))>0)){
        this.valMontoNuevoEjecutado = true;
      }
      else{
        this.valMontoNuevoEjecutado = false;
      }
    }

    valMotivoNuevoEjecutado: any = true;
    validateMotivoNuevoEjecutado(){
      if((this.motivoNuevoEjecutado)&&(this.motivoNuevoEjecutado.length < 100)){
        this.valMotivoNuevoEjecutado = true;
      }
      else{
        this.valMotivoNuevoEjecutado = false;
      }
    }
    // ======= ======= GET PRESU AVANCE ======= =======
    getPresuAvance(){
      this.servPresuAvance.getPresuAvanceByIdProy(this.idProyecto).subscribe(
        (data) => {
          this.presuAvances = (data[0].dato)?(data[0].dato):([]);
        },
        (error) => {
          console.error(error);
        }
      );
    }
    // ======= ======= ======= ======= =======
    // ======= ======= ADD PRESU AVANCE ======= =======
    addPresuAvance(){
      this.validateMontoNuevoEjecutado();
      this.validateMotivoNuevoEjecutado();

      let valPreAva = this.valMontoNuevoEjecutado && this.valMotivoNuevoEjecutado;

      if(valPreAva){  
        let objPresuAvance = {
          p_id_proy_presu_avance: null,
          p_id_proy_presupuesto: 1,
          p_monto_avance: this.parseAmountStrToFloat(this.montoNuevoEjecutado),
          p_id_persona: this.idPersonaReg,
          p_fecha_hora: null,
          p_motivo: this.motivoNuevoEjecutado,
          p_id_proyecto: 0
        };

        this.servPresuAvance.addPresuAvance(objPresuAvance).subscribe(
          (data) => {
            this.montoNuevoEjecutado = null;
            this.motivoNuevoEjecutado = null;

            this.getPresuAvance();
          },
          (error) => {
            console.error(error);
          }
        );
      }
    }
    // ======= ======= ======= ======= =======
    // ======= ======= GET ACTIVIDADES ======= =======
    getActividades(){
      this.servActividad.getActividadesByIdProy(this.idProyecto).subscribe(
        (data) => {
          this.actividades = (data[0].dato)?(data[0].dato):([]);

          this.actividades.forEach((actividad)=>{
            actividad.presupuesto = (actividad.presupuesto)?(this.parseAmountStrToFloat(actividad.presupuesto.slice(1))):(0);
          });

          this.elementosGant = [];
          this.elementos.forEach((elemento)=>{
            let elementoToAdd = {...elemento};
            elementoToAdd.childrens = this.actividades.filter(
              (actividadObj) =>
                actividadObj.codigo.startsWith(elemento.codigo.slice(0, -2))
            );

            this.elementosGant.push(elementoToAdd);
          });

          this.elementosGant = this.elementosGant.filter(
            (elementoGant)=>(
              elementoGant.childrens.length > 0
            )
          );

          this.countHeaderData();
          //this.initializeCharts();
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
      let actividadCodigo = ((this.elementos.find(
        (elemento)=>(this.id_proy_elemento_padre == elemento.id_proy_elemento)
      )).codigo);

      actividadCodigo = actividadCodigo.slice(0,(actividadCodigo.length - 1));

      console.log(this.elementosGant);

      actividadCodigo = actividadCodigo+(666);

      const objActividad = {
        p_id_proy_actividad: 0,
        p_id_proyecto: parseInt(this.idProyecto,10),
        p_id_proy_elemento_padre: parseInt(this.id_proy_elemento_padre, 10),
        p_codigo: actividadCodigo,
        p_actividad: this.actividadText,
        p_descripcion: this.descripcion,
        p_orden: parseInt(this.orden,10),
        p_id_proy_acti_repro: parseInt(this.id_proy_acti_repro, 10),
        p_presupuesto: parseInt(this.presupuesto,10),
        p_fecha_inicio: this.fecha_inicio,
        p_fecha_fin: this.fecha_fin,
        p_resultado: this.resultado,
        p_idp_actividad_estado: parseInt(this.idp_actividad_estado, 10)
      };

      console.log(objActividad);

      /*this.servActividad.addActividad(objActividad).subscribe(
        (data) => {
          this.getActividades();
        },
        (error) => {
          console.error(error);
        }
      );*/
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