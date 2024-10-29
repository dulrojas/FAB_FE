import { Component, OnInit, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-aprendizajes',
    templateUrl: './aprendizajes.component.html',
    styleUrls: ['../../../styles/styles.scss'],
    animations: [routerTransition()]
})
export class AprendizajesComponent implements OnInit {
    // ======= ======= VARIABLES SECTION ======= =======
    personasRoles: any[] = [];
    mainPage = 1;
    mainPageSize = 10;
    totalLength = 0;
    constructor(
      private modalService: NgbModal,
      private cdr: ChangeDetectorRef
    ) {}

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
        this.loadPeople();
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
      this.modalTitle = (modalAction == "add")?("Añadir Aprendizaje"):(this.modalTitle);
      this.modalTitle = (modalAction == "edit")?("Editar Aprendizaje"):(this.modalTitle);
      return this.modalTitle;
    }
    // ======= ======= ======= ======= =======
    // ======= ======= PERSONA ROLES TABLE PAGINATION ======= =======
    get personasRolesTable() {
      const start = (this.mainPage - 1) * this.mainPageSize;
      return this.personasRoles.slice(start, start + this.mainPageSize);
    }
    // ======= ======= ======= ======= =======
    // ======= ======= PERSONA ROLES TABLE PAGINATION ======= =======
    get proyectosTable() {
      return this.proyectos;
    }
    // ======= ======= ======= ======= =======
    aprendizajesSelected: any = null;
    // ======= ======= CHECKBOX CHANGED ======= =======
    checkboxChanged(personaSel: any) {
      this.personasRoles.forEach(persona =>{
        if(personaSel.id_persona == persona.id_persona){
          if(personaSel.selected){
            this.aprendizajesSelected = personaSel;
          }
          else{
            this.aprendizajesSelected = null;
          }
        }
        else{
          persona.selected = false;
        }
      });
    }
    // ======= ======= ======= ======= =======
    // ======= ======= INIT PERSONA ROLES NGMODEL ======= =======
    initAprendizajesModel(){
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
    initAddAprendizajes(modalScope: TemplateRef<any>){
      this.initAprendizajesModel();

      this.modalTitle = this.getModalTitle("add");

      this.openModal(modalScope);
    }
    // ======= ======= ======= ======= =======
    // ======= ======= INIT EDIT PERSONA ROLES ======= =======
    initEditAprendizajes(modalScope: TemplateRef<any>){
      this.initAprendizajesModel();

      this.modalTitle = this.getModalTitle("edit");

      this.nombres = this.aprendizajesSelected.nombres;
      this.apellido_1 = this.aprendizajesSelected.apellido_1;
      this.apellido_2 = this.aprendizajesSelected.apellido_2;
      this.idp_tipo_documento = this.aprendizajesSelected.idp_tipo_documento;
      this.telefono = this.aprendizajesSelected.telefono;
      this.correo = this.aprendizajesSelected.correo;
      this.unidad = this.aprendizajesSelected.unidad;
      this.cargo = this.aprendizajesSelected.cargo;
      this.responsable = this.aprendizajesSelected.responsable;
      this.usuario = this.aprendizajesSelected.usuario;
      this.contrasenia = this.aprendizajesSelected.contrasenia;
      this.logedBy = this.aprendizajesSelected.logedBy;

      this.openModal(modalScope);
    }
    // ======= ======= ======= ======= =======
    // ======= ======= INIT DELETE PERSONA ROLES ======= =======
    initDeleteAprendizajes(){
      
    }
    // ======= ======= ======= ======= =======
    // ======= ======= GET PERSONAS ======= =======
    loadPeople(): void {
      this.personasRoles = [
        {
          id_persona: 1,
          nombres: 'John',
          apellido_1: 'Doe',
          apellido_2: '',
          telefono: '123-456-7890',
          correo: 'john.doe@example.com',
          usuario: 'jdoe',
          unidad: 'Desarrollo',
          responsable: 'Sí',
          cargo: 'Developer',
          admi_sistema: true,
          proyectoRol: 'CON'
        },
        {
          id_persona: 2,
          nombres: 'Jane',
          apellido_1: 'Doe',
          apellido_2: 'Jhonson',
          telefono: '987-654-3210',
          correo: 'jane.doe@example.com',
          usuario: 'jadoe',
          unidad: 'Diseño',
          responsable: 'No',
          cargo: 'Designer',
          admi_sistema: false,
          proyectoRol: 'RES'
        },
        {
          id_persona: 3,
          nombres: 'James',
          apellido_1: 'Smith',
          apellido_2: '',
          telefono: '456-789-1230',
          correo: 'james.smith@example.com',
          usuario: 'jsmith',
          unidad: 'Gerencia',
          responsable: 'Sí',
          cargo: 'Manager',
          admi_sistema: false,
          proyectoRol: 'ESC'
        },
        {
          id_persona: 4,
          nombres: 'Emily',
          apellido_1: 'Davis',
          apellido_2: '',
          telefono: '321-654-9870',
          correo: 'emily.davis@example.com',
          usuario: 'edavis',
          unidad: 'Desarrollo',
          responsable: 'No',
          cargo: 'Developer',
          admi_sistema: false,
          proyectoRol: 'LEC'
        },
        {
          id_persona: 5,
          nombres: 'Michael',
          apellido_1: 'Brown',
          apellido_2: 'Doe',
          telefono: '654-321-7890',
          correo: 'michael.brown@example.com',
          usuario: 'mbrown',
          unidad: 'Recursos Humanos',
          responsable: 'Sí',
          cargo: 'HR',
          admi_sistema: false,
          proyectoRol: 'LEC'
        },
        {
          id_persona: 6,
          nombres: 'Sarah',
          apellido_1: 'Wilson',
          apellido_2: '',
          telefono: '789-456-1230',
          correo: 'sarah.wilson@example.com',
          usuario: 'swilson',
          unidad: 'Marketing',
          responsable: 'No',
          cargo: 'Marketing',
          admi_sistema: false,
          proyectoRol: 'RES'
        },
        {
          id_persona: 7,
          nombres: 'David',
          apellido_1: 'Lee',
          apellido_2: '',
          telefono: '012-345-6789',
          correo: 'david.lee@example.com',
          usuario: 'dlee',
          unidad: 'Soporte',
          responsable: 'Sí',
          cargo: 'Support',
          admi_sistema: false,
          proyectoRol: 'RES'
        },
        {
          id_persona: 8,
          nombres: 'Laura',
          apellido_1: 'Moore',
          apellido_2: '',
          telefono: '654-987-1230',
          correo: 'laura.moore@example.com',
          usuario: 'lmoore',
          unidad: 'Dirección',
          responsable: 'Sí',
          cargo: 'CEO',
          admi_sistema: false,
          proyectoRol: 'RES'
        },
        {
          id_persona: 9,
          nombres: 'Paul',
          apellido_1: 'Harris',
          apellido_2: '',
          telefono: '789-012-3456',
          correo: 'paul.harris@example.com',
          usuario: 'pharris',
          unidad: 'Ventas',
          responsable: 'No',
          cargo: 'Sales',
          admi_sistema: false,
          proyectoRol: 'ESC'
        },
        {
          id_persona: 10,
          nombres: 'Anna',
          apellido_1: 'Scott',
          apellido_2: '',
          telefono: '345-678-9012',
          correo: 'anna.scott@example.com',
          usuario: 'ascott',
          unidad: 'Producto',
          responsable: 'Sí',
          cargo: 'Product Owner',
          admi_sistema: true,
          proyectoRol: 'CON'
        }
      ];
      this.totalLength = this.personasRoles.length;
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
