import { Component, OnInit, TemplateRef, EventEmitter, Output } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { ProyectoService } from '../../services/proyectoData.service';
import { servicios } from "../../servicios/servicios";
import { servPersona } from "../../servicios/persona";
import { servPersonaRoles } from "../../servicios/personaRoles";
import { servProyectos } from "../../servicios/proyectos";

import { forkJoin } from 'rxjs';

import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-personaRoles',
    templateUrl: './personaRoles.component.html',
    styleUrls: ['../../../styles/styles.scss'],
    animations: [routerTransition()]
})
export class PersonaRolesComponent implements OnInit {
    // ======= ======= VARIABLES SECTION ======= =======
    personasRoles: any[] = [];
    mainPage = 1;
    mainPageSize = 10;
    totalLength = 0;
    constructor(
      private modalService: NgbModal,
      private proyectoService: ProyectoService,
      private servicios: servicios,
      private servPersona: servPersona,
      private servPersonaRoles: servPersonaRoles,
      private servProyectos: servProyectos
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

      this.getPersonaRoles();
      this.countHeaderData();
    }

    headerDataNro01: any = 0;
    headerDataNro02: any = 0;
    headerDataNro03: any = 0;
    headerDataNro04: any = 0;
    // ======= ======= ======= ======= =======

    // ======= ======= NGMODEL VARIABLES SECTION ======= =======
    modalAction: any = "";
    modalTitle: any = "";

    id_persona: any = null;
    nombres: any = null;
    apellido_1: any = null;
    apellido_2: any = null;
    idp_tipo_documento: any = "";
    idp_estado: any = null;
    nro_documento: any = "";
    telefono: any = null;
    correo: any = null;
    id_inst_unidad: any = null;
    cargo: any = null;
    responsable: any = null;
    usuario: any = null;
    contrasenia: any = null;
    logedBy: any = null;
    admi_sistema: any = null;

    imageSrc: any = null;
    defaultImageSrc: any = environment.defaultImageSrc;

    // ======= ======= VALIDATION SECTION ======= =======
    valNombres: any = true;
    ValidateNombres() {
      this.valNombres = true;
      const regex = /^[A-Za-zÁÉÍÓÚáéíóú\s]+$/;
      if (!(this.nombres) || this.nombres.length >= 50 || !regex.test(this.nombres)) {
        this.valNombres = false;
      }
    }
    
    valApellido1: any = true;
    ValidateApellido1() {
      this.valApellido1 = true;
      const regex = /^[A-Za-zÁÉÍÓÚáéíóú\s]+$/;
      if ((!this.apellido_1) || this.apellido_1.length >= 50 || !regex.test(this.apellido_1)) {
        this.valApellido1 = false;
      }
    }
    
    valApellido2: any = true;
    ValidateApellido2() {
      this.valApellido2 = true;
      const regex = /^[A-Za-zÁÉÍÓÚáéíóú\s]+$/;
      if ((!this.apellido_2) || this.apellido_2.length >= 50 || !regex.test(this.apellido_2)) {
        this.valApellido2 = false;
      }
    }

    valTipoDocumento: any = true;
    ValidateTipoDocumento() {
      this.valTipoDocumento = true;
      if (!this.idp_tipo_documento) {
        this.valTipoDocumento = false;
      }
    }

    valNroDocumento: any = true;
    ValidateNroDocumento() {
      this.valNroDocumento = true;
      if ((!this.nro_documento)||(this.nro_documento.length >= 20)) {
        this.valNroDocumento = false;
      }
    }
    
    valTelefono: any = true;
    ValidateTelefono() {
      this.valTelefono = true;
      const regex = /^[0-9+]+$/;
      if ((!this.telefono) || this.telefono.length >= 15 || !regex.test(this.telefono)) {
        this.valTelefono = false;
      }
    }
    
    valCorreo: any = true;
    ValidateCorreo() {
      this.valCorreo = true;
      const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if ((!this.correo) || this.correo.length >= 100 || !regex.test(this.correo)) {
        this.valCorreo = false;
      }
    }

    valUnidad: any = true;
    ValidateUnidad() {
      this.valUnidad = true;
      if (!this.id_inst_unidad) {
        this.valUnidad = false;
      }
    }

