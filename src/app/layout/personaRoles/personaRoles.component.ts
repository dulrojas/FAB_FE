import { Component, OnInit, TemplateRef } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { servicios } from "../../servicios/servicios";
import { servPersona } from "../../servicios/persona";
import { servPersonaRoles } from "../../servicios/personaRoles";
import { servProyectos } from "../../servicios/proyectos";

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
      private servicios: servicios,
      private servPersona: servPersona,
      private servPersonaRoles: servPersonaRoles,
      private servProyectos: servProyectos
    ){}

    idProyecto: any = 0;

    headerDataNro01: any = 0;
    headerDataNro02: any = 0;
    headerDataNro03: any = 0;
    headerDataNro04: any = 0;

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
      this.servicios.getParametricaByIdTipo(13).subscribe(
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
    // ======= ======= OPEN MODALS FUN ======= =======
    openModal(content: TemplateRef<any>) {
      this.modalService.open(content, { size: 'xl' });
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
      const proyectoToAdd = this.persona_proyecto_mod_to_add.some(obj => (obj.id_proyecto == proyecto.id_proyecto));
      if((this.modalAction == "add")||(!proyecto.rol)||(proyectoToAdd)){
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
      this.id_inst_unidad = null;
      this.cargo = null;
      this.responsable = null;
      this.usuario = null;
      this.contrasenia = null;
      this.logedBy = null;

      this.admi_sistema = null;
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
    addPersona(){
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
        p_id_tipo_institucion: null,
        p_id_inst_unidad: null,
        p_cargo: this.cargo,
        p_admi_sistema: this.admi_sistema
      };
      
      this.servPersona.addPersona(objPersona).subscribe(
        (data) => {
          this.persona_proyecto_mod_to_add.forEach((personaProyecto) => {
            personaProyecto.id_persona = data[0].dato[0].id_persona;
            this.addPersonaRol(personaProyecto);
          });
        },
        (error) => {
          console.error(error);
        }
      );
    }
    // ======= ======= ======= ======= =======
    // ======= ======= ADD PERSONAS ======= =======
    addPersonaRol(proyectoRolScope: any){
      const objPersonaRol = {
        p_id_persona_proyecto: null,
        p_id_persona: proyectoRolScope.id_persona,
        p_id_institucion: null,
        p_id_proyecto: proyectoRolScope.id_proyecto,
        p_rol: proyectoRolScope.rol
      };
      
      this.servPersonaRoles.addPersonaRol(objPersonaRol).subscribe(
        (data) => {
        },
        (error) => {
          console.error(error);
        }
      );
    }
    // ======= ======= ======= ======= =======
    // ======= ======= INIT EDIT PERSONA ROLES ======= =======
    initEditPersonaRoles(modalScope: TemplateRef<any>){
      this.initPersonaRolesModel();
      
      this.personaRolesSelected.detalle_proyectos.forEach((proyecto)=>{
        proyecto.rol = (proyecto.rol)?(proyecto.rol):("");
      });
      this.proyectos = this.personaRolesSelected.detalle_proyectos;

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
      this.responsable = this.personaRolesSelected.responsable;
      this.usuario = this.personaRolesSelected.usuario;
      this.contrasenia = this.personaRolesSelected.contrasenia;
      this.logedBy = this.personaRolesSelected.logedBy;

      this.admi_sistema = this.personaRolesSelected.admi_sistema;

      this.openModal(modalScope);
    }
    // ======= ======= ======= ======= =======
    // ======= ======= EDIT PERSONAS ======= =======
    editPersona(){
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
        p_id_tipo_institucion: null,
        p_id_inst_unidad: null,
        p_cargo: this.cargo,
        p_admi_sistema: this.admi_sistema
      };
      console.log(objPersona);
      this.servPersona.editPersona(objPersona).subscribe(
        (data) => {
          console.log(data);
        },
        (error) => {
          console.error(error);
        }
      );
    }
    // ======= ======= ======= ======= =======
    // ======= ======= EDIT PERSONAS ======= =======
    editPersonaRol(proyectoRolScope: any){
      const objPersonaRol = {
        p_id_persona_proyecto: proyectoRolScope.id_persona_proyecto,
        p_id_persona: proyectoRolScope.id_persona,
        p_id_proyecto: proyectoRolScope.id_proyecto,
        p_rol: proyectoRolScope.rol
      };

      this.servPersonaRoles.editPersonaRol(objPersonaRol).subscribe(
        (data) => {
          console.log(data);
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

      console.log(this.persona_proyecto_mod_to_add);
      console.log(this.persona_proyecto_mod_to_edit);

      if(this.modalAction == "add"){
        this.addPersona();
      }
      else{
        this.editPersona();

        this.persona_proyecto_mod_to_add.forEach((personaProyecto) => {
          personaProyecto.id_persona = 3;
          this.addPersonaRol(personaProyecto);
        });

        this.persona_proyecto_mod_to_edit.forEach((personaProyecto) => {
          personaProyecto.id_persona = 3;
          this.addPersonaRol(personaProyecto);
        });
      }
    }
    // ======= ======= ======= ======= =======
}
