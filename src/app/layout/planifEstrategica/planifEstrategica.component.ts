// Importacion de modulos y componentes Principales
import { Component, OnInit, TemplateRef, ChangeDetectorRef} from '@angular/core';
import { routerTransition } from '../../router.animations';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

// Importacion de servicios 

import { PlanifEstrategicaService } from '../../servicios/planifEstrategica';
import { servicios } from "../../servicios/servicios";
import { servAprendizaje } from "../../servicios/aprendizajes";
import { servIndicador } from '../../servicios/indicador';
import {servInstCategorias} from '../../servicios/instCategoria';
import { servIndicadorAvance } from '../../servicios/indicadorAvance';


// Estructura del Decorador del Componente 
@Component({
  selector: 'app-planifEstrategica',
  templateUrl: './planifEstrategica.component.html',
  styleUrls: ['./planifEstrategica.component.scss'],
  animations: [routerTransition()]
})

export class PlanifEstrategicaComponent implements OnInit {
    // Variables de datos principales
    planifEstrategica: any[] = [];
    // Variables de paginación
    mainPage = 1;
    mainPageSize = 10;
    totalLength = 0;
    constructor(
      private modalService: NgbModal,
      private cdr: ChangeDetectorRef,
      private ServPlanifEstrategica: PlanifEstrategicaService,
      private servicios: servicios,
      private servInstCategorias: servInstCategorias,
      private servApredizaje: servAprendizaje,
      private servIndicador: servIndicador,
      private servIndicadorAvance: servIndicadorAvance
      
    ) {}

        // ======= ======= HEADER SECTION ======= =======
        idProyecto: any = parseInt(localStorage.getItem('currentIdProy'));
        idPersonaReg: any = parseInt(localStorage.getItem('currentIdPer'));
        namePersonaReg: any = localStorage.getItem('userFullName');
        onChildSelectionChange(selectedId: string) {
          this.idProyecto = selectedId;
          localStorage.setItem('currentIdProy', (this.idProyecto).toString());
    
          this.getParametricas();
          this.getPlanifEstrategica();
          this.initPlanifEstrategicaModel();
          this.planifEstrategicaSelected = null
        }

        headerDataNro01: any = 0;
        headerDataNro02: any = 0;
        headerDataNro03: any = 0;
        headerDataNro04: any = 0;
        // ======= ======= ======= ======= =======

        // ======= ======= NGMODEL VARIABLES SECTION ======= =======
        modalAction: any = "";
        modalTitle: any = '';

          //Variables PROY_ELEMENTO "Planificación Estratégica"
          id_proy_elemento: any = "";
          elemento: any = "";
          nivel: any = "";
          idp_estado: any = "";
          peso: any = "";

          // Variables PROY_INDICADOR 
          id_proy_indicador: any = "";
          id_proyecto: any = "";
          id_proy_elem_padre: any = "";
          codigo: any = "";
          indicador: any = "";
          descripcion: any = "";
          comentario: any = "";
          orden: any = "";
          linea_base: any = "";
          medida: any = "";
          meta_final: any = "";
          medio_verifica: any = "";
          id_estado: any = "";
          inst_categoria_1: any = "";
          inst_categoria_2: any = "";
          inst_categoria_3: any = "";

          sigla: any = "";
          color: any = "";
          // Variables de Selección
          componentes: any[] = [];
          planifCategoria: any[] = [];
          planifSubCategoria: any[] = [];
          planifTipoCategoria: any[] = [];
          planifIDindAvance: any[] = [];
          planifPeriodofecha: any[] = [];
          planifMetaEsperada: any[] = [];

            //LLAMADO PARA TABLA
            planifEstrategicaTipo: any[] = [];
    


    // ======= ======= ======= ======= ======= ======= =======
    // ======= ======= VALDIATE FUNCTIONS SECTION ======= =======
    valComponente: any = false;  // Inicializar como false, ya que debe ser verdadero solo cuando la validación pase

