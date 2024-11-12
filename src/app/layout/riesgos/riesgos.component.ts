import { Component, OnInit, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ServRiesgos } from "../../servicios/riesgos";

@Component({
  selector: 'app-riesgos',
  templateUrl: './riesgos.component.html',
  styleUrls: ['./riesgos.component.scss'],
  animations: [routerTransition()]
})

export class RiesgosComponent implements OnInit {
  
  // Variables
  riesgos: any[] = [];
  riesgoSelected: any = null;

    mainPage = 1;
    mainPageSize = 10;
    totalLength = 0;

  constructor(
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,
    private servRiesgos: ServRiesgos,
    ) {}

    idProyecto: any = 0;

    headerDataNro01: any = 0; 
    headerDataNro02: any = 0; 
    headerDataNro03: any = 0; 
    headerDataNro04: any = 0; 

  // ======= ======= NGMODEL VARIABLES SECTION ======= =======
  modalTitle: any = "";
    
  id_riesgo: any = null;
  id_proyecto: any = null;
  id_proy_elemen_padre: any = null;
  idp_categoria: any = "";
  codigo: any = "";
  fecha: any = "";
  riesgo: any = "";
  descripcion: any = "";
  vinculados: any = "";
  idp_identificacion: any = "";
  impacto: any = "";
  probabilidad: any = "";
  nivel: any = "";
  idp_ocurrencia: any = "";
  medidas: any = "";
  idp_efectividad: any = "";
  comentarios: any = "";
  fecha_hora_reg: any = "";
  id_persona_reg: any = "";

  categorias: Array<{ id: number, name: string }> = [
    { id: 1, name: 'Político' },
    { id: 2, name: 'Social' },
    { id: 3, name: 'Ambiental' },
    { id: 4, name: 'Económico' }
  ];
  componentes: Array<{ id: number, name: string }> = [
    { id: 1, name: 'Objetivo General' },
    { id: 2, name: 'Objetivo Especifico' },
    { id: 3, name: 'Resultado' },
    { id: 4, name: 'Indicador' }
  ];


  ngOnInit(): void {
    this.getRiesgos();
    this.countHeaderData();
  }

  // ======= ======= OPEN MODALS FUN ======= =======
  openModal(content: TemplateRef<any>) {
    this.modalService.open(content, { size: 'xl' });
  }

  // ======= ======= GET MODAL TITLE FUN ======= =======
  getModalTitle(modalAction: any) {
      this.modalTitle = (modalAction == "add") ? ("Añadir Riesgo") : this.modalTitle;
      this.modalTitle = (modalAction == "edit") ? ("Editar Riesgo") : this.modalTitle;
      return this.modalTitle;
  }

  // ======= ======= RIESGOS TABLE PAGINATION ======= =======
  get riesgosTable() {
    if (!this.riesgos) {
        return [];
    }
    const start = (this.mainPage - 1) * this.mainPageSize;
    return this.riesgos.slice(start, start + this.mainPageSize);
  }

  // ======= ======= CHECKBOX CHANGED ======= =======
  checkboxChanged(riesgoSel: any) {
    this.riesgos.forEach(riesgo => {
        if(riesgoSel.id_riesgo == riesgo.id_riesgo) {
            if(riesgoSel.selected) {
                this.riesgoSelected = riesgoSel;
            } 
            else {
                this.riesgoSelected = null;
            }
        } 
        else {
            riesgo.selected = false;
        }
    });
  }

  // ======= ======= INIT RIESGO MODEL ======= =======
  initRiesgoModel() {
    this.modalTitle = "";

    this.id_riesgo = null;
    this.id_proyecto = null;
    this.id_proy_elemen_padre = null;
    this.idp_categoria = "";
    this.codigo = "";
    this.fecha = new Date();
    this.riesgo = "";
    this.descripcion = "";
    this.vinculados = "";
    this.idp_identificacion = null;
    this.impacto = "";
    this.probabilidad = "";
    this.nivel = "";
    this.idp_ocurrencia = null;
    this.medidas = "";
    this.idp_efectividad = null;
    this.comentarios = "";

    //Sacar Datos De Persona
    this.fecha_hora_reg = new Date();
    this.id_persona_reg = null;
  }

  // ======= ======= INIT ADD RIESGO ======= =======
  initAddRiesgo(modalScope: TemplateRef<any>) {
    this.initRiesgoModel();
    this.modalTitle = this.getModalTitle("add");
    this.openModal(modalScope);
  }

