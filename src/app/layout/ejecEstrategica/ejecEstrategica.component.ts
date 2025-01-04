import { Component, OnInit, TemplateRef, EventEmitter, Output} from '@angular/core';
import { forkJoin } from 'rxjs';
import { routerTransition } from '../../router.animations';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ProyectoService } from '../../services/proyectoData.service';

// ======= ======= SERVICES SECTION ======= ======= 
import { servIndicador} from '../../servicios/indicador';
import {servIndicadorAvance} from '../../servicios/indicadorAvance';
import {servInstCategorias} from '../../servicios/instCategoria';
import { ElementosService } from '../../servicios/elementos';
import {PlanifEstrategicaService} from '../../servicios/planifEstrategica';
import {MetoElementosService} from '../../servicios/metoElementos';
import { servActAvance } from '../../servicios/actividadAvance';
import { servicios } from "../../servicios/servicios";
// ======= ======= ======= ======= ======= ======= =======  ======= =======
@Component({
  selector: 'app-ejec-estrategica',
  templateUrl: './ejecEstrategica.component.html',
  styleUrls: ['./ejecEstrategica.component.scss'],
  animations: [routerTransition()]
})
// ======= ======= ======= ======= ======= ======= =======  ======= =======
export class EjecEstrategicaComponent implements OnInit {
  // ======= ======= VARIABLES SECTION ======= =======
  ejecEstrategica: any[] = [];
  // ======= ======= VARIABLES PAGINACION ======= =======
    mainPage = 1;
    mainPageSize = 10;
    totalLength = 0;
    
  // ======= ======= CONSTRUCTOR SECTION ======= =======
  constructor(
    private modalService: NgbModal,
    private proyectoService: ProyectoService,
    private servIndicador: servIndicador,
    private servIndicadorAvance: servIndicadorAvance,
    private servInstCategorias: servInstCategorias,
    private planifEstrategicaService: PlanifEstrategicaService,
    private metoElementosService: MetoElementosService,
    private servActAvance: servActAvance,
    protected proyElementosService: ElementosService,
    private servicios: servicios
  ) {}


