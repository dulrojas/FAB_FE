// Importacion de modulos y componentes Principales
import { Component, OnInit, TemplateRef, ChangeDetectorRef, EventEmitter, Output} from '@angular/core';
import { routerTransition } from '../../router.animations';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ProyectoService } from '../../services/proyectoData.service';

// ======= ======= ======= SERVICES SECTION ======= ======= =======
import { servicios } from "../../servicios/servicios";
import { servAprendizaje } from "../../servicios/aprendizajes";
import { servIndicador } from '../../servicios/indicador';
import { servInstCategorias } from '../../servicios/instCategoria';
import { servIndicadorAvance } from '../../servicios/indicadorAvance';
import { ElementosService } from '../../servicios/elementos';
import { MetoElementosService } from '../../servicios/metoElementos';
import { servActAvance } from '../../servicios/actividadAvance';
import { NgForm } from '@angular/forms';

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
  combinedData: any[] = [];

  periodos: any;
  periodosForm: any; 
  editPeriodo = { periodo: '', valorEsperado: 0 }; 
  metoElementoData: any[] = [];
  datosAliados: any;
  editAvance: {
    id_proy_indica_avance: any,
    id_proy_indicador: any, 
    fecha_reportar: any,  
    fecha_hora_reporte: any,
    valor_reportado: any,  
    valor_esperado: any,  
    id_persona_reporte: any,
    comentarios: any,  
    ruta_evidencia: any,
  };