    valCargo: any = true;
    ValidateCargo() {
      this.valCargo = true;
      if ((!this.cargo)||(this.cargo.length >= 100)) {
        this.valCargo = false;
      }
    }

    valUsuario: any = true;
    ValidateUsuario() {
      this.valUsuario = true;
      if ((!this.usuario)||(this.usuario.length >= 15)) {
        this.valUsuario = false;
      }
    }

    valContrasenia: any = true;
    ValidateContrasenia() {
      this.valContrasenia = true;
      if ((!this.contrasenia)||(this.contrasenia.length >= 200)) {
        this.valContrasenia = false;
      }
    }

    valImageSrc: any = true;
    ValidateImageSrc() {
      this.valImageSrc = true;
      if (!this.imageSrc) {
        this.valImageSrc = false;
      }
    }
    // ======= ======= ======= ======= =======
    // ======= ======= INIT VIEW FUN ======= =======
    ngOnInit(): void{
      this.getParametricas();
      this.getPersonaRoles();
      this.countHeaderData();
    }
    // ======= ======= ======= ======= =======
    // ======= ======= VARIABLES SECTION ======= =======
    tipoDoc: any[] = [];
    roles: any[] = [];
    proyectos: any[] = [];
    proyectosInitAux: any[] = [];
    detalle_proyectos_to_add: any[] = [];
    detalle_proyectos_to_add_inited: any[] = [];
    persona_proyecto_mod_to_add: any[] = [];
    persona_proyecto_mod_to_edit: any[] = [];
    unidades: any[] =[];
    // ======= ======= ======= ======= =======
    // ======= ======= GET PARAMETRICAS ======= =======
    getParametricas(){
      // ======= GET TIPO DOC =======
      this.servicios.getParametricaByIdTipo(1).subscribe(
        (data) => {
          this.tipoDoc = data[0].dato;
        },
        (error) => {
          console.error(error);
        }
      );
      // ======= ======= =======
      // ======= GET ROLES =======
      this.servicios.getParametricaByIdTipo(11).subscribe(
        (data) => {
          this.roles = data[0].dato;
        },
        (error) => {
          console.error(error);
        }
      );
      // ======= ======= =======
      // ======= GET PROYECTOS =======
      this.servProyectos.getProyectos().subscribe(
        (data) => {
          this.detalle_proyectos_to_add = data[0].dato;
          this.detalle_proyectos_to_add_inited = data[0].dato;
        },
        (error) => {
          console.error(error);
        }
      );
      // ======= ======= =======
      // ======= GET UNIDADES =======
      this.servicios.getUnidades().subscribe(
        (data) => {
          this.unidades = data[0].dato;
        },
        (error) => {
          console.error(error);
        }
      );
      // ======= ======= =======
    }
    // ======= ======= ======= ======= =======
    // ======= ======= IMAGE LOADER FUNCTION ======= =======
    fileData: any;
    onFileSelected(event: Event): void {
      const input = event.target as HTMLInputElement;
  
      if (input.files && input.files.length > 0) {
        this.fileData = input.files[0];
        const reader = new FileReader();
  
        reader.onload = () => {
          this.imageSrc = reader.result as string;
        };
  
        reader.readAsDataURL(this.fileData);
      }
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
      this.modalTitle = (modalAction == "add")?("Añadir Persona"):(this.modalTitle);
      this.modalTitle = (modalAction == "edit")?("Editar Persona"):(this.modalTitle);
      return this.modalTitle;
    }
    // ======= ======= ======= ======= =======
    // ======= ======= PERSONA ROLES TABLE PAGINATION ======= =======
    get personasRolesTable() {
      if (!this.personasRoles) {
          return [];
      }
      const start = (this.mainPage - 1) * this.mainPageSize;
      return this.personasRoles.slice(start, start + this.mainPageSize);
    }
    // ======= ======= ======= ======= =======
    // ======= ======= PERSONA ROLES TABLE PAGINATION ======= =======
    get proyectosTable(){
      return this.proyectos; 
    }
    // ======= ======= ======= ======= =======
    // ======= ======= CHECKBOX CHANGED ======= =======
    personaRolesSelected: any = null;
    checkboxChanged(personaSel: any) {
      this.personasRoles.forEach(persona =>{
        if(personaSel.id_persona == persona.id_persona){
          if(personaSel.selected){
            this.personaRolesSelected = personaSel;
          }
          else{
            this.personaRolesSelected = null;
          }
        }
        else{
          persona.selected = false;
        }
      });
    }
    // ======= ======= ======= ======= =======
    // ======= ======= PERSONA ROL FORM CHAGNED ======= =======
    personaProyectoRolChange(event: Event, proyecto: any) {
      const selectedValue = (event.target as HTMLSelectElement).value;
      const proyectoToAdd = !(this.proyectosInitAux.some(obj => ((obj.id_proyecto == proyecto.id_proyecto)&&(obj.rol))));
      const proyectoInAdd = this.persona_proyecto_mod_to_add.some(obj => (obj.id_proyecto == proyecto.id_proyecto));
      if((this.modalAction == "add")||(proyectoToAdd)||(proyectoInAdd)){
        if(proyectoToAdd){
          this.persona_proyecto_mod_to_add = this.persona_proyecto_mod_to_add.filter(obj => (obj.id_proyecto != proyecto.id_proyecto));
        }
        this.persona_proyecto_mod_to_add.push(proyecto);
      }
      else{
        const proyectoToEdit = this.persona_proyecto_mod_to_edit.some(obj => (obj.id_proyecto == proyecto.id_proyecto));
        if(proyectoToEdit){
          this.persona_proyecto_mod_to_edit = this.persona_proyecto_mod_to_edit.filter(obj => (obj.id_proyecto != proyecto.id_proyecto));
        }
        this.persona_proyecto_mod_to_edit.push(proyecto);
      }
    }
    // ======= ======= ======= ======= =======
    // ======= ======= COUNT HEADER DATA FUCTION ======= =======
    countHeaderData(){
      this.headerDataNro01 = this.personasRoles.length;
      this.headerDataNro02 = this.detalle_proyectos_to_add_inited.length;
      this.personasRoles.forEach(persona =>{
        if(persona.admi_sistema){
          this.headerDataNro03 += 1
        }
        if(persona.id_persona == persona.id_persona_resp){
          this.headerDataNro04 += 1
        }
      });
    }
    // ======= ======= ======= ======= =======
    // ======= ======= INIT PERSONA ROLES NGMODEL ======= =======
    initPersonaRolesModel(){
      this.detalle_proyectos_to_add = this.detalle_proyectos_to_add_inited;
      this.persona_proyecto_mod_to_add = [];
      this.persona_proyecto_mod_to_edit = [];
      this.proyectosInitAux = [];

      this.modalAction = "";
      this.modalTitle = "";

      this.id_persona = null;
      this.nombres = null;
      this.apellido_1 = null;
      this.apellido_2 = null;
      this.idp_tipo_documento = "";
      this.idp_estado = null;
      this.nro_documento = null;
      this.telefono = null;
      this.correo = null;
      this.id_inst_unidad = "";
      this.cargo = null;
      this.responsable = null;
      this.usuario = null;
      this.contrasenia = null;
      this.logedBy = null;

      this.admi_sistema = null;

      this.imageSrc = null;

      this.valNombres = true;
      this.valApellido1 = true;
      this.valApellido2 = true;
      this.valTipoDocumento = true;
      this.valNroDocumento = true;
      this.valTelefono = true;
      this.valCorreo = true;
      this.valUnidad = true;
      this.valCargo = true;
      this.valUsuario = true;
      this.valContrasenia = true;
      this.valImageSrc = true;

    }
    // ======= ======= ======= ======= =======
    // ======= ======= GET PERSONAS ======= =======
    getPersonaRoles(){
      this.servPersonaRoles.getPersonaRoles().subscribe(
        (data) => {
          this.personasRoles = data[0].dato;
          this.totalLength = this.personasRoles.length;
          this.countHeaderData();
        },
        (error) => {
          console.error(error);
        }
      );
    }
    // ======= ======= ======= ======= =======
    // ======= ======= INIT ADD PERSONA ROLES ======= =======
    initAddPersonaRoles(modalScope: TemplateRef<any>){
      this.initPersonaRolesModel();
      
      this.detalle_proyectos_to_add.forEach((proyecto)=>{
        proyecto.rol = (proyecto.rol)?(proyecto.rol):("");
      });
      this.proyectos = this.detalle_proyectos_to_add;

      this.modalAction = "add";
      this.modalTitle = this.getModalTitle("add");

      this.openModal(modalScope);
    }
    // ======= ======= ======= ======= =======
    // ======= ======= ADD PERSONAS ======= =======
    addPersona() {
      const objPersona = {
        p_id_persona: null,
        p_nombres: this.nombres,
        p_apellido_1: this.apellido_1,
        p_apellido_2: this.apellido_2,
        p_nro_documento: this.nro_documento,
        p_correo: this.correo,
        p_telefono: this.telefono,
        p_fecha_registro: null,
        p_usuario: this.usuario,
        p_contrasenia: this.contrasenia,
        p_ruta_foto: null,
        p_idp_tipo_documento: this.idp_tipo_documento,
        p_idp_estado: 1,
        p_idp_tipo_red_social: null,
        p_firebase: null,
        p_id_tipo_institucion: 1,
        p_id_inst_unidad: this.id_inst_unidad,
        p_cargo: this.cargo,
        p_admi_sistema: this.admi_sistema,
        p_id_persona_reg: this.idPersonaReg
      };
    
      this.servPersona.addPersona(objPersona).subscribe(
        (data) => {
          const idPersona = data[0].dato[0].id_persona;

          // ======= ADD PERSONA PROYECTO =======
          this.uploadFile(this.fileData, this.id_persona, ((this.nombres+this.apellido_1+this.apellido_2).replace(/ /g, "_")));
          // ======= ======= =======
          // ======= ADD PERSONA PROYECTO =======
          const requests = this.persona_proyecto_mod_to_add.map((personaProyecto) => {
            const objPersonaRol = {
              p_id_persona_proyecto: null,
              p_id_persona: idPersona,
              p_id_institucion: null,
              p_id_proyecto: personaProyecto.id_proyecto,
              p_rol: personaProyecto.rol,
              p_id_persona_reg: this.idPersonaReg
            };
            return this.servPersonaRoles.addPersonaRol(objPersonaRol);
          });
          // ======= ======= =======
          // ======= IS RESPONSABLE =======
          if(this.responsable){
            let unidadObj = this.unidades.find(unidad => unidad.id_inst_unidad == this.id_inst_unidad);
            unidadObj.id_persona_resp = idPersona;
            this.editUnidad(unidadObj);
          }
          // ======= ======= =======
    
          if (requests.length === 0) {
            this.onAllServicesComplete();
            this.personaRolesSelected = null;
          }
          else{
            forkJoin(requests).subscribe(
              () => {
                this.onAllServicesComplete();
              },
              (error) => {
                console.error(error);
              }
            );
          }
        },
        (error) => {
          console.error(error);
        }
      );
    }
    