  // ======= ======= HEADER SECTION  "NO TOCAR"======= =======
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
      this.getEjecEstrategica();
      this.initEjecEstrategicaModel();
      this.ejecEstrategicaSelected = null;
    }
  // ======= ======= HEADER SECTION  "NO TOCAR"======= =======
  // ======= ======= ======= CONTADOR =======  ======= =======
      headerDataNro01: any = 0;
      headerDataNro02: any = 0;
      headerDataNro03: any = 0;
      headerDataNro04: any = 0;
  // ======= ======= NGMODEL VARIABLES SECTION ======= =======
      modalAccion: any = '';
      modalTitle: any = '';
      //Variables PROY_ELEMENTO "Planificación Estratégica"
      id_proy_elemento: any = "";
      elemento: any = "";
      nivel: any = "";
      idp_estado: any = "";
      peso: any = "";
      // VARIABLES PROY_INDICADOR 
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

    // variables 
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
        planifIDindAvance: any[] = [];
        planifPeriodofecha: any[] = [];
        planifMetaEsperada: any[] = [];
    // Variables de Selección
      componentes: any[] = [];
      ejecCategoria: any[] = [];
      ejecSubCategoria: any[] = [];
      ejecTipoCategoria: any[] = [];  
      ejecEstrategicaAvances: any[] = [];

      elementosTabla: any[] = [];
      planifEstrategica: any[] = [];

  // ======= ======= INIT VIEW FUN ======= =======
  ngOnInit(): void {
    this.getParametricas();
    this.getEjecEstrategica();
    this.getIndicadoresAvance();
    this.loadMetoElemento();
    this.getParametricas(); 
    this.loadData();   
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
  getParametricas() {
    this.servInstCategorias.getCategoriaById(1).subscribe(
      (data: any) => {
        this.ejecCategoria = data[0]?.dato || [];
      },
      (error) => {
        console.error("Error al cargar categorías:", error);
      }
    );

    this.servInstCategorias.getCategoriaById(2).subscribe(
      (data: any) => {
        this.ejecSubCategoria = data[0]?.dato || [];
      },
      (error) => {
        console.error("Error al cargar categorías:", error);
      }
    );

    this.servInstCategorias.getCategoriaById(3).subscribe(
      (data: any) => {
        this.ejecTipoCategoria = data[0]?.dato || [];
      },
      (error) => {
        console.error("Error al cargar categorías:", error);
      }
    );
  }
  loadMetoElemento() {
    this.metoElementosService.getMetoElementosByMetodologia(2).subscribe(
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
      },
      (error) => {
        console.error(error);
      }
    );
  }
  
 
  // ======= ======= ======= ======= ======= ======= =======  ======= =======        
  private modalRefs: NgbModalRef[] = [];
    
    openModal(content: TemplateRef<any>) {
      const modalRef = this.modalService.open(content, { size: 'xl' });
      this.modalRefs.push(modalRef);
    }

    closeModal() {
      if (this.modalRefs.length > 0) {
        const modalRef = this.modalRefs.pop();
        modalRef?.close();
      }
      if (this.modalRef) {
        this.modalRef.close();
        this.modalRef = null;
      }
    }

  // ======= ======= ======= ======= ======= ======= =======  ======= =======
  get ejecEstrategicaTable() {
    const start = (this.mainPage - 1) * this.mainPageSize;
    return this.ejecEstrategica.slice(start, start + this.mainPageSize);
  }
  // ======= ======= ======= ======= ======= ======= =======  ======= =======
  ejecEstrategicaSelected: any = null;
  checkboxChanged(ejecEstrategicaSel: any) {
    this.ejecEstrategica.forEach(ejecEstrategica => {
      if (ejecEstrategica.id_proy_indicador === ejecEstrategicaSel.id_proy_indicador) {
       if(ejecEstrategicaSel.selected){
        this.ejecEstrategicaSelected = ejecEstrategicaSel;
        }
        else{
          this.ejecEstrategicaSelected = null;
        }
      }
      else{
        ejecEstrategica.selected = false;
      }
    }
    )
  }
  // ======= ======= ======= ======= ======= ======= =======  ======= =======
  onSelectionChange() {
    const selectedComponente = this.componentes.find(comp => comp.id_meto_elemento == this.id_proy_elem_padre);
    if (selectedComponente) {
        this.color = selectedComponente.color;
        this.sigla = selectedComponente.sigla;
    }
  }
 
  // ======= ======= ======= ======= ======= ======= =======  ======= =======

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
    
    getElementoNombre(id_proy_elem_padre: number): string {
      const elemento = this.metoElementoData.find(comp => comp.nivel === id_proy_elem_padre);
      return elemento ? elemento.meto_elemento : 'Nombre no disponible';
    }

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

    getUltimoAvance(idProyIndicador: number): any {
    if (!this.ejecEstrategicaAvances) return null;
  
  const avancesIndicador = this.ejecEstrategicaAvances.filter(
    avance => avance.id_proy_indicador === idProyIndicador
  );
  
  if (avancesIndicador.length === 0) return null;
  
  // Ordenar por fecha descendente
  return avancesIndicador.sort((a, b) => 
    new Date(b.fecha_reportar).getTime() - new Date(a.fecha_reportar).getTime()
  )[0];
}

  sortEjecEstrategicaByCodigo() {
    if (this.ejecEstrategica && this.ejecEstrategica.length > 0) {
      this.ejecEstrategica.sort((a, b) => {
        // Convertir códigos a minúsculas para comparación consistente
        const codigoA = a.codigo?.toLowerCase() || '';
        const codigoB = b.codigo?.toLowerCase() || '';
        return codigoA.localeCompare(codigoB, undefined, {numeric: true, sensitivity: 'base'});
      });
    }
  }

  // ======= ======= ======= ======= ======= ======= =======  ======= =======
  // GRAFICO PARA AVANCE PER Y AVANCE
  
  calculateAvancePer(ejecEstrategica: any): number {
    const index = this.ejecEstrategica.indexOf(ejecEstrategica);
    const valorReportado = this.indicadoresAvance[index]?.valor_reportado || 0;
    const valorEsperado = this.indicadoresAvance[index]?.valor_esperado || 0;
    
    if (valorEsperado <= 0) return 0;
    
    // Calculate percentage and round to 1 decimal place
    const percentage = Math.min(Math.round((valorReportado / valorEsperado) * 1000) / 10, 100);
    return isNaN(percentage) ? 0 : percentage;
  }
  
  calculateAvanceTotal(ejecEstrategica: any): number {
    const index = this.ejecEstrategica.indexOf(ejecEstrategica);
    const valorReportado = this.indicadoresAvance[index]?.valor_reportado || 0;
    const metaFinal = ejecEstrategica.meta_final || 0;
    
    if (metaFinal <= 0) return 0;
    
    // Calculate percentage and round to 1 decimal place
    const percentage = Math.min(Math.round((valorReportado / metaFinal) * 1000) / 10, 100);
    return isNaN(percentage) ? 0 : percentage;
  }

  
    
  // ======= ======= INIT EJECUCION ESTRATEGICA NGMODEL ======= =======
  initEjecEstrategicaModel() {
    //this.modalTitle = "";

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
  }

  // ======= ======= ======= ======= ======= ======= =======  ======= =======
    // ======= ======= GET INDICADORES ======= =======
    getEjecEstrategica() {
      this.servIndicador.getIndicadorByIdProy(this.idProyecto).subscribe(
        (data) => {
          if (data && data[0]?.dato) {
            this.ejecEstrategica = data[0].dato;
            this.sortEjecEstrategicaByCodigo();
            this.totalLength = this.ejecEstrategica.length;
            this.countHeaderData();
          } else {
            console.error('No data received from the service');
            this.ejecEstrategica = [];  // Asegurarse de que no esté null o undefined
          }
        },
        (error) => {
          console.error(error);
          this.ejecEstrategica = []; // Prevenir errores si hay fallo en el servicio
        }
      );
    }
    

  // ======= ======= ======= ======= ======= ======= =======  ======= =======
  initEditEjecEstrategica(modalScope: TemplateRef<any>) {
    if (this.ejecEstrategicaSelected) {
      this.initEjecEstrategicaModel();
      
      this.id_proy_indicador = this.ejecEstrategicaSelected.id_proy_indicador;
      this.id_proyecto = this.ejecEstrategicaSelected.id_proyecto;
      this.id_proy_elem_padre = this.ejecEstrategicaSelected.id_proy_elem_padre;
      this.codigo = this.ejecEstrategicaSelected.codigo;
      this.indicador = this.ejecEstrategicaSelected.indicador;
      this.descripcion = this.ejecEstrategicaSelected.descripcion;
      this.comentario = this.ejecEstrategicaSelected.comentario;
      this.orden = this.ejecEstrategicaSelected.orden;
      this.linea_base = this.ejecEstrategicaSelected.linea_base;
      this.medida = this.ejecEstrategicaSelected.medida;
      this.meta_final = this.ejecEstrategicaSelected.meta_final;
      this.medio_verifica = this.ejecEstrategicaSelected.medio_verifica;
      this.id_estado = this.ejecEstrategicaSelected.id_estado;
      this.inst_categoria_1 = this.ejecEstrategicaSelected.inst_categoria_1;
      this.inst_categoria_2 = this.ejecEstrategicaSelected.inst_categoria_2;
      this.inst_categoria_3 = this.ejecEstrategicaSelected.inst_categoria_3;
  
      this.sigla = this.ejecEstrategicaSelected.sigla;
      this.color = this.ejecEstrategicaSelected.color;

      // Buscar el elemento padre
    this.getPlanifEstrategica();
  
      this.openModal(modalScope);
    } else {
      console.error("No se ha seleccionado ningún indicador");
    }
  }
  

  editIndicador(): void {
    const objIndicador = { ...this.ejecEstrategicaSelected };
    this.servIndicador.editIndicador(objIndicador).subscribe(
      () => {
        this.getEjecEstrategica();
      },
      (error) => {
        console.error('Error al editar el indicador:', error);
      }
    );
  }
  

  countHeaderData() {
    if (this.ejecEstrategica && Array.isArray(this.ejecEstrategica)) {
      this.headerDataNro01 = this.ejecEstrategica.length;
      this.headerDataNro02 = this.ejecEstrategica.filter((item) => item.someCondition).length;
      this.headerDataNro03 = this.ejecEstrategica.reduce((sum, item) => sum + (item.someValue || 0), 0);
      this.headerDataNro04 = this.ejecEstrategica.reduce((sum, item) => sum + (item.anotherValue || 0), 0);
    } else {
      console.error('Invalid or empty data in ejecEstrategica');
    }
  }
  

  // ======= ======= SUBMIT FORM ======= =======
  onSubmit(): void {
    if (this.modalAccion === 'edit') {
      this.editIndicador();
    }
    this.closeModal();
  }
  

   // ======= ======= ======= INDICADORES AVANCE =======  ======= =======
   // ======= ======= INDICADORES AVANCE ======= =======
