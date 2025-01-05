import { Component, OnInit, TemplateRef, EventEmitter, Output} from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

    this.getEjecucionEstrategicaData();
    this.loadMetoElementos();
    this.loadCategorias();    
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
          this.combinarDatos();
        }
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
      this.ejecEstrategicaTable = this.indicadoresData
        .filter(indicador => this.isIndicadorActivo(indicador.id_estado))
        .map(indicador => {
          const avanceIndicador = this.indicadoresAvance.find(
            avance => avance.id_proy_indicador === indicador.id_proy_indicador
          );
  
          const elemento = this.elementosData.find(
            elem => elem.id_proy_elemento === indicador.id_proy_elem_padre && 
                   this.isElementoActivo(elem.idp_estado)
          );
  
          return {
            ...indicador,
            elemento: elemento,
            avance: avanceIndicador || null,
            selected: false
          };
        });
  
      this.totalLength = this.ejecEstrategicaTable.length;
      this.countHeaderData();
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

     // Buscar el elemento padre
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
    // Buscar el elemento en elementosData
    const elemento = this.elementosData.find(
      elem => elem.id_proy_elemento === id_elemento
    );
    
    if (elemento) {
      // Buscar el meto_elemento correspondiente
      const metoElemento = this.metoElementosData.find(
        meto => meto.id_meto_elemento === elemento.id_meto_elemento
      );
      
      if (metoElemento) {
        // Retornar solo el meto_elemento
        return metoElemento.meto_elemento;
      }
    }
    return '';
  }
  // Función para verificar si un elemento está activo
  isElementoActivo(idp_estado: number): boolean {
    return idp_estado === 1;
  }

  // Función para verificar si un indicador está activo
  isIndicadorActivo(id_estado: number): boolean {
    return id_estado === 1;
  }

  getElementoPadre(id_proy_elem_padre: number): string {
    console.log('ID elemento padre:', id_proy_elem_padre); // Para debugging
    console.log('Elementos disponibles:', this.elementosData); // Para debugging
    
    const elementoPadre = this.elementosData.find(
      elem => elem.id_proy_elemento === id_proy_elem_padre && this.isElementoActivo(elem.idp_estado)
    );
    
    if (elementoPadre && elementoPadre.id_meto_elemento) {
      console.log('Elemento padre encontrado:', elementoPadre); // Para debugging
      console.log('Meto elementos disponibles:', this.metoElementosData); // Para debugging
      
      // Asegurarnos de que metoElementosData está cargado
      if (this.metoElementosData && this.metoElementosData.length > 0) {
        const metoElemento = this.metoElementosData.find(
          meto => meto.id_meto_elemento === elementoPadre.id_meto_elemento
        );
        
        console.log('Meto elemento encontrado:', metoElemento); // Para debugging
        return metoElemento ? metoElemento.meto_elemento : 'No encontrado';
      }
    }
    return 'No encontrado';
  }
  

