import { Component, OnInit, TemplateRef, EventEmitter, Output} from '@angular/core';
import { NgForm } from '@angular/forms';
import { routerTransition } from '../../router.animations';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ProyectoService } from '../../services/proyectoData.service';

// ======= ======= SERVICES SECTION ======= ======= 
import {servIndicador} from '../../servicios/indicador';
import {servIndicadorAvance} from '../../servicios/indicadorAvance';
import {servInstCategorias} from '../../servicios/instCategoria';
import {ElementosService } from '../../servicios/elementos';
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
  // ======= ======= VARIABLES INDICADOR ======= =======
  datosIndicador: any[] = [];
  indicadoresData: any[] = [];
  // ======= ======= VARIABLES INDICADOR AVANCE ======= =======
  indicadoresAvance: any[] = [];
  // ======= ======= VARIABLES ELEMENTOS ======= =======
  elementosData: any[] = [];
  ejecEstrategicaTable: any[] = [];
  // ======= ======= VARIABLES METO ELEMENTOS ======= =======
  metoElementosData: any[] = [];
  selectedMetoElemento: any = null;
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
    private ElementosService: ElementosService,    
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
    }
  // ======= ======= HEADER SECTION  "NO TOCAR"======= =======
  // ======= ======= ======= CONTADOR =======  ======= =======
      headerDataNro01: any = 0;
      headerDataNro02: any = 0;
      headerDataNro03: any = 0;
      headerDataNro04: any = 0;
  // ======= ======= NGMODEL VARIABLES SECTION ======= =======
      

  // ======= ======= INIT VIEW FUN ======= =======
  ngOnInit(): void {
    this.getEjecucionEstrategicaData();
    this.loadMetoElementos();
    this.loadCategorias();
  }
  // ======= ======= COMBINACION DE DATOS LLAMADOS PARA LA TABLA PRINCIPAL ======= =======

  getEjecucionEstrategicaData() {
    // Obtener datos de indicadores
    this.servIndicador.getIndicadorByIdProy(this.idProyecto).subscribe(
      (data) => {
        if (data && data[0]?.dato?.[0]) {
          this.datosIndicador = data[0].dato;
          this.indicadoresData = this.datosIndicador;
          this.combinarDatos(); // Llamar a función para combinar datos
        }
      },
      (error) => {
        console.error('Error al obtener datos del Indicador:', error);
      }
    );
  
    // Obtener datos de indicadores avance
    this.servIndicadorAvance.getIndicadoresAvance().subscribe(
      (data) => {
        if (data && data[0]?.dato?.[0]) {
          this.indicadoresAvance = data[0].dato;
          this.combinarDatos(); // Llamar a función para combinar datos
        }
      },
      (error) => {
        console.error('Error al obtener datos del Indicador Avance:', error);
      }
    );
  
    // Obtener datos de elementos
    this.ElementosService.getElementosByProyecto(this.idProyecto).subscribe(
      (data) => {
        if (data && data[0]?.dato?.[0]) {
          this.elementosData = data[0].dato;
          this.combinarDatos(); // Llamar a función para combinar datos
        }
      },
      (error) => {
        console.error('Error al obtener datos de los elementos:', error);
      }
    );
  }
  
  // Función para combinar los datos
  combinarDatos() {
    if (this.indicadoresData.length > 0 && this.elementosData.length > 0) {
      this.ejecEstrategicaTable = this.indicadoresData.map(indicador => {
        // Buscar el elemento correspondiente
        const elemento = this.elementosData.find(elem => 
          elem.id_proy_elem_padre === indicador.id_proy_elem_padre
        );
        
        // Buscar el avance correspondiente
        const avance = this.indicadoresAvance.find(av => 
          av.id_proy_indicador === indicador.id_proy_indicador
        );
  
        return {
          ...indicador,
          ...elemento,
          selected: false, // Para el checkbox
          avance: avance || null
        };
      });
  
      this.totalLength = this.ejecEstrategicaTable.length;
    }
  }
  calculateAvancePer(item: any): number {
    if (!item.avance?.valor_reportado || !item.avance?.valor_esperado) return 0;
    const reportado = parseFloat(item.avance.valor_reportado.replace('$', ''));
    const esperado = parseFloat(item.avance.valor_esperado.replace('$', ''));
    return Math.round((reportado / esperado) * 100);
  }
  
  calculateAvanceTotal(item: any): number {
    if (!item.avance?.valor_reportado || !item.meta_final) return 0;
    const reportado = parseFloat(item.avance.valor_reportado.replace('$', ''));
    const metaFinal = parseFloat(item.meta_final.replace('$', ''));
    return Math.round((reportado / metaFinal) * 100);
  }
  
  // ======= ======= NGMODEL VARIABLES SECTION ======= =======
  id_proy_elem_padre: number = 0;
  codigo: string = '';
  inst_categoria_1: any = '';
  inst_categoria_2: any = '';
  inst_categoria_3: any = '';
  indicador: string = '';
  descripcion: string = '';
  codigoPadre: string = '';
  codigoAbuelo: string = '';
  descripcionPadre: string = '';
  linea_base: string = '';
  medida: string = '';
  meta_final: string = '';
  medio_verifica: string = '';
  comentario: string = '';
  sigla: string = '';
  color: string = '';

  // Variables adicionales
  editMode: boolean = false;
  ejecEstrategicaSelected: any = null;
  ejecCategoria: any[] = [];
  ejecSubCategoria: any[] = [];
  ejecTipoCategoria: any[] = [];

  // Función para inicializar el modal
  initEditEjecEstrategica(modal: any) {
    // Verificar si hay un elemento seleccionado
    const selectedItems = this.ejecEstrategicaTable.filter(item => item.selected);
    if (selectedItems.length === 1) {
      this.ejecEstrategicaSelected = selectedItems[0];
      
      // Cargar datos del indicador seleccionado
      this.id_proy_elem_padre = this.ejecEstrategicaSelected.id_proy_elem_padre;
      this.codigo = this.ejecEstrategicaSelected.codigo;
      this.inst_categoria_1 = this.ejecEstrategicaSelected.id_inst_categoria_1;
      this.inst_categoria_2 = this.ejecEstrategicaSelected.id_inst_categoria_2;
      this.inst_categoria_3 = this.ejecEstrategicaSelected.id_inst_categoria_3;
      this.indicador = this.ejecEstrategicaSelected.indicador;
      this.descripcion = this.ejecEstrategicaSelected.descripcion;
      this.linea_base = this.ejecEstrategicaSelected.linea_base;
      this.medida = this.ejecEstrategicaSelected.medida;
      this.meta_final = this.ejecEstrategicaSelected.meta_final;
      this.medio_verifica = this.ejecEstrategicaSelected.medio_verifica;
      this.comentario = this.ejecEstrategicaSelected.comentario;
      this.sigla = this.ejecEstrategicaSelected.sigla;
      this.color = '#' + this.ejecEstrategicaSelected.color;

      // Buscar datos del padre en elementosData
      const elementoPadre = this.elementosData.find(
        elem => elem.id_proy_elemento === this.id_proy_elem_padre
      );

      if (elementoPadre) {
        this.codigoPadre = elementoPadre.codigo;
        this.descripcionPadre = elementoPadre.descripcion;

        // Buscar el abuelo (elemento padre del padre)
        const elementoAbuelo = this.elementosData.find(
          elem => elem.id_proy_elemento === elementoPadre.id_proy_elem_padre
        );
        
        if (elementoAbuelo) {
          this.codigoAbuelo = elementoAbuelo.codigo;
        }
      }

      // Cargar las categorías
      this.loadCategorias();
      
      // Abrir el modal
      this.modalService.open(modal, { size: 'lg' });
    }
  }

  // Función para cargar las categorías
  loadCategorias() {
    this.servInstCategorias.getAllCategorias().subscribe(
      (response) => {
        if (response && response[0]?.dato) {
          const categorias = response[0].dato;
          
          // Filtrar categorías por nivel
          this.ejecCategoria = categorias.filter(
            (cat: any) => cat.nivel === 1
          );
          
          this.ejecSubCategoria = categorias.filter(
            (cat: any) => cat.nivel === 2
          );
          
          this.ejecTipoCategoria = categorias.filter(
            (cat: any) => cat.nivel === 3
          );
  
          // Establecer valores iniciales basados en el indicador seleccionado
          if (this.ejecEstrategicaSelected) {
            this.inst_categoria_1 = this.ejecEstrategicaSelected.id_inst_categoria_1;
            this.inst_categoria_2 = this.ejecEstrategicaSelected.id_inst_categoria_2;
            this.inst_categoria_3 = this.ejecEstrategicaSelected.id_inst_categoria_3;
          }
        }
      },
      (error) => {
        console.error('Error al cargar las categorías:', error);
      }
    );
  }
  onCategoria1Change() {
    // Filtrar subcategorías basadas en la categoría seleccionada
    const categoriaSeleccionada = this.ejecCategoria.find(
      cat => cat.id_inst_categoria === parseInt(this.inst_categoria_1)
    );
    
    if (categoriaSeleccionada) {
      this.ejecSubCategoria = this.ejecSubCategoria.filter(
        subcat => subcat.id_inst_categoria_padre === categoriaSeleccionada.id_inst_categoria
      );
      this.inst_categoria_2 = ''; // Resetear subcategoría
      this.inst_categoria_3 = ''; // Resetear tipo
    }
  }
  
  onCategoria2Change() {
    // Filtrar tipos basados en la subcategoría seleccionada
    const subcategoriaSeleccionada = this.ejecSubCategoria.find(
      subcat => subcat.id_inst_categoria === parseInt(this.inst_categoria_2)
    );
    
    if (subcategoriaSeleccionada) {
      this.ejecTipoCategoria = this.ejecTipoCategoria.filter(
        tipo => tipo.id_inst_categoria_padre === subcategoriaSeleccionada.id_inst_categoria
      );
      this.inst_categoria_3 = ''; // Resetear tipo
    }
  }
  

  // Función para obtener el nombre del elemento
  getElementoNombre(id_elemento: number): string {
    const elemento = this.elementosData.find(
      elem => elem.id_proy_elemento === id_elemento
    );
    
    if (elemento) {
      const metoElemento = this.metoElementosData.find(
        meto => meto.id_meto_elemento === elemento.id_meto_elemento
      );
      
      if (metoElemento) {
        return `${elemento.elemento} (${metoElemento.meto_elemento})`;
      }
      return elemento.elemento;
    }
    return '';
  }

  // Función para manejar el envío del formulario
  onSubmit(form: NgForm) {
    if (form.valid) {
      // Aquí puedes implementar la lógica para guardar los cambios
      console.log('Formulario enviado:', form.value);
      this.modalService.dismissAll();
    }
  }

  // Función para controlar la selección de checkboxes
  checkboxChanged(item: any) {
    // Deseleccionar otros items si uno está seleccionado
    if (item.selected) {
      this.ejecEstrategicaTable.forEach(row => {
        if (row !== item) {
          row.selected = false;
        }
      });
      this.ejecEstrategicaSelected = item;
    } else {
      this.ejecEstrategicaSelected = null;
    }
  }

  // Cargar datos de meto_elementos
loadMetoElementos() {
  this.metoElementosService.getAllMetoElementos().subscribe(
    (response) => {
      if (response && response[0]?.dato) {
        this.metoElementosData = response[0].dato;
        // Actualizar los datos del elemento seleccionado si existe
        if (this.ejecEstrategicaSelected) {
          this.updateElementoData();
        }
      }
    },
    (error) => {
      console.error('Error al cargar meto_elementos:', error);
    }
  );
}

// Función para actualizar los datos del elemento con meto_elementos
updateElementoData() {
  const elemento = this.elementosData.find(
    elem => elem.id_proy_elemento === this.id_proy_elem_padre
  );
  
  if (elemento) {
    // Buscar el meto_elemento correspondiente
    const metoElemento = this.metoElementosData.find(
      meto => meto.id_meto_elemento === elemento.id_meto_elemento
    );
    
    if (metoElemento) {
      this.sigla = metoElemento.sigla;
      this.color = '#' + metoElemento.color;
    }
  }
}

}