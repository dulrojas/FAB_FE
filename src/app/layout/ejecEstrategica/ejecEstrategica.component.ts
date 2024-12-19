import { Component, OnInit, TemplateRef, ChangeDetectorRef} from '@angular/core';
import { routerTransition } from '../../router.animations';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

// ======= ======= SERVICES SECTION ======= =======
import { servIndicador} from '../../servicios/indicador';
import {servIndicadorAvance} from '../../servicios/indicadorAvance';
import {servInstCategorias} from '../../servicios/instCategoria';
import { servAprendizaje } from "../../servicios/aprendizajes";
import { servicios } from "../../servicios/servicios";
import {servProyectos} from '../../servicios/proyectos';



@Component({
  selector: 'app-ejec-estrategica',
  templateUrl: './ejecEstrategica.component.html',
  styleUrls: ['./ejecEstrategica.component.scss'],
  animations: [routerTransition()]
})

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
    private cdr: ChangeDetectorRef,
    private servIndicador: servIndicador,
    private servIndicadorAvance: servIndicadorAvance,
    private servInstCategorias: servInstCategorias,
    private servAprendizaje: servAprendizaje,
    private servProyectos: servProyectos,
    private servicios: servicios
  ) {}

  // ======= ======= ======= HEADER SECTION  ======= ======= ======= 
    idProyecto: any = parseInt(localStorage.getItem('currentIdProy'));
    idPersonaReg: any = parseInt(localStorage.getItem('currentIdPer'));
    namePersonaReg: any = localStorage.getItem('userFullName');

    onChildSelectionChange(selectedId: string) {
      this.idProyecto = selectedId;
      localStorage.setItem('currentIdProy', (this.idProyecto).toString());

      this.getParametricas();
      this.getEjecEstrategica();
      this.initEjecEstrategicaModel();
      this.ejecEstrategicaSelected = null;
    }
  // ======= ======= ======= CONTADOR =======  ======= =======
      headerDataNro01: any = 0;
      headerDataNro02: any = 0;
      headerDataNro03: any = 0;
      headerDataNro04: any = 0;
  // ======= ======= NGMODEL VARIABLES SECTION ======= =======
      modalAccion: any = '';
      modalTitle: any = "";

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

    // Variables de Selección
      componentes: any[] = [];
      ejecCategoria: any[] = [];
      ejecSubCategoria: any[] = [];
      ejecTipoCategoria: any[] = [];  
      ejecEstrategicaAvances: any[] = [];

  // ======= ======= INIT VIEW FUN ======= =======
  ngOnInit(): void {
    this.getParametricas();
    this.getEjecEstrategica();
    this.getIndicadoresAvance();
    
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
    this.servAprendizaje.getMetoElementos(this.idProyecto).subscribe(
      (data) => {
        this.componentes = data[0].dato;
      },
      (error) => {
        console.error(error);
      }
    );

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
    
    getElementoNombre(id_proy_elem_padre: number): string {
      const elemento = this.componentes.find(comp => comp.id_meto_elemento === id_proy_elem_padre);
      return elemento ? elemento.meto_elemento : '';
    }
        
    getAvanceVerde(lineaBase: number, metaFinal: number, avancePeriodo: number): number {
      if (!lineaBase || !metaFinal || avancePeriodo === null || avancePeriodo === undefined) return 0;
    
      const totalRango = metaFinal - lineaBase;
      if (totalRango <= 0) return 0;
    
      const progreso = avancePeriodo - lineaBase;
      const porcentaje = (progreso / totalRango) * 100;
    
      return Math.min(Math.max(porcentaje, 0), 100); // Limita entre 0 y 100
    }
    
    getAvanceAmarillo(lineaBase: number, metaFinal: number, avancePeriodo: number): number {
      if (!lineaBase || !metaFinal || avancePeriodo === null || avancePeriodo === undefined) return 0;
    
      const totalRango = metaFinal - lineaBase;
      if (totalRango <= 0) return 0;
    
      const progreso = metaFinal - avancePeriodo;
      const porcentaje = (progreso / totalRango) * 100;
    
      return Math.min(Math.max(porcentaje, 0), 100); // Limita entre 0 y 100
    }
    getUltimoAvance(idProyIndicador: number): any {
      // Filtra los registros relacionados al indicador
      const avancesRelacionados = this.ejecEstrategicaAvances.filter(avance => avance.id_proy_indicador === idProyIndicador);
      
      // Ordena por fecha_reportar en orden descendente
      const ordenadosPorFecha = avancesRelacionados.sort((a, b) => new Date(b.fecha_reportar).getTime() - new Date(a.fecha_reportar).getTime());
      
      // Retorna el último registro o null si no hay registros
      return ordenadosPorFecha.length > 0 ? ordenadosPorFecha[0] : null;
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

// Cargar indicadores de avance
getIndicadoresAvance(): void {
  this.servIndicadorAvance.getIndicadoresAvance().subscribe(
    (data) => {
      if (data) {
        this.indicadoresAvance = data.map((item: any) => {
          const ultimoAvance = item.avances?.[item.avances.length - 1] || {};
          return {
            ...item,
            periodo: item.periodo || '-',
            valor_esperado: item.valor_esperado || 0,
            progreso: ultimoAvance.valor_reportado || 0,
            notas: ultimoAvance.comentarios || '-',
            avance_per: this.calcularAvancePorcentual(item.meta_periodo, ultimoAvance.valor_reportado),
            avance_total: this.calcularAvancePorcentual(item.meta_final, ultimoAvance.valor_reportado),
            ruta_evidencia: ultimoAvance.ruta_evidencia || null,
          };
        });
      } else {
        console.error('No data received from API');
      }
    },
    (error) => {
      console.error('Error loading data:', error);
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


}
