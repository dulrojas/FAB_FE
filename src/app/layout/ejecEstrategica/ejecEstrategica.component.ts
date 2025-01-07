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
  datosIndicadoresAvance: any[] = [];
  indicadoresAvance: any[] = []; 
  // ======= ======= VARIABLES ELEMENTOS ======= =======
  elementosData: any[] = [];
  ejecEstrategicaTable: any[] = [];
  // ======= ======= VARIABLES METO ELEMENTOS ======= =======
  metoElementosData: any[] = [];
  selectedMetoElemento: any = null;
  elementosCompletos: any[] = [];
   // ======= ======= VARIABLE PERIODOS ======= ======= 
   ejecPeridosEva: any[] = [];
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
    this.loadCategorias();
    this.loadPeriodosEvaluacion();
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
    this.loadCategorias();
    this.loadPeriodosEvaluacion();
  }
  // ======= ======= COMBINACION DE DATOS LLAMADOS PARA LA TABLA PRINCIPAL ======= =======

  getEjecucionEstrategicaData() {
    // Obtener datos de indicadores
    this.servIndicador.getIndicadorByIdProy(this.idProyecto).subscribe(
      (data) => {
        if (data && data[0]?.dato?.[0]) {
          this.datosIndicador = data[0].dato;
          this.indicadoresData = this.datosIndicador.map(indicador => {
            // Buscar la descripción de la medida
            const periodoEncontrado = this.ejecPeridosEva.find(
              periodo => periodo.id_subtipo === parseInt(indicador.medida)
            );
            return {
              ...indicador,
              medida_descripcion: periodoEncontrado ? periodoEncontrado.descripcion_subtipo : indicador.medida
            };
          });
          this.combinarDatos();
        }
      }
    );
  
    // Obtener datos de indicadores avance
    this.servIndicadorAvance.getIndicadoresAvance().subscribe(
      (data) => {
        if (data && data[0]?.dato?.[0]) {
          this.datosIndicadoresAvance = data[0].dato; // Guardamos los datos originales
          this.indicadoresAvance = [...this.datosIndicadoresAvance]; // Hacemos una copia
          this.combinarDatos();
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
      const indicadoresActivos = this.indicadoresData.filter(
        indicador => this.isIndicadorActivo(indicador.id_estado)
      );

      this.ejecEstrategicaTable = indicadoresActivos.map(indicador => {
        // Obtenemos todos los avances para este indicador
        const avancesIndicador = this.datosIndicadoresAvance.filter(
          avance => avance.id_proy_indicador === indicador.id_proy_indicador
        );

        // Calculamos la suma de valores reportados y esperados
        const sumaReportado = avancesIndicador.reduce((sum, avance) => 
          sum + parseFloat(avance.valor_reportado?.replace('$', '') || '0'), 0
        );

        const sumaEsperado = avancesIndicador.reduce((sum, avance) => 
          sum + parseFloat(avance.valor_esperado?.replace('$', '') || '0'), 0
        );

        // Tomamos el último avance para la fecha más reciente
        const ultimoAvance = avancesIndicador.length > 0 ? 
          avancesIndicador.sort((a, b) => 
            new Date(b.fecha_reportar).getTime() - new Date(a.fecha_reportar).getTime()
          )[0] : null;

        // Modificamos el avance para incluir las sumas
        const avanceModificado = ultimoAvance ? {
          ...ultimoAvance,
          valor_reportado_total: sumaReportado.toString(),
          valor_esperado_total: sumaEsperado.toString()
        } : null;

        const elemento = this.elementosData.find(
          elem => elem.id_proy_elemento === indicador.id_proy_elem_padre && 
                 this.isElementoActivo(elem.idp_estado)
        );

        return {
          ...indicador,
          elemento: elemento,
          avance: avanceModificado,
          avances: avancesIndicador,
          selected: false
        };
      });

      // Ordenamos por código
      this.ejecEstrategicaTable.sort((a, b) => {
        if (!a.codigo || !b.codigo) return 0;
        return a.codigo.localeCompare(b.codigo, undefined, {
          numeric: true,
          sensitivity: 'base'
        });
      });

      this.totalLength = this.ejecEstrategicaTable.length;
      this.countHeaderData();
    }
  }
 
  get ejecEstrategicaTablePaginada() {
    const start = (this.mainPage - 1) * this.mainPageSize;
    return this.ejecEstrategicaTable.slice(start, start + this.mainPageSize);
  }

  calculateAvancePer(item: any): number {
    if (!item.avance?.valor_reportado_total || !item.avance?.valor_esperado_total) return 0;
    
    const reportado = parseFloat(item.avance.valor_reportado_total);
    const esperado = parseFloat(item.avance.valor_esperado_total);
    const porcentaje = Math.round((reportado / esperado) * 100);
    
    // Limitamos a 100%
    return Math.min(porcentaje, 100);
  }
  
  calculateAvanceTotal(item: any): number {
    if (!item.avance?.valor_reportado_total || !item.meta_final) return 0;
    
    const reportado = parseFloat(item.avance.valor_reportado_total);
    const metaFinal = parseFloat(item.meta_final.replace('$', ''));
    const porcentaje = Math.round((reportado / metaFinal) * 100);
    
    // Limitamos a 100%
    return Math.min(porcentaje, 100);
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
      
      // Buscar la descripción de la medida
      if (this.ejecEstrategicaSelected.medida && this.ejecPeridosEva.length > 0) {
        const periodoEncontrado = this.ejecPeridosEva.find(
          periodo => periodo.id_subtipo === parseInt(this.ejecEstrategicaSelected.medida)
        );
        
        if (periodoEncontrado) {
          this.medida = periodoEncontrado.descripcion_subtipo;
        } else {
          this.medida = this.ejecEstrategicaSelected.medida;
        }
      }

     // Buscar el elemento padre
     const elementoPadre = this.elementosData.find(
      elem => elem.id_proy_elemento === this.id_proy_elem_padre
  );

  if (elementoPadre) {
      this.codigoPadre = elementoPadre.codigo;
      this.descripcionPadre = elementoPadre.descripcion;

      // Encontrar el código base (primer número del código)
      const codigoBase = elementoPadre.codigo.split('.')[0];
      
      // Buscar el objetivo general (abuelo) que corresponde al código base
      const elementoAbuelo = this.elementosData.find(
          elem => elem.codigo.startsWith(codigoBase) && 
                 elem.codigo.match(/^\d+\.0\.0\.0$/) // Patrón para objetivos generales
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
  
  // Función para verificar si un elemento está activo
  isElementoActivo(idp_estado: number): boolean {
    return idp_estado === 1;
  }

  // Función para verificar si un indicador está activo
  isIndicadorActivo(id_estado: number): boolean {
    return id_estado === 1;
  }

  getElementoPadre(id_proy_elem_padre: number): string {
    const elementoPadre = this.elementosData.find(
      elem => elem.id_proy_elemento === id_proy_elem_padre
    );
    
    if (elementoPadre) {
      const partesCodigo = elementoPadre.codigo.split('.').map(Number);
      
      // Determinar el tipo basado en el patrón del código
      if (partesCodigo[1] === 0 && partesCodigo[2] === 0 && partesCodigo[3] === 0) {
        return 'Objetivo General';
      } else if (partesCodigo[2] === 0 && partesCodigo[3] === 0) {
        return 'Objetivo Específico';
      } else if (partesCodigo[3] === 0) {
        return 'Resultado';
      }
    }
    
    return 'No asignado';
  }
  
// Función para obtener el componente del elemento padre
getComponentePadre(id_proy_elem_padre: number): { sigla: string, color: string } {
  const elementoPadre = this.elementosData.find(
    elem => elem.id_proy_elemento === id_proy_elem_padre
  );
  
  if (elementoPadre) {
    const partesCodigo = elementoPadre.codigo.split('.').map(Number);
    
    // Verificar patrón de código
    if (partesCodigo[1] === 0 && partesCodigo[2] === 0 && partesCodigo[3] === 0) {
      // Es Objetivo General (1.0.0.0)
      return { sigla: 'OG', color: '#C64D27' };
    } else if (partesCodigo[2] === 0 && partesCodigo[3] === 0) {
      // Es Objetivo Específico (1.1.0.0)
      return { sigla: 'OE', color: '#D67600' };
    } else if (partesCodigo[3] === 0) {
      // Es Resultado (1.1.1.0)
      return { sigla: 'RE', color: '#F5A000' };
    }
  }
  
  // Por defecto retorna Indicador
  return { sigla: 'IN', color: '#FDC82F' };
}
//Nombre del elemento padre
private getDescripcionByNivel(nivel: number): string {
  switch(nivel) {
      case 1: return 'Objetivo General'; // Objetivo General
      case 2: return 'Objetivo Específico'; // Objetivo Específico
      case 3: return 'Resultado'; // Resultado
      default: return 'INDICADOR';
  }
}
// componente del elemento padre
private getSiglaByNivel(nivel: number): string {
  switch(nivel) {
      case 1: return 'OG'; // Objetivo General
      case 2: return 'OE'; // Objetivo Específico
      case 3: return 'RE'; // Resultado
      default: return 'IN';
  }
}
// Color del componente del elemento padre
private getColorByNivel(nivel: number): string {
  switch(nivel) {
      case 1: return '#C64D27'; 
      case 2: return '#D67600'; 
      case 3: return '#F5A000'; 
      default: return '#FDC82F';
  }
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
      
      // Filtrar los avances para el indicador seleccionado
      this.indicadoresAvance = this.datosIndicadoresAvance.filter(
        avance => avance.id_proy_indicador === item.id_proy_indicador
      ).sort((a, b) => 
        new Date(b.fecha_reportar).getTime() - new Date(a.fecha_reportar).getTime()
      );
    } else {
      this.ejecEstrategicaSelected = null;
      // Restaurar el array original
      this.indicadoresAvance = [...this.datosIndicadoresAvance];
    }
  }

  // ======= ======= VARIABLES PARA PERIODOS ======= =======

  loadPeriodosEvaluacion() {
    this.servicios.getParametricaByIdTipo(10).subscribe(
      (response) => {
        if (response && response[0]?.dato) {
          this.ejecPeridosEva = response[0].dato;
          // Recargar los datos después de obtener los períodos
          this.getEjecucionEstrategicaData();
        }
      },
      (error) => {
        console.error('Error al cargar períodos:', error);
      }
    );
  }
  
  // Actualizar el select de medida con los periodos disponibles
  actualizarMedida() {
    if (this.medida && this.ejecPeridosEva.length > 0) {
      // Buscamos el período que coincida con el código de la medida
      const periodoEncontrado = this.ejecPeridosEva.find(
        periodo => periodo.descripcion_subtipo.startsWith(this.medida)
      );
      
      if (periodoEncontrado) {
        this.medida = periodoEncontrado.descripcion_subtipo;
      }
    }
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
  openEditAvanceModal(modal: any, item: any) {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 19).replace('T', ' ');
  
    this.editAvance = {
      id_proy_indica_avance: item.id_proy_indica_avance,
      id_proy_indicador: item.id_proy_indicador,
      fecha_reportar: item.fecha_reportar,
      fecha_hora_reporte: formattedDate,
      valor_esperado: this.limpiarValorNumerico(item.valor_esperado),
      valor_reportado: this.limpiarValorNumerico(item.valor_reportado),
      comentarios: item.comentarios || '',
      ruta_evidencia: item.ruta_evidencia || '',
      id_persona_reporte: this.idPersonaReg // Tomado del localStorage
    };
  
    this.modalService.open(modal, { size: 'lg' });
  }

  // Función auxiliar para limpiar valores numéricos
  limpiarValorNumerico(valor: string | number): number {
    if (typeof valor === 'string') {
      return parseFloat(valor.replace(/[^0-9.-]+/g, ''));
    }
    return valor || 0;
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
  id_proy_indicador: null,
  fecha_reportar: '',
  valor_esperado: '',
  valor_reportado: '',
  comentarios: '',
  ruta_evidencia: ''
};
selectedFile: File | null = null;
  // Función para calcular el progreso
calculateProgress(reportado: number, esperado: number): number {
  if (!esperado) return 0;
  const progress = (reportado / esperado) * 100;
  return Math.min(progress, 100); // No permitir que supere el 100%
}

// Función para guardar los cambios del avance
async onEditAvanceSubmit() {
  try {
    if (!this.editAvance.id_proy_indica_avance) {
      console.error('No hay ID de avance para actualizar');
      return;
    }

    // Si hay un archivo nuevo, primero lo subimos
    let nuevaRutaEvidencia = this.editAvance.ruta_evidencia;
    if (this.fileData) {
      const formData = new FormData();
      formData.append('file', this.fileData);
      formData.append('tipo', 'evidencia');
      formData.append('id_proyecto', this.idProyecto);
      
      try {
        // Aquí debes implementar tu servicio de subida de archivos
        const response = await this.servicios.uploadFile(formData, "nombreTabla", "campoTabla", "idEnTabla", "nombreRegistro", "idRegistro").toPromise();
        nuevaRutaEvidencia = response.ruta;
      } catch (error) {
        console.error('Error al subir el archivo:', error);
        alert('Error al subir el archivo');
        return;
      }
    }

    // Preparar datos para actualizar
    const datosActualizados = {
      p_id_proy_indicador_avance: this.editAvance.id_proy_indica_avance,
      p_id_proy_indicador: this.editAvance.id_proy_indicador,
      p_fecha_reportar: this.editAvance.fecha_reportar,
      p_fecha_hora_reporte: this.editAvance.fecha_hora_reporte,
      p_valor_esperado: this.editAvance.valor_esperado.toString(),
      p_valor_reportado: this.editAvance.valor_reportado.toString(),
      p_comentarios: this.editAvance.comentarios,
      p_ruta_evidencia: nuevaRutaEvidencia,
      p_id_persona_reporte: this.idPersonaReg
    };

    // Actualizar el avance
    this.servIndicadorAvance.editIndicadorAvance(datosActualizados).subscribe(
      (response) => {
        if (response && response[0]?.mensaje === 'OK') {
          alert('Avance actualizado exitosamente');
          this.modalService.dismissAll();
          this.getEjecucionEstrategicaData(); // Recargar datos
        } else {
          alert('Error al actualizar el avance');
        }
      },
      (error) => {
        console.error('Error al actualizar el avance:', error);
        alert('Error al actualizar el avance');
      }
    );
  } catch (error) {
    console.error('Error en el proceso de actualización:', error);
    alert('Error en el proceso de actualización');
  }
}
// Variables para el manejo de archivos
fileData: any = null;
allowedFileTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];
maxFileSize = 5 * 1024 * 1024; // 5MB en bytes
onFileSelected(event: any): void {
  const file = event.target.files[0];
  
  if (file) {
    // Verificar el tipo de archivo
    const fileExtension = file.name.toLowerCase().slice((file.name.lastIndexOf(".") - 1 >>> 0) + 2);
    if (!this.allowedFileTypes.includes('.' + fileExtension)) {
      alert('Tipo de archivo no permitido. Los formatos permitidos son: ' + this.allowedFileTypes.join(', '));
      return;
    }

    // Verificar el tamaño
    if (file.size > this.maxFileSize) {
      alert('El archivo es demasiado grande. El tamaño máximo permitido es 5MB');
      return;
    }

    this.fileData = file;
    
    // Si es una imagen, mostrar preview
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        this.editAvance.preview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
}


countHeaderData() {
  if (this.ejecEstrategicaTable && this.ejecEstrategicaTable.length > 0) {
      // Total de indicadores
      this.headerDataNro01 = this.ejecEstrategicaTable.length;
  
      // Metas de período cumplidas (usando valores sumados)
      this.headerDataNro02 = this.ejecEstrategicaTable.filter(item => {
          if (item.avance?.valor_reportado_total && item.avance?.valor_esperado_total) {
              const reportado = parseFloat(item.avance.valor_reportado_total);
              const esperado = parseFloat(item.avance.valor_esperado_total);
              return reportado >= esperado;
          }
          return false;
      }).length;
  
      // Indicadores sin avance
      this.headerDataNro03 = this.ejecEstrategicaTable.filter(item => 
          !item.avance?.valor_reportado_total || 
          parseFloat(item.avance.valor_reportado_total) === 0
      ).length;
  
      // Meta final cumplida
      this.headerDataNro04 = this.ejecEstrategicaTable.filter(item => {
          if (item.avance?.valor_reportado_total && item.meta_final) {
              const reportado = parseFloat(item.avance.valor_reportado_total);
              const metaFinal = parseFloat(item.meta_final.replace('$', ''));
              return reportado >= metaFinal;
          }
          return false;
      }).length;
  }
}

}