  // ======= ======= INIT EDIT RIESGO ======= =======
  initEditRiesgo(modalScope: TemplateRef<any>) {
    this.initRiesgoModel();
    this.modalTitle = this.getModalTitle("edit");

    this.id_riesgo = this.riesgoSelected.id_riesgo;
    this.id_proyecto = this.riesgoSelected.id_proyecto;
    this.id_proy_elemen_padre = this.riesgoSelected.id_proy_elemen_padre;
    this.idp_categoria = this.riesgoSelected.idp_categoria;
    this.codigo = this.riesgoSelected.codigo;
    this.fecha = this.riesgoSelected.fecha;
    this.riesgo = this.riesgoSelected.riesgo;
    this.descripcion = this.riesgoSelected.descripcion;
    this.vinculados = this.riesgoSelected.vinculados;
    this.idp_identificacion = this.riesgoSelected.idp_identificacion;
    this.impacto = this.riesgoSelected.impacto;
    this.probabilidad = this.riesgoSelected.probabilidad;
    this.nivel = this.riesgoSelected.nivel;
    this.idp_ocurrencia = this.riesgoSelected.idp_ocurrencia;
    this.medidas = this.riesgoSelected.medidas;
    this.idp_efectividad = this.riesgoSelected.idp_efectividad;
    this.comentarios = this.riesgoSelected.comentarios;

    this.openModal(modalScope);
  }

  // ======= ======= INIT DELETE RIESGO ======= =======
  initDeleteRiesgo() {
       
  }

  // ======= ======= GET RIESGOS ======= =======
    /*getRiesgos() {
        this.servRiesgos.getRiesgos().subscribe(
            (data) => {
                this.riesgos = data[0].dato;
                this.countHeaderData();
            },
            (error) => {
                console.error(error);
            }
        );
    }*/

    //Get Para Pruebas 
    getRiesgos(): void {
      this.riesgos = [
      { id: 1, categoria: 'Político', identificacion: '2024-05-02', riesgo: 'Impedimento legal', impacto: 'Alto', probabilidad: 'Bajo', nivelRiesgo: 'Alto', tomarMedidas: 'No', efectividad: 'No efectiva', comentarios: '', seleccionado: false },
      { id: 2, categoria: 'Ambiental', identificacion: '2024-06-02', riesgo: 'Incendio', impacto: 'Medio', probabilidad: 'Medio', nivelRiesgo: 'Medio', tomarMedidas: 'Sí', efectividad: 'De bajo efecto', comentarios: '', seleccionado: false },
      { id: 3, categoria: 'Social', identificacion: '2024-07-02', riesgo: 'Protestas', impacto: 'Bajo', probabilidad: 'Alto', nivelRiesgo: 'Bajo', tomarMedidas: 'Sí', efectividad: 'Efectiva', comentarios: '', seleccionado: false },
      { id: 5, categoria: 'Ambiental', identificacion: '2024-06-02', riesgo: 'Incendio', impacto: 'Medio', probabilidad: 'Medio', nivelRiesgo: 'Medio', tomarMedidas: 'Sí', efectividad: 'De bajo efecto', comentarios: '', seleccionado: false },
      { id: 6, categoria: 'Social', identificacion: '2024-07-02', riesgo: 'Protestas', impacto: 'Bajo', probabilidad: 'Alto', nivelRiesgo: 'Bajo', tomarMedidas: 'Sí', efectividad: 'Efectiva', comentarios: '', seleccionado: false },
      { id: 7, categoria: 'Político', identificacion: '2024-05-02', riesgo: 'Impedimento legal', impacto: 'Alto', probabilidad: 'Bajo', nivelRiesgo: 'Alto', tomarMedidas: 'No', efectividad: 'No efectiva', comentarios: '', seleccionado: false },
      ];
      this.totalLength = this.riesgos.length;
      }

  // ======= ======= COUNT HEADER DATA FUNCTION ======= =======
    countHeaderData() {
        this.headerDataNro01 = 0;
        this.headerDataNro02 = 0;
        this.headerDataNro03 = 0;
        this.headerDataNro04 = 0;
        
        this.riesgos.forEach(riesgo => {
            if(riesgo.nivel === 'ALTO') {
                this.headerDataNro02 += 1;
            } else if(riesgo.nivel === 'MEDIO') {
                this.headerDataNro03 += 1;
            } else if(riesgo.nivel === 'BAJO') {
                this.headerDataNro04 += 1;
            }
        });
    }

    // ======= ======= SUBMIT FORM ======= =======
    onSubmit(): void {
    }

}

