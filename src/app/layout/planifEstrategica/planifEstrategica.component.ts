// Importacion de modulos y componentes Principales
import { Component, OnInit, TemplateRef, ChangeDetectorRef} from '@angular/core';
import { routerTransition } from '../../router.animations';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

// ======= ======= ======= SERVICES SECTION ======= ======= =======
import { PlanifEstrategicaService } from '../../servicios/planifEstrategica';
import { servicios } from "../../servicios/servicios";
import { servAprendizaje } from "../../servicios/aprendizajes";
import { servIndicador } from '../../servicios/indicador';
import {servInstCategorias} from '../../servicios/instCategoria';
import { servIndicadorAvance } from '../../servicios/indicadorAvance';
import {ElementosService} from '../../servicios/elementos';
import { NgForm } from '@angular/forms';
import { get } from 'http';


// ======= ======= ======= COMPONENTES ======= ======= =======
@Component({
  selector: 'app-planifEstrategica',
  templateUrl: './planifEstrategica.component.html',
  styleUrls: ['./planifEstrategica.component.scss'],
  animations: [routerTransition()]
})

export class PlanifEstrategicaComponent implements OnInit {
    // ======= ======= VARIABLES SECTION ======= =======
    planifEstrategica: any[] = [];

    // ======= ======= VARIABLES PAGINACION ======= =======
    mainPage = 1;
    mainPageSize = 10;
    totalLength = 0;
  elementosTabla: any;
  combinedData: any[];
  periodos: any;
    periodosForm: any; // Add this line to define periodosForm
    editPeriodo = { periodo: '', valorEsperado: 0 }; // Valores iniciales


    
    constructor(
      private modalService: NgbModal,
      private cdr: ChangeDetectorRef,
      private ServPlanifEstrategica: PlanifEstrategicaService,
      private servicios: servicios,
      private servInstCategorias: servInstCategorias,
      private servApredizaje: servAprendizaje,
      private servIndicador: servIndicador,
      private servIndicadorAvance: servIndicadorAvance,
      private proyElementosService: ElementosService
      
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
          orden: any ;
          linea_base: any = "";
          medida: any = "";
          meta_final: any = "";
          medio_verifica: any = "";
          id_estado: any = "";
          inst_categoria_1: any ;
          inst_categoria_2: any = "";
          inst_categoria_3: any = "";

          sigla: any = "";
          color: any = "";
          // Variables de Selección
          componentes: any[] = [];
          selectedParentCodigo: any = '';
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
    valComponente: any = false; 

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
            console.log('el orden es : ',  this.orden);
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
            console.log('el id estado es : ',  this.id_estado);
            this.valEstado = false;
          }
        }
        private previousIdProyecto: number | null = null;

    // ======= ======= INIT VIEW FUN ======= =======
    editPlanifEstrategica(planifEstrategicaOGOERE:any ,planifEstrategicaIN:any): void {
      this.initEditPlanifEstrategica(planifEstrategicaOGOERE, planifEstrategicaIN);
      this.cargarIndicadoresAvance();
    }
        ngOnInit(): void {
          this.getParametricas(); 
          this.getPlanifEstrategica(); 
          //this.cargarIndicadoresAvance();
  
          this.grtElementos();
          this.loadData();

       
         // Configurar un intervalo para verificar cambios en idProyecto cada 5 segundos
    setInterval(() => {
      this.checkForProjectChange();
    }, 1000);
        }
          // Método para verificar cambios en idProyecto
  private checkForProjectChange(): void {
    if (this.idProyecto !== this.previousIdProyecto) {
      this.previousIdProyecto = this.idProyecto;
      this.loadData();
    }
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

     
        isEditing: boolean = false; // Indica si el formulario está en modo de edición
        selectedIdProyIndicador: number | null = null; // Almacena el ID seleccionado
        
        cargarIndicadoresAvance() {
          console.log( ' entrando a cargar indicador avance')
          this.selectedIdProyIndicador ; // Almacena el ID seleccionado
          this.isEditing = true; // Activa el modo de edición
        
          console.log('Cargando datos para el ID seleccionado:',  this.selectedIdProyIndicador);
        
          this.servIndicadorAvance.getIndicadoresAvanceById( this.selectedIdProyIndicador).subscribe(
            (response: any) => {
              const datos = response[0]?.dato || [];
              console.log('Datos obtenidos:', datos);
        
              // Extraer los valores necesarios
              this.planifIDindAvance = datos.map((item: any) => item.id_proy_indica_avance);
              this.planifPeriodofecha = datos.map((item: any) => item.fecha_reportar);
              this.planifMetaEsperada = datos.map((item: any) => item.valor_esperado);
              console.log('IDs de avance:', this.planifIDindAvance);
            },
            (error) => {
              console.error('Error al cargar los datos:', error);
            }
          );
        }

        openEditPeriodoModal(content: any, id: number) {
          const periodoData = this.planifIDindAvance.find(p => p.id === id);
          if (periodoData) {
            this.editPeriodo = {
              periodo: periodoData.periodo || '',
              valorEsperado: periodoData.valorEsperado || 0,
            };
          }
          this.modalService.open(content, { size: 'lg', backdrop: 'static' });
        }

        
        onEditSubmit() {
          // Lógica para guardar los cambios
          console.log('Datos editados:', this.editPeriodo);
        
          // Lógica para cerrar el modal
          this.modalService.dismissAll();
        }
        

        
        cerrarFormulario() {
          this.isEditing = false; // Desactiva el modo de edición
          this.selectedIdProyIndicador = null; // Limpia el ID seleccionado
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
      console.log('Elemento seleccionado a revisar:', planifEstrategicaSel);
    this.selectedIdProyIndicador=planifEstrategicaSel.id_proy_indicador;
    console.log('ahora esl id elemento par avance es :', this.selectedIdProyIndicador)
      // Recorre todos los elementos y actualiza el estado de selección
      this.combinedData.forEach(planifEstrategica => {
        const isSameItem =
          planifEstrategicaSel.id_proy_indicador
            ? planifEstrategicaSel.id_proy_indicador === planifEstrategica.id_proy_indicador
            : planifEstrategicaSel.id_proy_elemento === planifEstrategica.id_proy_elemento;
    
        if (isSameItem) {
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
        console.log('Datos de planifEstrategica:', this.combinedData);
        switch (tipo) {
          case 'OG': // Objetivo General no tiene padres válidos (es la raíz)
            return [];

          case 'OE': // Objetivo Específico solo puede tener como padre un OG
            return this.combinedData.filter(el => el.id_proy_elem_padre === 1);

          case 'RE': // Resultado Estratégico puede tener como padre un OG o un OE
            return this.combinedData.filter(el => el.id_proy_elem_padre === 1 || el.id_proy_elem_padre === 2);

          case 'IN': // Indicador puede tener como padre un OG, OE o RE
            return this.combinedData.filter(el => 
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
      // Método para manejar cambios en el tipo y filtrar padres válidos
      onParentChange(): void {
        if (this.selectedParentCodigo) {
          switch (this.tipo) {
            case 'OG':
              this.codigo = this.generateCodigoOG();
              break;
            case 'OE':
              this.codigo = this.generarCodigoOE(this.selectedParentCodigo);
              break;
            case 'RE':
              this.codigo = this.generarCodigoRE(this.selectedParentCodigo);
              break;
            case 'IN':
              this.codigo = this.generarCodigoIN(this.selectedParentCodigo);
              break;
            default:
              this.codigo = '';
              break;
          }
        } else {
          this.codigo = ''; // Limpia el código si no hay un padre seleccionado
        }
      }
      
    // ======= ======= GENERAR CÓDIGO ======= ======= 
    // Método para obtener el último código de "OG" y generar el siguiente código.
    generateCodigoOG(): string {
      // Obtener los elementos con id_proy_elem_padre === 1 (OG).
      const ogElements = this.combinedData.filter(el => el.id_proy_elem_padre === 1);

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
    // Generar código para OE
    generarCodigoOE(parentCodigo: string): string {
    const oeElements = this.combinedData.filter(el => el.id_proy_elem_padre === 2);
    const lastOE = oeElements.reduce((max, el) => {
      const currentCode = el.codigo.split('.').map(Number);
      if (currentCode[1] > max[1]) return currentCode;
      return max;
    }, [Number(parentCodigo.split('.')[0]), 0, 0, 0]);

    lastOE[1]++;
    return `${lastOE[0]}.${lastOE[1]}.0.0`;
    }
      // Generar código para RE
    generarCodigoRE(parentCodigo: string): string {
    const reElements = this.combinedData.filter(el => el.codigo.startsWith(parentCodigo) && el.id_proy_elem_padre === 2);
    const lastRE = reElements.reduce((max, el) => {
      const currentCode = el.codigo.split('.').map(Number);
      if (currentCode[2] > max[2]) return currentCode;
      return max;
    }, [Number(parentCodigo.split('.')[0]), Number(parentCodigo.split('.')[1]), 0, 0]);

    console.log('Último RE:', lastRE);
    lastRE[2]++;
    return `${lastRE[0]}.${lastRE[1]}.${lastRE[2]}.0`;
    }
    generarCodigoIN(parentCodigo: string): string {
    // Convertimos el código del padre a un array de números para la comparación
    const parentCodeArray = parentCodigo.split('.').map(Number);

    // Filtrar elementos que coincidan con el prefijo del código del padre seleccionado
    const inElements = this.combinedData.filter(el => {
      const currentCodeArray = el.codigo.split('.').map(Number);
      return (
        currentCodeArray[0] === parentCodeArray[0] && // Mismo nivel 1
        currentCodeArray[1] === parentCodeArray[1] && // Mismo nivel 2
        currentCodeArray[2] === parentCodeArray[2]    // Mismo nivel 3
      );
    });

    console.log('Elementos filtrados:', inElements);

    // Reducir para encontrar el último código válido en el nivel 4
    const lastIN = inElements.reduce((max, el) => {
      const currentCodeArray = el.codigo.split('.').map(Number);
      if (currentCodeArray[3] > max[3]) {
        return currentCodeArray; // Actualizamos si el nivel 4 es mayor
      }
      return max;
    }, parentCodeArray); // Inicializamos con el código del padre convertido a números

    console.log('Último código encontrado:', lastIN);

    // Incrementar el cuarto nivel del código
    lastIN[3]++;
    return `${lastIN[0]}.${lastIN[1]}.${lastIN[2]}.${lastIN[3]}`; // Formateamos el nuevo código
    }

    moverElemento(elemento: any, direccion: string): void {
      // Encontrar el índice actual del elemento
      const index = this.combinedData.findIndex(el => el === elemento);
    
      if (index === -1) {
        alert('Error: Elemento no encontrado.');
        console.error('Elemento no encontrado.');
        return;
      }
    
      // Determinar el nuevo índice
      let newIndex = direccion === 'arriba' ? index - 1 : index + 1;
    
      // Validar que el índice esté dentro de los límites
      if (newIndex < 0 || newIndex >= this.combinedData.length) {
        alert(`No se puede mover más ${direccion === 'arriba' ? 'arriba' : 'abajo'}.`);
        console.warn('Movimiento fuera de límites.');
        return;
      }
    
      // Obtener códigos del elemento actual y del elemento de destino
      const codigoActual = this.combinedData[index].codigo.split('.').map(Number);
      const codigoDestino = this.combinedData[newIndex].codigo.split('.').map(Number);
    
      // Verificar que el movimiento respete la jerarquía
      if (direccion === 'arriba') {
        // Validar que no suba sobre un padre
        if (!this.puedeMover(codigoActual, codigoDestino)) {
          alert('Movimiento no permitido: un hijo no puede estar encima de su padre.');
          console.warn('Movimiento no permitido: un hijo no puede estar encima de su padre.');
          return;
        }
      } else if (direccion === 'abajo') {
        // Validar que no baje sobre un hijo
        if (!this.puedeMover(codigoDestino, codigoActual)) {
          alert('Movimiento no permitido: un padre no puede estar debajo de su hijo.');
          console.warn('Movimiento no permitido: un padre no puede estar debajo de su hijo.');
          return;
        }
      }
    
      // Intercambiar elementos en la lista
      [this.combinedData[index], this.combinedData[newIndex]] = 
        [this.combinedData[newIndex], this.combinedData[index]];
    
      alert(`Elemento movido ${direccion}.`);
      console.log(`Elemento movido ${direccion}. Nuevo orden:`, this.combinedData);
    }
    
    /**
     * Verifica si el movimiento respeta la jerarquía.
     * Un hijo no puede estar encima de su padre y viceversa.
     */
    private puedeMover(codigoHijo: number[], codigoPadre: number[]): boolean {
      for (let i = 0; i < codigoPadre.length; i++) {
        if (codigoHijo[i] > codigoPadre[i]) {
          return false; // Hijo no puede estar encima de un padre
        } else if (codigoHijo[i] < codigoPadre[i]) {
          return true; // Padre está en una posición válida
        }
      }
      return true; // Igualdad entre códigos
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
        this.orden = 2;
        this.linea_base = "";
        this.medida = "";
        this.meta_final = "";
        this.medio_verifica = "";
        this.id_estado = 1;
        this.inst_categoria_1 = "";
        this.inst_categoria_2 = "" ;
        this.inst_categoria_3 = "" ;

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
      grtElementos(){
        this.proyElementosService.getElementosByProyecto(this.idProyecto).subscribe(
          (data: any )=> {
            console.log('Elementos:', data[0].dato);
            this.elementosTabla = (data[0].dato)?(data[0].dato):[];
            console.log('Elementos:', this.elementosTabla);
          }


        )
      }
      loadData(): void {
        this.servIndicador.getIndicadorByIdProy(this.idProyecto).subscribe(
          (data: any) => {
            this.planifEstrategica = (data[0].dato)?(data[0].dato):[];
            console.log(' datos ede indicador en eel loadData : ',this.planifEstrategica )
            this.checkIfDataLoaded();
          },
          (error) => {
            console.error(error);
          }
        );
      
        this.proyElementosService.getElementosByProyecto(this.idProyecto).subscribe(
          (data: any) => {
            this.elementosTabla = (data[0].dato)?(data[0].dato):[];
            console.log(' datos ede elementos en el LoadData : ',this.elementosTabla );
      

            this.checkIfDataLoaded();
          },
          (error) => {
            console.error(error);
          }
        );
      }
      
      checkIfDataLoaded(): void {
        if (this.planifEstrategica && this.elementosTabla) {
          this.combinePlanifEstrategicaAndElementos();
        }
      }
      
      combinePlanifEstrategicaAndElementos(): void {
        const planifEstrategicaMapped = this.planifEstrategica.map((item: any) => ({

          tipo: 'Indicador',
          codigo: item.codigo || '-',
          color:item.color,
          comentario:item.comentario,  
          descripcion: item.descripcion || '-',  
          id_estado:item.id_estado,
          id_inst_categoria_1:item.id_inst_categoria_1,
          id_inst_categoria_2:item.id_inst_categoria_2,
          id_inst_categoria_3:item.id_inst_categoria_3,
          id_proy_elem_padre: item.id_proy_elem_padre,
          id_proy_indicador:item.id_proy_indicador,
          id_proyecto:item.id_proyecto,
          indicador: item.indicador || '-',

          linea_base: item.linea_base || '-',
          medida: item.medida || '-',          
          medio_verifica: item.medio_verifica || '-',
          meta_final:item.meta_final || '-',
          orden:item.orden,
          sigla:item.sigla,
          
        }));
      
        const elementosTablaMapped = this.elementosTabla.map((item: any) => ({
      
          tipo: 'Elemento',
   
          codigo: item.codigo || '-',
          color:item.color,
          comentario:item.comentario,  
          descripcion: item.descripcion || '-',  
          id_estado:item.id_estado,
          id_inst_categoria_1:item.id_inst_categoria_1,
          id_inst_categoria_2:item.id_inst_categoria_2,
          id_inst_categoria_3:item.id_inst_categoria_3,
          id_proy_elem_padre: item.id_proy_elem_padre,
          id_proy_elemento:item.id_proy_elemento,
          id_proyecto:item.id_proyecto,
          indicador: item.elemento || '-',
          linea_base: item.linea_base || '-',
          medida: item.medida || '-',          
          medio_verifica: item.medio_verifica || '-',
          meta_final:item.meta_final || '-',
          orden:item.orden,
          sigla:this.getSigla(item.id_proy_elem_padre),
        }));
      console.log('datos en el elemeto tabla de elementos ante de ser combinado:', elementosTablaMapped);
        // Combina ambas tablas
        this.combinedData = [...planifEstrategicaMapped, ...elementosTablaMapped];

        console.log('estsos son los datos convinados : ', this.combinedData);
        console.log('se compara con lo que tien ', this.planifEstrategica);
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
      p_id_proy_indicador: 0|| null,
      p_id_proyecto: parseInt(this.idProyecto, 10)|| null,
      p_id_proy_elem_padre: this.id_proy_elem_padre|| null,
      p_codigo: this.codigo|| null,
      p_indicador: this.indicador|| null,
      p_descripcion: this.descripcion|| null,
      p_comentario: this.comentario || null,
      p_orden: this.orden|| null,
      p_linea_base: this.linea_base || null,
      p_medida: this.medida|| null,
      p_meta_final: this.meta_final|| null,
      p_medio_verifica: this.medio_verifica|| null,
      p_id_estado: this.id_estado|| null,
      p_inst_categoria_1: parseInt(this.inst_categoria_1, 10)|| null,
      p_inst_categoria_2: parseInt(this.inst_categoria_2, 10)|| null,
      p_inst_categoria_3: parseInt(this.inst_categoria_3, 10)|| null
    };
  
    console.log('Objeto enviado a la API:', objIndicador); // Verifica los valores
  
    this.servIndicador.addIndicador(objIndicador).subscribe(
      (data) => {
        console.log('Objeto enviado a la API 2 :', objIndicador); // Verifica los valores
        console.log('Elemento añadido con éxito', data);
        this.getPlanifEstrategica();
      },
      (error) => {
        console.error('Error al guardar los datos:', error);
      }
    );
    this.loadData()
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
        p_id_proyecto: parseInt(this.idProyecto, 10)|| null,
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
        p_inst_categoria_1: parseInt(this.inst_categoria_1,10),
        p_inst_categoria_2: parseInt(this.inst_categoria_2,10),
        p_inst_categoria_3: parseInt(this.inst_categoria_3,10)
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
      this.getPlanifEstrategica();
      this.loadData();
    }
    editElemento() {
      const objElemento = {
        p_accion: "M1",
        p_id_proy_elemento: this.planifEstrategicaSelected.id_proy_elemento || null,
        p_id_proyecto: this.planifEstrategicaSelected.id_proyecto || null,
        p_id_meto_elemento: this.planifEstrategicaSelected.id_meto_elemento || null,
        p_id_proy_elem_padre: this.planifEstrategicaSelected.id_proy_elem_padre || null,
        p_codigo: this.planifEstrategicaSelected.codigo || null,
        p_elemento: this.planifEstrategicaSelected.elemento || null,
        p_descripcion: this.planifEstrategicaSelected.descripcion || null,
        p_comentario: this.planifEstrategicaSelected.comentario || null,
        p_nivel: this.planifEstrategicaSelected.nivel || null,
        p_orden: this.planifEstrategicaSelected.orden || null,
        p_idp_estado: this.planifEstrategicaSelected.idp_estado || null,
        p_peso: this.planifEstrategicaSelected.peso || null
      };
    
      this.proyElementosService.editElemento(objElemento).subscribe(
        (response) => {
          console.log("Elemento editado con éxito:", response);
          this.getPlanifEstrategica(); // Refrescar datos
        },
        (error) => {
          console.error("Error al editar el elemento:", error);
        }
      );
    }
    
  // ======= ======= ======= ======= ======= ======= =======  ======= =======
    initDeletePlanifEstrategica(modalScope: TemplateRef<any>){
      this.initPlanifEstrategicaModel();

      this.id_proy_indicador = this.planifEstrategicaSelected.id_proy_indicador;
     
      this.openModal(modalScope);
      this.loadData();
    }
  // ======= ======= ======= ======= ======= ======= =======  ======= =======
    deleteIndicador(){
      console.log('Eliminando el ID:', this.id_proy_indicador);
      this.servIndicador.deleteIndicador(this.id_proy_indicador).subscribe(
        (data) => {
          this.planifEstrategicaSelected = null;
          this.closeModal();
          this.getPlanifEstrategica();
          console.log('indicador eliminado con éxito', data);
      
        },
        (error) => {
          console.error(error);
        }
      );
      
      this.getPlanifEstrategica();
      this.loadData()
    }
  // ======= ======= ======= ======= ======= ======= =======  ======= =======
  deleteElemento(){
    console.log('Eliminando el ID:', this.id_proy_elemento);
    this.proyElementosService.deleteElemento(this.id_proy_elemento).subscribe(
      (data) => {
        this.planifEstrategicaSelected = null;
        this.closeModal();
        this.getPlanifEstrategica();
        console.log('Eliminando el ID:', this.id_proy_elemento);
        console.log('Elemento eliminado con éxito', data);
    
      },
      (error) => {
        console.error(error);
      }
    );
    
    this.getPlanifEstrategica();
    this.loadData()
  }
  deletePlanificacionEstrategica() {
    if (this.planifEstrategicaSelected.id_proy_indicador) {
      console.log('Eliminando Indicador con ID:', this.planifEstrategicaSelected.id_proy_indicador);
      this.servIndicador.deleteIndicador(this.planifEstrategicaSelected.id_proy_indicador).subscribe(
        (data) => {
          console.log('Indicador eliminado con éxito', data);
          this.resetSelection();
        },
        (error) => {
          console.error('Error al eliminar el Indicador:', error);
        }
      );
    } else if (this.planifEstrategicaSelected.id_proy_elemento) {
      console.log('Eliminando Elemento con ID:', this.planifEstrategicaSelected.id_proy_elemento);
      this.proyElementosService.deleteElemento(this.planifEstrategicaSelected.id_proy_elemento).subscribe(
        (data) => {
          console.log('Elemento eliminado con éxito', data);
          this.resetSelection();
        },
        (error) => {
          console.error('Error al eliminar el Elemento:', error);
        }
      );
    } else {
      console.warn('No hay un Indicador o Elemento válido seleccionado.');
    }
  }
  
  // Reinicia la selección y recarga los datos
  resetSelection() {
    this.planifEstrategicaSelected = null;
    this.closeModal();
    this.getPlanifEstrategica();
    this.loadData();
  }
  

  countHeaderData(): void {
    // Inicializamos los contadores
    this.headerDataNro01 =0;
    this.headerDataNro02 = 0;
    this.headerDataNro03 = 0;
    this.headerDataNro04 = 0;
    console.log('Planificación Estratégica para e counter :', this.combinedData);
    // Recorremos solo una vez el arreglo y actualizamos los contadores
    this.combinedData.forEach(e => {
      switch (e.sigla) {
        case 'IM':
        case 'OG':
          this.headerDataNro01++;
          break;
        case 'OC':
          case 'OE':
          this.headerDataNro02++;
          break;
        case 'OP':
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
          
      /*this.ValidateCodigo();
      console.log('Código válido:', this.valCodigo);*/
    
      this.ValidateCategoria();        
      this.ValidateSubCategoria();  
      this.ValidateTipoCategoria();
      this.ValidateIndicador();
      this.ValidateDescripcion();
      this.ValidateComentario();
      this.ValidateOrden();
      this.ValidateLineaBase();
      this.ValidateMedida();
      this.ValidateMetaFinal();
      this.ValidateMedioVerifica();
      this.ValidateEstado();

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
        this.valMedioVerifica

      // ======= ACTION SECTION =======


      if (this.modalAction === "add") {
        this.addIndicador();
        console.log('Añadiendo...');
      } else if (this.modalAction === "edit") {
        this.editIndicador();
        console.log('Editando...');
      } 
      this.closeModal();
      console.log('Cerrando...');
    
      this.loadData();
  
}


    // ======= ======= ======= ======= =======
    onSubmitElemento(form: NgForm): void {
      if (form.valid) {
        const elemento = {
          id_proyecto: this.idProyecto,
          id_proy_elem_padre: this.id_proy_elem_padre,
          codigo: this.codigo,
          elemento: this.indicador,
          indicador: this.indicador,
          descripcion: this.descripcion,
          comentario: this.comentario,
          tipo: this.tipo,
          parentCodigo: this.selectedParentCodigo,
        };
    
        // Identificar si es una acción de agregar o editar
        if (this.modalAction === "add") {
          // Agregar nuevo elemento
          this.proyElementosService.addElemento(elemento).subscribe(
            (response) => {
              console.log('Elemento añadido exitosamente:', response);
              form.resetForm(); // Limpia el formulario
              this.loadData(); // Recargar los datos
            },
            (error) => {
              console.error('Error al añadir elemento:', error);
            }
          );
        } else if (this.modalAction === "edit") {
          // Editar elemento existente
          elemento['id_proy_elemento'] = this.planifEstrategicaSelected.id_proy_elemento; // Agregar el ID para identificar el elemento
          this.proyElementosService.editElemento(elemento).subscribe(
            (response) => {
              console.log('Elemento editado exitosamente:', response);
              form.resetForm(); // Limpia el formulario
              this.loadData(); // Recargar los datos
            },
            (error) => {
              console.error('Error al editar elemento:', error);
            }
          );
        }
    
        // Cerrar modal después de la acción
        this.closeModal();
        console.log('Cerrando...');
      }
    }
    

}