indicadoresAvance: any[] = [];
indicadoresAvanceSelected: any = null;
indicadoresAvanceModel: any = {};

// Validaciones
valValorReportado = true;
valComentarios = true;

validateValorReportado() {
  this.valValorReportado = true;
  if (this.indicadoresAvanceModel.valor_reportado == null || isNaN(this.indicadoresAvanceModel.valor_reportado)) {
    this.valValorReportado = false;
  }
}

validateComentarios() {
  this.valComentarios = true;
  if (!this.indicadoresAvanceModel.comentarios || this.indicadoresAvanceModel.comentarios.length > 500) {
    this.valComentarios = false;
  }
}
convertToNumber(value: string): number {
  return parseFloat(value.replace(/[^0-9.-]+/g, ''));
}

// Cargar indicadores de avance
getIndicadoresAvance(): void {
  this.servIndicadorAvance.getIndicadoresAvance().subscribe(
    (data) => {
      if (data && data.length > 0 && data[0].dato) {
        const indicadores = data[0].dato;


        // Asegurarse de que los datos sean correctos antes de asignarlos
        this.indicadoresAvance = indicadores.map((item: any) => {

          // Verificar si los avances existen
          const ultimoAvance = item.avances?.length > 0 ? item.avances[item.avances.length - 1] : null;

          if (!ultimoAvance) {
            console.warn('No hay avances para el indicador:', item);
          }

          // Calcular los avances
          const avancePeriodo = this.calcularAvancePorcentual(item.meta_periodo, ultimoAvance?.valor_reportado || 0);
          const avanceTotal = this.calcularAvancePorcentual(item.meta_final, ultimoAvance?.valor_reportado || 0);

          // Verificar y transformar los datos correctamente
          return {
            ...item,
            periodo: item.periodo || '-',
            valor_esperado: item.valor_esperado || 0,
            progreso: ultimoAvance?.valor_reportado || item.valor_reportado || 0,
            notas: ultimoAvance?.comentarios || item.comentarios||'-',
            avance_per: avancePeriodo || item.avance_per || 0,
            avance_total: avanceTotal,
            ruta_evidencia: ultimoAvance?.ruta_evidencia || item.ruta_evidencia || null,

            // Validación extra: Verificar que los valores calculados no sean NaN
            avance_per_validado: isNaN(avancePeriodo) ? 0 : avancePeriodo,
            avance_total_validado: isNaN(avanceTotal) ? 0 : avanceTotal,
          };
        });

        console.log('Indicadores de avance procesados:', this.indicadoresAvance);
        console.log( 'mostrar solo un indicador: ', this.indicadoresAvance[0]?.ruta_evidencia);
      
      } else {
        console.error('No se recibieron datos válidos de la API');
      }
    },
    (error) => {
      console.error('Error al cargar datos:', error);
    }
  );
}



