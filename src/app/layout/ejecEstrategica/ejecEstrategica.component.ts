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

  // ======= ======= INIT VIEW FUN ======= =======
  ngOnInit(): void {
    this.getParametricas();
    this.getEjecEstrategica();
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
  // ======= ======= ======= INDICADORES AVANCE =======  ======= =======
  planifDatosAvance: any[] = [];
  cargarIndicadoresAvance(): void {
    this.servIndicadorAvance.getIndicadoresAvance().subscribe(
      (response) => {
        const datos = response[0]?.dato || [];
        this.planifDatosAvance = datos.map((item: any) => ({
          id: item.id_proy_indica_avance,
          periodo: item.fecha_reportar,
          valorEsperado: item.valor_esperado,
          progreso: item.valor_reportado,
          notas: item.comentarios,
          evidencia: item.ruta_evidencia,
        }));
      },
      (error) => {
        console.error('Error al cargar indicadores de avance:', error);
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
  // ======= ======= INIT EJECUCION ESTRATEGICA NGMODEL ======= =======
  initEjecEstrategicaModel() {

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
    getEjecEstrategica(): void {
      this.servIndicador.getIndicadorByIdProy(this.idProyecto).subscribe(
        (data: any) => {
          this.ejecEstrategica = (data[0].dato)?(data[0].dato):([]);
          this.totalLength = this.ejecEstrategica.length;
          this.countHeaderData();
        },
        (error) => {
          console.error(error);
        }
      );
    }

  // ======= ======= ======= ======= ======= ======= =======  ======= =======
  initEditEjecEstrategica(modalScope: TemplateRef<any>){
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
  

  countHeaderData(): void {
    this.headerDataNro01 = this.ejecEstrategica.length;
    this.headerDataNro02 = this.ejecEstrategica.filter((item) => item.someCondition).length;
    this.headerDataNro03 = this.ejecEstrategica.reduce((sum, item) => sum + (item.someValue || 0), 0);
    this.headerDataNro04 = this.ejecEstrategica.reduce((sum, item) => sum + (item.anotherValue || 0), 0);
  }

  // ======= ======= SUBMIT FORM ======= =======
  onSubmit(): void {
    if (this.modalAccion === 'edit') {
      this.editIndicador();
    }
    this.closeModal();
  }



}