// Función para obtener el componente del elemento padre
getComponentePadre(id_proy_elem_padre: number): { sigla: string, color: string } {
  const elementoPadre = this.elementosData.find(
    elem => elem.id_proy_elemento === id_proy_elem_padre && this.isElementoActivo(elem.idp_estado)
  );
  
  if (elementoPadre) {
    const metoElemento = this.metoElementosData.find(
      meto => meto.id_meto_elemento === elementoPadre.id_meto_elemento
    );
    
    if (metoElemento) {
      return {
        sigla: metoElemento.sigla,
        color: '#' + metoElemento.color // Añadimos el # al color
      };
    }
  }
  
  // Valores por defecto
  return {
    sigla: 'IN',
    color: '#FDC82F'
  };
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
          // Filtrar solo los meto_elementos con id_metodologia = 2
          this.metoElementosData = response[0].dato.filter(
            (meto: any) => meto.id_metodologia === 2
          );
          
          // Actualizar los datos si hay un elemento seleccionado
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
  // Buscar el elemento padre
  const elemento = this.elementosData.find(
    elem => elem.id_proy_elemento === this.id_proy_elem_padre
  );
  
  if (elemento) {
    // Buscar el meto_elemento correspondiente, filtrando por id_metodologia = 2
    const metoElemento = this.metoElementosData.find(
      meto => meto.id_meto_elemento === elemento.id_meto_elemento && 
              meto.id_metodologia === 2
    );
    
    if (metoElemento) {
      // Actualizar sigla y color desde meto_elemento
      this.sigla = metoElemento.sigla;
      this.color = metoElemento.color ? '#' + metoElemento.color : '#FDC82F';
    } else {
      // Valores por defecto si no encuentra meto_elemento
      this.sigla = 'IN';
      this.color = '#FDC82F';
    }
  }
  }
  getComponenteInfo(id_elemento: number): { sigla: string, color: string } {
    // Buscar el elemento
    const elemento = this.elementosData.find(
      elem => elem.id_proy_elemento === id_elemento
    );
    
    if (elemento) {
      // Buscar el meto_elemento correspondiente
      const metoElemento = this.metoElementosData.find(
        meto => meto.id_meto_elemento === elemento.id_meto_elemento
      );
      
      if (metoElemento) {
        return {
          sigla: metoElemento.sigla,
          color: metoElemento.color ? '#' + metoElemento.color : '#FDC82F'
        };
      }
    }
    
    // Valores por defecto
    return {
      sigla: 'IN',
      color: '#FDC82F'
    };
  }

  // ======= ======= VARIABLES PARA PERIODOS ======= =======
  periodoEvaluacion: string = 'ME'; // Valor por defecto
  periodosEvaluacion: any[] = [];
  fechaInicio: Date;
  fechaFin: Date;
  fechaFinAmpliada: Date;


  loadPeriodosEvaluacion() {
    this.servicios.getParametricaByIdTipo(10).subscribe(
      (response) => {
        if (response && response.dato) {
          this.periodosEvaluacion = response.dato;
          // Actualizar el select de medida
          this.updateMedidaSelect();
        }
      },
      (error) => {
        console.error('Error al cargar periodos:', error);
      }
    );
  }
  
  // Actualizar el select de medida con los periodos disponibles
  updateMedidaSelect() {
    const periodos = this.periodosEvaluacion.map(p => ({
      value: p.descripcion_subtipo.split(' - ')[0],
      label: p.descripcion_subtipo
    }));
    // Actualizar el modelo de medida
    this.medida = periodos[0].value;
  }
  
  // Generar fechas según periodicidad
  generateFechas(periodicidad: string, fechaInicio: Date, fechaFin: Date): Date[] {
    const fechas: Date[] = [];
    let currentDate = new Date(fechaInicio);
    
    while (currentDate <= fechaFin) {
      fechas.push(new Date(currentDate));
      
      switch (periodicidad) {
        case 'ME':
          currentDate.setMonth(currentDate.getMonth() + 1);
          break;
        case 'BI':
          currentDate.setMonth(currentDate.getMonth() + 2);
          break;
        case 'TR':
          currentDate.setMonth(currentDate.getMonth() + 3);
          break;
        case 'CU':
          currentDate.setMonth(currentDate.getMonth() + 4);
          break;
        case 'SE':
          currentDate.setMonth(currentDate.getMonth() + 6);
          break;
        case 'AN':
          currentDate.setFullYear(currentDate.getFullYear() + 1);
          break;
        case 'FA':
          // Fechas específicas mayo-diciembre
          fechas.length = 0; // Limpiar array
          fechas.push(new Date(currentDate.getFullYear(), 4, 31)); // Mayo
          fechas.push(new Date(currentDate.getFullYear(), 11, 31)); // Diciembre
          return fechas;
      }
    }
    return fechas;
  }
  
  // Generar registros de avance
  generateAvanceRecords(indicadorId: number) {
    const fechas = this.generateFechas(
      this.medida,
      this.fechaInicio,
      this.fechaFinAmpliada || this.fechaFin
    );
  
    const avances = fechas.map((fecha, index) => ({
      id_proy_indica_avance: null,
      id_proy_indicador: indicadorId,
      fecha_reportar: fecha,
      valor_reportado: null,
      valor_esperado: this.calcularValorEsperado(index, fechas.length)
    }));
    return avances;
  }
  
  // Calcular valor esperado
  calcularValorEsperado(index: number, total: number): number {
    if (index === 0) return parseFloat(this.linea_base);
    if (index === total - 1) return parseFloat(this.meta_final);
    
    // Calcular progreso esperado entre línea base y meta final
    const incremento = (parseFloat(this.meta_final) - parseFloat(this.linea_base)) / (total - 1);
    return parseFloat(this.linea_base) + (incremento * index);
  }
  
  // Abrir modal de edición de avance
  openEditPeriodoModal(modal: any, idAvance: number) {
    const avance = this.indicadoresAvance.find(
      a => a.id_proy_indica_avance === idAvance
    );
    
    if (avance) {
      // Verificar si el período ya culminó
      const fechaActual = new Date();
      const fechaReporte = new Date(avance.fecha_reportar);
      
      if (fechaReporte < fechaActual) {
        console.log('Este período ya no puede ser editado');
        return;
      }
      
      // Abrir modal con los datos del avance
      this.editAvance = { ...avance };
      this.modalService.open(modal, { size: 'lg' });
    }
  }
  
  // Guardar cambios en el avance
  saveAvance(avance: any) {
    // Aquí implementarías la llamada al servicio para guardar los cambios
    this.servIndicadorAvance.editIndicadorAvance(avance).subscribe(
      (response) => {
        console.log('Avance actualizado exitosamente');
        this.modalService.dismissAll();
        this.getEjecucionEstrategicaData(); // Recargar datos
      },
      (error) => {
        console.error('Error al actualizar avance:', error);
      }
    );
  }
  
  // Convertir valor a número para la barra de progreso
  convertToNumber(value: any): number {
    if (!value) return 0;
    if (typeof value === 'string') {
      value = value.replace('$', '').replace(',', '');
    }
    return parseFloat(value);
  }

  // Variables para el manejo de avances
  editAvance: any = {
    id_proy_indica_avance: null,
    fecha_reportar: '',
    valor_esperado: 0,
    valor_reportado: 0,
    comentarios: '',
    ruta_evidencia: ''
  };
  selectedFile: File | null = null;
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }
  
  // Función para calcular el progreso