    ValidateComponente() {
      if (this.id_proy_elem_padre) {
        this.valComponente = true;  
      } else {
        this.valComponente = false;  
      }
      console.log('Componente válido:', this.valComponente);  
    }
    /*valCodigo: any = true;
    ValidateCodigo() {
      this.valCodigo = true;
      if (!this.codigo || this.codigo.length > 10) {
        this.valCodigo = false;
      }
    }*/
        valCategoria: any = true;
        ValidateCategoria(){
          this.valCategoria = true;
          if(!this.inst_categoria_1){
            this.valCategoria = false;
          }
        }
        valSubCategoria: any = true;
        ValidateSubCategoria(){
          this.valSubCategoria = true;
          if(!this.inst_categoria_2){
            this.valCategoria = false;
          }
        }
        valTipoCategoria: any = true;
        ValidateTipoCategoria(){
          this.valTipoCategoria = true;
          if(!this.inst_categoria_3){
            this.valCategoria = false;
          }
        }

        valIndicador: any = true;
        ValidateIndicador() {
          this.valIndicador = true;
          if (!this.indicador || this.indicador.length > 100) {
            console.log("Indicador inválido");
            this.valIndicador = false;
          }
        }

        valDescripcion: any = true;
        ValidateDescripcion() {
          this.valDescripcion = true;
          if (!this.descripcion || this.descripcion.length > 255) {
            console.log("Descripción inválida");
            this.valDescripcion = false;
          }
        }

        valComentario: any = true;
        ValidateComentario() {
          this.valComentario = true;
          if (!this.comentario || this.comentario.length > 255) {
            console.log("Comentario inválido");
            this.valComentario = false;
          }
        }

        valOrden: any = true;
        ValidateOrden(){
          this.valOrden = true;
          if(!this.orden){
            this.valOrden = false;
          }
        }
        valLineaBase: any = true;
        ValidateLineaBase(){
          this.valLineaBase = true;
          if(!this.linea_base){
            this.valLineaBase = false;
          }
        }
        valMedida: any = true;
        ValidateMedida(){
          this.valMedida = true;
          if((!this.medida)||(this.medida.length >= 20)){
            this.valMedida = false;
          }
        }
        valMetaFinal: any = true;
        ValidateMetaFinal(){
          this.valMetaFinal = true;
          if(!this.meta_final){
            this.valMetaFinal = false;
          }
        }
        valMedioVerifica: any = true;
        ValidateMedioVerifica(){
          this.valMedioVerifica = true;
          if((!this.medio_verifica)||(this.medio_verifica.length >= 255)){
            this.valMedioVerifica = false;
          }
        }
        valEstado: any = true;
        ValidateEstado(){
          this.valEstado = true;
          if(!this.id_estado){
            this.valEstado = false;
          }
        }
       
    // ======= ======= INIT VIEW FUN ======= =======
        ngOnInit(): void {
          this.getParametricas(); // Obtiene datos de las paramétricas
          this.getPlanifEstrategica(); // Obtiene datos del servicio
          this.cargarIndicadoresAvance();
        }
    // ======= ======= ======= ======= =======  ======= ======= =======  =======
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
    // ======= ======= ======= ======= ======= ======= =======  ======= =======

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

          this.servInstCategorias.getCategoriaById(1).subscribe(
            (data: any) => {
              this.planifCategoria = data[0]?.dato || []; 
            },
            (error) => {
              console.error("Error al cargar categorías:", error);
            }
          );

          this.servInstCategorias.getCategoriaById(2).subscribe(
            (data: any) => {
              this.planifSubCategoria = data[0]?.dato || []; 
            },
            (error) => {
              console.error("Error al cargar categorías:", error);
            }
          );

