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
  styleUrls: ['../../../styles/styles.scss'],
  animations: [routerTransition()]
})

export class EjecEstrategicaComponent implements OnInit {
  // ======= ======= VARIABLES SECTION ======= =======
  ejecEstrategica: any[] = [];

    mainPage = 1;
    mainPageSize = 10;
    totalLength = 0;

  constructor(
      private modalService: NgbModal,
      private cdr: ChangeDetectorRef,
      private servIndicador: servIndicador,
      private servIndicadorAvance: servIndicadorAvance,
      private servInstCategorias: servInstCategorias,
      private servApredizaje: servAprendizaje,
      private servProyectos: servProyectos,
      private servicios: servicios
  ) {}

  // ======= ======= ======= HEADER SECTION  ======= ======= ======= 
    idProyecto: any = parseInt(localStorage.getItem('currentIdProy'));
    idPersonaReg: any = parseInt(localStorage.getItem('currentIdPer'));
    namePersonaReg: any = localStorage.getItem('userFullName');

    onChildSelectionChange(selectedId: any) {
      this.idProyecto = selectedId;
      localStorage.setItem('currentIdProy', (this.idProyecto).toString());

      this.getEjecEstrategica();
      this.initEjecEstrategicaModel();
      this.ejecEstrategicaSelected = null;
    }
  // ======= ======= ======= ======= ======= ======= =======  ======= =======
      headerDataNro01: any = 0;
      headerDataNro02: any = 0;
      headerDataNro03: any = 0;
      headerDataNro04: any = 0;

  // ======= ======= NGMODEL VARIABLES SECTION ======= =======
      modalAccion: any = '';
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
    ejecSubTipo: any[] = [];
   
    fecha_hora_reporte: any[] = [];
          planifCategoria: any[] = [];
          planifSubCategoria: any[] = [];
          planifTipoCategoria: any[] = [];


    // ======= ======= VALDIATE FUNCTIONS SECTION ======= =======
    valComponente: any = true;
    ValidateComponente(){
      this.valComponente = true;
      if(!this.id_proy_elem_padre){
        this.valComponente = false;
      }
    }
    valejecSubTipo: any = true;
    ValidateEjecSubTipo(){
      this.valejecSubTipo = true;
      if(!this.inst_categoria_1){
        this.valCategoria = false;
      }
    }
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
    this.servApredizaje.getMetoElementos(this.idProyecto).subscribe(
      (data) => {
        this.componentes = data[0].dato;
      },
      (error) => {
        console.error(error);
      }
    );

    // ======= ======= =======
    this.servicios.getParametricaByIdTipo(14).subscribe(
      (data) => {
        this.ejecSubTipo = data[0].dato;
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
  // ======= ======= ======= ======= ======= ======= =======  ======= =======
  planifData: any[] = []; // Arreglo para almacenar los datos procesados
  cargarIndicadoresAvance() {
    this.servIndicadorAvance.getIndicadoresAvance().subscribe(
      (response: any) => {
        if (response[0]?.res === 'OK') {
          this.planifData = response[0]?.dato || [];
          console.log('Datos cargados:', this.planifData); // Verifica los datos en la consola
        } else {
          console.error('Error en la respuesta del API:', response);
        }
      },
      (error) => {
        console.error('Error al cargar los datos del servicio:', error);
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
  // ======= ======= ======= ======= ======= ======= =======  ======= =======
  get ejecEstrategicaTable() {
    const start = (this.mainPage - 1) * this.mainPageSize;
    return this.ejecEstrategica.slice(start, start + this.mainPageSize);
  }
  // ======= ======= ======= ======= ======= ======= =======  ======= =======
  ejecEstrategicaSelected: any = null;
  // ======= ======= ======= ======= ======= ======= =======  ======= =======
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
    // ======= ======= JERARQUIA DE PADRE ======= =======
    validParents: any[] = [];
    tipo: string = '';
    planifEstrategica: any[] = [];


    // Filtrar padres válidos en función del tipo del elemento a crear
      getValidParents(tipo: string): any[] {
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
        if (!this.tipo) {
          console.error("No se ha definido un tipo para validar el padre.");
          return;
        }

        // Actualizar lista de padres válidos
        this.validParents = this.getValidParents(this.tipo);
        
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
    // ======= ======= ======= ======= ======= ======= =======  ======= =======
        
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

    this.valComponente = true;
    this.valejecSubTipo = true;
    this.valCategoria = true;
    this.valSubCategoria = true;
    this.valTipoCategoria = true;
  }

  // ======= ======= ======= ======= ======= ======= =======  ======= =======
    // ======= ======= GET INDICADORES ======= =======
    getEjecEstrategica() {
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

    //
    initAddEjecEstrategica(modalScope: TemplateRef<any>){
      this.initEjecEstrategicaModel();
      this.modalAccion = "add";

      // Si se pasa un ID, establece el elemento automáticamente
      if (this.id_proy_elem_padre) {
        this.color = this.getColor(this.id_proy_elem_padre);
        this.sigla = this.getSigla(this.id_proy_elem_padre);
        this.tipo = this.getSigla(this.id_proy_elem_padre); // Obtener sigla del tipo
        this.validParents = this.getValidParents(this.tipo);
    
        // Si el tipo es OG, generar el código automáticamente
        if (this.tipo === 'OG') {
          this.codigo = this.generateCodigoOG(); // Generar el código para OG
        }
      }
      this.openModal(modalScope);

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
      p_inst_categoria_3: this.inst_categoria_3,
    };
    this.servIndicador.editIndicador(objIndicador).subscribe(
      (data) => {
        this.getEjecEstrategica();
      },
      (error) => {
        console.error(error);
      }
    );
  }
  

  countHeaderData() {
    // Implement the logic for counterheaderData here
    // For example, you can update the header data variables based on ejecEstrategica
    this.headerDataNro01 = this.ejecEstrategica.length;
    this.headerDataNro02 = this.ejecEstrategica.filter(item => item.someCondition).length;
    this.headerDataNro03 = this.ejecEstrategica.reduce((sum, item) => sum + item.someValue, 0);
    this.headerDataNro04 = this.ejecEstrategica.reduce((sum, item) => sum + item.anotherValue, 0);
  }

  // ======= ======= SUBMIT FORM ======= =======
  onSubmit(): void {
    // ======= VALIDATION SECTION =======
    let valForm = false;

    this.ValidateComponente();
   this.ValidateCategoria();
      console.log('Categoría válida:', this.valCategoria);
    
      this.ValidateSubCategoria();
      console.log('Subcategoría válida:', this.valSubCategoria);
    
      this.ValidateTipoCategoria();
      console.log('Tipo de categoría válido:', this.valTipoCategoria);

    valForm = 
      this.valComponente &&
      this.valCategoria &&
      this.valSubCategoria &&
      this.valTipoCategoria;
     

    // ======= ACTION SECTION =======
    if(valForm){
      if(this.modalAccion == "edit"){
        this.editIndicador();
      }
      this.closeModal();
    }
  }
  // ======= ======= ======= ======= =======


}
