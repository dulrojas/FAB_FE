import { Component, OnInit, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { servicios } from "../../servicios/servicios";
import { servAprendizaje } from "../../servicios/aprendizajes";

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
      private servicios: servicios,
      private servApredizaje: servAprendizaje,
      private cdr: ChangeDetectorRef
    ){}
    idProyecto: any = 1;
    idPersonaReg: any = 1;

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
    // ======= ======= VARIABLES SECTION ======= =======
    componentes: any[] = [];
    areasAprendizaje: any[] = [];
    tiposAprendizaje: any[] = [];
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
      this.servApredizaje.getMetoElementos(this.idProyecto).subscribe(
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
      this.servApredizaje.getPreguntas(this.idProyecto).subscribe(
        (data) => {
          this.preguntasObj1 = data[0].dato[0];
          this.preguntasObj1.preguntas = JSON.parse(this.preguntasObj1.preguntas);
          this.preguntas1 = this.preguntasObj1.preguntas.Positivo;
          this.preguntasObj2 = data[0].dato[1];
          this.preguntasObj2.preguntas = JSON.parse(this.preguntasObj2.preguntas);
          this.preguntas2 = this.preguntasObj2.preguntas.Negativo;
          this.cdr.detectChanges();
        },
        (error) => {
          console.error(error);
        }
      );
      // ======= ======= =======
    }
    // ======= ======= ======= ======= =======
    // ======= ======= OPEN MODALS FUN ======= =======
    openModal(content: TemplateRef<any>) {
      this.modalService.open(content, { size: 'xl' });
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
      const selectedComponente = this.componentes.find(comp => comp.id_meto_elemento == this.id_proy_elemento);
      if (selectedComponente) {
          this.color = selectedComponente.color;
          this.sigla = selectedComponente.sigla;
      }
    }
    // ======= ======= INIT PERSONA ROLES NGMODEL ======= =======
    initAprendizajesModel(){
      this.modalTitle = "";

      this.id_proy_aprende = 0;
      this.fecha_registro = "";
      this.persona_registro = this.idPersonaReg;
      this.id_proy_elemento = "";
      this.idp_aprendizaje_area = null;
      this.idp_aprendizaje_tipo = null;
      this.id_preguntas_1 = this.preguntasObj1.id_preguntas;
      this.id_preguntas_2 = this.preguntasObj2.id_preguntas; 
      this.aprendizaje = "";
      this.fecha = null;
      this.problema = null;
      this.accion_aprendizaje = null;
      
      this.sigla = null;
      this.color = null;
    }
    // ======= ======= ======= ======= =======
    // ======= ======= GET PERSONAS ======= =======
    getAprendizajes(){
      this.servApredizaje.getAprendizajesByIdProy(this.idProyecto).subscribe(
        (data) => {
          this.aprendizajes = data[0].dato;
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
        p_fecha: this.fecha,
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
        p_accion_aprendizaje: this.accion_aprendizaje,
        p_id_preguntas_1: this.id_preguntas_1,
        p_respuestas_1: this.respuestas1,
        p_id_preguntas_2: this.id_preguntas_2,
        p_respuestas_2: this.respuestas2,
        p_id_persona_reg: this.id_persona_reg,
        p_id_proy_elemento: this.id_proy_elemento,
        p_idp_aprendizaje_area: this.idp_aprendizaje_area,
        p_idp_aprendizaje_tipo: this.idp_aprendizaje_tipo,
        p_fecha: this.fecha,
        p_fecha_hora_reg: null
      };

    }
    // ======= ======= ======= ======= =======
    // ======= ======= INIT DELETE PERSONA ROLES ======= =======
    initDeleteAprendizajes(){
      
    }
    // ======= ======= ======= ======= =======
    // ======= ======= COUNT HEADER DATA FUCTION ======= =======
    countHeaderData(){
      this.headerDataNro01 = this.aprendizajes.length;
      this.aprendizajes.forEach(aprendizaje =>{
        if(aprendizaje.admi_sistema){
          this.headerDataNro02 += 1
        }
        if(aprendizaje.proyectoRol == "CON"){
          this.headerDataNro03 += 1
        }
        if(aprendizaje.proyectoRol == "RES"){
          this.headerDataNro04 += 1
        }
      });
    }
    // ======= ======= ======= ======= =======
    // ======= ======= SUBMIT FORM ======= =======
    onSubmit(): void {
      if(this.modalAction == "add"){
        this.addAprendizajes();
      }
      else{
        //this.editAprendizajes();
      }
    }
    // ======= ======= ======= ======= =======
}