// Calcular porcentaje de avance
calcularAvancePorcentual(meta: number, actual: number): number {
  if (!meta || meta <= 0) return 0;
  return Math.min(Math.round((actual / meta) * 100), 100);
}

// Inicializar modelo de indicadores
initIndicadoresAvanceModel() {
  this.indicadoresAvanceModel = {
    id_proy_indica_avance: 0,
    id_proy_indicador: null,
    fecha_reportar: null,
    valor_esperado: null,
    fecha_hora_reporte: null,
    id_persona_reporte: this.idPersonaReg,
    valor_reportado: null,
    comentarios: '',
    ruta_evidencia: '',
  };

  this.valValorReportado = true;
  this.valComentarios = true;
}

// Añadir un nuevo avance
addIndicadorAvance() {
  const nuevoAvance = {
    p_accion: 'A1',
    ...this.indicadoresAvanceModel,
  };

  this.servIndicadorAvance.addIndicadorAvance(nuevoAvance).subscribe(
    (data) => {
      this.getIndicadoresAvance();
    },
    (error) => {
      console.error(error);
    }
  );
}

// Editar un avance existente
editIndicadorAvance() {
  const avanceEditado = {
    p_accion: 'U1',
    ...this.indicadoresAvanceModel,
  };

  this.servIndicadorAvance.editIndicadorAvance(avanceEditado).subscribe(
    (data) => {
      this.getIndicadoresAvance();
      this.indicadoresAvanceSelected = null;
    },
    (error) => {
      console.error(error);
    }
  );
}

