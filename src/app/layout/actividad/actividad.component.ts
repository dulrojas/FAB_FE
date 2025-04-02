import { Component, OnInit, TemplateRef, EventEmitter, Output, QueryList, ViewChildren, ElementRef, AfterViewChecked } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { ProyectoService } from '../../services/proyectoData.service';
import { ExcelExportService } from '../../services/excelExport.service';
import { servicios } from "../../servicios/servicios";
import { ElementosService } from "../../servicios/elementos";
import { servActividad } from "../../servicios/actividad";
import { servActAvance } from "../../servicios/actividadAvance";
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

  actAvaAvance: any = "";

  idPresupuestoGest: any = 0;
  periodo: any = "";
  presupuestoProy: any = 0;
  presupuestoActProy: any = 0;
  ejecutadoProy: any = 0;
  initGestion: any = "";
  gestion: any = "";
  startYear: any = "";
  startDate: any = "";
  endYear: any = "";
  endDate: any = "";
  presupuestoGest: any = 0;
  ejecutadoGest: any = 0;

  doughnutChartProy: any = null;
  doughnutChartGest: any = null;
  halfCircleChart: any = null;

  idPresuAvance: any = null;
  montoNuevoEjecutado: any = null;
  fechaNuevoEjecutado: any = null;
  motivoNuevoEjecutado: any = null;

  elementos: any[] = [];

  elementosGant: any[] = [];

  actividades: any[] = [];
  actividadesGest: any[] = [];
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

    let presupuestoActProy = this.parseAmountStrToFloat(this.presupuestoActProy);
    let ejecutadoProy = this.parseAmountStrToFloat(this.ejecutadoProy);

    let presupuestoFormated = (presupuestoActProy)?(presupuestoActProy):(1);
    let porcentajeGrafico = 0;
    if(this.presupuestoActProy){
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
    this.montoNuevoEjecutado = null;
    this.fechaNuevoEjecutado = null;
    this.motivoNuevoEjecutado = null;
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
    this.ElementosService.getElementosMetoEleNivel3ByIdProy(this.idProyecto).subscribe(
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
    amount = amount.toString();
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
    this.validateMontoNuevoEjecutado();
  }

  onPadreChanged(){
    let elementoScope = (this.elementos.find((elemento)=>(elemento.id_proy_elemento == this.id_proy_elemento_padre)));
    this.proy_elemento_padre = elementoScope.elemento;
    this.validateIdProyElementoPadre();
  }

  getLastAvance(actividadGant: any) {
    if (!actividadGant || !Array.isArray(actividadGant.avances)) {
      return 0;
    }

    if (actividadGant.avances.length > 0) {
      let avance = actividadGant.avances[actividadGant.avances.length - 1].avance;
      return avance;
    }

    return 0;
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

    this.valMontoNuevoEjecutado = true;
    this.valFechaNuevoEjecutado = true;
    this.valMotivoNuevoEjecutado = true;

    this.valIdProyElementoPadre = true;
    this.valActividadText = true;
    this.valDescripcion = true;
    this.valFechaInicio1 = true;
    this.valFechaInicio2 = true;
    this.valFechaFin = true;
    this.valFechaFin2 = true;
    this.valFechaFin3 = true;
    this.valResultado = true;

    this.valActAvaAvance = true;

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
        dataReq.pro_act_presupuesto = this.parseAmountStrToFloat(dataReq.pro_act_presupuesto.slice(1));
        dataReq.pro_pre_adicional_gestion = this.parseAmountStrToFloat(dataReq.pro_pre_adicional_gestion.slice(1));

        dataReq.pro_act_ava_ejecutado = this.parseAmountStrToFloat(dataReq.pro_act_ava_ejecutado.slice(1));
        dataReq.pro_pre_ava_ejecutado = this.parseAmountStrToFloat(dataReq.pro_pre_ava_ejecutado.slice(1));

        dataReq.pro_act_presupuesto_gestion = this.parseAmountStrToFloat(dataReq.pro_act_presupuesto_gestion.slice(1));
        dataReq.pro_act_ava_ejecutado_gestion = this.parseAmountStrToFloat(dataReq.pro_act_ava_ejecutado_gestion.slice(1));
        dataReq.pro_pre_ava_ejecutado_gestion = this.parseAmountStrToFloat(dataReq.pro_pre_ava_ejecutado_gestion.slice(1));

        this.presupuestoProy = this.parseAmountFloatToStr(dataReq.presupuesto_mn);
        this.presupuestoActProy = this.parseAmountFloatToStr(dataReq.presupuesto_mn);
        this.ejecutadoProy = this.parseAmountFloatToStr(dataReq.pro_act_ava_ejecutado + dataReq.pro_pre_ava_ejecutado);
  
        this.initGestion = dataReq.gestion_actual;
        this.gestion = dataReq.gestion_actual;

        this.startDate = dataReq.fecha_inicio;
        this.endDate = (dataReq.fecha_fin_ampliada)?(dataReq.fecha_fin_ampliada):(dataReq.fecha_fin);

        this.startYear = (this.startDate)?(this.startDate.slice(0,4)):(new Date().getFullYear().toString());
        this.endYear = (this.endDate)?(this.endDate.slice(0,4)):(new Date().getFullYear().toString());

        if( parseInt(this.endYear) < parseInt(this.gestion) ){
          this.gestion = this.endYear;
        }

        this.presupuestoGest = this.parseAmountFloatToStr(dataReq.pro_pre_adicional_gestion);
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
  valMontoNuevoEjecutado2: any = true;
  validateMontoNuevoEjecutado(){
    this.valMontoNuevoEjecutado = true;
    this.valMontoNuevoEjecutado2 = true;
    if((this.montoNuevoEjecutado)&&((this.parseAmountStrToFloat(this.montoNuevoEjecutado))>0)){
      this.valMontoNuevoEjecutado = true;
      if( ((this.parseAmountStrToFloat(this.montoNuevoEjecutado))+( this.parseAmountStrToFloat(this.ejecutadoGest) - ((this.presuAvanceSelected)?(this.parseAmountStrToFloat((this.presuAvanceSelected.monto_avance).slice(1))):(0)) ) <= this.parseAmountStrToFloat(this.presupuestoGest)) ){
        this.valMontoNuevoEjecutado2 = true;
      }
      else{
        this.valMontoNuevoEjecutado2 = false;
      }
    }
    else{
      this.valMontoNuevoEjecutado = false;
    }
  }

  valFechaNuevoEjecutado: any = true;
  validateFechaNuevoEjecutado(){
    if( ( this.fechaNuevoEjecutado ) && ( new Date(this.fechaNuevoEjecutado + 'T00:00:00Z').getUTCFullYear().toString() == this.initGestion ) ){
      this.valFechaNuevoEjecutado = true;
    }
    else{
      this.valFechaNuevoEjecutado = false;
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
    if ((this.actividadText) && (this.actividadText.length <= 100)) {
      this.valActividadText = true;
    } else {
      this.valActividadText = false;
    }
  }

  valDescripcion: any = true;
  validateDescripcion() {
    if ((this.descripcion) && (this.descripcion.length <= 255)) {
      this.valDescripcion = true;
    } else {
      this.valDescripcion = false;
    }
  }

  valFechaInicio1: any = true;
  valFechaInicio2: any = true;
  validateFechaInicio() {
    this.valFechaInicio1 = true;
    this.valFechaInicio2 = true;
    if (this.fecha_inicio && new Date(this.fecha_inicio + 'T00:00:00Z').getUTCFullYear().toString() >= this.initGestion) {
      this.valFechaInicio1 = true;
      if( ( new Date(this.startDate) > new Date(this.fecha_inicio + 'T00:00:00Z') ) || ( new Date(this.fecha_inicio + 'T00:00:00Z') > new Date(this.endDate) ) ){
        this.valFechaInicio2 = false;
      }
    } 
    else {
      this.valFechaInicio1 = false;
    }
  }

  valFechaFin: any = true;
  valFechaFin2: any = true;
  valFechaFin3: any = true;
  validateFechaFin() {
    this.valFechaFin = true;
    this.valFechaFin2 = true;
    this.valFechaFin3 = true;
    if ((this.fecha_fin)&&( new Date(this.fecha_fin + 'T00:00:00Z').getFullYear().toString() >= this.initGestion )) {
      this.valFechaFin = true;
      if( (new Date(this.fecha_inicio)) < (new Date(this.fecha_fin)) ){
        this.valFechaFin2 = true;
        if( ( new Date(this.startDate) > new Date(this.fecha_fin + 'T00:00:00Z') ) || ( new Date(this.fecha_fin + 'T00:00:00Z') > new Date(this.endDate) ) ){
          this.valFechaFin3 = false;
        }
      }
      else{
        this.valFechaFin2 = false;
      }
    } 
    else {
      this.valFechaFin = false;
    }
  }
  // ======= ======= =======
  // ======= ACTIVIDAD AVANCE VALIDATIONS =======
  valActAvaAvance: any = true;
  validateActAvaAvance() {

    let lastAvance = (this.actividadAvances[this.actividadAvances.length - 1 ]).avance;

    if( this.actAvaAvance ) {
      this.valActAvaAvance = true;
      if( ( parseFloat(this.actAvaAvance) > lastAvance ) && ( parseFloat(this.actAvaAvance) <= 100 ) ){
        this.valActAvaAvance = true;
      }
      else{
        this.valActAvaAvance = false;
      }
    } 
    else {
      this.valActAvaAvance = false;
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
  // ======= ======= CHECKBOX CHANGED ======= =======
  presuAvanceSelected: any = null;
  onPresuAvanceClick(presuAvanceSel: any) {
    this.montoNuevoEjecutado = null;
    this.fechaNuevoEjecutado = null;
    this.motivoNuevoEjecutado = null;
    this.presuAvances.forEach((presuAvance) =>{
      if(presuAvanceSel.id_proy_presu_avance == presuAvance.id_proy_presu_avance){
        if(presuAvanceSel.selected){
          this.presuAvanceSelected = presuAvanceSel;
        }
        else{
          this.presuAvanceSelected = null;
        }
      }
      else{
        presuAvance.selected = false;
      }
    });
  }
  // ======= ======= ======= ======= =======
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
    this.validateFechaNuevoEjecutado();
    this.validateMotivoNuevoEjecutado();

    let valPreAva = 
      this.valMontoNuevoEjecutado && 
      this.valMontoNuevoEjecutado2 && 
      this.valFechaNuevoEjecutado && 
      this.valMotivoNuevoEjecutado
    ;

    if(valPreAva){  
      let objPresuAvance = {
        p_id_proy_presu_avance: null,
        p_id_proy_presupuesto: this.idPresupuestoGest,
        p_monto_avance: this.parseAmountStrToFloat(this.montoNuevoEjecutado),
        p_id_persona: this.idPersonaReg,
        p_fecha_hora: (this.fechaNuevoEjecutado + " 00:00:00.00"),
        p_motivo: this.motivoNuevoEjecutado,
        p_id_proyecto: 0
      };

      this.servPresuAvance.addPresuAvance(objPresuAvance).subscribe(
        (data) => {
          this.presuAvanceSelected = null;
          this.idPresuAvance = null;
          this.montoNuevoEjecutado = null;
          this.fechaNuevoEjecutado = null;
          this.motivoNuevoEjecutado = null;

          this.getPresupuestoEjecutado();
          this.getPresuAvance();
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }
  // ======= ======= ======= ======= =======
  // ======= ======= INIT EDIT PRESU EJEC ======= =======
  initEditPresupuestoEjecutado(modalScope: TemplateRef<any>){
    this.initActividadModel();

    this.modalAction = "edit";
    this.modalTitle = "Editar ejecucion de presupuesto";

    this.idPresuAvance = this.presuAvanceSelected.id_proy_presu_avance;
    this.montoNuevoEjecutado = (this.presuAvanceSelected.monto_avance).slice(1);
    this.fechaNuevoEjecutado = this.presuAvanceSelected.fecha_hora.split("T")[0];
    this.motivoNuevoEjecutado = this.presuAvanceSelected.motivo;

    this.openModal(modalScope);
  }
  // ======= ======= ======= ======= =======
  // ======= ======= EDIT PRESU AVANCE ======= =======
  editPresuAvance(){
    this.validateMontoNuevoEjecutado();
    this.validateFechaNuevoEjecutado();
    this.validateMotivoNuevoEjecutado();

    let valPreAva = 
      this.valMontoNuevoEjecutado && 
      this.valMontoNuevoEjecutado2 && 
      this.valFechaNuevoEjecutado && 
      this.valMotivoNuevoEjecutado
    ;

    if(valPreAva){  
      let objPresuAvance = {
        p_id_proy_presu_avance: this.idPresuAvance,
        p_id_proy_presupuesto: this.idPresupuestoGest,
        p_monto_avance: this.parseAmountStrToFloat(this.montoNuevoEjecutado),
        p_id_persona: this.idPersonaReg,
        p_fecha_hora: (this.fechaNuevoEjecutado + " 00:00:00.00"),
        p_motivo: this.motivoNuevoEjecutado,
        p_id_proyecto: 0
      };

      this.servPresuAvance.editPresuAvance(objPresuAvance).subscribe(
        (data) => {
          this.presuAvanceSelected = null;
          this.idPresuAvance = null;
          this.montoNuevoEjecutado = null;
          this.fechaNuevoEjecutado = null;
          this.motivoNuevoEjecutado = null;

          this.getPresupuestoEjecutado();
          this.getPresuAvance();
          this.closeModal();
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }
  // ======= ======= ======= ======= =======
  // ======= ======= INIT DELETE PRESU EJEC ======= =======
  initDeletePresupuestoEjecutado(modalScope: TemplateRef<any>){
    this.initActividadModel();

    this.idPresuAvance = this.presuAvanceSelected.id_proy_presu_avance;

    this.openModal(modalScope);
  }
  // ======= ======= ======= ======= =======
  // ======= ======= DELETE PRESU AVANCE ======= =======
  deletePresuAvance(){
    this.servPresuAvance.deletePresuAvance(this.idPresuAvance, this.idPersonaReg).subscribe(
      (data) => {
        this.presuAvanceSelected = null;
        this.idPresuAvance = null;
        this.montoNuevoEjecutado = null;
        this.fechaNuevoEjecutado = null;
        this.motivoNuevoEjecutado = null;

        this.getPresuAvance();
        this.closeModal();
      },
      (error) => {
        console.error(error);
      }
    );
  }
  // ======= ======= ======= ======= =======
  // ======= ======= ON GESTION CHANGED ======= =======
  onGestionChanged(gestionChange: number){
    this.gestion = parseInt(this.gestion) + gestionChange;
    this.groupActividadesGant();

    this.servicios.getPresupuestoEjecutadoByIdProyAndYear(this.idProyecto, (this.gestion).toString()).subscribe(
      (data)=>{
        if(data[0].dato){
          let dataReq = data[0].dato[0];

          dataReq.pro_act_presupuesto_gestion = this.parseAmountStrToFloat(dataReq.pro_act_presupuesto_gestion.slice(1));
          dataReq.pro_act_ava_ejecutado_gestion = this.parseAmountStrToFloat(dataReq.pro_act_ava_ejecutado_gestion.slice(1));
          dataReq.pro_pre_ava_ejecutado_gestion = this.parseAmountStrToFloat(dataReq.pro_pre_ava_ejecutado_gestion.slice(1));
          dataReq.pro_pre_adicional_gestion = this.parseAmountStrToFloat(dataReq.pro_pre_adicional_gestion.slice(1));

          this.presupuestoGest = this.parseAmountFloatToStr(dataReq.pro_pre_adicional_gestion);
          this.ejecutadoGest = this.parseAmountFloatToStr(dataReq.pro_act_ava_ejecutado_gestion + dataReq.pro_pre_ava_ejecutado_gestion);
          
          this.createDoughnutChartGestion();
        }
      },
      (error)=>{

      }
    );
  }
  gestionIsStartYear(){
    let boolToReturn = false;
    if( this.gestion == this.startYear ){
      boolToReturn = true;
    }
    return boolToReturn;
  }
  gestionIsEndYear(){
    let boolToReturn = false;
    if( this.gestion == this.endYear ){
      boolToReturn = true;
    }
    return boolToReturn;
  }
  // ======= ======= ======= ======= =======
  // ======= ======= GROUP ACTIVIDADES BY ELEMENT AND GESTION ======= =======
  groupActividadesGant(){
    this.actividadesGest = this.actividades.filter((actividad)=>( actividad.fecha_inicio.slice(0,4) == this.gestion ));

    this.elementosGant = [];
    this.elementos.forEach((elemento)=>{
      let elementoToAdd = {...elemento};
      elementoToAdd.childrens = this.actividadesGest.filter(
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

        actividadGant.porcentajeAvance = 0;
        actividadGant.avances.forEach(actAva => {
          actividadGant.porcentajeAvance += parseInt(actAva.avance);
        });
      
        actividadGant.esActividadReprog = this.esActividadReprog(actividadGant.id_proy_actividad);

      });
    });

    this.countHeaderData();
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

        this.groupActividadesGant();

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
  // ======= ======= ADD ACTIVIDAD ======= =======
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
  // ======= ======= INIT EDIT AVANCE ACTIVIDAD ======= =======
  initEditActividad(modalScope: TemplateRef<any>){
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

    this.actividadAvances = (this.actividadSelected.avances)?(this.actividadSelected.avances):([]);

    this.openModal(modalScope);
  }
  // ======= ======= ======= ======= =======
  // ======= ======= EDIT ACTIVIDAD ======= =======
  editActividad(){
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
      p_id_proy_actividad: this.actividadSelected.id_proy_actividad,
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
  // ======= ======= INIT ADD AVANCE ACTIVIDAD ======= =======
  initAvanceActividad(modalScope: TemplateRef<any>){
    this.initActividadModel();

    this.modalAction = "avance";
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

    this.actividadAvances = (this.actividadSelected.avances)?(this.actividadSelected.avances):([]);

    this.openModal(modalScope);
  }
  // ======= ======= ======= ======= =======
  // ======= ======= ADD ACTIVIDAD AVANCE ======= =======
  avanceActividad(){
    const objActAvance = {
      p_id_proy_actividad_avance: null,
      p_id_proy_actividad: this.actividadSelected.id_proy_actividad,
      p_fecha_hora: null,
      p_avance: this.actAvaAvance,
      p_monto_ejecutado: 0,
      p_id_persona_reg: this.idPersonaReg
    };

    this.servActAvance.addActAvance(objActAvance).subscribe(
      (data) => {
        this.getActividades();
        this.closeModal();
      },
      (error) => {
        console.error(error);
      }
    );

  }
  // ======= ======= ======= ======= =======
  // ======= ======= INIT EDIT AVANCE ACTIVIDAD ======= =======
  initDeleteActividad(modalScope: TemplateRef<any>){
    this.initActividadModel();

    this.id_proy_actividad = this.actividadSelected.id_proy_actividad;

    this.openModal(modalScope);
  }
  // ======= ======= ======= ======= =======
  // ======= ======= DELETE ACTIVIDAD ======= =======
  deleteActividad(){
    this.servActividad.deleteActividad(this.id_proy_actividad, this.idPersonaReg).subscribe(
      (data) => {
        this.getActividades();
        this.closeModal();
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
      this.validateFechaInicio();
      this.validateFechaFin();

      let valForm = (
        this.valIdProyElementoPadre &&
        this.valActividadText &&
        this.valDescripcion &&
        this.valFechaInicio1 &&
        this.valFechaInicio2 &&
        this.valFechaFin &&
        this.valFechaFin2 &&
        this.valFechaFin3
      );

      if(valForm){
        this.addActividad();
        this.closeModal();
      }
    }
    else{
      this.validateIdProyElementoPadre();
      this.validateActividadText();
      this.validateDescripcion();
      this.validateFechaInicio();
      this.validateFechaFin();

      let valForm1 = (
        this.valIdProyElementoPadre &&
        this.valActividadText &&
        this.valDescripcion &&
        this.valFechaInicio1 &&
        this.valFechaInicio2 &&
        this.valFechaFin &&
        this.valFechaFin2 &&
        this.valFechaFin3
      );

      if(valForm1){
        this.editActividad();
        this.closeModal();
      }
    }
  }

  onSubmitAvance(): void {
    this.validateActAvaAvance();

    let valForm = this.valActAvaAvance;

    if(valForm){
      this.avanceActividad();
    }
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

    if((!this.valFechaInicio1) && (!this.valFechaInicio2) && (!this.valFechaFin) && (!this.valFechaFin2) && (!this.valFechaFin3)){
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
  // ======= ======= DOWNLOAD EXCEL ======= =======
  downloadExcel() {
    const columnas = [
      'actividad', 
      'codigo', 
      'fecha_inicio', 
      'fecha_fin', 
      'descripcion', 
      'id_proy_elem_padre', 
      'id_proy_acti_repro'
    ];
    const today = new Date();
    const formattedDate = today.toLocaleDateString('es-ES').replace(/\//g, '_');
    ExcelExportService.exportToExcel(
      this.actividades, 
      'Reporte_Actividades_'+formattedDate, 
      columnas
    );
  }
  // ======= ======= ======= ======= =======
}