import { Component, OnInit, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { servicios } from "../../servicios/servicios";
import { servLogros } from "../../servicios/logros";
import { servAprendizaje } from "../../servicios/aprendizajes";

@Component({
    selector: 'app-logros',
    templateUrl: './logros.component.html',
    styleUrls: ['../../../styles/styles.scss'],
    animations: [routerTransition()]
})
export class LogrosComponent implements OnInit {
    // ======= ======= VARIABLES SECTION ======= =======
    logros: any[] = [];
    mainPage = 1;
    mainPageSize = 10;
    totalLength = 0;
    constructor(
      private modalService: NgbModal,
      private servicios: servicios,
      private servLogros: servLogros,
      private servApredizaje: servAprendizaje
    ){}

    idProyecto: any = parseInt(localStorage.getItem('currentIdProy'));
    idPersonaReg: any = parseInt(localStorage.getItem('currentIdPer'));
    onChildSelectionChange(selectedId: string) {
      this.idProyecto = selectedId;
      localStorage.setItem('currentIdProy', (this.idProyecto).toString());
      this.getLogros();
    }

    headerDataNro01: any = 0;
    headerDataNro02: any = 0;
    headerDataNro03: any = 0;
    headerDataNro04: any = 0;
    // ======= ======= NGMODEL VARIABLES SECTION ======= =======
    modalAction: any = "";
    modalTitle: any = "";

    id_proy_logro: any = 0;
    id_proyecto: any = 0;
    logro: any = "";
    descripcion: any = "";
    ruta_imagen: any = "";
    fecha_hora: any = "";
    id_persona_reg: any = 0;
    id_proy_elemento: any = 0;
    fecha_logro: any = "";

    sigla: any = "";
    color: any = "";
    // ======= ======= VARIABLES SECTION ======= =======
    componentes: any[] = [];
    images: any[] = [
      {"id_institucion": 1, "ruta_logros_iconos": "../../../assets/images/logroImage001.png"},
      {"id_institucion": 2, "ruta_logros_iconos": "../../../assets/images/logroImage002.png"},
      {"id_institucion": 3, "ruta_logros_iconos": "../../../assets/images/logroImage003.png"},
      {"id_institucion": 4, "ruta_logros_iconos": "../../../assets/images/logroImage004.png"},
      {"id_institucion": 5, "ruta_logros_iconos": "../../../assets/images/logroImage005.png"},
      {"id_institucion": 6, "ruta_logros_iconos": "../../../assets/images/logroImage006.png"},
      {"id_institucion": 7, "ruta_logros_iconos": "../../../assets/images/logroImage007.png"},
      {"id_institucion": 8, "ruta_logros_iconos": "../../../assets/images/logroImage008.png"},
      {"id_institucion": 9, "ruta_logros_iconos": "../../../assets/images/logroImage009.png"},
      {"id_institucion": 10, "ruta_logros_iconos": "../../../assets/images/logroImage010.png"},
      {"id_institucion": 11, "ruta_logros_iconos": "../../../assets/images/logroImage011.png"},
      {"id_institucion": 12, "ruta_logros_iconos": "../../../assets/images/logroImage012.png"},
      {"id_institucion": 13, "ruta_logros_iconos": "../../../assets/images/logroImage013.png"},
      {"id_institucion": 14, "ruta_logros_iconos": "../../../assets/images/logroImage014.png"},
      {"id_institucion": 15, "ruta_logros_iconos": "../../../assets/images/logroImage015.png"},
      {"id_institucion": 16, "ruta_logros_iconos": "../../../assets/images/logroImage016.png"},
      {"id_institucion": 17, "ruta_logros_iconos": "../../../assets/images/logroImage017.png"},
      {"id_institucion": 18, "ruta_logros_iconos": "../../../assets/images/logroImage018.png"},
      {"id_institucion": 19, "ruta_logros_iconos": "../../../assets/images/logroImage019.png"},
      {"id_institucion": 20, "ruta_logros_iconos": "../../../assets/images/logroImage020.png"},
      {"id_institucion": 21, "ruta_logros_iconos": "../../../assets/images/logroImage021.png"}
    ];
    // ======= ======= ======= ======= =======
    // ======= ======= INIT VIEW FUN ======= =======
    ngOnInit(): void{
      this.getParametricas();
      this.getLogros();
    }
    // ======= ======= ======= ======= =======
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
    }
    // ======= ======= ======= ======= =======
    // ======= ======= OPEN MODALS FUN ======= =======
    openModal(content: TemplateRef<any>) {
      this.modalService.open(content, { size: 'xl' });
    }
    // ======= ======= ======= ======= =======
    // ======= ======= GET MODAL TITLE FUN ======= =======
    getModalTitle(modalAction: any){
      this.modalTitle = (modalAction == "add")?("Añadir Logro"):(this.modalTitle);
      this.modalTitle = (modalAction == "edit")?("Editar Logro"):(this.modalTitle);
      return this.modalTitle;
    }
    // ======= ======= ======= ======= =======
    logrosSelected: any = null;
    // ======= ======= CHECKBOX CHANGED ======= =======
    onLogroClick(logroSel: any) {
      this.logros.forEach(logro =>{
        if(logroSel.id_proy_logro == logro.id_proy_logro){
          logro.selected = !logro.selected;
          if(logroSel.selected){
            this.logrosSelected = logroSel;
          }
          else{
            this.logrosSelected = null;
          }
        }
        else{
          logro.selected = false;
        }
      });
    }
    // ======= ======= ======= ======= =======
    onSelectionChange(){
      const selectedComponente = this.componentes.find(comp => comp.id_meto_elemento == this.id_proy_elemento);
      if (selectedComponente) {
          this.color = selectedComponente.color;
          this.sigla = selectedComponente.sigla;
      }
    }
    imageSelected: any = null;
    imageSelectedAux: any = null;
    onImageClick(imageSel: any) {
      this.images.forEach(image =>{
        if(imageSel.id_institucion == image.id_institucion){
          image.selected = !image.selected;
          if(imageSel.selected){
            this.imageSelectedAux = imageSel;
          }
          else{
            this.imageSelectedAux = null;
          }
        }
        else{
          image.selected = false;
        }
      });
    }
    initSelectImage(modalScope: TemplateRef<any>){
      this.openModal(modalScope);
    }
    selectImage(){
      this.ruta_imagen = this.imageSelectedAux.ruta_logros_iconos;
      this.imageSelected = this.imageSelectedAux;
    }
    // ======= ======= INIT PERSONA ROLES NGMODEL ======= =======
    initLogrosModel(){
      this.modalTitle = "";

      this.id_proy_logro = 0;
      this.id_proyecto = 0;
      this.logro = "";
      this.descripcion = "";
      this.ruta_imagen = "";
      this.fecha_hora = "";
      this.id_persona_reg = 0;
      this.id_proy_elemento = 0;
      this.fecha_logro = "";
      this.ruta_imagen = "../../../assets/images/empty.jpg";
      
      this.sigla = "";
      this.color = "ffffff";

      this.images.forEach((image: any) => {
        image.selected = false;
      });

      this.imageSelected = null;
      this.imageSelectedAux = null;
    }
    // ======= ======= ======= ======= =======
    // ======= ======= COUNT HEADER DATA FUCTION ======= =======
    countHeaderData(){
      this.headerDataNro01 = this.logros.length;
      this.logros.forEach(logro =>{
        if(logro.admi_sistema){
          this.headerDataNro02 += 1
        }
        if(logro.proyectoRol == "CON"){
          this.headerDataNro03 += 1
        }
        if(logro.proyectoRol == "RES"){
          this.headerDataNro04 += 1
        }
      });
    }
    // ======= ======= ======= ======= =======
    // ======= ======= GET PERSONAS ======= =======
    getLogros(){
      this.servLogros.getLogrosByIdProy(this.idProyecto).subscribe(
        (data) => {
          this.logros = (data[0].dato)?(data[0].dato):([]);
          this.logros.forEach((logro: any) => {
            logro.selected = false;
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
    initAddLogros(modalScope: TemplateRef<any>){
      this.initLogrosModel();

      this.modalAction = "add";
      this.modalTitle = this.getModalTitle("add");

      this.openModal(modalScope);
    }
    // ======= ======= ======= ======= =======
    // ======= ======= EDIT APRENDIZAJE ======= =======
    addLogros(){
      const objLogro = {
        p_id_proy_aprende: 0,
        p_id_proyecto: parseInt(this.idProyecto,10),
        p_logro: this.logro,
        p_descripcion: this.descripcion,
        p_ruta_imagen: this.ruta_imagen,
        p_fecha_hora: null,
        p_id_persona_reg: this.idPersonaReg,
        p_id_proy_elemento: this.id_proy_elemento,
        p_fecha_logro: this.fecha_logro
      };

      this.servLogros.addLogro(objLogro).subscribe(
        (data) => {
          this.getLogros();
        },
        (error) => {
          console.error(error);
        }
      );
    }
    // ======= ======= ======= ======= =======
    // ======= ======= INIT EDIT PERSONA ROLES ======= =======
    initEditLogros(modalScope: TemplateRef<any>){
      this.initLogrosModel();

      this.modalAction = "edit";
      this.modalTitle = this.getModalTitle("edit");

      this.id_proy_logro = this.logrosSelected.id_proy_logro;
      this.id_proyecto = this.logrosSelected.id_proyecto;
      this.logro = this.logrosSelected.logro;
      this.descripcion = this.logrosSelected.descripcion;
      this.ruta_imagen = this.logrosSelected.ruta_imagen;
      this.fecha_hora = this.logrosSelected.fecha_hora;
      this.id_persona_reg = this.logrosSelected.id_persona_reg;
      this.id_proy_elemento = this.logrosSelected.id_proy_elemento;
      this.fecha_logro = this.logrosSelected.fecha_logro;
      
      this.sigla = this.logrosSelected.sigla;
      this.color = this.logrosSelected.color;

      this.openModal(modalScope);
    }
    // ======= ======= ======= ======= =======
    // ======= ======= EDIT APRENDIZAJE ======= =======
    editLogros(){
      const objApredizaje = {
        p_id_proy_aprende: 0,
        p_id_proyecto: parseInt(this.idProyecto,10),
        p_fecha_hora_reg: null
      };

    }
    // ======= ======= ======= ======= =======
    // ======= ======= INIT DELETE PERSONA ROLES ======= =======
    initDeleteLogros(){
      
    }
    // ======= ======= ======= ======= =======
    // ======= ======= SUBMIT FORM ======= =======
    onSubmit(): void {
      if(this.modalAction == "add"){
        this.addLogros();
      }
      else{
        //this.editLogros();
      }
    }
    // ======= ======= ======= ======= =======
}
