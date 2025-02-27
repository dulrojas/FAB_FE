import { Component, OnInit, EventEmitter, Output, ViewChild, TemplateRef } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { ProyectoService } from '../../services/proyectoData.service';
import { servicios } from "../../servicios/servicios";
import { servAuditoria } from "../../servicios/auditoria";

@Component({
    selector: 'app-auditoria',
    templateUrl: './auditoria.component.html',
    styleUrls: ['../../../styles/styles.scss'],
    animations: [routerTransition()]
})
export class AuditoriaComponent implements OnInit {
    // ======= ======= VARIABLES SECTION ======= =======
    constructor(
      private modalService: NgbModal,
      private proyectoService: ProyectoService,
      private servicios: servicios,
      private servAuditoria: servAuditoria
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
    }

    headerDataNro01: any = 0;
    headerDataNro02: any = 0;
    headerDataNro03: any = 0;
    headerDataNro04: any = 0;
    // ======= ======= ======= ======= =======
    // ======= ======= NGMODEL VARIABLES SECTION ======= =======
    formularios: any = [];
    tablas: any = [];
    acciones: any = [];

    id_formulario: any = "";

    registrosAuditoria:any = [];
    registroSelected: any = [];
    
    mainPage = 1;
    mainPageSize = 10;
    totalLength = 0;

    @ViewChild('waitMessageModal', { static: true }) waitMessageModal!: TemplateRef<any>;
    // ======= ======= ======= ======= =======
    // ======= ======= FUNCIONS SECTION ======= =======
    private modalRefs: NgbModalRef[] = [];
    
    openCustomModal(content: TemplateRef<any>, modalConfig: any) {
      const modalRef = this.modalService.open(content, modalConfig);
      this.modalRefs.push(modalRef);
    }

    closeModal() {
      if (this.modalRefs.length > 0) {
        const modalRef = this.modalRefs.pop();
        modalRef?.close();
      }
    }
    
    onFormularioChange(){
      this.registrosAuditoria = [];
      this.getAuditoria();
    }
    getDescripcionAccion(id_accion){
      let accionForm = this.acciones.find((accionItem)=>(accionItem.id_subtipo == id_accion));
      let accionDescripcion = accionForm.descripcion_subtipo;
      return accionDescripcion;
    }
    getDescripcionTabla(id_tabla){
      let tablaForm = this.tablas.find((tablaItem)=>(tablaItem.id_subtipo == id_tabla));
      let tablaDescripcion = tablaForm.descripcion_subtipo;
      return tablaDescripcion;
    }
    objectEntries(obj: any): { key: string, value: any }[] {
      return Object.entries(obj).map(([key, value]) => ({ key, value }));
    }
    showRegistro(registro){
      try{
        let registroObject = (JSON.parse(registro.datos))[0];
        this.registroSelected = this.objectEntries(registroObject);
      }
      catch (error) {
        console.error(error);
      }
    }
    // ======= ======= ======= ======= =======
    // ======= ======= PERSONA ROLES TABLE PAGINATION ======= =======
    get registrosAuditoriaFormTable() {
      if (!this.registrosAuditoria) {
          return [];
      }
      const start = (this.mainPage - 1) * this.mainPageSize;
      return this.registrosAuditoria.slice(start, start + this.mainPageSize);
    }
    // ======= ======= ======= ======= =======
    // ======= ======= INIT VIEW FUN ======= =======
    ngOnInit(): void{
      this.getParametricas();
    }
    // ======= ======= ======= ======= =======
    // ======= ======= GET PARAMETRICAS ======= =======
    getParametricas(){
      this.servicios.getParametricaByIdTipo(22).subscribe(
        (data)=>{
          this.formularios = (data[0].dato)?(data[0].dato):([]);
          this.id_formulario = this.formularios[0].id_subtipo;
          this.getAuditoria();
        },
        (error)=>{
          console.error(error);
        }
      );
      this.servicios.getParametricaByIdTipo(23).subscribe(
        (data)=>{
          this.tablas = (data[0].dato)?(data[0].dato):([]);
        },
        (error)=>{
          console.error(error);
        }
      );
      this.servicios.getParametricaByIdTipo(24).subscribe(
        (data)=>{
          this.acciones = (data[0].dato)?(data[0].dato):([]);
        },
        (error)=>{
          console.error(error);
        }
      );
    }
    // ======= ======= ======= ======= =======
    // ======= ======= GET AUDITORIA ======= =======
    getAuditoria(){
      this.openCustomModal(
        this.waitMessageModal,
        {
          size: 'lg',
          centered: true
        }
      );
      this.servAuditoria.getAuditoriaByIdFormulario(this.id_formulario).subscribe(
        (data)=>{
          this.registrosAuditoria = (data[0].dato)?(data[0].dato):([]);
          this.totalLength = this.registrosAuditoria.length;
          this.registroSelected = [];
          this.closeModal();
        },
        (error)=>{
          console.error(error);
        }
      );
    }
    // ======= ======= ======= ======= =======
}