          this.servInstCategorias.getCategoriaById(3).subscribe(
            (data: any) => {
              this.planifTipoCategoria = data[0]?.dato || []; 
            },
            (error) => {
              console.error("Error al cargar categorías:", error);
            }
          );

        } 

        cargarIndicadoresAvance() {
          this.servIndicadorAvance.getIndicadoresAvance().subscribe(
            (response: any) => {
              const datos = response[0]?.dato || [];
        
              // Extraer los valores necesarios
              this.planifIDindAvance = datos.map((item: any) => item.id_proy_indica_avance);
              this.planifPeriodofecha = datos.map((item: any) => item.fecha_reportar);
              this.planifMetaEsperada = datos.map((item: any) => item.valor_esperado);
            },
            (error) => {
              console.error("Error al cargar los datos:", error);
            }
          );
        }
    // ======= ======= ======= ======= ======= ======= =======  ======= =======        
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
    // ======= ======= ======= ======= ======= ======= =======  ======= =======
    // ======= ======= GET MODAL TITLE FUN ======= =======
      getModalTitle(modalAction: any) {
        this.modalTitle = (modalAction == "add") ? ("Añadir Planificación Estratégica") : (this.modalTitle);
        this.modalTitle = (modalAction == "edit") ? ("Editar Planificación Estratégica") : (this.modalTitle);
        return this.modalTitle;
      }
    // ======= ======= ======= ======= ======= ======= =======  ======= =======
      get planifEstrategicaTable() {
        const start = (this.mainPage - 1) * this.mainPageSize;
        return this.planifEstrategica.slice(start, start + this.mainPageSize);
      }
    // ======= ======= ======= ======= ======= ======= =======  ======= =======
    planifEstrategicaSelected: any = null;
    
    // ======= ======= CHECKBOX CHANGED ======= =======
    checkboxChanged(planifEstrategicaSel: any) {
      // Recorre todos los elementos y actualiza el estado de selección
      this.planifEstrategica.forEach(planifEstrategica => {
        if (planifEstrategicaSel.id_proy_indicador === planifEstrategica.id_proy_indicador) {
          // Si el checkbox está marcado, seleccionamos el elemento
          if (planifEstrategicaSel.selected) {
            this.planifEstrategicaSelected = planifEstrategicaSel;
          } else {
            this.planifEstrategicaSelected = null;
          }
        } else {
          // Si no es el elemento seleccionado, desmarcamos su checkbox
          planifEstrategica.selected = false;
        }
      });
    }
    // ======= ======= ======= ======= ======= ======= =======  ======= =======
      onSelectionChange() {
        const selectedComponente = this.componentes.find(comp => comp.id_meto_elemento == this.id_proy_elem_padre);
        if (selectedComponente) {
            this.color = selectedComponente.color;
            this.sigla = selectedComponente.sigla;
        }
        this.ValidateComponente();
      }
    // ======= ======= ======= ======= ======= ======= =======  ======= =======
      // Tipo botones de la tabla de planifEstrategica
    elementosMap = {
      1: { sigla: 'OG', color: '#D45B49' }, // Objetivo General
      2: { sigla: 'OE', color: '#F58634' }, // Objetivo Específico
      3: { sigla: 'RE', color: '#F7B529' }, // Resultado Estratégico
      4: { sigla: 'IN', color: '#FBD468' }  // Indicador
    };
    
    // Método para obtener la sigla
    getSigla(id_proy_elem_padre: number): string {
      return this.elementosMap[id_proy_elem_padre]?.sigla || '';
    }
    
    // Método para obtener el color
    getColor(id_proy_elem_padre: number): string {
      const color = this.elementosMap[id_proy_elem_padre]?.color;
      return color ? color : '#000000'; 
    }
    
    // Método para calcular el margen dinámico (espaciado)
    getMargin(id_proy_elem_padre: number): string {
      switch (id_proy_elem_padre) {
        case 1: return '0';      // Sin margen adicional
        case 2: return '10px';   // Espaciado medio
        case 3: return '20px';   // Espaciado más amplio
        case 4: return '30px';   // Espaciado al final
        default: return '0';     // Por defecto, sin margen
      }
    }
    
    getElementoNombre(id_proy_elem_padre: number): string {
      const elemento = this.componentes.find(comp => comp.id_meto_elemento === id_proy_elem_padre);
      return elemento ? elemento.meto_elemento : '';
    }

   // ======= ======= ======= ======= ======= ======= =======  ======= ======= 
    // ======= ======= JERARQUIA DE PADRE ======= =======
    validParents: any[] = [];
    tipo: string = '';


    // Filtrar padres válidos en función del tipo del elemento a crear
      getValidParents(tipo: string): any[] {
        console.log('Tipo recibido en getValidParents:', tipo);
        console.log('Datos de planifEstrategica:', this.planifEstrategica);
        switch (tipo) {
          case 'OG': // Objetivo General no tiene padres válidos (es la raíz)
            return [];

          case 'OE': // Objetivo Específico solo puede tener como padre un OG
            return this.planifEstrategica.filter(el => el.id_proy_elem_padre === 1);

          case 'RE': // Resultado Estratégico puede tener como padre un OG o un OE
            return this.planifEstrategica.filter(el => el.id_proy_elem_padre === 1 || el.id_proy_elem_padre === 2);

          case 'IN': // Indicador puede tener como padre un OG, OE o RE
            return this.planifEstrategica.filter(el => 
              el.id_proy_elem_padre === 1 || 
              el.id_proy_elem_padre === 2 || 
              el.id_proy_elem_padre === 3
            );

          default:
            return [];
        }
      }

      // Validar si un padre seleccionado es válido para el tipo actual
      validarPadre(tipo: string, parentCodigo: string): boolean {
        const validParents = this.getValidParents(tipo);
        return validParents.some(parent => parent.codigo === parentCodigo);
      }

      // Método para manejar cambios en el tipo y filtrar padres válidos
      onParentChange(): void {
        console.log('Tipo actual:', this.tipo);
        if (!this.tipo) {
          console.error("No se ha definido un tipo para validar el padre.");
          return;
        }

        // Actualizar lista de padres válidos
        this.validParents = this.getValidParents(this.tipo);
        console.log('Padres válidos actualizados:', this.validParents);
        
      }
    // ======= ======= ======= ======= ======= ======= =======  ======= =======
    // ======= ======= GENERAR CÓDIGO ======= ======= 
    // Método para obtener el último código de "OG" y generar el siguiente código.
      generateCodigoOG(): string {
        // Obtener los elementos con id_proy_elem_padre === 1 (OG).
        const ogElements = this.planifEstrategica.filter(el => el.id_proy_elem_padre === 1);

        // Buscar el código más alto de los OG.
        const lastOG = ogElements.reduce((max, el) => {
          const currentCode = el.codigo.split('.').map(Number);
          if (currentCode[0] > max[0]) {
            return currentCode;
          }
          return max;
        }, [0, 0, 0, 0]); // [1, 0, 0, 0] es el valor predeterminado

        // Incrementar el primer dígito del código.
        lastOG[0]++;

        // Formatear el nuevo código en el formato "X.0.0.0".
        return `${lastOG[0]}.0.0.0`;
      }


    // ======= ======= MOVER ELEMENTO ======= =======
    moverElemento(elemento: any, direccion: string): void {
      
    }
    
    
    
    // ======= ======= ======= ======= ======= ======= =======  ======= =======      
        

    // ======= ======= INIT PLANIFICACION ESTRATEGICA NGMODEL ======= =======
      initPlanifEstrategicaModel() {
        this.modalTitle = "";

        this.id_proy_indicador = 0;
        this.id_proyecto = "";
        this.id_proy_elem_padre = "";
        this.codigo = "";
        this.indicador = "";
        this.descripcion = "";
        this.comentario = "";
        this.orden = "";
        this.linea_base = "";
        this.medida = "";
        this.meta_final = "";
        this.medio_verifica = "";
        this.id_estado = "";
        this.inst_categoria_1 = "";
        this.inst_categoria_2 = "";
        this.inst_categoria_3 = "";

        this.sigla = null;
        this.color = null;

        this.valComponente = true;
        this.valCategoria = true;
        this.valSubCategoria = true;
        this.valTipoCategoria = true;

      
      }
  // ======= ======= ======= ======= ======= ======= =======  ======= =======
    // ======= ======= GET INDICADORES ======= =======
      getPlanifEstrategica() {
        this.servIndicador.getIndicadorByIdProy(this.idProyecto).subscribe(
          (data: any) => {
            this.planifEstrategica = (data[0].dato)?(data[0].dato):([]);
            this.totalLength = this.planifEstrategica.length;
            this.countHeaderData();
          },
          (error) => {
            console.error(error);
          }
        );
      }
  // ======= ======= ======= ======= ======= ======= =======  ======= =======
    initAddPlanifEstrategica(modalScope: TemplateRef<any>, id_proy_elem_padre?: number): void{
      this.initPlanifEstrategicaModel();

      this.modalAction = "add";
      this.modalTitle = this.getModalTitle("add");

      console.log('Iniciando proceso de añadir...');

      // Si se pasa un ID, establece el elemento automáticamente
      if (id_proy_elem_padre) {
        this.id_proy_elem_padre = id_proy_elem_padre;
        this.color = this.getColor(id_proy_elem_padre);
        this.sigla = this.getSigla(id_proy_elem_padre);
        this.tipo = this.getSigla(id_proy_elem_padre); // Obtener sigla del tipo
        this.validParents = this.getValidParents(this.tipo);
    
        // Si el tipo es OG, generar el código automáticamente
        if (this.tipo === 'OG') {
          this.codigo = this.generateCodigoOG(); // Generar el código para OG
        }
      }

      this.openModal(modalScope);
    }
  // ======= ======= ======= ======= ======= ======= =======  ======= =======
  addIndicador() {
    const objIndicador = {
      p_id_proy_indicador: 0,
      p_id_proyecto: parseInt(this.idProyecto, 10),
      p_id_proy_elem_padre: this.id_proy_elem_padre,
      p_codigo: this.codigo,
      p_indicador: this.indicador,
      p_descripcion: this.descripcion,
      p_comentario: this.comentario,
      p_orden: this.orden,
      p_linea_base: this.linea_base,
      p_medida: this.medida,
      p_meta_final: this.meta_final,
      p_medio_verifica: this.medio_verifica,
      p_id_estado: this.id_estado,
      p_inst_categoria_1: this.inst_categoria_1,
      p_inst_categoria_2: this.inst_categoria_2,
      p_inst_categoria_3: this.inst_categoria_3
    };
  
    console.log('Objeto enviado a la API:', objIndicador); // Verifica los valores
  
    this.servIndicador.addIndicador(objIndicador).subscribe(
      (data) => {
        console.log('Elemento añadido con éxito', data);
        this.getPlanifEstrategica();
      },
      (error) => {
        console.error('Error al guardar los datos:', error);
      }
    );
  }
  
  // ======= ======= ======= ======= ======= ======= =======  ======= =======
    initEditPlanifEstrategica(planifEstrategicaOGOERE: TemplateRef<any>, planifEstrategicaIN: TemplateRef<any>){
      if (!this.planifEstrategicaSelected) {
        console.error("No hay un elemento seleccionado para editar.");
        return;
      }
      this.initPlanifEstrategicaModel ();

      this.modalAction = "edit";
      this.modalTitle = this.getModalTitle("edit");

      this.id_proy_indicador = this.planifEstrategicaSelected.id_proy_indicador;
      this.id_proyecto = this.planifEstrategicaSelected.id_proyecto;
      this.id_proy_elem_padre = this.planifEstrategicaSelected.id_proy_elem_padre;
      this.codigo = this.planifEstrategicaSelected.codigo;
      this.indicador = this.planifEstrategicaSelected.indicador;
      this.descripcion = this.planifEstrategicaSelected.descripcion;
      this.comentario = this.planifEstrategicaSelected.comentario;
      this.orden = this.planifEstrategicaSelected.orden;
      this.linea_base = this.planifEstrategicaSelected.linea_base;
      this.medida = this.planifEstrategicaSelected.medida;
      this.meta_final = this.planifEstrategicaSelected.meta_final;
      this.medio_verifica = this.planifEstrategicaSelected.medio_verifica;
      this.id_estado = this.planifEstrategicaSelected.id_estado;
      this.inst_categoria_1 = this.planifEstrategicaSelected.inst_categoria_1;
      this.inst_categoria_2 = this.planifEstrategicaSelected.inst_categoria_2;
      this.inst_categoria_3 = this.planifEstrategicaSelected.inst_categoria_3;

      this.sigla = this.planifEstrategicaSelected.sigla;
      this.color = this.planifEstrategicaSelected.color;

      // Abrir el modal correspondiente
        switch (this.id_proy_elem_padre) {
          case 1: // Objetivo General
          case 2: // Objetivo Específico
          case 3: // Resultado Estratégico
            this.openModal(planifEstrategicaOGOERE);
            break;
          case 4: // Indicador
            this.openModal(planifEstrategicaIN);
            break;
          default:
            console.error("Tipo de elemento desconocido.");
  }
    }
  // ======= ======= ======= ======= ======= ======= =======  ======= =======
    editIndicador(){
      const objIndicador = {
        p_id_proy_indicador: this.id_proy_indicador,
        p_id_proyecto: this.id_proyecto,
        p_id_proy_elem_padre: this.id_proy_elem_padre,
        p_codigo: this.codigo,
        p_indicador: this.indicador,
        p_descripcion: this.descripcion,
        p_comentario: this.comentario,
        p_orden: this.orden,
        p_linea_base: this.linea_base,
        p_medida: this.medida,
        p_meta_final: this.meta_final,
        p_medio_verifica: this.medio_verifica,
        p_id_estado: this.id_estado,
        p_inst_categoria_1: this.inst_categoria_1,
        p_inst_categoria_2: this.inst_categoria_2,
        p_inst_categoria_3: this.inst_categoria_3
      };
      this.servIndicador.editIndicador(objIndicador).subscribe(
        (data) => {
          this.getPlanifEstrategica();
          console.log('Elemento editado con éxito', data);
        },
        (error) => {
          console.error(error);
        }
      );
    }
  // ======= ======= ======= ======= ======= ======= =======  ======= =======
    initDeletePlanifEstrategica(modalScope: TemplateRef<any>){
      this.initPlanifEstrategicaModel();

      this.id_proy_indicador = this.planifEstrategicaSelected.id_proy_indicador;
     
      this.openModal(modalScope);
    }
  // ======= ======= ======= ======= ======= ======= =======  ======= =======
    deleteIndicador(){
      //console.log('Eliminando el ID:', this.id_proy_indicador);
      this.servIndicador.deleteIndicador(this.id_proy_indicador).subscribe(
        (data) => {
          this.planifEstrategicaSelected = null;
          this.closeModal();
          this.getPlanifEstrategica();
          console.log('Elemento eliminado con éxito', data);
        },
        (error) => {
          console.error(error);
        }
      );
    }
  // ======= ======= ======= ======= ======= ======= =======  ======= =======


