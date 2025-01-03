// Importacion de modulos y componentes Principales
import { Component, OnInit, TemplateRef, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ProyectoService } from '../../services/proyectoData.service';

// ======= ======= ======= SERVICES SECTION ======= ======= =======
import { PlanifEstrategicaService } from '../../servicios/planifEstrategica';
import { servicios } from "../../servicios/servicios";
import { servAprendizaje } from "../../servicios/aprendizajes";
import { servIndicador } from '../../servicios/indicador';
import { servInstCategorias } from '../../servicios/instCategoria';
import { servIndicadorAvance } from '../../servicios/indicadorAvance';
import { ElementosService } from '../../servicios/elementos';
import { MetoElementosService } from '../../servicios/metoElementos';
import { servActAvance } from '../../servicios/actividadAvance';
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
  combinedData: any[] = [];

  periodos: any;
  periodosForm: any; // Add this line to define periodosForm
  editPeriodo = { periodo: '', valorEsperado: 0 }; // Valores iniciales
  metoElementoData: any[] = [];
  datosAliados: any;
  editAvance: {
    id_proy_indica_avance: any,
    id_proy_indicador: any,  // Asegúrate de que el campo correcto sea id_proy_indicador
    fecha_reportar: any,  // Asegúrate de que se cargue correctamente
    fecha_hora_reporte: any,
    valor_reportado: any,  // Eliminar símbolo de dólar y coma si la hay
    valor_esperado: any,  // Lo mismo para valor_esperado
    id_persona_reporte: any,
    comentarios: any,  // Cargar comentarios si existen
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
  // Variables de Selección
  //com/nentes: any[] = [];
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
    protected proyectoService: ProyectoService,
    protected cdr: ChangeDetectorRef,
    protected ServPlanifEstrategica: PlanifEstrategicaService,
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
      // this.getParametricas();
      // this.getPlanifEstrategica();
      this.initPlanifEstrategicaModel();
      this.planifEstrategicaSelected = null
    }

  ngOnInit(): void {
    this.loadMetoElemento();
    this.getParametricas();
    this.getPlanifEstrategica();
  //  this.cargarIndicadoresAvance();
  
    this.grtElementos();
    this.loadData();
  }
  getParametricas() {
      // ======= GET METO ELEMENTOS =======
      // this.servApredizaje.getMetoElementos(this.idProyecto).subscribe(
      //   (data) => {
      //     this.componentes = data[0].dato;
      //   },
      //   (error) => {
      //     console.error(error);
      //   }
      // );
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
    // ======= ======= GET INDICADORES ======= =======
    getPlanifEstrategica() {
      this.servIndicador.getIndicadorByIdProy(this.idProyecto).subscribe(
        (data: any) => {
          this.planifEstrategica = (data[0].dato) ? (data[0].dato) : ([]);
          this.totalLength = this.planifEstrategica.length;
          this.countHeaderData();
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
        console.log('meto elementos cargados:', this.metoElementoData);
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
    console.log('Componente válido:', this.valComponente);
  }



  valIndicador: any = true;
  ValidateIndicador() {
    this.valIndicador = true;
    if (!this.indicador || this.indicador.length > 100) {
      console.log("Indicador inválido");
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
  // ======= ======= ======= ======= ======= ======= =======  ======= =======

  // ======= ======= GET PARAMETRICAS ======= =======
  
  isEditing: boolean = false; // Indica si el formulario está en modo de edición
  selectedIdProyIndicador: number | null = null; // Almacena el ID seleccionado

  cargarIndicadoresAvance() {
   
    this.selectedIdProyIndicador; // Almacena el ID seleccionado
    this.isEditing = true; // Activa el modo de edición

    console.log('Cargando datos para el ID seleccionado:', this.selectedIdProyIndicador);

    this.servIndicadorAvance.getIndicadoresAvanceById(this.selectedIdProyIndicador).subscribe(
      (response: any) => {
        this.datosAliados = response[0]?.dato || [];
        console.log('Datos obtenidos:', this.datosAliados);

        // Extraer los valores necesarios
        this.planifIDindAvance = this.datosAliados.map((item: any) => item.id_proy_indica_avance);
        this.planifPeriodofecha = this.datosAliados.map((item: any) => item.fecha_reportar);
        this.planifMetaEsperada = this.datosAliados.map((item: any) => item.valor_esperado);
        console.log('IDs de avance:', this.planifIDindAvance);
      },
      (error) => {
        console.error('Error al cargar los datos:', error);
      }
    );
  }

  openEditPeriodoModal(content: any, id: number) {
    const avanceData = this.datosAliados.find(p => p.id_proy_indica_avance === id);

    if (avanceData) {
      this.editAvance = {
        id_proy_indica_avance: avanceData.id_proy_indica_avance,
        id_proy_indicador: avanceData.id_proy_indicador || null,  // Asegúrate de que el campo correcto sea id_proy_indicador
        fecha_reportar: avanceData.fecha_reportar || '',  // Asegúrate de que se cargue correctamente
        fecha_hora_reporte: new Date().toISOString(),
        valor_reportado: parseFloat(avanceData.valor_reportado.replace('$', '').replace(',', '')) || 0,  // Eliminar símbolo de dólar y coma si la hay
        valor_esperado: parseFloat(avanceData.valor_esperado.replace('$', '').replace(',', '')) || 0,  // Lo mismo para valor_esperado
        id_persona_reporte: avanceData.id_persona_reporte || null,
        comentarios: avanceData.comentarios || '',  // Cargar comentarios si existen
        ruta_evidencia: avanceData.ruta_evidencia || '',  // Cargar la ruta de evidencia si existe
      };
      console.log('Datos de avance a cargar al formulario:', this.editAvance);

    } else {
      console.warn('No se encontraron datos para el ID especificado:', id);
    }

    this.modalService.open(content, { size: 'lg', backdrop: 'static' });
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

    // Lógica para guardar los cambios
    console.log('Datos editados:', avanceEditado);

    // Llamar al servicio para actualizar los datos
    this.servIndicadorAvance.editIndicadorAvance(avanceEditado).subscribe(
      (response) => {
        console.log('Actualización exitosa:', response);

      },
      (error) => {
        console.error('Error al actualizar:', error);
      }
    );
    this.cargarIndicadoresAvance();
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
    this.selectedIdProyIndicador = planifEstrategicaSel.id_proy_indicador || planifEstrategicaSel.id_proy_elemento;

    console.log('ahora esl id  par avance es :', this.selectedIdProyIndicador)
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
  // ======= ======= ======= ======= ======= ======= =======  ======= =======
  // Tipo botones de la tabla de planifEstrategica


  // Método para obtener la sigla







  // getColor(id_proy_elem_padre: number): string {

  //   const color = this.elementosMap[id_proy_elem_padre]?.color;
  //   return color ? color : '#000000';
  // }


  getElementoNombre(id_proy_elem_padre: number): string {
    const elemento = this.metoElementoData.find(comp => comp.nivel === id_proy_elem_padre);
    return elemento ? elemento.meto_elemento : 'Nombre no disponible';
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

    console.log('Tipo recibido en getValidParents:', tipo);
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
    // [1, 0, 0, 0] es el valor predeterminado

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

    console.log('Elementos RE filtrados:', reElements);

    // Reducir para encontrar el último código válido en el tercer nivel (nivel 2 del array)
    const lastRE = reElements.reduce((max, el) => {
      const currentCodeArray = el.codigo.split('.').map(Number);
      if (currentCodeArray[2] > max[2]) {
        return currentCodeArray; // Actualizamos si el nivel 3 es mayor
      }
      return max;
    }, [...parentCodeArray]); // Inicializamos con el código del padre convertido a números

    console.log('Último código RE encontrado:', lastRE);

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
    console.log('Comparando:', codigoHijo, codigoPadre);
    for (let i = 0; i < codigoPadre.length; i++) {
      console.log(`Comparando nivel ${i}: ${codigoHijo[i]} con ${codigoPadre[i]}`);
      if (codigoHijo[i] > codigoPadre[i]) {
        console.log('Movimiento no permitido: un hijo no puede estar encima de su padre.');
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
    this.inst_categoria_2 = "";
    this.inst_categoria_3 = "";

    this.sigla = null;
    this.color = null;

    this.valComponente = true;



  }
  // ======= ======= ======= ======= ======= ======= =======  ======= =======

  grtElementos() {
    this.proyElementosService.getElementosByProyecto(this.idProyecto).subscribe(
      (data: any) => {
        console.log('Elementos:', data[0].dato);
        this.elementosTabla = (data[0].dato) ? (data[0].dato) : [];
        console.log('Elementos:', this.elementosTabla);
      }
    )
  }

  checkIfDataLoaded(): any {
    if (this.planifEstrategica && this.elementosTabla) {
      this.combinePlanifEstrategicaAndElementos();
    }
  }

/** ===  seleccion de color sigla magin  */
getColorElemento(idMeto: number | null): string {
  if (idMeto == null) {
      return '#000000'; 
  }
  const color = this.metoElementoData.find((compo: any) => compo.nivel === idMeto);
  console.log('El color meto elemento es:', color?.color);
  return color? `#${color?.color}` : '#000000';
}
getColorIndicador(idPadreElemento: number): string {
  if (idPadreElemento == null) {
    return '#000000'; 
}
const padre =this.elementosTabla.find((compo: any) => compo.id_proy_elemento === idPadreElemento);

const color = this.metoElementoData.find((compo: any) => compo.nivel === padre.id_proy_elem_padre);


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
    console.log('Datos en planifEstrategicaMapped antes de ser combinados:',  this.planifEstrategica);


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
      color: this.getColorElemento(item.id_meto_elemento),
      sigla:this.getSiglaElemento(item.id_meto_elemento),
      peso: item.peso,



   //   sigla: this.getSigla(item.id_proy_elem_padre), // Asegúrate de que `getSigla` devuelve correctamente el valor para `RE`.
    }));

    console.log('Datos en elementosTabla antes de ser combinados:', elementosTablaMapped);

    // Combinar ambas tablas
    this.combinedData = [...planifEstrategicaMapped, ...elementosTablaMapped];

    console.log('Datos combinados:', this.combinedData);

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

    console.log('Datos combinados y ordenados:', this.combinedData);
  }





  // ======= ======= ======= ======= ======= ======= =======  ======= =======
  initAddPlanifEstrategica(modalScope: TemplateRef<any>, id_proy_elem_padre?: number): void {
    this.initPlanifEstrategicaModel();

    this.modalAction = "add";
    this.modalTitle = this.getModalTitle("add");

    console.log('Iniciando proceso de añadir...');

    // Si se pasa un ID, establece el elemento automáticamente
    if (id_proy_elem_padre) {
      this.id_proy_elem_padre = id_proy_elem_padre;
      // this.color = this.getColor(id_proy_elem_padre);
      // this.sigla = this.getSigla(id_proy_elem_padre);
      this.tipo = this.getSiglaElemento(id_proy_elem_padre); 
      this.validParents = this.getValidParents(this.tipo);
      console.log('QQQQQQQQQQQQQQQ : ', this.validParents)
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
      p_id_proy_indicador: 0 || null,
      p_id_proyecto: parseInt(this.idProyecto, 10) || null,
      p_id_proy_elem_padre: this.getIdPadreByCodig(this.selectedParentCodigo) || null,
      p_codigo: this.codigo || null,
      p_indicador: this.indicador || null,
      p_descripcion: this.descripcion || null,
      p_comentario: this.comentario || null,
      p_orden: this.orden || null,
      p_linea_base: this.linea_base || null,
      p_medida: this.medida || null,
      p_meta_final: this.meta_final || null,
      p_medio_verifica: this.medio_verifica || null,
      p_id_estado: this.id_estado || null,
      p_inst_categoria_1: parseInt(this.inst_categoria_1, 10) || null,
      p_inst_categoria_2: parseInt(this.inst_categoria_2, 10) || null,
      p_inst_categoria_3: parseInt(this.inst_categoria_3, 10) || null
    };

    console.log('Objeto enviado a la API:', objIndicador); // Verifica los valores

    this.servIndicador.addIndicador(objIndicador).subscribe(
      (data) => {
        console.log('Objeto enviado a la API 2 :', objIndicador); // Verifica los valores
        console.log('Elemento añadido con éxito', data);
        this.getPlanifEstrategica();
        this.loadData()
      },
      (error) => {
        console.error('Error al guardar los datos:', error);
      }
    );
    this.loadData()
  }

  // ======= ======= ======= ======= ======= ======= =======  ======= =======

getCodigoPadre(id_meto:number):string{

  return null;
}
  initEditPlanifEstrategica(planifEstrategicaOGOERE: TemplateRef<any>, planifEstrategicaIN: TemplateRef<any>) {
    
    if (!this.planifEstrategicaSelected) {
      console.error("No hay un elemento seleccionado para editar.");
      return;
    }
    this.initPlanifEstrategicaModel();

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
    console.log('QQQQQQQQQQQQQQQ : ', this.validParents)
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
  // ======= ======= ======= ======= ======= ======= =======  ======= =======
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
      
      p_id_proy_elemento: this.planifEstrategicaSelected.id_proy_elemento || null,
      p_id_proyecto: this.planifEstrategicaSelected.id_proyecto || null,
      p_id_meto_elemento: this.id_proy_elem_padre || null,
      p_id_proy_elem_padre: this.getIdPadreByCodig(this.selectedParentCodigo),//this.planifEstrategicaSelected.id_proy_elem_padre || null,
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
  initDeletePlanifEstrategica(modalScope: TemplateRef<any>) {
    this.initPlanifEstrategicaModel();

    this.id_proy_indicador = this.planifEstrategicaSelected.id_proy_indicador;

    this.openModal(modalScope);
    this.ngOnInit();
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
  /**
   * Método para validar si un elemento tiene hijos.
   * Un elemento con hijos no puede ser eliminado.
   */
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

  /**
   * Verifica si un código es hijo de otro.
   */
  private esHijo(codigoPadre: number[], codigoHijo: number[]): boolean {
    // Un hijo debe tener más niveles y coincidir en todos los niveles del padre
    if (codigoHijo.length <= codigoPadre.length) {
      return false;
    }

    return codigoPadre.every((nivel, index) => nivel === codigoHijo[index]);
  }

  /**
   * Método para eliminar un elemento, validando si tiene hijos.
   */
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
    console.log('Eliminando Elemento:', elemento);
    this.proyElementosService.deleteElemento(elemento.id_proy_elemento).subscribe(
      (data) => {
        console.log('Elemento eliminado con éxito:', data);
        this.combinedData = this.combinedData.filter(el => el !== elemento);
        alert('Elemento eliminado con éxito.');
      },
      (error) => {
        console.error('Error al eliminar el elemento:', error);
        alert('Error al eliminar el elemento.');
      }
    );
  }

  /**
   * Método para eliminar un indicador, validando si tiene hijos.
   */
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
    console.log('Eliminando Indicador:', indicador);
    this.servIndicador.deleteIndicador(indicador.id_proy_indicador).subscribe(
      (data) => {
        console.log('Indicador eliminado con éxito:', data);
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
      console.log('Eliminando Indicador con ID:', this.planifEstrategicaSelected.id_proy_indicador);
      this.servIndicador.deleteIndicador(this.planifEstrategicaSelected.id_proy_indicador).subscribe(
        (data) => {
          console.log('Indicador eliminado con éxito', data);
          this.resetSelection();
          this.getPlanifEstrategica();
          this.loadData();
        },
        (error) => {
          console.error('Error al eliminar el Indicador:', error);
          alert('Error al eliminar el indicador');
        }
      );
    } else if (this.planifEstrategicaSelected.id_proy_elemento) {
      console.log('Eliminando Elemento con ID:', this.planifEstrategicaSelected.id_proy_elemento);
      this.proyElementosService.deleteElemento(this.planifEstrategicaSelected.id_proy_elemento).subscribe(
        (data) => {
          console.log('Elemento eliminado con éxito', data);
          this.resetSelection();
          this.ngOnInit();
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
    // Inicializamos los contadores
    this.headerDataNro01 = 0;
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

    this.ValidateComponente();


    if (this.modalAction === "add") {
      this.addIndicador();
      console.log('Añadiendo...');
    } else if (this.modalAction === "edit") {
      this.editIndicador();
      console.log('Editando...');
    }
    this.closeModal();
    console.log('Cerrando...');
    this.ngOnInit();
    this.loadData();
  }
  getIdPadreByCodig(codigo: any): any {
    console.log(' **** el coidgo enviado es  para el indicador es  ***:',codigo)
    const elemento = this.elementosTabla.find((item: any) => item.codigo === codigo);
   // console.log('el ide del elemneto que se va a retornar es : ',elemento.id_proy_elemento)
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
      console.log('oooobbbjetooo elemnto a añadir ,', elemento)
      // Identificar si es una acción de agregar o editar
      if (this.modalAction === "add") {
        // Agregar nuevo elemento
        this.proyElementosService.addElemento(elemento).subscribe(
          (response) => {
            console.log('Elemento añadido exitosamente:', response);
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
            console.log('Elemento editado exitosamente:', response);
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
      console.log('Cerrando...');
    }
    this.ngOnInit();
  }


}