// ============ counter  variables section ====== =====
  headerDataNro01: any = 0;
  headerDataNro02: any = 0;
  headerDataNro03: any = 0;
  headerDataNro04: any = 0;

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
  orden: any;
  linea_base: any = "";
  medida: any = "";
  meta_final: any = "";
  medio_verifica: any = "";
  id_estado: any = "";
  inst_categoria_1: any;
  inst_categoria_2: any = "";
  inst_categoria_3: any = "";

  sigla: any = "";
  color: any = "";

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

  constructor(
    protected modalService: NgbModal,
     private proyectoService: ProyectoService,
    protected cdr: ChangeDetectorRef,
    protected servicios: servicios,
    protected servInstCategorias: servInstCategorias,
    protected servApredizaje: servAprendizaje,
    protected servIndicador: servIndicador,
    protected servIndicadorAvance: servIndicadorAvance,
    protected proyElementosService: ElementosService,
    protected servmetoElemento: MetoElementosService,
    protected servActAvance: servActAvance,
  ) { }
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
      this.ngOnInit()
      this.getParametricas();
      this.getPlanifEstrategica();
      this.initPlanifEstrategicaModel();
      this.planifEstrategicaSelected = null
    }

    ngOnInit(): void {
      this.loadMetoElemento();
      this.getParametricas();
      this.getPlanifEstrategica(); 
      this.loadData();
      this.countHeaderData();
      this.cargarIndicadoresAvance();
    }

      // ======= ======= GET INDICADORES ======= =======
      getPlanifEstrategica() {
        this.servIndicador.getIndicadorByIdProy(this.idProyecto).subscribe(
          (data: any) => {
            this.planifEstrategica = (data[0].dato) ? (data[0].dato) : ([]);
            this.totalLength = this.planifEstrategica.length;
            
          },
          (error) => {
            console.error(error);
          }
        );
      }
  
    loadMetoElemento() {
      this.servmetoElemento.getMetoElementosByMetodologia(2).subscribe(
        (data: any) => {
          this.metoElementoData = (data[0]?.dato) ? data[0].dato : [];
        },
        (error) => {
          console.error(error);
        }
      );
    }
  
    loadData(): void {
      this.servIndicador.getIndicadorByIdProy(this.idProyecto).subscribe(
        (data: any) => {
          this.planifEstrategica = (data[0].dato) ? data[0].dato : [];
          this.checkIfDataLoaded();  
        },
        (error) => {
          console.error(error);
        }
      );
  
      this.proyElementosService.getElementosByProyecto(this.idProyecto).subscribe(
        (data: any) => {
          this.elementosTabla = (data[0].dato) ? data[0].dato : [];
          this.checkIfDataLoaded(); 
        },
        (error) => {
          console.error(error);
        }
      );
    }
  
    // == ====== section validator  =====
    ValidateComponente() {
      if (this.id_proy_elem_padre) {
        this.valComponente = true;
      } else {
        this.valComponente = false;
      }
    }
    valIndicador: any = true;
    ValidateIndicador() {
      this.valIndicador = true;
      if (!this.indicador || this.indicador.length > 100) {
        this.valIndicador = false;
      }
    }   
  
    // ======= ======= INIT VIEW FUN ======= =======
    editPlanifEstrategica(planifEstrategicaOGOERE: any, planifEstrategicaIN: any): void {
      this.initEditPlanifEstrategica(planifEstrategicaOGOERE, planifEstrategicaIN);
      this.cargarIndicadoresAvance();
    }
  
    // ======= ======= ======= ======= =======  ======= ======= =======  =======
      jsonToString(json: object): string {
        return JSON.stringify(json);
      }
    
      stringToJson(jsonString: string): object {
        return JSON.parse(jsonString);
      }
    
      getDescripcionSubtipo(idRegistro: any, paramList: any): string {
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
    
    isEditing: boolean = false; 
    selectedIdProyIndicador: number | null = null; 
  
    cargarIndicadoresAvance() {
      this.isEditing = true;
      
      // Reiniciar los datos antes de cargar nuevos valores
      this.datosAliados = [];
      this.planifIDindAvance = [];
      this.planifPeriodofecha = [];
      this.planifMetaEsperada = [];
    
      if (this.selectedIdProyIndicador) {
        this.servIndicadorAvance.getIndicadoresAvanceById(this.selectedIdProyIndicador).subscribe(
          (response: any) => {
            this.datosAliados = response[0]?.dato || [];
    
            // Ordenar por fecha de la más antigua a la más nueva
            this.datosAliados.sort((a: any, b: any) => new Date(a.fecha_reportar).getTime() - new Date(b.fecha_reportar).getTime());
    
            if (this.datosAliados.length > 0) {
              this.planifIDindAvance = this.datosAliados.map((item: any) => item.id_proy_indica_avance);
              this.planifPeriodofecha = this.datosAliados.map((item: any) => item.fecha_reportar);
              this.planifMetaEsperada = this.datosAliados.map((item: any) => item.valor_esperado);
            }
          },
          (error) => {
            console.error('Error al cargar los datos:', error);
          }
        );
      }
    }
    
    openEditPeriodoModal(content: any, id: number) {
      const avanceData = this.datosAliados.find(p => p.id_proy_indica_avance === id);
    
      if (avanceData) {
        // Obtener la fecha límite (23:59:59 del día en Bolivia)
        const fechaAvance = new Date(avanceData.fecha_reportar + 'T23:59:59-04:00'); // Aseguramos la zona horaria UTC-4
    
        // Obtener la hora actual en UTC y convertirla manualmente a Bolivia (UTC-4)
        const nowUTC = new Date();
        const nowBolivia = new Date(nowUTC.getTime() - (4 * 60 * 60 * 1000)); // Restamos 4 horas para Bolivia
    
        console.log("Fecha del avance (hasta las 23:59):", fechaAvance);
        console.log("Fecha actual en Bolivia:", nowBolivia);
    
        // Verificar si la fecha ya venció
        if (nowBolivia > fechaAvance) {
          alert('No puedes editar este avance porque la fecha ya ha vencido.');
          return; // Bloqueamos la edición
        }
    
        // Si la fecha aún es válida, continuar con la edición
        this.editAvance = {
          id_proy_indica_avance: avanceData.id_proy_indica_avance,
          id_proy_indicador: avanceData.id_proy_indicador || null,  
          fecha_reportar: avanceData.fecha_reportar || '',  
          fecha_hora_reporte: new Date().toISOString(),
          valor_reportado: parseFloat(avanceData.valor_reportado.replace('$', '').replace(',', '')) || 0 || null ,  
          valor_esperado: parseFloat(avanceData.valor_esperado.replace('$', '').replace(',', '')) || 0,  
          id_persona_reporte: avanceData.id_persona_reporte || null,
          comentarios: avanceData.comentarios || '',  
          ruta_evidencia: avanceData.ruta_evidencia || '',  
        };
    
        this.modalService.open(content, { size: 'lg', backdrop: 'static' });
    
      } else {
        console.warn('No se encontraron datos para el ID especificado:', id);
      }
    }
    
    
  
    onEditAvanceSubmit() {
      // Crear el objeto con los datos editados
      const avanceEditado = {
        p_id_proy_indicador_avance: this.editAvance.id_proy_indica_avance,
        p_id_proy_indicador: this.editAvance.id_proy_indicador,
        p_fecha_reportar: this.editAvance.fecha_reportar,
        p_fecha_hora_reporte: this.editAvance.fecha_hora_reporte,
        p_valor_reportado: this.editAvance.valor_reportado,
        p_valor_esperado: this.editAvance.valor_esperado,
        p_id_persona_reporte: this.editAvance.id_persona_reporte,
        p_comentarios: this.editAvance.comentarios,
        p_ruta_evidencia: this.editAvance.ruta_evidencia,
      };
  
      // Llamar al servicio para actualizar los datos
      this.servIndicadorAvance.editIndicadorAvance(avanceEditado).subscribe(
        (response) => {
          this.cargarIndicadoresAvance();
          alert('Avance aditado correctamente');
        },
        (error) => {
          console.error('Error al actualizar:', error);
          alert('Error al actualizar el avance');
        }
      );
      
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
      this.selectedIdProyIndicador = planifEstrategicaSel.id_proy_indicador || planifEstrategicaSel.id_proy_elemento;
  
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
      const selectedComponente = this.metoElementoData.find(comp => comp.nivel == this.id_proy_elem_padre);
      if (selectedComponente) {
        this.color = selectedComponente.color;
        this.sigla = selectedComponente.sigla;
      }
      this.ValidateComponente();
    }
  
    getElementoNombre(sigla: any): string {
      const elemento = this.metoElementoData.find(comp => comp.sigla === sigla);
      return elemento ? elemento.meto_elemento : 'Indicador';
    }
  
    // ======= ======= ======= ======= ======= ======= =======  ======= ======= 
    // ======= ======= JERARQUIA DE PADRE ======= =======
    validParents: any[] = [];
    tipo: string = '';
  
  
    // Filtrar padres válidos en función del tipo del elemento a crear
    getValidParents(tipo: string): any[] {
      if (!this.elementosTabla || !Array.isArray(this.elementosTabla)) {
        console.error("combinedData no está disponible o no es un array válido");
        return [];
      }
  
      switch (tipo) {
        case 'OG': // Objetivo General no tiene padres válidos (es la raíz)
          return [];
  
        case 'OE': // Objetivo Específico solo puede tener como padre un OG
          return this.elementosTabla.filter(el => el.id_meto_elemento === 1);
  
        case 'RE': // Resultado Estratégico puede tener como padre un OG o un OE
          return this.elementosTabla.filter(el => el.id_meto_elemento === 1 || el.id_meto_elemento === 2);
  
        case 'IN': // Indicador puede tener como padre un OG, OE o RE
          return this.elementosTabla.filter(el =>
            el.id_meto_elemento === 1 ||
            el.id_meto_elemento === 2 ||
            el.id_meto_elemento === 3
          );
  
        default:
          return [];
      }
    }
  
    // Validar si un padre seleccionado es válido para el tipo actual
    validarPadre(tipo: string, parentCodigo: string): boolean {
      if (!parentCodigo || !tipo) {
        console.error("parentCodigo o tipo no definidos correctamente");
        return false;
      }
  
      const validParents = this.getValidParents(tipo);
      return validParents.some(parent => parent.codigo === parentCodigo);
    }
  
  
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
      }, [1, 0, 0, 0]); // Asegurarse de que tenga al menos 4 niveles
  
      // Incrementar el primer dígito del código.
      lastOG[0]++;
  
      // Formatear el nuevo código en el formato "X.0.0.0".
      return `${lastOG[0]}.0.0.0`;
    }
    // Generar código para OE
    generarCodigoOE(parentCodigo: string): string {
      // Filtrar solo los elementos cuyo padre es el OG correspondiente
      const oeElements = this.combinedData.filter(el => el.id_proy_elem_padre === 1 && el.codigo.startsWith(parentCodigo.split('.')[0]));
  
      // Encontrar el último código de OE
      const lastOE = oeElements.reduce((max, el) => {
        const currentCode = el.codigo.split('.').map(Number);
        if (currentCode[1] > max[1]) return currentCode;
        return max;
      }, [Number(parentCodigo.split('.')[0]), 0, 0, 0]);
  
      // Incrementar el segundo nivel del código
      lastOE[1]++;
  
      // Verificar si el código generado ya existe
      let newCode = `${lastOE[0]}.${lastOE[1]}.0.0`;
      while (this.combinedData.some(el => el.codigo === newCode)) {
        lastOE[1]++; // Incrementa hasta encontrar un código no utilizado
        newCode = `${lastOE[0]}.${lastOE[1]}.0.0`;
      }
  
      return newCode;
    }
    generarCodigoRE(parentCodigo: string): string {
      // Convertir el código del padre a un array de números para trabajar con los niveles
      const parentCodeArray = parentCodigo.split('.').map(Number);
  
      // Filtrar elementos que coincidan con el prefijo del código del padre seleccionado
      const reElements = this.combinedData.filter(el => {
        const currentCodeArray = el.codigo.split('.').map(Number);
        return (
          currentCodeArray[0] === parentCodeArray[0] && // Mismo nivel 1
          currentCodeArray[1] === parentCodeArray[1]    // Mismo nivel 2
        );
      });
  
      // Reducir para encontrar el último código válido en el tercer nivel (nivel 2 del array)
      const lastRE = reElements.reduce((max, el) => {
        const currentCodeArray = el.codigo.split('.').map(Number);
        if (currentCodeArray[2] > max[2]) {
          return currentCodeArray; // Actualizamos si el nivel 3 es mayor
        }
        return max;
      }, [...parentCodeArray]); // Inicializamos con el código del padre convertido a números
  
      // Incrementar el tercer nivel del código
      lastRE[2]++;
  
      // Generar y retornar el nuevo código en el formato correcto
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
  
      // Reducir para encontrar el último código válido en el nivel 4
      const lastIN = inElements.reduce((max, el) => {
        const currentCodeArray = el.codigo.split('.').map(Number);
        if (currentCodeArray[3] > max[3]) {
          return currentCodeArray; // Actualizamos si el nivel 4 es mayor
        }
        return max;
      }, parentCodeArray); // Inicializamos con el código del padre convertido a números
  
      // Incrementar el cuarto nivel del código
      lastIN[3]++;
      return `${lastIN[0]}.${lastIN[1]}.${lastIN[2]}.${lastIN[3]}`; // Formateamos el nuevo código
    }
  
    moverElemento(elemento: any, direccion: string): void {
      // Validar que solo se puedan mover indicadores
      if (elemento.tipo !== 'Indicador') {
        alert('Solo se pueden mover los indicadores');
        return;
      }
    
      // Encontrar el índice actual del elemento
      const index = this.combinedData.findIndex(el => el === elemento);
      if (index === -1) {
        console.error('Elemento no encontrado.');
        return;
      }
    
      // Determinar el nuevo índice
      let newIndex = direccion === 'arriba' ? index - 1 : index + 1;
    
      // Validar que el índice esté dentro de los límites
      if (newIndex < 0 || newIndex >= this.combinedData.length) {
        alert(`No se puede mover más ${direccion === 'arriba' ? 'arriba' : 'abajo'}.`);
        return;
      }
    
      // Obtener el elemento padre
      const padreActual = this.combinedData.find(el => 
        el.id_proy_elemento === elemento.id_proy_elem_padre
      );
    
      if (!padreActual) {
        alert('No se encontró el elemento padre');
        return;
      }
    
      // Validar que el movimiento sea dentro del mismo padre
      const elementoDestino = this.combinedData[newIndex];
      if (elementoDestino.id_proy_elem_padre !== elemento.id_proy_elem_padre) {
        alert('Solo se puede mover dentro del mismo grupo de indicadores');
        return;
      }
    
      // Obtener todos los indicadores del mismo padre
      const indicadoresHermanos = this.combinedData.filter(el => 
        el.tipo === 'Indicador' && 
        el.id_proy_elem_padre === elemento.id_proy_elem_padre
      );
    
      // Reordenar códigos
      this.reordenarCodigos(elemento, elementoDestino, indicadoresHermanos);
    
      // Intercambiar elementos en la lista
      [this.combinedData[index], this.combinedData[newIndex]] = 
        [this.combinedData[newIndex], this.combinedData[index]];
    
      // Actualizar en la base de datos
      this.actualizarIndicadoresEnBD(elemento, elementoDestino);
    
    }
    private reordenarCodigos(indicadorActual: any, indicadorDestino: any, indicadoresHermanos: any[]): void {
      // Ordenar indicadores por código
      indicadoresHermanos.sort((a, b) => this.compareCode(a.codigo, b.codigo));
      
      // Intercambiar códigos entre los indicadores
      const codigoTemp = indicadorActual.codigo;
      indicadorActual.codigo = indicadorDestino.codigo;
      indicadorDestino.codigo = codigoTemp;
    }

    getParametricas() {
      // Cargar categorías de nivel 1
      this.servInstCategorias.getCategoriaById(1).subscribe(
        (data: any) => {
          this.planifCategoria = data[0]?.dato || [];
        },
        (error) => {
          console.error("Error al cargar categorías:", error);
        }
      );
    }
    
    // Cuando el usuario seleccione una categoría, cargamos las subcategorías
    onCategoriaChange() {
      if (this.inst_categoria_1) {
        this.servInstCategorias.getCategoriasByNivelYPadre(2, this.inst_categoria_1).subscribe(
          (data: any) => {
            this.planifSubCategoria = data[0]?.dato || [];
            this.inst_categoria_2 = null; // Resetear la selección de subcategoría
            this.planifTipoCategoria = []; // Resetear los tipos
          },
          (error) => {
            console.error("Error al cargar subcategorías:", error);
          }
        );
      } else {
        this.planifSubCategoria = [];
        this.planifTipoCategoria = [];
      }
    }
    
    // Cuando el usuario seleccione una subcategoría, cargamos los tipos
    onSubCategoriaChange() {
      if (this.inst_categoria_2) {
        this.servInstCategorias.getCategoriasByNivelYPadre(3, this.inst_categoria_1).subscribe(
          (data: any) => {
            this.planifTipoCategoria = data[0]?.dato || [];
            this.inst_categoria_3 = null; // Resetear la selección de tipo
          },
          (error) => {
            console.error("Error al cargar tipos:", error);
          }
        );
      } else {
        this.planifTipoCategoria = [];
      }
    }
    cargarCategoriasParaEdicion() {
      // Primero cargamos las categorías de nivel 1
      this.servInstCategorias.getCategoriaById(1).subscribe(
        (data: any) => {
          this.planifCategoria = data[0]?.dato || [];
          
          // Si tenemos inst_categoria_1, cargamos las subcategorías
          if (this.inst_categoria_1) {
            this.servInstCategorias.getCategoriasByNivelYPadre(2, this.inst_categoria_1).subscribe(
              (data: any) => {
                this.planifSubCategoria = data[0]?.dato || [];
                
                // Si tenemos inst_categoria_2, cargamos los tipos
                if (this.inst_categoria_2) {
                  this.servInstCategorias.getCategoriasByNivelYPadre(3, this.inst_categoria_1).subscribe(
                    (data: any) => {
                      this.planifTipoCategoria = data[0]?.dato || [];
                    },
                    (error) => {
                      console.error("Error al cargar tipos:", error);
                    }
                  );
                }
              },
              (error) => {
                console.error("Error al cargar subcategorías:", error);
              }
            );
          }
        },
        (error) => {
          console.error("Error al cargar categorías:", error);
        }
      );
    }
    
    // Función para actualizar los indicadores en la base de datos
    private actualizarIndicadoresEnBD(indicador1: any, indicador2: any): void {

      const objIndicador1 = {
        p_id_proy_indicador: indicador1.id_proy_indicador,
        p_id_proyecto: this.idProyecto,
        p_id_proy_elem_padre: indicador1.id_proy_elem_padre,
        p_codigo: indicador1.codigo,
        p_indicador: indicador1.indicador,
        p_descripcion: indicador1.descripcion,
        p_comentario: indicador1.comentario,
        p_orden: indicador1.orden,
        p_linea_base: indicador1.linea_base,
        p_medida: indicador1.medida,
        p_meta_final: indicador1.meta_final,
        p_medio_verifica: indicador1.medio_verifica,
        p_id_estado: indicador1.id_estado,
        p_inst_categoria_1: indicador1.id_inst_categoria_1,
        p_inst_categoria_2: indicador1.id_inst_categoria_2,
        p_inst_categoria_3: indicador1.id_inst_categoria_3
      };
    
      const objIndicador2 = {
        p_id_proy_indicador: indicador2.id_proy_indicador,
        p_id_proyecto: this.idProyecto,
        p_id_proy_elem_padre: indicador2.id_proy_elem_padre,
        p_codigo: indicador2.codigo,
        p_indicador: indicador2.indicador,
        p_descripcion: indicador2.descripcion,
        p_comentario: indicador2.comentario,
        p_orden: indicador2.orden,
        p_linea_base: indicador2.linea_base,
        p_medida: indicador2.medida,
        p_meta_final: indicador2.meta_final,
        p_medio_verifica: indicador2.medio_verifica,
        p_id_estado: indicador2.id_estado,
        p_inst_categoria_1: indicador2.id_inst_categoria_1,
        p_inst_categoria_2: indicador2.id_inst_categoria_2,
        p_inst_categoria_3: indicador2.id_inst_categoria_3
      };
    
      // Realizar las actualizaciones en la base de datos
      this.servIndicador.editIndicador(objIndicador1).subscribe(
        () => {
          this.servIndicador.editIndicador(objIndicador2).subscribe(
            () => {
              this.getPlanifEstrategica();
              this.loadData();
            },
            error => console.error('Error actualizando segundo indicador:', error)
          );
        },
        error => console.error('Error actualizando primer indicador:', error)
      );
    }

    // ======= ======= INIT PLANIFICACION ESTRATEGICA NGMODEL ======= =======
    initPlanifEstrategicaModel() {
      this.modalTitle = "";
      this.selectedParentCodigo="";
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
      this.inst_categoria_2 = "";
      this.inst_categoria_3 = "";
  
      this.sigla = null;
      this.color = null;
  
      this.valComponente = true;

    }
    // ======= ======= ======= ======= ======= ======= =======  ======= =======
    initAddPlanifEstrategica(modalScope: TemplateRef<any>, id_proy_elem_padre?: number): void {
      this.initPlanifEstrategicaModel();
  
      this.modalAction = "add";
      this.modalTitle = this.getModalTitle("add");
  
      // Si se pasa un ID, establece el elemento automáticamente
      if (id_proy_elem_padre) {
        this.id_proy_elem_padre = id_proy_elem_padre;
        this.tipo = this.getSiglaElemento(id_proy_elem_padre); 
        this.sigla = this.getSiglaElemento(id_proy_elem_padre); 
        
        this.color=this.getColorElemento(id_proy_elem_padre);
        this.validParents = this.getValidParents(this.tipo);
        // Si el tipo es OG, generar el código automáticamente
        if (this.tipo === 'OG') {
          this.codigo = this.generateCodigoOG(); // Generar el código para OG
        }
  
      }
      this.isEditing = false;
      this.datosAliados = [];
      this.planifIDindAvance = [];
      this.planifPeriodofecha = [];
      this.planifMetaEsperada = [];

      this.openModal(modalScope);
    }

    combinePlanifEstrategicaAndElementos(): any {
      // Mapear datos de planifEstrategica
  
      const planifEstrategicaMapped = this.planifEstrategica.map((item: any) => ({
        id_proy_indicador: item.id_proy_indicador,
        tipo: 'Indicador',
        id_proyecto: item.id_proyecto,
        id_proy_elem_padre: item.id_proy_elem_padre,
        codigo: item.codigo || '-',
        indicador: item.indicador || '-',
        descripcion: item.descripcion || '-',
        comentario: item.comentario,
        orden: item.orden,
        linea_base: item.linea_base || '-',
        medida: item.medida || '-',
        meta_final: item.meta_final || '-',
        medio_verifica: item.medio_verifica || '-',
        id_estado: item.id_estado,
        id_inst_categoria_1: item.id_inst_categoria_1,
        id_inst_categoria_2: item.id_inst_categoria_2,
        id_inst_categoria_3: item.id_inst_categoria_3,
        color:'#FDC82F',
        sigla: 'IN',
      }));
  
      // Mapear datos de elementosTabla
      const elementosTablaMapped = this.elementosTabla.map((item: any) => ({
        id_proy_elemento: item.id_proy_elemento,
        tipo: 'Elemento',
        id_proyecto: item.id_proyecto,
        id_meto_elemento: item.id_meto_elemento,
        id_proy_elem_padre: item.id_proy_elem_padre,
        codigo: item.codigo || '-',
        elemento: item.elemento || '-',
        descripcion: item.descripcion || '-',
        comentario: item.comentario,
        nivel: item.nivel,
        orden: item.orden,
        idp_estado: item.idp_estado,
        color:this.getColorElemento(item.id_meto_elemento),
        sigla:this.getSiglaElemento(item.id_meto_elemento),
        peso: item.peso,
      }));
  
      // Combinar ambas tablas
      this.combinedData = [...planifEstrategicaMapped, ...elementosTablaMapped];
  
      // Ordenar los datos combinados
      this.combinedData.sort((a, b) => {
        const comparisonByCode = this.compareCode(a.codigo, b.codigo);
        if (comparisonByCode !== 0) {
          return comparisonByCode;
        }
  
        // Si los códigos son iguales, ordenar por tipo (sigla)
        const typeWeightA = this.getTypeWeight(a.sigla);
        const typeWeightB = this.getTypeWeight(b.sigla);
        return typeWeightA - typeWeightB;
      });
  
      this.countHeaderData();
    }
  
    // ======= ======= ======= ======= AÑADIR INDICADOR ======= =======  ======= =======
    addIndicador() {
      const objIndicador = {
        p_id_proy_indicador: 0 || null,
        p_id_proyecto: parseInt(this.idProyecto, 10) || null,
        p_id_proy_elem_padre: this.getIdPadreByCodig(this.selectedParentCodigo) || null,
        p_codigo: this.codigo || null,
        p_indicador: this.indicador || null,
        p_descripcion: this.descripcion || null,
        p_comentario: this.comentario || null,
        p_orden: this.orden || null,
        p_linea_base: this.linea_base,
        p_medida: this.medida || null,
        p_meta_final: this.meta_final,
        p_medio_verifica: this.medio_verifica || null,
        p_id_estado: this.id_estado || null,
        p_inst_categoria_1: parseInt(this.inst_categoria_1, 10) || null,
        p_inst_categoria_2: parseInt(this.inst_categoria_2, 10) || null,
        p_inst_categoria_3: parseInt(this.inst_categoria_3, 10) || null
      };

      this.servIndicador.addIndicador(objIndicador).subscribe(
        (data) => {
          alert('Indicador añadido correctamente.');
          this.getPlanifEstrategica();
          this.loadData()
          this.cargarIndicadoresAvance();
        },
        (error) => {
          alert('Error al añadir el indicador.');
          console.error('Error al guardar los datos:', error);
        }
      );
      this.loadData()
    }
    // ======= ======= ======= ======= EDITAR INDICADOR ======= =======  ======= =======
    editIndicador() {
  
      const objIndicador = {
        p_id_proy_indicador: this.id_proy_indicador,
        p_id_proyecto: parseInt(this.idProyecto, 10) || null,
        p_id_proy_elem_padre: this.getIdPadreByCodig(this.selectedParentCodigo),
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
        p_inst_categoria_1: parseInt(this.inst_categoria_1, 10),
        p_inst_categoria_2: parseInt(this.inst_categoria_2, 10),
        p_inst_categoria_3: parseInt(this.inst_categoria_3, 10)
      };
  
      this.servIndicador.editIndicador(objIndicador).subscribe(
        (data) => {
          alert('Indicador editado correctamente.');
          this.getPlanifEstrategica();
          this.loadData();
          this.getIndicadorAvance();
          this.cargarIndicadoresAvance();
        },
        (error) => {
          alert('Error al editar el indicador.');
          console.error(error);
        }
      );
      this.getPlanifEstrategica();
      this.loadData();
    }

    // ======= ======= ======= ======= EDITAR ELEMENTO ======= =======  ======= =======
    initEditPlanifEstrategica(planifEstrategicaOGOERE: TemplateRef<any>, planifEstrategicaIN: TemplateRef<any>) {
        if (!this.planifEstrategicaSelected) {
          console.error("No hay un elemento seleccionado para editar.");
          return;
        }
        this.initPlanifEstrategicaModel();
        this.cargarCategoriasParaEdicion();
        this.modalAction = "edit";
        this.modalTitle = this.getModalTitle("edit");
        
        this.selectedParentCodigo=this.getCodigoPadre(this.planifEstrategicaSelected.id_proy_elem_padre);
        this.id_proy_indicador = this.planifEstrategicaSelected.id_proy_indicador;
        this.id_proyecto = this.planifEstrategicaSelected.id_proyecto;
        this.id_proy_elem_padre = this.planifEstrategicaSelected.id_proy_elem_padre;
        this.codigo = this.planifEstrategicaSelected.codigo;
        this.indicador = this.planifEstrategicaSelected.elemento||this.planifEstrategicaSelected.indicador ;
        this.descripcion = this.planifEstrategicaSelected.descripcion;
        this.comentario = this.planifEstrategicaSelected.comentario;
        this.orden = this.planifEstrategicaSelected.orden;
        this.linea_base = this.planifEstrategicaSelected.linea_base;
        this.medida = this.planifEstrategicaSelected.medida;
        this.meta_final = this.planifEstrategicaSelected.meta_final;
        this.medio_verifica = this.planifEstrategicaSelected.medio_verifica;
        this.id_estado = this.planifEstrategicaSelected.id_estado;
        this.inst_categoria_1 = this.planifEstrategicaSelected.id_inst_categoria_1;
        this.inst_categoria_2 = this.planifEstrategicaSelected.id_inst_categoria_2;
        this.inst_categoria_3 = this.planifEstrategicaSelected.id_inst_categoria_3;
        this.sigla = this.planifEstrategicaSelected.sigla;
        this.color = this.planifEstrategicaSelected.color;
        
        this.tipo = this.getSiglaElemento(this.planifEstrategicaSelected.id_meto_elemento); 
        this.validParents = this.getValidParents(this.tipo);
    if( this.planifEstrategicaSelected.tipo=='Elemento')
    {
        // Abrir el modal correspondiente
        switch (this.planifEstrategicaSelected.id_meto_elemento) {
          case 1: // Objetivo General
          case 2: // Objetivo Específico
          case 3: // Resultado Estratégico
            this.openModal(planifEstrategicaOGOERE);
    
            break;
          default:
            console.error("Tipo de elemento desconocido.");
        }
    }else {
      this.openModal(planifEstrategicaIN);
    }
  }

  editElemento() {
    const objElemento = {
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
        alert('Elemento editado correctamente.');
        this.getPlanifEstrategica(); // Refrescar datos
      },
      (error) => {
        alert('Error al editar el elemento.');
        console.error("Error al editar el elemento:", error);
      }
    );
  }
  
    // ======= ======= ======= ======= ======= ======= =======  ======= =======
    initDeletePlanifEstrategica(modalScope: TemplateRef<any>) {
      this.initPlanifEstrategicaModel();
      this.id_proy_indicador = this.planifEstrategicaSelected.id_proy_indicador;
      this.id_proy_elemento=this.planifEstrategicaSelected.id_proy_elemento;
      if(this.verificPadre(this.id_proy_elemento|| this.id_proy_indicador,this.planifEstrategicaSelected.tipo )  )
      {
       this.openModal(modalScope);
      } 
      this.ngOnInit();
    }
  
    verificPadre(id: any,tipo:string): any {
      const tieneHijo = this.combinedData.filter(index => index.id_proy_elem_padre == id );
      
      if (tieneHijo == null || tieneHijo.length === 0 || tipo=="Indicador") {
        alert('No tiene hijos !- SI -! PUEDES ELIMINAR');
        return true;
      } else {
        alert('Tiene hijos ! NO ! puedes eliminar ');
        return false;
      }
    }
  
    canDeleteElementByCode(element: any, combinedData: any[]): { canDelete: boolean; message: string } {
      if (!element) {
        return { canDelete: false, message: 'No hay un elemento seleccionado.' };
      }
  
      // Verificar si hay hijos basados en el código del elemento seleccionado
      const hijos = combinedData.filter(el => el.codigo_padre === element.codigo);
  
      if (hijos.length > 0) {
        return { canDelete: false, message: 'No se puede eliminar este elemento porque tiene hijos activos.' };
      }
  
      return { canDelete: true, message: '' };
    }

    // ======= ======= ======= ======= ======= ======= =======  ======= =======

    private puedeMover(codigoHijo: number[], codigoPadre: number[]): boolean {
      for (let i = 0; i < codigoPadre.length; i++) {
        if (codigoHijo[i] > codigoPadre[i]) {
          return false;
        } else if (codigoHijo[i] < codigoPadre[i]) {
          return true; // Padre está en una posición válida
        }
      }
      return true; // Igualdad entre códigos
    }
  
    // ======= ======= ======= ======= ======= ======= =======  ======= =======  
  
    compareCode(a: string, b: string): number {
      const partsA = a.split('.').map(Number);
      const partsB = b.split('.').map(Number);
  
      for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
        const valueA = partsA[i] || 0;
        const valueB = partsB[i] || 0;
        if (valueA !== valueB) {
          return valueA - valueB;
        }
      }
      return 0;
    }
  
    getTypeWeight(type: string): number {
      switch (type) {
        case 'OG': return 1;
        case 'OE': return 2;
        case 'RE': return 3;
        case 'IN': return 4;
        default: return 5;
      }
    }

    isParentCode(parentCode: string, childCode: string): boolean {
      const parentParts = parentCode.split('.').map(Number);
      const childParts = childCode.split('.').map(Number);
  
      for (let i = 0; i < parentParts.length; i++) {
        if (parentParts[i] !== childParts[i]) {
          return false; // No es hijo
        }
      }
  
      return childParts.length > parentParts.length; // El hijo tiene más niveles
    }

    checkIfDataLoaded(): any {
      if (this.planifEstrategica && this.elementosTabla) {
        this.combinePlanifEstrategicaAndElementos();
      }
    }
  
      /** ===  seleccion de color sigla magin  */
      getColorElemento(idMeto: number | null): string {
        if (idMeto == null) {
            return '#FDC82F'; 
        }
        const color = this.metoElementoData.find((compo: any) => compo.nivel === idMeto);
      
      
        return color? `#${color?.color}` : '#000000';
      }

      getColorIndicador(idPadreElemento: number): string {
        if (idPadreElemento == null) {
          return '#000000'; 
      }
      const padre =this.elementosTabla.find((compo: any) => compo.id_proy_elemento === idPadreElemento);
      
      const color = this.metoElementoData.find((compo: any) => compo.nivel === padre.id_proy_elem_padre);
      
      this.color=`#${color?.color}`;
      return color? `#${color?.color}` : '#000000';
      }
      
      getSiglaElemento( idMeto:number): string {
        if (idMeto == null) {
          return 'IN'; 
      }
      const sigla = this.metoElementoData.find((compo: any) => compo.nivel === idMeto);
      
      return sigla? sigla.sigla : 'IN';
      }
        // Método para calcular el margen dinámico (espaciado)
      getMargin(planifEstr: any): string {
      if(planifEstr.tipo== 'Elemento'){
        switch (planifEstr.id_meto_elemento) {
          case 1: return '0';      // Sin margen adicional
          case 2: return '40px';   // Espaciado medio
          case 3: return '80px';   // Espaciado más amplio  // Espaciado al final
          default: return '120px';     // Por defecto, sin margen
        }
      
      }else{
      return '120px'
      }
      }

    // ======= ======= ======= ======= ======= ======= =======  ======= =======
    getCodigoPadre(id_meto:number):string{
      const codigoPadre= this.combinedData.find(index=>index.id_proy_elemento== id_meto);
        return codigoPadre? codigoPadre.codigo : null;
      }

    private tieneHijos(elemento: any, combinedData: any[]): boolean {
      if (!elemento || !elemento.codigo) {
        console.error('Elemento inválido o sin código.');
        return false;
      }
  
      // Separar el código del elemento en niveles jerárquicos
      const codigoActual = elemento.codigo.split('.').map(Number);
  
      // Buscar si algún elemento tiene este código como prefijo
      return combinedData.some(el => {
        const codigoComparado = el.codigo.split('.').map(Number);
        return codigoComparado.length > codigoActual.length &&
          this.esPrefijo(codigoActual, codigoComparado);
      });
    }
    private esPrefijo(codigoPadre: number[], codigoHijo: number[]): boolean {
      return codigoPadre.every((nivel, index) => nivel === codigoHijo[index]);
    }

    private esHijo(codigoPadre: number[], codigoHijo: number[]): boolean {
      // Un hijo debe tener más niveles y coincidir en todos los niveles del padre
      if (codigoHijo.length <= codigoPadre.length) {
        return false;
      }
  
      return codigoPadre.every((nivel, index) => nivel === codigoHijo[index]);
    }

    deleteElemento(elemento: any): void {
      if (!elemento) {
        alert('No hay un elemento seleccionado para eliminar.');
        console.warn('Elemento no válido para eliminación.');
        return;
      }
  
      // Validar si el elemento tiene hijos activos
      if (this.tieneHijos(elemento, this.combinedData)) {
        alert('No se puede eliminar este elemento porque tiene hijos activos.');
        console.warn('El elemento tiene hijos activos y no puede ser eliminado.');
        return;
      }
  
      // Proceder con la eliminación
      this.proyElementosService.deleteElemento(elemento.id_proy_elemento).subscribe(
        (data) => {
          this.combinedData = this.combinedData.filter(el => el !== elemento);
          alert('Elemento eliminado con éxito.');
        },
        (error) => {
          console.error('Error al eliminar el elemento:', error);
          alert('Error al eliminar el elemento.');
        }
      );
    }

    deleteIndicador(indicador: any): void {
      if (!indicador) {
        alert('No hay un indicador seleccionado para eliminar.');
        console.warn('Indicador no válido para eliminación.');
        return;
      }
  
      // Validar si el indicador tiene hijos activos
      if (this.tieneHijos(indicador, this.combinedData)) {
        alert('No se puede eliminar este indicador porque tiene hijos activos.');
        console.warn('El indicador tiene hijos activos y no puede ser eliminado.');
        return;
      }
  
      // Proceder con la eliminación
      this.servIndicador.deleteIndicador(indicador.id_proy_indicador).subscribe(
        (data) => {
          this.combinedData = this.combinedData.filter(el => el !== indicador);
          alert('Indicador eliminado con éxito.');
        },
        (error) => {
          console.error('Error al eliminar el indicador:', error);
          alert('Error al eliminar el indicador.');
        }
      );
    }
  
    // Método para eliminar la planificación estratégica con validación de hijos activos
    deletePlanificacionEstrategica() {
      if (!this.planifEstrategicaSelected) {
        console.warn('No hay un elemento seleccionado para eliminar');
        return;
      }
  
      // Validar si se puede eliminar el elemento seleccionado usando el código
      const validationResult = this.canDeleteElementByCode(this.planifEstrategicaSelected, this.combinedData);
  
      if (!validationResult.canDelete) {
        // Si no se puede eliminar, mostrar el mensaje de advertencia
        alert(validationResult.message);
        return;
      }
  
      // Proceder con la eliminación según el tipo de elemento
      if (this.planifEstrategicaSelected.id_proy_indicador) {
        this.servIndicador.deleteIndicador(this.planifEstrategicaSelected.id_proy_indicador).subscribe(
          (data) => {
            this.resetSelection();
            this.getPlanifEstrategica();
            this.loadData();
          },
          (error) => {
            console.error('Error al eliminar el Indicador:', error);
            alert('Error al eliminar el indicador');
          }
        );
      this.servIndicadorAvance.deleteIndicadorAvanceByIndicador(this.planifEstrategicaSelected.id_proy_indicador).subscribe();
      } else if (this.planifEstrategicaSelected.id_proy_elemento) {
        this.proyElementosService.deleteElemento(this.planifEstrategicaSelected.id_proy_elemento).subscribe(
          (data) => {
            this.resetSelection();
            this.ngOnInit();
            alert('Elemento eliminado con éxito.');
          },
          (error) => {
            console.error('Error al eliminar el Elemento:', error);
            alert('Error al eliminar el elemento');
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
      this.headerDataNro01=0;
      this.headerDataNro02=0;
      this.headerDataNro03=0;
      this.headerDataNro04=0;
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
      this.ValidateComponente();

      if (this.modalAction === "add") {
        this.addIndicador();
      } else if (this.modalAction === "edit") {
        this.editIndicador();
      }
      this.closeModal();
      this.ngOnInit();
      this.loadData();
    }
    getIdPadreByCodig(codigo: any): any {
      const elemento = this.elementosTabla.find((item: any) => item.codigo === codigo);
      return elemento ? elemento.id_proy_elemento : 1;
    }
  
    // ======= ======= ======= ======= =======
    onSubmitElemento(form: NgForm): void {
      if (form.valid) {
        const elemento = {
          id_proyecto: this.idProyecto,
          id_meto_elemento: this.id_proy_elem_padre,
          id_proy_elem_padre:this.getIdPadreByCodig(this.selectedParentCodigo),
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
              form.resetForm(); // Limpia el formulario
              this.ngOnInit();
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
              form.resetForm(); // Limpia el formulario
              this.ngOnInit();
            },
            (error) => {
              console.error('Error al editar elemento:', error);
            }
          );
        }
  
        // Cerrar modal después de la acción
        this.closeModal();
      }
      this.ngOnInit();
    }
// ======= ======= ======= ======= ======= ======= ======= ======= =======
// ============== INDICADOR AVANCE - PROY_INDICADOR_AVANCE  ==============
// ======= ======= ======= ======= ======= ======= ======= ======= =======
    // ======= ======= NGMODEL VARIABLES GENERALES ======= =======
    indicadorAvance: any[] = [];

      // Esta función debe llamarse cuando se selecciona un indicador
      setSelectedIndicador(indicador: any) {
        this.planifEstrategicaSelected = indicador;
      }
    // ======= NGMODEL VARIABLES SECTION INDICADOR AVANCE ======= 
        //modalTitleInAvance: string = "";
        modalActionInAvance: string = "";
        
        id_proy_indica_avance: any = "";
        //id_proy_indicador: any = "";
        fecha_reportar: any = "";
        valor_esperado: any = "";
        fecha_hora_reporte: any = "";
        id_persona_reporte: any = "";
        valor_reportado: number = 0;
        comentarios: any = "";
        ruta_evidencia: any = "";

        inAvance_persona_registro: any = "";
        //inAvance_fecha_registro: any = ""; 
    // ======= ======= VALDIATE FUNCTIONS SECTION ======= =======
        valValorEsperado: any = true;
        ValidateValorEsperado() {
          this.valValorEsperado = true;
          const valor = parseFloat(this.valor_esperado);
          if (isNaN(valor) || valor < 0) {
            this.valValorEsperado = false;
          }
        }
        valComentarios: any = true;
        ValidateComentarios(){
          this.valComentarios = true;
          if((!this.comentarios)||(this.comentarios.length >= 255)){
            this.valComentarios = false;
          }
        }
    // ======= ======= OPEN MODALS FUN ======= =======
        //private modalRef: NgbModalRef | null = null;
        openModalIndicadorAvance(content: TemplateRef<any>) {
          // Asegurarnos de que tenemos un indicador seleccionado
          if (!this.planifEstrategicaSelected?.id_proy_indicador) {
            alert('Por favor seleccione un indicador primero');
            return;
          }
          
          this.initIndicadorAvanceModel();
          // Asignar el id_proy_indicador del indicador seleccionado
          this.id_proy_indicador = this.planifEstrategicaSelected.id_proy_indicador;
          
          this.modalRef = this.modalService.open(content, { size: 'xl' });
        }
          closeModalIndicadorAvance() {
          if (this.modalRef) {
            this.modalRef.close(); 
            this.modalRef = null;
            }
          }    
    // ======= ======= INIT INDICADOR AVANCE MODEL ======= =======
        initIndicadorAvanceModel() {
          //this.modalTitleInAvance = "";

          this.id_proy_indica_avance = 0;
          this.id_proy_indicador = "";
          this.fecha_reportar = "";
          this.valor_esperado = "";
          this.fecha_hora_reporte = null;
          this.id_persona_reporte = "";
          this.valor_reportado = 0;
          this.comentarios = "";
          this.ruta_evidencia = null;

          this.inAvance_persona_registro = "";
          //this.inAvance_fecha_registro = "";
          }
    // ======= ======= GET INDICADOR AVANCE ======= =======
        getIndicadorAvance() {
          this.servIndicadorAvance.getIndicadoresAvanceById(this.idProyecto).subscribe(
            (data) => {
              this.indicadorAvance = (data[0].dato)?(data[0].dato):([]);
            },
            (error) => {
              console.error(error);
            }
          );
        }
    // ======= ======= INIT ADD INDICADOR AVANCE ======= =======
        initAddIndicadorAvance(modalScope: TemplateRef<any>) {
          if (!this.planifEstrategicaSelected?.id_proy_indicador) {
            alert('Por favor seleccione un indicador primero');
            return;
          }
        
          this.initIndicadorAvanceModel();
          this.modalActionInAvance = "add";
          this.openModalIndicadorAvance(modalScope);
        }     
    // ======= ======= ADD INDICADOR AVANCE ======= =======
    addIndicadorAvance() {
      // Validar que tenemos todos los campos requeridos
      if (!this.fecha_reportar || !this.valor_esperado || !this.comentarios) {
        alert('Por favor complete todos los campos requeridos');
        return;
      }
      
      const objIndicadorAvance = {
        p_id_proy_indica_avance: 0,
        p_id_proy_indicador: this.id_proy_indicador,
        p_fecha_reportar: this.fecha_reportar,
        p_valor_esperado: this.valor_esperado,
        p_fecha_hora_reporte: null,
        p_id_persona_reporte: parseInt(this.idPersonaReg, 10),
        p_valor_reportado: 0,
        p_comentarios: this.comentarios,
        p_ruta_evidencia: null
      };

      this.servIndicadorAvance.addIndicadorAvance(objIndicadorAvance).subscribe({
        next: (data) => {
          alert('Avance agregado exitosamente');
          this.cargarIndicadoresAvance();
          this.getIndicadorAvance();
          this.closeModalIndicadorAvance();
        },
        error: (error) => {
          console.error('Error al guardar los datos:', error);
          alert('Error al guardar los datos');
        }
      });
    }

    // ======= ======= ======= ======= VALIDATION INDICADOR AVANCE ======= =======
    onSudmidIndicadorAvance(): void {
      // Validar los campos
      this.ValidateComentarios();
      this.ValidateValorEsperado();
    
      if (!this.fecha_reportar) {
        alert('La fecha es requerida');
        return;
      }
    
      if (this.valComentarios && this.valValorEsperado) {
        this.addIndicadorAvance();
      } else {
        alert('Por favor corrija los errores en el formulario');
      }
    }
    
  
  }