calculateProgress(reportado: number, esperado: number): number {
  if (!esperado) return 0;
  const progress = (reportado / esperado) * 100;
  return Math.min(progress, 100); // No permitir que supere el 100%
}

// Función para guardar los cambios del avance
async onEditAvanceSubmit() {
  try {
    // Si hay un archivo seleccionado, primero subimos el archivo
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      
      // Aquí deberías tener un servicio para subir archivos
    }

    // Luego actualizamos el avance
    this.servIndicadorAvance.editIndicadorAvance(this.editAvance).subscribe(
      (response) => {
        this.getEjecucionEstrategicaData();
        this.modalService.dismissAll();
        this.selectedFile = null;
      },
      (error) => {
        console.error('Error al actualizar el avance:', error);
      }
    );
  } catch (error) {
    console.error('Error al procesar la actualización:', error);
  }
}







  countHeaderData() {
    if (this.ejecEstrategicaTable && this.ejecEstrategicaTable.length > 0) {
      // Total de indicadores
      this.headerDataNro01 = this.ejecEstrategicaTable.length;
  
      // Contadores para las diferentes métricas
      this.headerDataNro02 = this.ejecEstrategicaTable.filter(item => {
        if (item.avance?.valor_reportado && item.avance?.valor_esperado) {
          const reportado = parseFloat(item.avance.valor_reportado.replace('$', ''));
          const esperado = parseFloat(item.avance.valor_esperado.replace('$', ''));
          return reportado >= esperado;
        }
        return false;
      }).length;
  
      // Indicadores sin avance
      this.headerDataNro03 = this.ejecEstrategicaTable.filter(item => 
        !item.avance?.valor_reportado || 
        parseFloat(item.avance.valor_reportado.replace('$', '')) === 0
      ).length;
  
      // Meta final cumplida
      this.headerDataNro04 = this.ejecEstrategicaTable.filter(item => {
        if (item.avance?.valor_reportado && item.meta_final) {
          const reportado = parseFloat(item.avance.valor_reportado.replace('$', ''));
          const metaFinal = parseFloat(item.meta_final.replace('$', ''));
          return reportado >= metaFinal;
        }
        return false;
      }).length;
    }
  }

}