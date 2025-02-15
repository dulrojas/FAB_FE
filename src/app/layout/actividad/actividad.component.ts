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
import { forkJoin } from 'rxjs';

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
      
      this.getParametricas();
      this.getPresupuestoEjecutado();
      this.getPresuAvance();
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

    actividadAvances: any = [];
    actividadAvanceMonto: any = [];
    actividadAvanceAvances: any = [];

    actAvaAvance: any = "";
    actAvaMonto: any = "";

    idPresupuestoGest: any = 0;
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
    actividadesReprogIds: any[] = [];
    presuAvances: any[] = [];

    showReprogramados: any = true;
    
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

      let presupuestoProy = this.parseAmountStrToFloat(this.presupuestoProy);
      let ejecutadoProy = this.parseAmountStrToFloat(this.ejecutadoProy);

      let presupuestoFormated = (presupuestoProy)?(presupuestoProy):(1);
      let porcentajeGrafico = 0;
      if(this.presupuestoProy){
        porcentajeGrafico = parseFloat((100*(ejecutadoProy / presupuestoFormated)).toFixed(2));
      }
      porcentajeGrafico = (porcentajeGrafico>100)?(100):(porcentajeGrafico);

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

      let presupuestoGest = this.parseAmountStrToFloat(this.presupuestoGest);
      let ejecutadoGest = this.parseAmountStrToFloat(this.ejecutadoGest);

      let presupuestoFormated = (presupuestoGest)?(presupuestoGest):(1);
      let porcentajeGrafico = 0;
      if(this.presupuestoGest){
        porcentajeGrafico = parseFloat((100*(ejecutadoGest / presupuestoFormated)).toFixed(2));
      }
      porcentajeGrafico = (porcentajeGrafico>100)?(100):(porcentajeGrafico);
    
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
    /*
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
    */
    // ======= ======= ======= ======= ======= ======= =======
    // ======= ======= INIT VIEW FUN ======= =======
    ngOnInit(): void{
      this.getParametricas();
      this.getPresupuestoEjecutado();
      this.getPresuAvance();
    }
    // ======= ======= ======= ======= =======
    // ======= ======= OPEN MODALS FUN ======= =======
    modalAction: any = "";
    modalTitle: any = "";

    private modalRefs: NgbModalRef[] = [];

    openModal(content: TemplateRef<any>) {
      const modalRef = this.modalService.open(content, { size: 'xl' });
      this.modalRefs.push(modalRef);
    }
    closeModal() {
      if (this.modalRefs.length > 0) {
        const lastModal = this.modalRefs.pop();
        lastModal?.close();
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
          this.getActividades();
        },
        (error) => {
          console.error(error);
        }
      );
    }
    // ======= ======= ======= ======= =======
    // ======= ======= CHECKBOX CHANGED ======= =======
    actividadSelected: any = null;
    onActividadClick(actividadSel: any) {
      this.elementosGant.forEach((elementoGant) =>{
        elementoGant.childrens.forEach((actividadGant)=>{
          if(actividadSel.id_proy_actividad == actividadGant.id_proy_actividad){
            actividadSel.selected = !actividadGant.selected;
            if(actividadSel.selected){
              this.actividadSelected = actividadSel;
            }
            else{
              this.actividadSelected = null;
            }
          }
          else{
            actividadGant.selected = false;
          }
        });
      });
    }
    // ======= ======= ======= ======= =======
    // ======= ======= ACTIVIDADES FUN ======= =======
    parseAmountStrToFloat(amount: any): number {
      amount = amount.replace('$', '');
      amount = amount.replace(/,/g, '');
      amount = parseFloat(amount);

      return amount;
    }
    parseAmountFloatToStr(amount: any): string {
      amount = amount.toFixed(2);
      amount = amount.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

      return amount;
    }
    getFormatedMonto(monto){
      if(/[a-zA-Z]/.test(monto)) {
        return ("0.00");
      }
      monto = this.parseAmountStrToFloat(monto);
      monto = this.parseAmountFloatToStr(monto);
      return (monto);
    }
    onChangedMontoNuevoEjecutado(){
      this.montoNuevoEjecutado = this.getFormatedMonto(this.montoNuevoEjecutado);
    }
    onChangedPresupuesto(){
      this.presupuesto = this.getFormatedMonto(this.presupuesto);
      this.validatePresupuesto();
    }
    onChangedAvanceNuevoEjecutado(){
      this.actAvaMonto = this.getFormatedMonto(this.actAvaMonto);
      this.validateActAvaMonto();
    }

    onPadreChanged(){
      let elementoScope = (this.elementos.find((elemento)=>(elemento.id_proy_elemento == this.id_proy_elemento_padre)));
      this.proy_elemento_padre = elementoScope.elemento;
      this.validateIdProyElementoPadre();
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

      this.actAvaAvance = "";
      this.actAvaMonto = "";

      this.valMontoNuevoEjecutado = true;
      this.valMotivoNuevoEjecutado = true;

      this.valIdProyElementoPadre = true;
      this.valActividadText = true;
      this.valDescripcion = true;
      this.valPresupuesto = true;
      this.valFechaInicio = true;
      this.valFechaFin = true;
      this.valFechaFin2 = true;
      this.valResultado = true;

      this.valActAvaAvance = true;
      this.valActAvaMonto = true;

    }
    // ======= ======= ======= ======= =======
    // ======= ======= COUNT HEADER DATA FUCTION ======= =======
    countHeaderData(){
      this.headerDataNro01 = this.ejecutadoProy;
      this.headerDataNro02 = this.ejecutadoGest;
    }
    // ======= ======= ======= ======= =======
    // ======= ======= GET PRESUPUESTO EJECUTADO ======= =======
    getPresupuestoEjecutado(){
      this.servicios.getPresupuestoEjecutadoByIdProy(this.idProyecto).subscribe(
        (data) => {
          let dataReq = data[0].dato[0];

          this.idPresupuestoGest = (dataReq.id_proy_presupuesto)?(dataReq.id_proy_presupuesto):(0);

          dataReq.presupuesto_mn = this.parseAmountStrToFloat(dataReq.presupuesto_mn.slice(1));

          dataReq.pro_act_ava_ejecutado = this.parseAmountStrToFloat(dataReq.pro_act_ava_ejecutado.slice(1));
          dataReq.pro_pre_ava_ejecutado = this.parseAmountStrToFloat(dataReq.pro_pre_ava_ejecutado.slice(1));

          dataReq.pro_act_presupuesto_gestion = this.parseAmountStrToFloat(dataReq.pro_act_presupuesto_gestion.slice(1))
          dataReq.pro_act_ava_ejecutado_gestion = this.parseAmountStrToFloat(dataReq.pro_act_ava_ejecutado_gestion.slice(1))
          dataReq.pro_pre_ava_ejecutado_gestion = this.parseAmountStrToFloat(dataReq.pro_pre_ava_ejecutado_gestion.slice(1))

          this.presupuestoProy = this.parseAmountFloatToStr(dataReq.presupuesto_mn);
          this.ejecutadoProy = this.parseAmountFloatToStr(dataReq.pro_act_ava_ejecutado + dataReq.pro_pre_ava_ejecutado);
    
          this.gestion = dataReq.gestion_actual;
          this.presupuestoGest = this.parseAmountFloatToStr(dataReq.pro_act_presupuesto_gestion);
          this.ejecutadoGest = this.parseAmountFloatToStr(dataReq.pro_act_ava_ejecutado_gestion + dataReq.pro_pre_ava_ejecutado_gestion);
          
          this.createDoughnutChartProyecto();
          this.createDoughnutChartGestion();
        },
        (error) => {
          console.error(error);
        }
      );

    }
    // ======= ======= ======= ======= =======
    getDateDaysGap(date1: string, date2: string): number {
      const date1Formated = new Date(date1);
      const date2Formated = new Date(date2);
    
      let dateDiference = date1Formated.getTime() - date2Formated.getTime();
      dateDiference = Math.floor(dateDiference / (1000 * 60 * 60 * 24));
    
      return dateDiference;
    }

    esActividadReprog(id_actividad: number): boolean {
      return this.actividadesReprogIds.includes(id_actividad);
    }

    // ======= PRESU EJECUTADO VALIDATIONS =======
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
    // ======= ======= =======
    // ======= ACTIVIDAD VALIDATIONS =======
    valIdProyElementoPadre: any = true;
    validateIdProyElementoPadre() {
      if (this.id_proy_elemento_padre) {
        this.valIdProyElementoPadre = true;
      } 
      else {
        this.valIdProyElementoPadre = false;
      }
    }

    valActividadText: any = true;
    validateActividadText() {
      if ((this.actividadText) && (this.actividadText.length < 100)) {
        this.valActividadText = true;
      } else {
        this.valActividadText = false;
      }
    }

    valDescripcion: any = true;
    validateDescripcion() {
      if ((this.descripcion) && (this.descripcion.length < 255)) {
        this.valDescripcion = true;
      } else {
        this.valDescripcion = false;
      }
    }

    valFechaInicio: any = true;
    validateFechaInicio() {
      if ((this.fecha_inicio)&&( new Date(this.fecha_inicio).getFullYear().toString() == this.gestion )) {
        this.valFechaInicio = true;
      } else {
        this.valFechaInicio = false;
      }
    }

    valFechaFin: any = true;
    valFechaFin2: any = true;
    validateFechaFin() {
      if ((this.fecha_fin)&&( new Date(this.fecha_fin).getFullYear().toString() == this.gestion )) {
        this.valFechaFin = true;
        if( (new Date(this.fecha_inicio)) < (new Date(this.fecha_fin)) ){
          this.valFechaFin2 = true;
        }
        else{
          this.valFechaFin2 = false;
        }
      } 
      else {
        this.valFechaFin = false;
      }
    }

    valPresupuesto: any = true;
    validatePresupuesto() {
      if (this.presupuesto) {
        this.valPresupuesto = true;
      } else {
        this.valPresupuesto = false;
      }
    }
    // ======= ======= =======
    // ======= ACTIVIDAD AVANCE VALIDATIONS =======
    valActAvaAvance: any = true;
    valActAvaAvance2: any = true;
    validateActAvaAvance() {
      if(this.actAvaAvance) {
        this.valActAvaAvance = true;
        if( (parseFloat(this.actAvaAvance) + parseFloat(this.actividadAvanceAvances)) <= 100 ){
          this.valActAvaAvance2 = true;
        }
        else{
          this.valActAvaAvance2 = false;
        }
      } 
      else {
        this.valActAvaAvance = false;
      }
    }

    valActAvaMonto: any = true;
    valActAvaMonto2: any = true;
    validateActAvaMonto() {
      if(this.actAvaMonto) {
        this.valActAvaMonto = true;
        if( (parseFloat(this.actAvaMonto) + parseFloat(this.actividadAvanceMonto)) <= ( this.parseAmountStrToFloat(this.presupuesto) ) ){
          this.valActAvaMonto2 = true;
        }
        else{
          this.valActAvaMonto2 = false;
        }
      } 
      else {
        this.valActAvaMonto = false;
      }
    }

    valResultado: any = true;
    validateResultado() {
      if((this.resultado) && (this.resultado.length < 255)) {
        this.valResultado = true;
      } else {
        this.valResultado = false;
      }
    }
    // ======= ======= =======
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
          p_id_proy_presupuesto: this.idPresupuestoGest,
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
          this.actividadesReprogIds = (this.actividades.map(a => a.id_proy_acti_repro).filter(id => id !== null));

          this.actividades.forEach((actividad)=>{
            actividad.presupuesto = (actividad.presupuesto)?(this.parseAmountStrToFloat(actividad.presupuesto.slice(1))):(0);
          });

          this.actividades = this.actividades.filter((actividad)=>( actividad.fecha_inicio.slice(0,4) == this.gestion ));

          this.elementosGant = [];
          this.elementos.forEach((elemento)=>{
            let elementoToAdd = {...elemento};
            elementoToAdd.childrens = this.actividades.filter(
              (actividadObj) =>
                //actividadObj.codigo.startsWith(elemento.codigo.slice(0, -2))
                (actividadObj.id_proy_elem_padre == elemento.id_proy_elemento)
            );

            this.elementosGant.push(elementoToAdd);
          });

          this.elementosGant = this.elementosGant.filter(
            (elementoGant)=>(
              elementoGant.childrens.length > 0
            )
          );

          this.elementosGant.forEach((elementoGant)=>{
            elementoGant.childrens.forEach((actividadGant)=>{

              actividadGant.init_date_gap = this.getDateDaysGap(actividadGant.fecha_inicio, (this.gestion+"-01-01"));
              actividadGant.init_date_gap_por = 100*(actividadGant.init_date_gap / 365);

              actividadGant.date_gap = this.getDateDaysGap(actividadGant.fecha_fin, actividadGant.fecha_inicio);
              actividadGant.date_gap_por = 100*(actividadGant.date_gap / 365);
              
              const totalEjecutado = actividadGant.avances.reduce((sum, item) => {
                const monto = parseFloat(item.monto_ejecutado.replace("$", "").replace(",", ""));
                return sum + monto;
              }, 0);
              //actividadGant.porcentajeAvance = (100*(totalEjecutado / actividadGant.presupuesto)).toFixed(2);
              actividadGant.porcentajeAvance = 0;
              actividadGant.avances.forEach(actAva => {
                actividadGant.porcentajeAvance += parseInt(actAva.avance);
              });
            
              actividadGant.esActividadReprog = this.esActividadReprog(actividadGant.id_proy_actividad);

            });
          });

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
        (elemento)=>(elemento.id_proy_elemento == this.id_proy_elemento_padre)
      )).codigo);
      actividadCodigo = actividadCodigo.slice(0,(actividadCodigo.length - 1));

      let elementoPadre = (this.elementosGant.find(
        (elemento)=>(elemento.id_proy_elemento == this.id_proy_elemento_padre)
      ));

      if( elementoPadre ){
        let childrensCodigos = elementoPadre.childrens
          .map(item => item.codigo)
          .filter(codigo => codigo.startsWith(actividadCodigo))
          .map(codigo => parseInt(codigo.split(actividadCodigo)[1], 10)) 
          .filter(x => !isNaN(x));
        let maxChildrenCodigo = (childrensCodigos.length > 0)?(Math.max(...childrensCodigos)):(null);

        actividadCodigo = actividadCodigo+ (maxChildrenCodigo+1).toString();
      }
      else{
        actividadCodigo = actividadCodigo+"1";
      }

      const objActividad = {
        p_id_proy_actividad: 0,
        p_id_proyecto: parseInt(this.idProyecto,10),
        p_id_proy_elemento_padre: parseInt(this.id_proy_elemento_padre, 10),
        p_codigo: actividadCodigo,
        p_actividad: this.actividadText,
        p_descripcion: this.descripcion,
        p_orden: parseInt(this.orden,10),
        p_id_proy_acti_repro: null,
        p_presupuesto: this.parseAmountStrToFloat(this.presupuesto),
        p_fecha_inicio: this.fecha_inicio,
        p_fecha_fin: this.fecha_fin,
        p_resultado: this.resultado,
        p_idp_actividad_estado: parseInt(this.idp_actividad_estado, 10),
        p_id_persona_reg: parseInt( this.idPersonaReg, 10)
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
    initAvanceActividad(modalScope: TemplateRef<any>){
      this.initActividadModel();

      this.modalAction = "edit";
      this.modalTitle = this.getModalTitle("edit");

      this.id_proy_actividad = this.actividadSelected.id_proy_actividad;
      this.codigo = this.actividadSelected.codigo;
      this.actividadText = this.actividadSelected.actividad;
      this.proy_acti_repro = (this.actividadSelected.id_proy_acti_repro)?
        (this.actividadSelected.pro_act_rep_codigo+" - REP: "+this.actividadSelected.pro_act_rep_actividad):
        (null);
      this.id_proy_elemento_padre = this.actividadSelected.id_proy_elem_padre;
      this.onPadreChanged();
      this.descripcion = this.actividadSelected.descripcion;
      this.fecha_inicio = this.actividadSelected.fecha_inicio;
      this.fecha_fin = this.actividadSelected.fecha_fin;
      this.presupuesto = this.parseAmountFloatToStr(this.actividadSelected.presupuesto);

      this.resultado = this.actividadSelected.resultado;

      this.actividadAvances = this.actividadSelected.avances;

      console.log(this.actividadAvances);
      this.actividadAvances.forEach((actAvance) => {
        this.actividadAvanceAvances += actAvance.avance;
        this.actividadAvanceMonto += this.parseAmountStrToFloat(actAvance.monto_ejecutado);
      });

      this.actividadAvanceMonto = (this.actividadAvanceMonto);

      this.openModal(modalScope);
    }
    // ======= ======= ======= ======= =======
    // ======= ======= EDIT APRENDIZAJE ======= =======
    avanceActividad(){
      const objActAvance = {
        p_id_proy_actividad_avance: null,
        p_id_proy_actividad: this.actividadSelected.id_proy_actividad,
        p_fecha_hora: null,
        p_avance: this.actAvaAvance,
        p_monto_ejecutado: this.parseAmountStrToFloat(this.actAvaMonto),
        p_id_persona_reg: this.idPersonaReg
      };

      this.servActAvance.addActAvance(objActAvance).subscribe(
        (data) => {
          this.getActividades();
        },
        (error) => {
          console.error(error);
        }
      );

    }
    // ======= ======= ======= ======= =======
    // ======= ======= SUBMIT FORM ======= =======
    onSubmit(): void {
      if(this.modalAction == "add"){
        this.validateIdProyElementoPadre();
        this.validateActividadText();
        this.validateDescripcion();
        this.validatePresupuesto();
        this.validateFechaInicio();
        this.validateFechaFin();

        let valForm = (
          this.valIdProyElementoPadre &&
          this.valActividadText &&
          this.valDescripcion &&
          this.valPresupuesto &&
          this.valFechaInicio &&
          this.valFechaFin &&
          this.valFechaFin2
        );

        if(valForm){
          this.addActividad();
        }
      }
      else{
        this.validateActAvaAvance();
        this.validateActAvaMonto();

        let valForm = (
          this.valActAvaAvance &&
          this.valActAvaMonto
        );

        if(valForm){
          this.avanceActividad();
        }
      }
      this.closeModal();
    }
    // ======= ======= ======= ======= =======
    // ======= ======= INIT REPROGRAMAR FUNCTION ======= =======
    initReprogramarActividad(modalScope: TemplateRef<any>){
      this.validateResultado();

      if(!this.valResultado){
        return;
      }

      this.id_proy_acti_repro = this.id_proy_actividad;
      this.openModal(modalScope);
    }
    // ======= ======= ======= ======= =======
    // ======= ======= REPROGRAMAR FUNCTION ======= =======
    reprogramarActividad(){
      this.validateFechaInicio();
      this.validateFechaFin();

      if((!this.valFechaInicio) && (!this.valFechaFin) && (!this.valFechaFin2)){
        return;
      }

      let actividadCodigo = ((this.elementos.find(
        (elemento)=>(elemento.id_proy_elemento == this.id_proy_elemento_padre)
      )).codigo);
      actividadCodigo = actividadCodigo.slice(0,(actividadCodigo.length - 1));

      let elementoPadre = (this.elementosGant.find(
        (elemento)=>(elemento.id_proy_elemento == this.id_proy_elemento_padre)
      ));

      if( elementoPadre ){
        let childrensCodigos = elementoPadre.childrens
          .map(item => item.codigo)
          .filter(codigo => codigo.startsWith(actividadCodigo))
          .map(codigo => parseInt(codigo.split(actividadCodigo)[1], 10)) 
          .filter(x => !isNaN(x));
        let maxChildrenCodigo = (childrensCodigos.length > 0)?(Math.max(...childrensCodigos)):(null);

        actividadCodigo = actividadCodigo+ (maxChildrenCodigo+1).toString();
      }
      else{
        actividadCodigo = actividadCodigo+"1";
      }

      const objActividad = {
        p_id_proy_actividad: 0,
        p_id_proyecto: parseInt(this.idProyecto,10),
        p_id_proy_elemento_padre: parseInt(this.id_proy_elemento_padre, 10),
        p_codigo: actividadCodigo,
        p_actividad: this.actividadText,
        p_descripcion: this.descripcion,
        p_orden: parseInt(this.orden,10),
        p_id_proy_acti_repro: this.id_proy_actividad,
        p_presupuesto: this.parseAmountStrToFloat(this.presupuesto),
        p_fecha_inicio: this.fecha_inicio,
        p_fecha_fin: this.fecha_fin,
        p_resultado: this.resultado,
        p_idp_actividad_estado: parseInt(this.idp_actividad_estado, 10),
        p_id_persona_reg: parseInt( this.idPersonaReg, 10)
      };

      this.servActividad.addActividad(objActividad).subscribe(
        (data) => {
          let idActiRepro = data[0].dato[0].id_proy_actividad;

          const requests = this.actividadSelected.avances.map((actividadAvaGantSel) => {
            const objActAvance = {
              p_id_proy_actividad_avance: null,
              p_id_proy_actividad: idActiRepro,
              p_fecha_hora: null,
              p_avance: actividadAvaGantSel.avance,
              p_monto_ejecutado: this.parseAmountStrToFloat(actividadAvaGantSel.monto_ejecutado),
              p_id_persona_reg: this.idPersonaReg
            };
            return this.servActAvance.addActAvance(objActAvance);
          });
          
          forkJoin(requests).subscribe(
            (results) => {
              this.getActividades();
            },
            (error) => {
              console.error(error);
            }
          );
        },
        (error) => {
          console.error(error);
        }
      );

      this.closeModal();
      this.closeModal();
    }
    // ======= ======= ======= ======= =======
}