import { Component, OnInit, TemplateRef, EventEmitter, Output } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { ProyectoService } from '../../services/proyectoData.service';
import { ExcelExportService } from '../../services/excelExport.service';
import { servicios } from "../../servicios/servicios";
import { servLogros } from "../../servicios/logros";
import { ElementosService } from "../../servicios/elementos";
import { environment } from '../../../environments/environment';

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
      private proyectoService: ProyectoService,
      private servicios: servicios,
      private servLogros: servLogros,
      private servElementos: ElementosService
    ){}
    // ======= ======= ======= ======= =======
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
      
      this.getLogros();
    }

    headerDataNro01: any = 0;
    headerDataNro02: any = 0;
    headerDataNro03: any = 0;
    headerDataNro04: any = 0;
    // ======= ======= ======= ======= =======
    // ======= ======= NGMODEL VARIABLES SECTION ======= =======
    modalAction: any = "";
    modalTitle: any = "";

    id_proy_logro: any = 0;
    id_proyecto: any = 0;
    id_proy_elemento: any = 0;
    fecha_logro: any = "";
    logro: any = "";
    descripcion: any = "";
    ruta_imagen: any = "";
    fecha_hora: any = "";
    id_persona_reg: any = 0;

    sigla: any = "";
    color: any = "";

    imageSrc: any = null;
    defaultImageSrc: any = environment.defaultImageSrc;
    // ======= ======= VARIABLES SECTION ======= =======
    componentes: any[] = [];
    images: any[] = [];
    // ======= ======= ======= ======= =======
    // ======= ======= VALIDATION VARIABLES SECTION ======= =======
    valElemento: any = true;
    ValidateElemento() {
      this.valElemento = true;
      if (!this.id_proy_elemento) {
        this.valElemento = false;
      }
    }

    valFechaLogro: any = true;
    ValidateFechaLogro() {
      this.valFechaLogro = true;
      if (!this.fecha_logro) {
        this.valFechaLogro = false;
      }
    }

    valLogro: any = true;
    ValidateLogro() {
      this.valLogro = true;
      if ((!this.logro)||(this.logro.length >= 50)) {
        this.valLogro = false;
      }
    }

    valDescripcion: any = true;
    ValidateDescripcion() {
      this.valDescripcion = true;
      if ((!this.descripcion)||(this.descripcion.length >= 500)) {
        this.valDescripcion = false;
      }
    }

    valImagen: any = true;
    ValidateImagen() {
      this.valImagen = true;
      if (this.ruta_imagen == `${environment.assetsPath}images/empty.jpg`) {
        this.valImagen = false;
      }
    }

    // ======= ======= INIT VIEW FUN ======= =======
    ngOnInit(): void{
      this.getParametricas();
      this.getIconos();
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
      this.servElementos.getElementosMetoEleByIdProy(this.idProyecto).subscribe(
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
    // ======= ======= GET ICONS ======= =======
    async getIconos(){
      try {
        const data: any = await new Promise((resolve, reject) => {
          this.servLogros.getIconos().subscribe(
            (response) => resolve(response),
            (error) => reject(error)
          );
        });
    
        this.images = data[0].dato;
    
        for (const image of this.images) {
          image.icono_src = await this.downloadFile("inst_iconos", "ruta_icono", "id_icono", image.id_icono);
        }
      } 
      catch (error) {
        console.error('Error en getIconos:', error);
      }
    }
    // ======= ======= ======= ======= =======
    // ======= ======= MODALS FUN ======= =======
    private modalRefs: NgbModalRef[] = [];
    
    openModal(content: TemplateRef<any>) {
      const modalRef = this.modalService.open(content, { size: 'xl' });
      this.modalRefs.push(modalRef);
    }

    closeModal() {
      if (this.modalRefs.length > 0) {
        const modalRef = this.modalRefs.pop();
        modalRef?.close();
      }
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
      const selectedComponente = this.componentes.find(comp => comp.id_proy_elemento == this.id_proy_elemento);
      if (selectedComponente) {
        this.color = selectedComponente.color;
        this.sigla = selectedComponente.sigla;
      }
      this.ValidateElemento();
    }
    imageSelected: any = null;
    imageSelectedAux: any = null;
    onImageClick(imageSel: any) {
      this.images.forEach(image =>{
        if(imageSel.id_icono == image.id_icono){
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
      this.ruta_imagen = this.imageSelectedAux.icono_src;
      this.imageSelected = this.imageSelectedAux;
      this.ValidateImagen();
      this.closeModal();
    }
    // ======= ======= INIT LOGROS NGMODEL ======= =======
    initLogrosModel(){
      this.modalTitle = "";

      this.id_proy_logro = 0;
      this.id_proyecto = 0;
      this.logro = "";
      this.descripcion = "";
      this.ruta_imagen = "";
      this.fecha_hora = "";
      this.id_persona_reg = 0;
      this.id_proy_elemento = "";
      this.fecha_logro = "";
      this.ruta_imagen = null;
      
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
    // ======= ======= GET LOGROS ======= =======
    getLogros(){
      this.servLogros.getLogrosByIdProy(this.idProyecto).subscribe(
        async (data) => {
          this.logros = (data[0].dato)?(data[0].dato):([]);
          this.logros.forEach((logro: any) => {
            logro.selected = false
          });
    
          await Promise.all(
            this.logros
              .filter((logro: any) => (logro.ruta_imagen))
              .map(async (logro: any) => {
                logro.imagen_src = await this.downloadFile(
                  "proy_logros",
                  "ruta_imagen",
                  "id_proy_logro",
                  logro.id_proy_logro
                );
              })
          );
    
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

      this.id_persona_reg = this.namePersonaReg;

      this.modalAction = "add";
      this.modalTitle = this.getModalTitle("add");

      this.openModal(modalScope);
    }
    // ======= ======= ======= ======= =======
    // ======= ======= ADD APRENDIZAJE ======= =======
    addLogros(){
      const objLogro = {
        p_id_proy_aprende: 0,
        p_id_proyecto: parseInt(this.idProyecto,10),
        p_logro: this.logro,
        p_descripcion: this.descripcion,
        p_ruta_imagen: this.imageSelected.ruta_icono,
        p_fecha_hora: null,
        p_id_persona_reg: this.idPersonaReg,
        p_id_proy_elemento: parseInt(this.id_proy_elemento,10),
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
      this.fecha_hora = this.logrosSelected.fecha_hora;
      this.id_persona_reg = (this.logrosSelected.nombres +" "+ this.logrosSelected.apellido_1 +" "+ ((this.logrosSelected.apellido_2)?(this.logrosSelected.apellido_2):("")));
      this.id_proy_elemento = this.logrosSelected.id_proy_elemento;
      this.fecha_logro = this.logrosSelected.fecha_logro;

      this.imageSelected = this.images.find((image) => image.ruta_icono == this.logrosSelected.ruta_imagen);
      if(this.imageSelected){
        this.imageSelected.selected = true;
      }
      this.ruta_imagen = this.logrosSelected.imagen_src;
      
      this.sigla = this.logrosSelected.sigla;
      this.color = this.logrosSelected.color;

      this.openModal(modalScope);
    }
    // ======= ======= ======= ======= =======
    // ======= ======= EDIT LOGRO ======= =======
    editLogros(){
      const objLogro = {
        p_id_proy_logro: this.id_proy_logro,
        p_id_proyecto: parseInt(this.idProyecto,10),
        p_logro: this.logro,
        p_descripcion: this.descripcion,
        p_rut_imagen: this.imageSelected.ruta_icono,
        p_fecha_hora: null,
        p_id_persona_reg: this.idPersonaReg,
        p_id_proy_elemento: parseInt(this.id_proy_elemento,10),
        p_fecha_logro: this.fecha_logro
      };

      this.servLogros.editLogro(objLogro).subscribe(
        (data) => {
          this.logrosSelected = null;
          this.getLogros();
        },
        (error) => {
          console.error(error);
        }
      );
    }
    // ======= ======= ======= ======= =======
    // ======= ======= INIT DELETE LOGRO ======= =======
    initDeleteLogros(modalScope: TemplateRef<any>){
      this.initLogrosModel();

      this.id_proy_logro = this.logrosSelected.id_proy_logro;

      this.openModal(modalScope);
    }
    // ======= ======= ======= ======= =======
    // ======= ======= DELETE LOGRO ======= =======
    deleteLogros(){
      this.servLogros.deleteLogro(this.id_proy_logro).subscribe(
        (data) => {
          this.logrosSelected = null;
          this.getLogros();
        },
        (error) => {
          console.error(error);
        }
      );
    }
    // ======= ======= ======= ======= =======
    // ======= ======= SUBMIT FORM ======= =======
    onSubmit(): void {
      // ======= VALIDATION SECTION =======
      let valForm = false;

      this.ValidateElemento();
      this.ValidateFechaLogro();
      this.ValidateLogro();
      this.ValidateDescripcion();
      this.ValidateImagen();

      valForm = 
        this.valElemento &&
        this.valFechaLogro &&
        this.valLogro &&
        this.valDescripcion &&
        this.valImagen;

      // ======= FUNCTION SECTION =======
      if(valForm){
        if(this.modalAction == "add"){
          this.addLogros();
        }
        else{
          this.editLogros();
        }
        this.closeModal();
      }
    }
    // ======= ======= ======= ======= =======
    // ======= ======= UPLOAD IMAGE FUN ======= =======
    uploadFile(file: any, idRegistro: any, nombreRegistro: any){
      this.servicios.uploadFile(file, "proy_logros", "ruta_imagen", "id_proy_logro", nombreRegistro, idRegistro).subscribe(
        (response) => {
          //console.log('Archivo subido correctamente:', response);
        },
        (error) => {
          console.error('Error al subir el archivo:', error);
        }
      );
    }
    // ======= ======= ======= ======= =======
    // ======= ======= DOWNLOAD IMAGE FUN ======= =======
    downloadFile(nombreTabla: any, campoTabla: any, idEnTabla: any, idRegistro: any){
      return new Promise((resolve, reject) => {
        this.servicios.downloadFile(nombreTabla, campoTabla, idEnTabla, idRegistro).subscribe(
          (response: Blob) => {
            if (response instanceof Blob) {
              const url = window.URL.createObjectURL(response);
              resolve(url);
            } 
            else {
              resolve(null); 
            }
          },
          (error) => {
            if (error.status === 404) {
              resolve(null);
            } 
            else {
              reject(error);
            }
          }
        );
      });
    }
    // ======= ======= ======= ======= =======
    // ======= ======= DOWNLOAD EXCEL ======= =======
    downloadExcel() {
      const columnas = ['logro', 'sigla'];
      const today = new Date();
      const formattedDate = today.toLocaleDateString('es-ES').replace(/\//g, '_');
      ExcelExportService.exportToExcel(
        this.logros, 
        'Reporte_Logros_'+formattedDate, 
        columnas
      );
    }
    // ======= ======= ======= ======= =======
}
