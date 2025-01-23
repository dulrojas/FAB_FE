import { Component, OnInit, TemplateRef, EventEmitter, Output} from '@angular/core';
import { routerTransition } from '../../router.animations';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { servRiesgos } from "../../servicios/riesgos";
import { ProyectoService } from '../../services/proyectoData.service';
import { servicios } from "../../servicios/servicios";
import { servAprendizaje } from "../../servicios/aprendizajes";

@Component({
  selector: 'app-riesgos',
  templateUrl: './riesgos.component.html',
  styleUrls: ['./riesgos.component.scss'],
  animations: [routerTransition()]
})

export class RiesgosComponent implements OnInit {
    // Variables
    riesgos: any[] = [];
  
    mainPage = 1;
    mainPageSize = 10;
    totalLength = 0;

    constructor(
      private modalService: NgbModal,
      private proyectoService: ProyectoService,
      private servRiesgos: servRiesgos,
      private servicios: servicios,
      private servApredizaje: servAprendizaje
    ) {}
    
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
      this.getRiesgos();
      this.initRiesgosModel();
      this.riesgosSelected = null;

    }
    // ======= ======= ======= ======= =======
    headerDataNro01: any = 0;
    headerDataNro02: any = 0;
    headerDataNro03: any = 0;
    headerDataNro04: any = 0;
    // ======= ======= ======= ======= =======

    // ======= ======= NGMODEL VARIABLES SECTION ======= =======
    modalTitle: any = "";
    modalAction: any = '';

    id_riesgo: any = "";
    id_proyecto: any = "";
    id_proy_elemen_padre: any = "";
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
    idp_medidas: any = "";
    medidas: any = "";
    idp_efectividad: any = "";
    comentarios: any = "";
    fecha_hora_reg: any = "";
    id_persona_reg: any = "";

    fecha_registro: any = "";
    persona_registro: any = "";

    sigla: any = "";
    color: any = "";
    // ======= ======= LLAMADOS A SELECCIONADORES ======= =======
    componentes: any[] = [];
    riesgoCategoria: any[] = [];
    riegosIdentificacion: any[] = [];
    riesgoImpacto: any[] = [];
    riesgoProbabilidad: any[] = [];
    riesgoNivel: any[] = [];
    riegosOcurrencia: any[] = [];
    riesgoAcciones: any[] = [];
    riesgoMedidas: any[] = [];
      //LLAMADO PARA TABLA
      riesgoTomarMedidas: any[] = [];
      riesgoEfectividad: any[] = [];

    // ======= ======= ======= ======= =======
    // ======= ======= VALDIATE FUNCTIONS SECTION ======= =======
    valComponente: any = true;
    ValidateComponente(){
      this.valComponente = true;
      if(!this.id_proy_elemen_padre){
        this.valComponente = false;
      }
    }
    valCategoria: any = true;
    ValidateCategoria(){
      this.valCategoria = true;
      if(!this.idp_categoria){
        this.valCategoria = false;
      }
    }
    valFecha: any = true;
    ValidateFecha(){
      this.valFecha = true;
      if(!this.fecha){
        this.valFecha = false;
      }
    }
    valRiesgo: any = true;
    ValidateRiesgo(){
      this.valRiesgo = true;
      if((!this.riesgo)||(this.riesgo.length >= 100)){
        this.valRiesgo = false;
      }
    }
    valDescripcion: any = true;
    ValidateDescripcion(){
      this.valDescripcion = true;
      if((!this.descripcion)||(this.descripcion.length >= 500)){
        this.valDescripcion = false;
      }
    }
    valVinculados: any = true;
    ValidateVinculados(){
      this.valVinculados = true;
      if((!this.vinculados)||(this.vinculados.length >= 100)){
        this.valVinculados = false;
      }
    }
    valIdentificacion: any = true;
    ValidateIdentificacion(){
      this.valIdentificacion = true;
      if(!this.idp_identificacion){
        this.valIdentificacion = false;
      }
    }
    /*valImpacto: any = true;
    ValidateImpacto(){
      this.valImpacto = true;
      if((!this.impacto)||(this.impacto.length >= 1)){
        this.valImpacto = false;
        console.log(this.impacto);
      }
    }
    valProbabilidad: any = true;
    ValidateProbabilidad(){
      this.valProbabilidad = true;
      if((!this.probabilidad)||(this.probabilidad.length >= 1)){
        this.valProbabilidad = false;
        console.log(this.probabilidad);
      }
    }
    valNivel: any = true;
    ValidateNivel(){
      this.valNivel = true;
      if((!this.nivel)||(this.nivel.length >= 1)){
        this.valNivel = false;
        console.log(this.nivel);
      }
    }*/
    valOcurrencia: any = true;
    ValidateOcurrencia(){
      this.valOcurrencia = true;
      if(!this.idp_ocurrencia){
        this.valOcurrencia = false;
      }
    }
    valMedidas: any = true;
    ValidateMedidas(){
      this.valMedidas = true;
      if(!this.idp_medidas){
        this.valMedidas = false;
      }
    }
    valMedida: any = true;
    ValidateMedida(){
      this.valMedida = true;
      if((!this.medidas)||(this.comentarios.length >= 500)){
        this.valMedida = false;
      }
    }
    valEfectividad: any = true;
    ValidateEfectividad(){
      this.valEfectividad = true;
      if(!this.idp_efectividad){
        this.valEfectividad = false;
      }
    }
    valComentarios: any = true;
    ValidateComentarios(){
      this.valComentarios = true;
      if((!this.comentarios)||(this.comentarios.length >= 500)){
        this.valComentarios = false;
      }
    }

  // ======= ======= INIT VIEW FUN ======= =======
   ngOnInit(): void {
    this.getParametricas();
    this.getRiesgos();
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
    // ======= GET COMPONENTES =======
      this.servApredizaje.getMetoElementos(this.idProyecto).subscribe(
          (data) => {
            this.componentes = data[0].dato;
          },
          (error) => {
            console.error(error);
          }
        );

    // ======= GET CATEGORÍAS =======  
      this.servicios.getParametricaByIdTipo(14).subscribe(
        (data) => {
          this.riesgoCategoria = data[0].dato;
        },
        (error) => {
          console.error(error);
        }
      );
  
    // ======= GET Identificación del Riesgo =======
      this.servicios.getParametricaByIdTipo(15).subscribe(
        (data) => {
          this. riegosIdentificacion = data[0].dato;
        },
        (error) => {
          console.error(error);
        }
      );
    
    // ======= GET Ocurrencia durante la Gestión =======
      this.servicios.getParametricaByIdTipo(16).subscribe(
        (data) => {
          this. riegosOcurrencia = data[0].dato;
        },
        (error) => {
          console.error(error);
        }
      );
    // ======= GET Necesidad de Tomar Acciones =======
      this.servicios.getParametricaByIdTipo(19).subscribe(
        (data) => {
          this. riesgoAcciones = data[0].dato;
        },
        (error) => {
          console.error(error);
        }
      );
    // ======= GET Efectividad de las Medidas =======
      this.servicios.getParametricaByIdTipo(17).subscribe(
        (data) => {
          this. riesgoMedidas = data[0].dato;
        },
        (error) => {
          console.error(error);
        }
      );

    //Llamado para tabla
    // ======= GET Tomar Medidas =======
      this.servicios.getParametricaByIdTipo(19).subscribe(
        (data) => {
          this.riesgoTomarMedidas = data[0].dato;
        },
        (error) => {
          console.error(error);
        }
      );
      // ======= GET EECTIVIDAD =======
      this.servicios.getParametricaByIdTipo(17).subscribe(
        (data) => {
          this.riesgoEfectividad = data[0].dato;
        },
        (error) => {
          console.error(error);
        }
      );
  }

  // ======= ======= OPEN MODALS FUN ======= =======
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
  // ======= ======= GET MODAL TITLE FUN ======= =======
  getModalTitle(modalAction: any) {
      this.modalTitle = (modalAction == "add") ? ("Añadir Riesgo") : this.modalTitle;
      this.modalTitle = (modalAction == "edit") ? ("Editar Riesgo") : this.modalTitle;
      return this.modalTitle;
  }
  // ======= ======= RIESGOS TABLE PAGINATION ======= =======
  get riesgosTable() {
    const start = (this.mainPage - 1) * this.mainPageSize;
      return this.riesgos.slice(start, start + this.mainPageSize);
  }
  // ======= ======= ======= ======= =======
  riesgosSelected: any = null;
  // ======= ======= CHECKBOX CHANGED ======= =======
  checkboxChanged(riesgoSel: any) {
    this.riesgos.forEach(riesgo => {
        if(riesgoSel.id_riesgo == riesgo.id_riesgo) {
            if(riesgoSel.selected) {
                this.riesgosSelected = riesgoSel;
            } 
            else {
                this.riesgosSelected = null;
            }
        } 
        else {
            riesgo.selected = false;
        }
    });
  }
  
  // ======= ======= ON SELECTION CHANGE Color  Componente======= =======
  onSelectionChange(){
    const selectedComponente = this.componentes.find(comp => comp.id_meto_elemento == this.id_proy_elemen_padre);
    if (selectedComponente) {
        this.color = selectedComponente.color;
        this.sigla = selectedComponente.sigla;
    }
    this.ValidateComponente();
  }

 // ======= ======= INIT RIESGO MODEL ======= =======
    initRiesgosModel() {
      this.modalTitle = "";

      this.id_riesgo = 0;
      this.id_proyecto = "";
      this.id_proy_elemen_padre = "";
      this.idp_categoria = "";
      this.codigo = null;
      this.fecha = null;
      this.riesgo = null;
      this.descripcion = null;
      this.vinculados = null;
      this.idp_identificacion = "";
      this.impacto = null;
      this.probabilidad = null;
      this.nivel = null;
      this.idp_ocurrencia = "";
      this.idp_medidas = "";
      this.medidas = null;
      this.idp_efectividad = "";
      this.comentarios = null;
      this.persona_registro = this.namePersonaReg;
      this.fecha_registro = "";

      this.sigla = null;
      this.color = null;

    }

    // ======= ======= GET RIESGOS ======= =======
    getRiesgos(){
      this.servRiesgos.getRiesgosByIdProy(this.idProyecto).subscribe(
        (data) => {
          this.riesgos = (data[0].dato)?(data[0].dato):([]);
          this.totalLength = this.riesgos.length;
          this.countHeaderData();
        },
        (error) => {
          console.error(error);
        }
      );
    }
    // ======= ======= ======= ======= =======

   // ======= ======= INIT ADD RIESGO ======= =======
    initAddRiesgo(modalScope: TemplateRef<any>) {
      this.initRiesgosModel();

      this.fecha_registro = this.getCurrentDateTime();

      this.modalAction = "add"; 
      this.modalTitle = this.getModalTitle("add");
    
      this.openModal(modalScope); 
    }

    // ======= ======= ADD RIESGOS ======= =======
    addRiesgos(){      
      const objRiesgo = {
        p_id_proy_aprende: 0,
        p_id_proyecto: this.idProyecto,
        p_id_proy_elemen_padre:this.id_proy_elemen_padre,
        p_idp_categoria: this.idp_categoria,
        p_codigo: this.codigo,
        p_fecha: this.fecha,
        p_riesgo: this.riesgo,
        p_descripcion: this.descripcion,
        p_vinculados: this.vinculados,
        p_idp_identificacion: this.idp_identificacion,
        p_impacto: this.impacto,
        p_probabilidad: this.probabilidad,
        p_nivel: this.nivel,
        p_idp_ocurrencia: this.idp_ocurrencia,
        p_idp_medidas: this.idp_medidas,
        p_medidas: this.medidas,
        p_idp_efectividad: this.idp_efectividad,
        p_comentarios: this.comentarios,
        p_fecha_hora_reg: null,
        p_id_persona_reg: parseInt(this.idPersonaReg,10)       
      };

      this.servRiesgos.addRiesgo(objRiesgo).subscribe(
        (data) => {
          this.getRiesgos();
        },
        (error) => {
          console.error(error);
        }
      );
    }
  
  // ======= ======= INIT EDIT RIESGO ======= =======
  initEditRiesgo(modalScope: TemplateRef<any>) {
    this.initRiesgosModel(); 
    this.modalAction = "edit";
    this.modalTitle = this.getModalTitle("edit");
  
    this.id_riesgo = this.riesgosSelected.id_riesgo;
    this.id_proyecto = this.riesgosSelected.id_proyecto;
    this.id_proy_elemen_padre = this.riesgosSelected.id_proy_elemen_padre;
    this.idp_categoria = this.riesgosSelected.idp_categoria;
    this.codigo = this.riesgosSelected.codigo;
    this.fecha = this.riesgosSelected.fecha;
    this.riesgo = this.riesgosSelected.riesgo;
    this.descripcion = this.riesgosSelected.descripcion;
    this.vinculados = this.riesgosSelected.vinculados;
    this.idp_identificacion = this.riesgosSelected.idp_identificacion;
    this.impacto = this.riesgosSelected.impacto;
    this.probabilidad = this.riesgosSelected.probabilidad;
    this.nivel = this.riesgosSelected.nivel;
    this.idp_ocurrencia = this.riesgosSelected.idp_ocurrencia;
    this.idp_medidas = this.riesgosSelected.idp_medidas;
    this.medidas = this.riesgosSelected.medidas;
    this.idp_efectividad = this.riesgosSelected.idp_efectividad;
    this.comentarios = this.riesgosSelected.comentarios;
    this.fecha_registro = this.riesgosSelected.fecha_hora_reg;
    this.id_persona_reg = this.riesgosSelected.id_persona_reg;
   
    this.sigla = this.riesgosSelected.sigla;
    this.color = this.riesgosSelected.color;
  
    this.openModal(modalScope); 
  }
  // ======= ======= EDIT RIESGO ======= =======
  editRiesgos(){
    const objRiesgo = {
      p_id_riesgo: this.id_riesgo,
      p_id_proyecto: this.id_proyecto,
      p_id_proy_elemen_padre: this.id_proy_elemen_padre,
      p_idp_categoria: this.idp_categoria,
      p_codigo: this.codigo,
      p_fecha: this.fecha,
      p_riesgo: this.riesgo,
      p_descripcion: this.descripcion,
      p_vinculados: this.vinculados,
      p_idp_identificacion: this.idp_identificacion,
      p_impacto: this.impacto,
      p_probabilidad: this.probabilidad,
      p_nivel: this.nivel,
      p_idp_ocurrencia: this.idp_ocurrencia,
      p_idp_medidas: this.idp_medidas,
      p_medidas: this.medidas,
      p_idp_efectividad: this.idp_efectividad,
      p_comentarios: this.comentarios,
      p_fecha_hora_reg: this.getCurrentDateTime(),
      p_id_persona_reg: this.id_persona_reg         
    }

    this.servRiesgos.editRiesgo(objRiesgo).subscribe(
      (data) => {
        this.getRiesgos();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  // ======= ======= INIT DELETE RIESGO ======= =======
  initDeleteRiesgo(modalScope: TemplateRef<any>) {
    this.initRiesgosModel();

    this.id_riesgo = this.riesgosSelected.id_riesgo;

    this.openModal(modalScope);
  }
  // ======= ======= DELETE RIESGO ======= =======
  deleteRiesgos(){
    this.servRiesgos.deleteRiesgo(this.riesgosSelected.id_riesgo).subscribe(
      (data) => {
        this.closeModal();
        this.getRiesgos();
      },
      (error) => {
        console.error(error);
      }
    );
  }

      mapNivel(value: any): string {
        switch (value) {
          case '1':
            return 'Bajo';
          case '2':
            return 'Medio';
          case '3':
            return 'Alto';
          default:
            return 'Desconocido';
        }
      }
      calcularNivelRiesgo() {
        if (this.impacto && this.probabilidad) {
            const impactoNum = parseInt(this.impacto);
            const probabilidadNum = parseInt(this.probabilidad);
            // Matriz de riesgo
            const matrizRiesgo = [
                ['1', '1', '1'], // Impacto bajo (1)
                ['1', '2', '2'], // Impacto medio (2)
                ['1', '2', '3']  // Impacto alto (3)
            ];
            // Obtener nivel de riesgo según matriz
            this.nivel = matrizRiesgo[impactoNum - 1][probabilidadNum - 1];
        }
    }

 
  // ======= ======= COUNT HEADER DATA FUNCTION ======= =======
  countHeaderData(): void {
    this.headerDataNro01 = 0;
    this.headerDataNro02 = 0;
    this.headerDataNro03 = 0;
    this.headerDataNro04 = 0;

    this.riesgos.forEach((riesgo) => {
        const nivel = Number(riesgo.nivel); 
        if (nivel === 3) {
            this.headerDataNro01 += 1;
        } else if (nivel === 2) {
            this.headerDataNro02 += 1;
        } else if (nivel === 1) {
            this.headerDataNro03 += 1;
        } 
        if (riesgo.idp_medidas === 1) {
            this.headerDataNro04 += 1;
        }
    });

  }

    getRiesgosAlto(): number {
      return this.headerDataNro03;
    }

    getRiesgosMedio(): number {
      return this.headerDataNro02;
    }

    getRiesgosBajo(): number {
      return this.headerDataNro01;
    }

    getRiesgosMedidas(): number {
      return this.headerDataNro04;
    }

    onSubmit(): void{
      // ======= VALIDATION SECTION =======
      let valForm = false;

      this.ValidateComponente();
      this.ValidateCategoria();
      this.ValidateFecha();
      this.ValidateRiesgo();
      this.ValidateDescripcion();
      this.ValidateVinculados();
      this.ValidateIdentificacion();
      /*this.ValidateImpacto();
      this.ValidateProbabilidad();
      this.ValidateNivel();*/
      this.ValidateOcurrencia();
      this.ValidateMedidas();
      this.ValidateMedida();
      this.ValidateEfectividad();
      this.ValidateComentarios();

      valForm = 
        this.valComponente &&
        this.valCategoria &&
        this.valFecha &&
        this.valRiesgo &&
        this.valDescripcion &&
        this.valVinculados &&
        this.valIdentificacion &&
        /*this.valImpacto &&
        this.valProbabilidad &&
        this.valNivel &&*/
        this.valOcurrencia &&
        this.valMedidas &&
        this.valMedida &&
        this.valEfectividad &&
        this.valComentarios;

      // ======= ACTION SECTION =======
      if(valForm){
        if (this.modalAction === 'add') {
          this.addRiesgos();
        } else {
          this.editRiesgos();
        } 
        this.closeModal();
      }
    }

}