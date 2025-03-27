import { Component, OnInit, TemplateRef, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { ProyectoService } from '../../services/proyectoData.service';
import { ExcelExportService } from '../../services/excelExport.service';
import { servicios } from "../../servicios/servicios";
import { servAprendizaje } from "../../servicios/aprendizajes";
import { ElementosService } from "../../servicios/elementos";

@Component({
    selector: 'app-aprendizajes',
    templateUrl: './aprendizajes.component.html',
    styleUrls: ['../../../styles/styles.scss'],
    animations: [routerTransition()]
})
export class AprendizajesComponent implements OnInit {
  // ======= ======= VARIABLES SECTION ======= =======
  aprendizajes: any[] = [];
  mainPage = 1;
  mainPageSize = 10;
  totalLength = 0;
  constructor(
    private modalService: NgbModal,
    private proyectoService: ProyectoService,
    private servicios: servicios,
    private servApredizaje: servAprendizaje,
    private servElementos: ElementosService,
    private cdr: ChangeDetectorRef
  ){}

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
    this.getAprendizajes();
    this.initAprendizajesModel();
    this.aprendizajesSelected = null;

  }

  headerDataNro01: any = 0;
  headerDataNro02: any = 0;
  headerDataNro03: any = 0;
  headerDataNro04: any = 0;
  // ======= ======= NGMODEL VARIABLES SECTION ======= =======
  modalAction: any = "";
  modalTitle: any = "";

  id_proy_aprende: any = "";
  id_proyecto: any = "";
  fecha_registro: any = "";
  persona_registro: any = "";
  id_proy_elemento: any = "";
  idp_aprendizaje_area: any = "";
  idp_aprendizaje_tipo: any = "";
  aprendizaje: any = "";
  fecha: any = "";
  problema: any = "";
  accion_aprendizaje: any = "";
  accion: any = "";
  id_preguntas_1: any = "";
  respuestas_1: any = "";
  id_preguntas_2: any = "";
  respuestas_2: any = "";
  id_persona_reg: any = "";
  fecha_hora_reg: any = "";

  sigla: any = "";
  color: any = "";

  preguntasObj1: any = [];
  preguntas1: any = [];
  respuestas1: any = [];
  preguntasObj2: any = [];
  preguntas2: any = [];
  respuestas2: any = [];

  componentes: any[] = [];
  areasAprendizaje: any[] = [];
  tiposAprendizaje: any[] = [];
  // ======= ======= ======= ======= =======
  // ======= ======= VALDIATE FUNCTIONS SECTION ======= =======
  valComponente: any = true;
  ValidateComponente(){
    this.valComponente = true;
    if(!this.id_proy_elemento){
      this.valComponente = false;
    }
  }

  valArea: any = true;
  ValidateArea(){
    this.valArea = true;
    if(!this.idp_aprendizaje_area){
      this.valArea = false;
    }
  }

  valTipo: any = true;
  ValidateTipo(){
    this.valTipo = true;
    if(!this.idp_aprendizaje_tipo){
      this.valTipo = false;
    }
  }

  valAprendizaje: any = true;
  ValidateAprendizaje(){
    this.valAprendizaje = true;
    if((!this.aprendizaje)||(this.aprendizaje.length >= 50)){
      this.valAprendizaje = false;
    }
  }

  valProblema: any = true;
  ValidateProblema(){
    this.valProblema = true;
    if((!this.problema)||(this.problema.length >= 500)){
      this.valProblema = false;
    }
  }

  valAccion: any = true;
  ValidateAccion(){
    this.valAccion = true;
    if((!this.accion)||(this.accion.length >= 500)){
      this.valAccion = false;
    }
  }
  // ======= ======= ======= ======= =======
  // ======= ======= INIT VIEW FUN ======= =======
  ngOnInit(): void{
    this.getParametricas();
    this.getAprendizajes();
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
  // ======= ======= GET PARAMETRICAS ======= =======
  getParametricas(){
    // ======= GET METO ELEMENTOS =======
    this.servElementos.getElementosMetoEleByIdProy(this.idProyecto).subscribe(
      (data) => {
        this.componentes = data[0].dato;
      },
      (error) => {
        console.error(error);
      }
    );
    // ======= ======= =======
    // ======= GET ROLES =======
    this.servicios.getParametricaByIdTipo(12).subscribe(
      (data) => {
        this.areasAprendizaje = data[0].dato;
      },
      (error) => {
        console.error(error);
      }
    );
    // ======= ======= =======
    // ======= GET ROLES =======
    this.servicios.getParametricaByIdTipo(13).subscribe(
      (data) => {
        this.tiposAprendizaje = data[0].dato;
      },
      (error) => {
        console.error(error);
      }
    );
    // ======= ======= =======
    // ======= GET PREGUNTAS =======
    this.servApredizaje.getPreguntas().subscribe(
      (data) => {
        if(data[0].dato){
          this.preguntasObj1 = data[0].dato[0];
          this.preguntasObj1.preguntas = JSON.parse(this.preguntasObj1.preguntas);
          this.preguntas1 = this.preguntasObj1.preguntas.Positivo;
          this.preguntasObj2 = data[0].dato[1];
          this.preguntasObj2.preguntas = JSON.parse(this.preguntasObj2.preguntas);
          this.preguntas2 = this.preguntasObj2.preguntas.Negativo;
          this.cdr.detectChanges();
        }
        else{
          this.preguntas1 = null;
          this.preguntas2 = null;
        }
      },
      (error) => {
        console.error(error);
      }
    );
    // ======= ======= =======
  }
  // ======= ======= ======= ======= =======
  // ======= ======= MODALS FUN ======= =======
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
    this.modalTitle = (modalAction == "add")?("Añadir Aprendizaje"):(this.modalTitle);
    this.modalTitle = (modalAction == "edit")?("Editar Aprendizaje"):(this.modalTitle);
    return this.modalTitle;
  }
  // ======= ======= ======= ======= =======
  // ======= ======= PERSONA ROLES TABLE PAGINATION ======= =======
  get aprendizajesTable() {
    const start = (this.mainPage - 1) * this.mainPageSize;
    return this.aprendizajes.slice(start, start + this.mainPageSize);
  }
  // ======= ======= ======= ======= =======
  aprendizajesSelected: any = null;
  // ======= ======= CHECKBOX CHANGED ======= =======
  checkboxChanged(aprendizajeSel: any) {
    this.aprendizajes.forEach(aprendizaje =>{
      if(aprendizajeSel.id_proy_aprende == aprendizaje.id_proy_aprende){
        if(aprendizajeSel.selected){
          this.aprendizajesSelected = aprendizajeSel;
        }
        else{
          this.aprendizajesSelected = null;
        }
      }
      else{
        aprendizaje.selected = false;
      }
    });
  }
  // ======= ======= ======= ======= =======
  onSelectionChange() {
    const selectedComponente = this.componentes.find(comp => comp.id_proy_elemento == this.id_proy_elemento);
    if (selectedComponente) {
        this.color = selectedComponente.color;
        this.sigla = selectedComponente.sigla;
    }
    this.ValidateComponente();
  }
  // ======= ======= INIT PERSONA ROLES NGMODEL ======= =======
  initAprendizajesModel(){
    this.modalTitle = "";

    this.id_proy_aprende = 0;
    this.fecha_registro = "";
    this.persona_registro = this.namePersonaReg;
    this.id_proy_elemento = "";
    this.idp_aprendizaje_area = "";
    this.idp_aprendizaje_tipo = "";
    this.id_preguntas_1 = this.preguntasObj1.id_preguntas;
    this.respuestas1 = [];
    this.id_preguntas_2 = this.preguntasObj2.id_preguntas; 
    this.respuestas2 = [];
    this.aprendizaje = "";
    this.fecha = null;
    this.problema = null;
    this.accion = null;
    
    this.sigla = null;
    this.color = null;

    this.valComponente = true;
    this.valArea = true;
    this.valTipo = true;
    this.valAprendizaje = true;
    this.valProblema = true;
    this.valAccion = true;

  }
  // ======= ======= ======= ======= =======
  // ======= ======= GET PERSONAS ======= =======
  getAprendizajes(){
    this.servApredizaje.getAprendizajesByIdProy(this.idProyecto).subscribe(
      (data) => {
        this.aprendizajes = (data[0].dato)?(data[0].dato):([]);
        this.totalLength = this.aprendizajes.length;
        this.countHeaderData();
      },
      (error) => {
        console.error(error);
      }
    );
  }
  // ======= ======= ======= ======= =======
  // ======= ======= INIT ADD PERSONA ROLES ======= =======
  initAddAprendizajes(modalScope: TemplateRef<any>){
    this.initAprendizajesModel();

    this.fecha_registro = this.getCurrentDateTime();

    this.modalAction = "add";
    this.modalTitle = this.getModalTitle("add");

    this.openModal(modalScope);
  }
  // ======= ======= ======= ======= =======
  // ======= ======= EDIT APRENDIZAJE ======= =======
  addAprendizajes(){
    const objApredizaje = {
      p_id_proy_aprende: 0,
      p_id_proyecto: parseInt(this.idProyecto,10),
      p_aprendizaje: this.aprendizaje,
      p_problema: this.problema,
      p_accion_aprendizaje: this.accion,
      p_id_preguntas_1: parseInt(this.id_preguntas_1,10),
      p_respuestas_1: this.jsonToString({"respuestas":this.respuestas1}),
      p_id_preguntas_2: parseInt(this.id_preguntas_2,10),
      p_respuestas_2: this.jsonToString({"respuestas":this.respuestas2}),
      p_id_persona_reg: parseInt(this.idPersonaReg,10),
      p_id_proy_elemento: parseInt(this.id_proy_elemento,10),
      p_idp_aprendizaje_area: parseInt(this.idp_aprendizaje_area,10),
      p_idp_aprendizaje_tipo: parseInt(this.idp_aprendizaje_tipo,10),
      p_fecha: (this.fecha)?(this.fecha):(null),
      p_fecha_hora_reg: null
    };

    this.servApredizaje.addAprendizaje(objApredizaje).subscribe(
      (data) => {
        this.getAprendizajes();
      },
      (error) => {
        console.error(error);
      }
    );

  }
  // ======= ======= ======= ======= =======
  // ======= ======= INIT EDIT PERSONA ROLES ======= =======
  initEditAprendizajes(modalScope: TemplateRef<any>){
    this.initAprendizajesModel();

    this.modalAction = "edit";
    this.modalTitle = this.getModalTitle("edit");

    this.id_proy_aprende = this.aprendizajesSelected.id_proy_aprende;
    this.id_proyecto = this.aprendizajesSelected.id_proyecto;
    this.aprendizaje = this.aprendizajesSelected.aprendizaje;
    this.problema = this.aprendizajesSelected.problema;
    this.accion = this.aprendizajesSelected.accion;
    this.id_preguntas_1 = this.aprendizajesSelected.id_preguntas_1;
    this.respuestas1 = this.stringToJson(this.aprendizajesSelected.respuestas_1)["respuestas"];
    this.id_preguntas_2 = this.aprendizajesSelected.id_preguntas_2;
    this.respuestas2 = this.stringToJson(this.aprendizajesSelected.respuestas_2)["respuestas"];
    this.id_persona_reg = this.aprendizajesSelected.id_persona_reg;
    this.id_proy_elemento = this.aprendizajesSelected.id_proy_elemento;
    this.idp_aprendizaje_area = this.aprendizajesSelected.idp_aprendizaje_area;
    this.idp_aprendizaje_tipo = this.aprendizajesSelected.idp_aprendizaje_tipo;
    this.fecha = this.aprendizajesSelected.fecha;
    this.fecha_registro = this.aprendizajesSelected.fecha_hora_reg;

    this.sigla = this.aprendizajesSelected.sigla;
    this.color = this.aprendizajesSelected.color;

    this.openModal(modalScope);
  }
  // ======= ======= ======= ======= =======
  // ======= ======= EDIT APRENDIZAJE ======= =======
  editAprendizajes(){
    const objApredizaje = {
      p_id_proy_aprende: this.id_proy_aprende,
      p_id_proyecto: this.id_proyecto,
      p_aprendizaje: this.aprendizaje,
      p_problema: this.problema,
      p_accion_aprendizaje: this.accion,
      p_id_preguntas_1: this.id_preguntas_1,
      p_respuestas_1: this.jsonToString({"respuestas":this.respuestas1}),
      p_id_preguntas_2: this.id_preguntas_2,
      p_respuestas_2: this.jsonToString({"respuestas":this.respuestas2}),
      p_id_persona_reg: this.id_persona_reg,
      p_id_proy_elemento: this.id_proy_elemento,
      p_idp_aprendizaje_area: this.idp_aprendizaje_area,
      p_idp_aprendizaje_tipo: this.idp_aprendizaje_tipo,
      p_fecha: (this.fecha)?(this.fecha):(null),
      p_fecha_hora_reg: null
    };

    this.servApredizaje.editAprendizaje(objApredizaje).subscribe(
      (data) => {
        this.getAprendizajes();
      },
      (error) => {
        console.error(error);
      }
    );

  }
  // ======= ======= ======= ======= =======
  // ======= ======= INIT DELETE PERSONA ROLES ======= =======
  initDeleteAprendizajes(modalScope: TemplateRef<any>){
    this.initAprendizajesModel();

    this.id_proy_aprende = this.aprendizajesSelected.id_proy_aprende;

    this.openModal(modalScope);
  }
  // ======= ======= ======= ======= =======
  // ======= ======= INIT DELETE PERSONA ROLES ======= =======
  deleteAprendizajes(){

    this.servApredizaje.deleteAprendizaje(this.id_proy_aprende, this.idPersonaReg).subscribe(
      (data) => {
        this.aprendizajesSelected = null;
        this.closeModal();
        this.getAprendizajes();
      },
      (error) => {
        console.error(error);
      }
    );
  }
  // ======= ======= ======= ======= =======
  // ======= ======= COUNT HEADER DATA FUCTION ======= =======
  countHeaderData(){
    this.headerDataNro01 = 0;
    this.headerDataNro02 = 0;
    this.headerDataNro03 = 0;
    this.headerDataNro04 = 0;

    this.headerDataNro01 = this.aprendizajes.length;
    this.aprendizajes.forEach(aprendizaje =>{
      if(aprendizaje.idp_aprendizaje_tipo == 1){
        this.headerDataNro02 += 1
      }
      if(aprendizaje.idp_aprendizaje_tipo == 2){
        this.headerDataNro03 += 1
      }
      if(aprendizaje.idp_aprendizaje_tipo == 3){
        this.headerDataNro04 += 1
      }
    });
  }
  // ======= ======= ======= ======= =======
  // ======= ======= SUBMIT FORM ======= =======
  onSubmit(): void {
    // ======= VALIDATION SECTION =======
    let valForm = false;

    this.ValidateComponente();
    this.ValidateArea();
    this.ValidateTipo();
    this.ValidateAprendizaje();
    this.ValidateProblema();
    this.ValidateAccion();

    valForm = 
      this.valComponente &&
      this.valArea &&
      this.valTipo &&
      this.valAprendizaje &&
      this.valProblema &&
      this.valAccion;

    // ======= ACTION SECTION =======
    if(valForm){
      if(this.modalAction == "add"){
        this.addAprendizajes();
      }
      else{
        this.editAprendizajes();
      }
      this.closeModal();
    }
  }
  // ======= ======= ======= ======= =======
  // ======= ======= DOWNLOAD EXCEL ======= =======
  downloadExcel() {
    const columnas = ['id_proy_aprende', 'fecha', 'sigla', 'aprendizaje', 'problema', 'accion'];
    const today = new Date();
    const formattedDate = today.toLocaleDateString('es-ES').replace(/\//g, '_');
    let aprendizajesObj = [...this.aprendizajes];
    ExcelExportService.exportToExcel(
      aprendizajesObj, 
      'Reporte_Aprendizajes_'+formattedDate, 
      columnas
    );
  }
  // ======= ======= ======= ======= =======
}