// COUNT HEADER DATA
countHeaderData(): void {
  // Inicializamos los contadores
  this.headerDataNro01 = 0;
  this.headerDataNro02 = 0;
  this.headerDataNro03 = 0;
  this.headerDataNro04 = 0;

  // Recorremos solo una vez el arreglo y actualizamos los contadores
  this.planifEstrategica.forEach(e => {
    switch (e.tipo) {
      case 'OG':
        this.headerDataNro01++;
        break;
      case 'OE':
        this.headerDataNro02++;
        break;
      case 'RE':
        this.headerDataNro03++;
        break;
      case 'IN':
        this.headerDataNro04++;
        break;
    }
  });
}


// ======= ======= SUBMIT FORM ======= =======
    onSubmit(): void {
      // ======= VALIDATION SECTION =======
      let valForm = false;

      this.ValidateComponente();
      console.log('Componente válido:', this.valComponente);
    
      /*this.ValidateCodigo();
      console.log('Código válido:', this.valCodigo);*/
    
      this.ValidateCategoria();
      console.log('Categoría válida:', this.valCategoria);
    
      this.ValidateSubCategoria();
      console.log('Subcategoría válida:', this.valSubCategoria);
    
      this.ValidateTipoCategoria();
      console.log('Tipo de categoría válido:', this.valTipoCategoria);
    
      this.ValidateIndicador();
      console.log('Indicador válido:', this.valIndicador);
    
      this.ValidateDescripcion();
      console.log('Descripción válida:', this.valDescripcion);
    
      this.ValidateComentario();
      console.log('Comentario válido:', this.valComentario);
    
      this.ValidateOrden();
      console.log('Orden válido:', this.valOrden);
    
      this.ValidateLineaBase();
      console.log('Línea base válida:', this.valLineaBase);
    
      this.ValidateMedida();
      console.log('Medida válida:', this.valMedida);
    
      this.ValidateMetaFinal();
      console.log('Meta final válida:', this.valMetaFinal);
    
      this.ValidateMedioVerifica();
      console.log('Medio de verificación válido:', this.valMedioVerifica);
    
      this.ValidateEstado();
      console.log('Estado válido:', this.valEstado);
    

      valForm = 
        this.valComponente &&
        //this.valCodigo &&
        this.valCategoria &&
        this.valSubCategoria &&
        this.valTipoCategoria &&
        this.valIndicador &&
        this.valDescripcion &&
        this.valComentario &&
        this.valOrden &&
        this.valLineaBase &&
        this.valMedida &&
        this.valMetaFinal &&
        this.valMedioVerifica &&
        this.valEstado;
       console.log('Formulario válido:', valForm); // Para verificar qué está fallando

      // ======= ACTION SECTION =======
      // ======= ACTION SECTION =======
  if (valForm) {
    if (this.modalAction === "add") {
      this.addIndicador();
      console.log('Añadiendo...');
    } else {
      this.editIndicador();
      console.log('Editando...');
    }
    this.closeModal();
    console.log('Cerrando...');
  } else {
    console.log('El formulario no es válido');
  }
}
    // ======= ======= ======= ======= =======


}