import { Component, OnInit, TemplateRef, ChangeDetectorRef, EventEmitter, Output} from '@angular/core';
import { routerTransition } from '../../router.animations';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ProyectoService } from '../../services/proyectoData.service';

import { servicios } from "../../servicios/servicios";
import { servRiesgos } from "../../servicios/riesgos";
import { ElementosService } from "../../servicios/elementos";
import { Notify,Report,Confirm } from 'notiflix';

@Component({
  selector: 'app-riesgos',
  templateUrl: './riesgos.component.html',
  styleUrls: ['./riesgos.component.scss'],
  animations: [routerTransition()]
})

export class RiesgosComponent implements OnInit {
    // ======= ======= NGMODEL VARIABLES GENERALES ======= =======
        riesgos: any[] = [];
      
        mainPage = 1;
        mainPageSize = 10;
        totalLength = 0;

      constructor(
        private modalService: NgbModal,
        private cdr: ChangeDetectorRef,
        private proyectoService: ProyectoService,
        private servicios: servicios,
        private servRiesgos: servRiesgos,
        private servElementos: ElementosService
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
        this.ngOnInit();
        //Riesgos
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
        //primera fila
        componentes: any[] = [];
        //segunda fila
        riesgoCategoria: any[] = [];
        //cuarta fila
        riegosIdentificacion: any[] = [];
        //quinta fila
        riesgoImpacto: any[] = [];
        riesgoProbabilidad: any[] = [];
        riesgoNivel: any[] = [];
        //sexta fila
        riegosOcurrencia: any[] = [];
        riesgoTomarAcciones: any[] = [];
        //octava fila
        riesgoEfectividadMedidas: any[] = [];
    // ======= ======= VALDIATE FUNCTIONS SECTION ======= =======
      /*primera fila
      valComponente: any = true;
      ValidateComponente(){
        this.valComponente = true;
        if(!this.id_proy_elemen_padre){
          this.valComponente = false;
        }
      }*/
      //segunda fila
      valCategoria: any = true;
      ValidateCategoria(){
        this.valCategoria = true;
        if(!this.idp_categoria){
          this.valCategoria = false;
        }
      }
      valRiesgo: any = true;
      ValidateRiesgo(){
        this.valRiesgo = true;
        if((!this.riesgo)||(this.riesgo.length >= 100)){
          this.valRiesgo = false;
        }
      }
      //tercera fila
      valDescripcion: any = true;
      ValidateDescripcion(){
        this.valDescripcion = true;
        if((!this.descripcion)||(this.descripcion.length >= 500)){
          this.valDescripcion = false;
        }
      }
      //cuarta fila
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
      //quinta fila
      valImpacto: any = true;
      ValidateImpacto(){
        this.valImpacto = true;
        if(!this.impacto){
          this.valImpacto = false;
        }
      }
      valProbabilidad: any = true;
      ValidateProbabilidad(){
        this.valProbabilidad = true;
        if(!this.probabilidad){
          this.valProbabilidad = false;
        }
      }
  // ======= ======= INIT VIEW FUN ======= =======
      ngOnInit(): void {
        this.getParametricas();
        this.getRiesgos();
        }
  // ======= ======= ======= ======= ======= ======= ======= ======= ======= ======= =======
      jsonToString(json: object): string {
        return JSON.stringify(json);
      }

      stringToJson(jsonString: string): object {
        return JSON.parse(jsonString);
      }
      // GET PARAMETRICAS
      getDescripcionSubtipo(idRegistro: any, paramList: any): string{
        const subtipo = paramList.find(elem => elem.id_subtipo == idRegistro);
        return subtipo ? subtipo.descripcion_subtipo : '';
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
  // ======= ======= ======= ======= ======= ======= ======= ======= ======= ======= =======
  // ======= ======= GET PARAMETRICAS ======= =======
      getParametricas(){
        //PRIMERA FILA
          // ======= GET COMPONENTES =======
              this.servElementos.getElementosMetoEleByIdProy(this.idProyecto).subscribe(
                (data) => {
                  this.componentes = data[0].dato;
                },
                (error) => {
                  console.error(error);
                }
              );
        //SEGUNDA FILA      
          // ======= GET CATEGORÍAS =======  
            this.servicios.getParametricaByIdTipo(14).subscribe(
              (data) => {
                this.riesgoCategoria = data[0].dato;
              },
              (error) => {
                console.error(error);
              }
            );
        //CUARTA FILA    
          // ======= GET Identificación del Riesgo =======
            this.servicios.getParametricaByIdTipo(15).subscribe(
              (data) => {
                this. riegosIdentificacion = data[0].dato;
              },
              (error) => {
                console.error(error);
              }
            );
        //SEXTA FILA
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
                this. riesgoTomarAcciones = data[0].dato;
              },
              (error) => {
                console.error(error);
              }
            );
        // OCTAVA FILA
          // ======= GET Efectividad de las Medidas =======
            this.servicios.getParametricaByIdTipo(17).subscribe(
              (data) => {
                this. riesgoEfectividadMedidas = data[0].dato;
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
  // ======= ======= ON SELECTION CHANGE Color  Componente ======= =======
      onSelectionChange(){
        const selectedComponente = this.componentes.find(comp => comp.id_proy_elemento == this.id_proy_elemen_padre);
        if (selectedComponente) {
            this.color = selectedComponente.color;
            this.sigla = selectedComponente.sigla;
        }
      }
 // ======= ======= INIT RIESGO MODEL ======= =======
      initRiesgosModel() {
        this.modalTitle = "";

        this.id_riesgo = 0;
        this.id_proyecto = "";
        this.id_proy_elemen_padre = null;
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
        this.idp_efectividad = null;
        this.comentarios = null;
        this.persona_registro = this.namePersonaReg;
        this.fecha_registro = "";

        this.sigla = "";
        this.color = "ffffff";

        this.valCategoria = true;
        this.valRiesgo = true;
        this.valDescripcion = true;
        this.valVinculados = true;
        this.valIdentificacion = true;
        this.valImpacto = true;
        this.valProbabilidad = true;  
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
            p_id_proy_elemen_padre:this.id_proy_elemen_padre || null,
            p_idp_categoria: this.idp_categoria,
            p_codigo: this.codigo || null,
            p_fecha: this.fecha || null,
            p_riesgo: this.riesgo,
            p_descripcion: this.descripcion,
            p_vinculados: this.vinculados,
            p_idp_identificacion: this.idp_identificacion,
            p_impacto: this.impacto,
            p_probabilidad: this.probabilidad,
            p_nivel: this.nivel,
            p_idp_ocurrencia: this.idp_ocurrencia || null,
            p_idp_medidas: this.idp_medidas || null,
            p_medidas: this.medidas || null,
            p_idp_efectividad: this.idp_efectividad || null,
            p_comentarios: this.comentarios || null,
            p_fecha_hora_reg: null,
            p_id_persona_reg: parseInt(this.idPersonaReg,10)       
          };
          this.servRiesgos.addRiesgo(objRiesgo).subscribe(
            (data) => {            
              alert('Riesgo agregado exitosamente');
              this.riesgosSelected = null;
              this.closeModal();
              this.getRiesgos();
            },
            (error) => {              
              console.error(error);
              alert('Error al guardar la riesgo');
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
          p_id_proy_elemen_padre: this.id_proy_elemen_padre || null,
          p_idp_categoria: this.idp_categoria,
          p_codigo: this.codigo || null,
          p_fecha: this.fecha || null,
          p_riesgo: this.riesgo,
          p_descripcion: this.descripcion,
          p_vinculados: this.vinculados,
          p_idp_identificacion: this.idp_identificacion,
          p_impacto: this.impacto,
          p_probabilidad: this.probabilidad,
          p_nivel: this.nivel,
          p_idp_ocurrencia: this.idp_ocurrencia || null,
          p_idp_medidas: this.idp_medidas || null,
          p_medidas: this.medidas || null,
          p_idp_efectividad: this.idp_efectividad || null,
          p_comentarios: this.comentarios || null,
          p_fecha_hora_reg: this.getCurrentDateTime(),
          p_id_persona_reg: this.id_persona_reg         
        }
        this.servRiesgos.editRiesgo(objRiesgo).subscribe(
          (data) => {  
            alert('Riesgo editado exitosamente');   
            this.riesgosSelected = null;
            this.closeModal();       
            this.getRiesgos();           
          },
          (error) => {            
            console.error(error);
            alert('Error al editar la riesgo');
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
        this.servRiesgos.deleteRiesgo(this.riesgosSelected.id_riesgo, this.idPersonaReg).subscribe(
          (data) => {           
            Notify.success('Riesgo eliminado exitosamente');
            this.riesgosSelected = null;
            this.closeModal();
            this.getRiesgos();
          },
          (error) => { 
            Notify.failure('Error al eliminar la riesgo');           
            console.error(error);
          }
        );
      }
  // ======= ======= Funcion de mapero para prbabilidad y Impacto ======= =======   
      mapProbabilidadImpacto(value: any): string {
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
  // ======= ======= Funcion de mapero para nivel de riesgo ======= =======    
      mapNivel(value: string): string {
        const numValue = parseInt(value, 10);

        if (numValue >= 6 && numValue <= 9) return 'Alto';
        if (numValue >= 3 && numValue <= 4) return 'Medio';
        if (numValue >= 1 && numValue <= 2) return 'Bajo';

        return 'Desconocido';
    }
    calcularNivelRiesgo() {
      if (this.impacto && this.probabilidad) {
          const impactoNum = parseInt(this.impacto, 10);
          const probabilidadNum = parseInt(this.probabilidad, 10);

          // Validación de valores esperados (1 a 3)
          if (impactoNum >= 1 && impactoNum <= 3 && probabilidadNum >= 1 && probabilidadNum <= 3) {
              // Multiplicación para obtener el nivel de riesgo
              this.nivel = (impactoNum * probabilidadNum).toString();
          } else {
              this.nivel = ''; // Si los valores no son válidos, se limpia el nivel
          }
      }
    }
  // ======= ======= COUNT HEADER DATA FUNCTION ======= =======
      countHeaderData(): void {
        // Reiniciar contadores
        this.headerDataNro01 = 0;
        this.headerDataNro02 = 0;
        this.headerDataNro03 = 0;
        this.headerDataNro04 = 0;
      
        this.riesgos.forEach((riesgo) => {
          // Usar la función mapNivel para determinar el nivel consistentemente
          const nivelRiesgo = this.mapNivel(riesgo.nivel);
      
          // Conteo de riesgos por nivel usando el mapeo de texto
          switch (nivelRiesgo) {
            case 'Alto':
              this.headerDataNro01 += 1;
              break;
            case 'Medio':
              this.headerDataNro02 += 1;
              break;
            case 'Bajo':
              this.headerDataNro03 += 1;
              break;
          }
      
          // Conteo de riesgos con medidas
          if (riesgo.idp_medidas === 1) {
            this.headerDataNro04 += 1;
          }
        });
      }
      getRiesgosBajo(): number {
        return this.headerDataNro01;
      }
      getRiesgosMedio(): number {
        return this.headerDataNro02;
      }
      getRiesgosAlto(): number {
        return this.headerDataNro03;
      }
      getRiesgosMedidas(): number {
        return this.headerDataNro04;
      }

    onSubmit(): void{
      // ======= VALIDATION SECTION =======
      let valForm = false;

      this.ValidateCategoria();
      this.ValidateRiesgo();
      this.ValidateDescripcion();
      this.ValidateVinculados();
      this.ValidateIdentificacion();
      this.ValidateImpacto();
      this.ValidateProbabilidad();

      valForm = 
        this.valCategoria &&
        this.valRiesgo &&
        this.valDescripcion &&
        this.valVinculados &&
        this.valIdentificacion &&
        this.valImpacto &&
        this.valProbabilidad;

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