    onAllServicesComplete() {
      this.getPersonaRoles();
      this.countHeaderData();
    }
    // ======= IS RESPONSABLE FUN =======
    isRespOfUnit(idToAsk){
      const isResp = this.unidades.some(unidad => unidad.id_persona_resp == idToAsk);
      return isResp;
    }
    editUnidad(obj: any){
      this.servicios.editUnidades(obj).subscribe(
        (data) => {
        },
        (error) => {
          console.error(error);
        }
      );
    }
    // ======= ======= =======
    // ======= ======= ======= ======= =======
    // ======= ======= INIT EDIT PERSONA ROLES ======= =======
    initEditPersonaRoles(modalScope: TemplateRef<any>){
      this.initPersonaRolesModel();
      
      this.personaRolesSelected.detalle_proyectos.forEach((proyecto)=>{
        proyecto.rol = (proyecto.rol)?(proyecto.rol):("");
      });
      this.proyectos = this.personaRolesSelected.detalle_proyectos;
      this.proyectosInitAux = this.personaRolesSelected.detalle_proyectos.filter(item => 
        item.id_persona_proyecto !== null && item.rol !== null && item.rol !== ""
      );

      this.modalAction = "edit";
      this.modalTitle = this.getModalTitle("edit");

      this.id_persona = this.personaRolesSelected.id_persona;
      this.nombres = this.personaRolesSelected.nombres;
      this.apellido_1 = this.personaRolesSelected.apellido_1;
      this.apellido_2 = this.personaRolesSelected.apellido_2;
      this.idp_tipo_documento = ((this.personaRolesSelected.idp_tipo_documento)?this.personaRolesSelected.idp_tipo_documento:"").toString();
      this.idp_estado = this.personaRolesSelected.idp_estado;
      this.nro_documento = this.personaRolesSelected.nro_documento;
      this.telefono = this.personaRolesSelected.telefono;
      this.correo = this.personaRolesSelected.correo;
      this.id_inst_unidad = this.personaRolesSelected.id_inst_unidad;
      this.cargo = this.personaRolesSelected.cargo;
      this.responsable = this.isRespOfUnit(this.personaRolesSelected.id_persona);
      this.usuario = this.personaRolesSelected.usuario;
      this.contrasenia = this.personaRolesSelected.contrasenia;
      this.logedBy = this.personaRolesSelected.logedBy;

      this.downloadFile(this.id_persona);

      this.admi_sistema = this.personaRolesSelected.admi_sistema;

      this.openModal(modalScope);
    }
    // ======= ======= ======= ======= =======
    // ======= ======= EDIT PERSONAS ======= =======
    editPersona() {
      const objPersona = {
        p_id_persona: this.id_persona,
        p_nombres: this.nombres,
        p_apellido_1: this.apellido_1,
        p_apellido_2: this.apellido_2,
        p_nro_documento: this.nro_documento,
        p_correo: this.correo,
        p_telefono: this.telefono,
        p_fecha_registro: null,
        p_usuario: this.usuario,
        p_contrasenia: this.contrasenia,
        p_ruta_foto: null,
        p_idp_tipo_documento: this.idp_tipo_documento,
        p_idp_estado: this.idp_estado,
        p_idp_tipo_red_social: null,
        p_firebase: null,
        p_id_tipo_institucion: 1,
        p_id_inst_unidad: this.id_inst_unidad,
        p_cargo: this.cargo,
        p_admi_sistema: this.admi_sistema,
        p_id_persona_reg: this.idPersonaReg
      };
    
      this.servPersona.editPersona(objPersona).subscribe(
        (data) => {

          // ======= UPLOAD FILE =======
          if(this.fileData){
            this.uploadFile(this.fileData, this.id_persona, ((this.nombres+this.apellido_1+this.apellido_2).replace(/ /g, "_")));
          }
          // ======= ======= =======
          // ======= BUILD PERSONA PROYECTO =======
          let addRequestsPersona: any[] = [];
          this.persona_proyecto_mod_to_add.forEach((personaProyecto) => {
            let objPersonaRol = {
              p_id_persona_proyecto: null,
              p_id_persona: this.id_persona,
              p_id_institucion: 1,
              p_id_proyecto: personaProyecto.id_proyecto,
              p_rol: personaProyecto.rol,
              p_id_persona_reg: this.idPersonaReg
            };
            addRequestsPersona.push(this.servPersonaRoles.addPersonaRol(objPersonaRol));
          });
          // ======= ======= =======
          // ======= EDIT PERSONA PROYECTO =======
          let editRequestsPersona: any[] = [];
          this.persona_proyecto_mod_to_edit.forEach((personaProyecto) => {
            let objPersonaRol = {
              p_id_persona_proyecto: personaProyecto.id_persona_proyecto,
              p_id_persona: this.id_persona,
              p_id_institucion: 1,
              p_id_proyecto: personaProyecto.id_proyecto,
              p_rol: personaProyecto.rol,
              p_id_persona_reg: this.idPersonaReg
            };
            editRequestsPersona.push(this.servPersonaRoles.editPersonaRol(objPersonaRol));
          });
          // ======= ======= =======
          // ======= ON ALL REQUEST END =======
          let allRequests = [...addRequestsPersona, ...editRequestsPersona];

          if (allRequests.length == 0) {
            this.onAllServicesComplete();
            this.personaRolesSelected = null;
          } 
            else {
            forkJoin(allRequests).subscribe(
              (responses) => {
                console.log(responses);
                this.onAllServicesComplete();
              },
              (error) => {
                console.error('Error en las peticiones:', error);
              }
            );
          }
          // ======= ======= =======
          // ======= IS RESPONSABLE =======
          if(this.responsable){
            let unidadObj = this.unidades.find(unidad => unidad.id_inst_unidad == this.id_inst_unidad);
            unidadObj.id_persona_resp = parseInt(this.id_persona,10);
            this.editUnidad(unidadObj);
          }
          // ======= ======= =======

        },
        (error) => {
          console.error(error);
        }
      );
    }
    // ======= ======= ======= ======= =======
    // ======= ======= INIT DELETE PERSONA ROLES ======= =======
    initDeletePersonaRoles(modalScope: TemplateRef<any>){
      this.id_persona = this.personaRolesSelected.id_persona;
      this.nombres = this.personaRolesSelected.nombres;
      this.apellido_1 = this.personaRolesSelected.apellido_1;
      this.apellido_2 = this.personaRolesSelected.apellido_2;
      this.idp_tipo_documento = ((this.personaRolesSelected.idp_tipo_documento)?this.personaRolesSelected.idp_tipo_documento:"").toString();
      this.idp_estado = 2;
      this.nro_documento = this.personaRolesSelected.nro_documento;
      this.telefono = this.personaRolesSelected.telefono;
      this.correo = this.personaRolesSelected.correo;
      this.id_inst_unidad = this.personaRolesSelected.id_inst_unidad;
      this.cargo = this.personaRolesSelected.cargo;
      this.responsable = this.personaRolesSelected.responsable;
      this.usuario = this.personaRolesSelected.usuario;
      this.contrasenia = this.personaRolesSelected.contrasenia;
      this.logedBy = this.personaRolesSelected.logedBy;

      this.admi_sistema = this.personaRolesSelected.admi_sistema;

      this.openModal(modalScope);
    }
    // ======= ======= ======= ======= =======
    // ======= ======= SUBMIT FORM ======= =======
    onSubmit(): void{
      // ======= VALIDATION SECTION =======
      let valForm = false;

      this.ValidateNombres();
      this.ValidateApellido1();
      this.ValidateApellido2();
      this.ValidateTipoDocumento();
      this.ValidateNroDocumento();
      this.ValidateTelefono();
      this.ValidateCorreo();
      this.ValidateUnidad();
      this.ValidateCargo();
      this.ValidateUsuario();
      this.ValidateContrasenia();
      this.ValidateImageSrc();

      valForm = 
        this.valNombres &&
        this.valApellido1 &&
        this.valApellido2 &&
        this.valTipoDocumento &&
        this.valNroDocumento &&
        this.valTelefono &&
        this.valCorreo &&
        this.valUnidad &&
        this.valCargo &&
        this.valUsuario &&
        this.valContrasenia &&
        this.valImageSrc;

      // ======= SUBMIT SECTION =======
      if(valForm){
        if(this.modalAction == "add"){
          this.addPersona();
        }
        else{
          this.editPersona();
        }
        this.closeModal();
      }
    }
    // ======= ======= ======= ======= =======
    // ======= ======= UPLOAD IMAGE FUN ======= =======
    uploadFile(file: any, idRegistro: any, nombreRegistro: any){
      this.servicios.uploadFile(file, "persona", "ruta_foto", "id_persona", nombreRegistro, idRegistro).subscribe(
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
    downloadFile(idRegistro: any){
      this.servicios.downloadFile("persona", "ruta_foto", "id_persona", idRegistro).subscribe(
        (response: Blob) => {
          if (response instanceof Blob) {
            const url = window.URL.createObjectURL(response);
            this.imageSrc = url;
          } 
          else {
            //console.warn('La respuesta no es un Blob:', response);
            this.imageSrc = null; 
          }
        },
        (error) => {
          if (error.status === 404) {
            //console.warn('No se encontró imagen para el registro:', idRegistro);
            this.imageSrc = null;
          } else {
            //console.error('Error al descargar la imagen:', error);
          }
        }
      );
    }
    // ======= ======= ======= ======= =======
}