// Inicializar edición de un avance
initEditIndicadorAvance(modalScope: TemplateRef<any>) {
  this.initIndicadoresAvanceModel();

  this.indicadoresAvanceModel = {
    ...this.indicadoresAvanceSelected,
  };

  this.openModal(modalScope);
}

// Abrir modal para añadir avance
initAddIndicadorAvance(modalScope: TemplateRef<any>) {
  this.initIndicadoresAvanceModel();
  this.modalTitle = "Añadir avance";
  this.openModal(modalScope);
}


// Variables para el elemento padre
elementoPadre: any = null;
codigoPadre: string = '';
descripcionPadre: string = '';
abuelo: any = null;
codigoAbuelo: string = '';
descripcionAbuelo: string = '';
tipoAbuelo: string = '';
siglaAbuelo: string = '';
colorAbuelo: string = '';

getPlanifEstrategica() {
  const params = {
    p_accion: 'C1',
    p_id_proyecto: this.idProyecto,
    p_id_proy_elemento: null,
    p_id_meto_elemento: null,
    p_id_proy_elem_padre: null,
    p_codigo: null,
    p_elemento: null,
    p_descripcion: null,
    p_comentario: null,
    p_nivel: null,
    p_orden: null,
    p_idp_estado: null,
    p_peso: null
  };

  this.planifEstrategicaService.getAllPlanifElements().subscribe(
    (data: any) => {
      if (data && data[0]?.dato) {
        this.procesarDatosPlanifEstrategica(data[0].dato);
      }
    },
    (error) => {
      console.error('Error al obtener datos de planificación estratégica:', error);
    }
  );
}

procesarDatosPlanifEstrategica(datos: any[]) {
  // Si tenemos un código de indicador seleccionado
  if (this.codigo) {
    // Encontrar el padre basado en el código
    this.elementoPadre = this.encontrarElementoPadre(datos, this.codigo);
    
    if (this.elementoPadre) {
      this.codigoPadre = this.elementoPadre.codigo;
      this.descripcionPadre = this.elementoPadre.descripcion;
      // Obtener detalles del abuelo
      this.abuelo = this.encontrarElementoPadre(datos, this.codigoPadre);
      if (this.abuelo) {
        this.codigoAbuelo = this.abuelo.codigo;
        this.descripcionAbuelo = this.abuelo.descripcion;
        this.tipoAbuelo = this.getElementoNombre(this.abuelo.tipo); // Supongamos que hay un campo `tipo`
        this.siglaAbuelo = this.abuelo.sigla;
        this.colorAbuelo = this.abuelo.color;
      }
    }
  }
}

encontrarElementoPadre(elementos: any[], codigoHijo: string): any {
  // Dividir el código en sus partes (ejemplo: "1.2.3.0" -> ["1", "2", "3", "0"])
  const partesCodigoHijo = codigoHijo.split('.');
  
  // Si el código tiene menos de 2 partes, no tiene padre
  if (partesCodigoHijo.length < 2) return null;
  
  // Construir el código del padre eliminando el último número no cero
  const partesCodigoPadre = [...partesCodigoHijo];
  for (let i = partesCodigoPadre.length - 1; i >= 0; i--) {
    if (partesCodigoPadre[i] !== '0') {
      partesCodigoPadre[i] = '0';
      break;
    }
  }
  
  const codigoPadre = partesCodigoPadre.join('.');
  
  // Buscar el elemento padre en el array de elementos
  return elementos.find(elem => elem.codigo === codigoPadre);
}

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


}