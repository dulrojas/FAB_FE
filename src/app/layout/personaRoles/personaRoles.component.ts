import { Component, OnInit, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { servPersonaRoles } from "../../servicios/personaRoles";

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
      private cdr: ChangeDetectorRef,
      private servPersonaRoles: servPersonaRoles
    ){}

    idProyecto: any = 0;

    headerDataNro01: any = 0;
    headerDataNro02: any = 0;
    headerDataNro03: any = 0;
    headerDataNro04: any = 0;

    // ======= ======= NGMODEL VARIABLES SECTION ======= =======
    modalTitle: any = "";

    nombres: any = null;
    apellido_1: any = null;
    apellido_2: any = null;
    idp_tipo_documento: any = "";
    telefono: any = null;
    correo: any = null;
    unidad: any = "";
    cargo: any = null;
    responsable: any = null;
    usuario: any = null;
    contrasenia: any = null;
    logedBy: any = null;

    // ======= ======= VARIABLES SECTION ======= =======
    tipoDoc: Array<{ id: number, name: string }> = [
      { id: 1, name: 'Carnet de identidad' },
      { id: 2, name: 'NIT' },
      { id: 3, name: 'DNI' },
      { id: 4, name: 'Pasaporte' }
    ];

    unidades: Array<{ id: number, name: string }> = [
      { id: 1, name: 'Unidad 1' },
      { id: 2, name: 'Unidad 2' },
      { id: 3, name: 'Unidad 3' }
    ];

    proyectos: Array<{ id: number, name: string }> = [
      { id: 1, name: 'Proyecto 1' },
      { id: 2, name: 'Proyecto 2' },
      { id: 3, name: 'Proyecto 3' },
      { id: 4, name: 'Proyecto 4' },
      { id: 5, name: 'Proyecto 5' }
    ];

    roles: Array<{ id: number, name: string }> = [
      { id: 1, name: 'LEC' },
      { id: 2, name: 'ESC' },
      { id: 3, name: 'RES' },
      { id: 4, name: 'CON' }
    ];

    // ======= ======= ======= ======= =======
    // ======= ======= INIT VIEW FUN ======= =======
    ngOnInit(): void{
        this.getPersonaRoles();
        this.countHeaderData();
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
    get proyectosTable() {
      return this.proyectos;
    }
    // ======= ======= ======= ======= =======
    personaRolesSelected: any = null;
    // ======= ======= CHECKBOX CHANGED ======= =======
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
    // ======= ======= INIT PERSONA ROLES NGMODEL ======= =======
    initPersonaRolesModel(){
      this.modalTitle = "";

      this.nombres = null;
      this.apellido_1 = null;
      this.apellido_2 = null;
      this.idp_tipo_documento = "";
      this.telefono = null;
      this.correo = null;
      this.unidad = "";
      this.cargo = null;
      this.responsable = null;
      this.usuario = null;
      this.contrasenia = null;
      this.logedBy = null;
    }
    // ======= ======= ======= ======= =======
    // ======= ======= INIT ADD PERSONA ROLES ======= =======
    initAddPersonaRoles(modalScope: TemplateRef<any>){
      this.initPersonaRolesModel();

      this.modalTitle = this.getModalTitle("add");

      this.openModal(modalScope);
    }
    // ======= ======= ======= ======= =======
    // ======= ======= INIT EDIT PERSONA ROLES ======= =======
    initEditPersonaRoles(modalScope: TemplateRef<any>){
      this.initPersonaRolesModel();

      this.modalTitle = this.getModalTitle("edit");

      this.nombres = this.personaRolesSelected.nombres;
      this.apellido_1 = this.personaRolesSelected.apellido_1;
      this.apellido_2 = this.personaRolesSelected.apellido_2;
      this.idp_tipo_documento = this.personaRolesSelected.idp_tipo_documento;
      this.telefono = this.personaRolesSelected.telefono;
      this.correo = this.personaRolesSelected.correo;
      this.unidad = this.personaRolesSelected.unidad;
      this.cargo = this.personaRolesSelected.cargo;
      this.responsable = this.personaRolesSelected.responsable;
      this.usuario = this.personaRolesSelected.usuario;
      this.contrasenia = this.personaRolesSelected.contrasenia;
      this.logedBy = this.personaRolesSelected.logedBy;

      this.openModal(modalScope);
    }
    // ======= ======= ======= ======= =======
    // ======= ======= INIT DELETE PERSONA ROLES ======= =======
    initDeletePersonaRoles(){
      
    }
    // ======= ======= ======= ======= =======
    // ======= ======= GET PERSONAS ======= =======
    getPersonaRoles(){
      this.servPersonaRoles.getPersonaRoles().subscribe(
        (data) => {
          this.personasRoles = data[0].dato;
          this.countHeaderData();
        },
        (error) => {
          console.error(error);
        }
      );
    }
    // ======= ======= ======= ======= =======
    // ======= ======= COUNT HEADER DATA FUCTION ======= =======
    countHeaderData(){
      this.headerDataNro01 = this.personasRoles.length;
      this.personasRoles.forEach(persona =>{
        if(persona.admi_sistema){
          this.headerDataNro02 += 1
        }
        if(persona.proyectoRol == "CON"){
          this.headerDataNro03 += 1
        }
        if(persona.proyectoRol == "RES"){
          this.headerDataNro04 += 1
        }
      });
    }
    // ======= ======= ======= ======= =======
    // ======= ======= SUBMIT FORM ======= =======
    onSubmit(): void {
    }
    // ======= ======= ======= ======= =======
}
