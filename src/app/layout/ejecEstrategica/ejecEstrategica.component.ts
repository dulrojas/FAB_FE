import { Component, OnInit, TemplateRef, EventEmitter, Output} from '@angular/core';
import { NgForm } from '@angular/forms';
import { routerTransition } from '../../router.animations';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ProyectoService } from '../../services/proyectoData.service';
import { ChangeDetectorRef } from '@angular/core';
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
    private servicios: servicios,
    private cdr: ChangeDetectorRef
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
          this.cdr.detectChanges();
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
  
      // Forzar la detección de cambios si es necesario
      this.ejecEstrategicaTable = [...this.ejecEstrategicaTable];
      this.indicadoresAvance = [...this.indicadoresAvance];
    }
  }
 
  get ejecEstrategicaTablePaginada() {
    const start = (this.mainPage - 1) * this.mainPageSize;
    return this.ejecEstrategicaTable.slice(start, start + this.mainPageSize);
  }

  calculateAvancePer(item: any): number {
    if (!item?.avance?.valor_reportado_total || !item?.avance?.valor_esperado_total) {
      return 0;
    }
    
    const reportado = parseFloat(item.avance.valor_reportado_total.toString().replace(/[^0-9.-]+/g, ''));
    const esperado = parseFloat(item.avance.valor_esperado_total.toString().replace(/[^0-9.-]+/g, ''));
    
    if (isNaN(reportado) || isNaN(esperado) || esperado === 0) {
      return 0;
    }
    
    const porcentaje = Math.round((reportado / esperado) * 100);
    return Math.min(porcentaje, 100);
  }
  
  calculateAvanceTotal(item: any): number {
    if (!item?.avance?.valor_reportado_total || !item?.meta_final) {
      return 0;
    }
    
    const reportado = parseFloat(item.avance.valor_reportado_total.toString().replace(/[^0-9.-]+/g, ''));
    const metaFinal = parseFloat(item.meta_final.toString().replace(/[^0-9.-]+/g, ''));
    
    if (isNaN(reportado) || isNaN(metaFinal) || metaFinal === 0) {
      return 0;
    }
    
    const porcentaje = Math.round((reportado / metaFinal) * 100);
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
    // Usar la fecha del reporte existente si está disponible
    const fechaHoraReporte = item.fecha_hora_reporte 
      ? new Date(item.fecha_hora_reporte) 
      : new Date();
      
    // Ajustar a zona horaria de Bolivia (UTC-4)
    fechaHoraReporte.setHours(fechaHoraReporte.getHours() - 4);
    
    this.editAvance = {
      ...item,
      fecha_hora_reporte: fechaHoraReporte.toISOString().slice(0, 16),
      valor_esperado: this.limpiarValorNumerico(item.valor_esperado),
      valor_reportado: this.limpiarValorNumerico(item.valor_reportado),
      comentarios: item.comentarios || '',
      ruta_evidencia: item.ruta_evidencia || '',
      id_persona_reporte: this.idPersonaReg
    };
  
    this.puedeEditar = this.verificarPermisoEdicion(item.fecha_reportar);
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

  async onEditAvanceSubmit() {
    if (!this.editAvance.id_proy_indica_avance || !this.puedeEditar) {
      alert('No se puede editar el avance');
      return;
    }
  
    try {
      // Obtener fecha actual en zona horaria de Bolivia
      const fechaActual = new Date();
      fechaActual.setHours(fechaActual.getHours() - 4);
      const fechaHoraActual = fechaActual.toISOString().slice(0, 19).replace('T', ' ');
  
      // Si hay un archivo nuevo, subirlo primero
      let rutaEvidencia = this.editAvance.ruta_evidencia;
      if (this.fileData) {
        rutaEvidencia = await this.uploadAvanceFile(this.editAvance.id_proy_indica_avance);
      }
  
      const datosActualizados = {
        p_accion: 'M1',
        p_id_proy_indicador_avance: this.editAvance.id_proy_indica_avance,
        p_id_proy_indicador: this.editAvance.id_proy_indicador,
        p_fecha_reportar: this.editAvance.fecha_reportar,
        p_fecha_hora_reporte: fechaHoraActual,
        p_valor_esperado: this.editAvance.valor_esperado.toString(),
        p_valor_reportado: this.editAvance.valor_reportado.toString(),
        p_comentarios: this.editAvance.comentarios || '',
        p_ruta_evidencia: rutaEvidencia,
        p_id_persona_reporte: this.idPersonaReg
      };
  
      await this.servIndicadorAvance.editIndicadorAvance(datosActualizados).toPromise();
      await this.actualizarTodosLosDatos(datosActualizados);
      
      alert('Avance actualizado exitosamente');
      
      // Limpiar datos del archivo
      this.fileData = null;
      this.fileName = '';
      this.fileUrl = null;
      
    } catch (error) {
      console.error('Error:', error);
      alert('Error en el proceso de actualización');
    }
  }
  
  // Nuevo método para actualizar todos los datos
  private async actualizarTodosLosDatos(datosActualizados: any) {
    // Actualizar la tabla principal primero
    const indexTabla = this.ejecEstrategicaTable.findIndex(
      item => item.id_proy_indicador === datosActualizados.p_id_proy_indicador
    );
  
    if (indexTabla !== -1) {
      // Calculamos el nuevo valor total
      const avancesActuales = this.datosIndicadoresAvance.filter(
        avance => avance.id_proy_indicador === datosActualizados.p_id_proy_indicador
      );
  
      const totalReportado = avancesActuales.reduce((sum, avance) => {
        const valor = avance.id_proy_indica_avance === datosActualizados.p_id_proy_indicador_avance ? 
          parseFloat(datosActualizados.p_valor_reportado) : 
          parseFloat(avance.valor_reportado);
        return sum + (isNaN(valor) ? 0 : valor);
      }, 0);
  
      const totalEsperado = avancesActuales.reduce((sum, avance) => {
        const valor = avance.id_proy_indica_avance === datosActualizados.p_id_proy_indicador_avance ? 
          parseFloat(datosActualizados.p_valor_esperado) : 
          parseFloat(avance.valor_esperado);
        return sum + (isNaN(valor) ? 0 : valor);
      }, 0);
  
      // Actualizar el elemento en la tabla
      this.ejecEstrategicaTable[indexTabla] = {
        ...this.ejecEstrategicaTable[indexTabla],
        avance: {
          ...this.ejecEstrategicaTable[indexTabla].avance,
          valor_reportado: datosActualizados.p_valor_reportado,
          valor_esperado: datosActualizados.p_valor_esperado,
          valor_reportado_total: totalReportado.toString(),
          valor_esperado_total: totalEsperado.toString(),
          fecha_hora_reporte: datosActualizados.p_fecha_hora_reporte,
          comentarios: datosActualizados.p_comentarios
        }
      };
    }
  
    // Actualizar arrays de datos
    const actualizarArray = (array: any[]) => {
      const index = array.findIndex(
        item => item.id_proy_indica_avance === datosActualizados.p_id_proy_indicador_avance
      );
      if (index !== -1) {
        array[index] = {
          ...array[index],
          valor_reportado: datosActualizados.p_valor_reportado,
          valor_esperado: datosActualizados.p_valor_esperado,
          fecha_hora_reporte: datosActualizados.p_fecha_hora_reporte,
          comentarios: datosActualizados.p_comentarios
        };
      }
    };
  
    actualizarArray(this.datosIndicadoresAvance);
    actualizarArray(this.indicadoresAvance);

    // Actualizar contadores
    this.countHeaderData();
    
    // Forzar detección de cambios
    this.cdr.detectChanges();
  }

// Variables para el manejo de archivos
fileData: any = null;
fileName: string = '';
fileUrl: string | null = null;
readonly allowedFileTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];
readonly maxFileSize = 5 * 1024 * 1024;

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
    this.fileName = file.name;
    
    // Si es una imagen, crear preview
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        this.fileUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      this.fileUrl = null;
    }

    // Actualizar el valor en editAvance
    this.editAvance.ruta_evidencia = this.fileName;
  }
}
// Función para subir archivo
async uploadAvanceFile(idAvance: number): Promise<string> {
  if (!this.fileData) {
    return '';
  }

  try {
    const response = await this.servicios.uploadFile(
      this.fileData,
      'proy_indicador_avance',
      'ruta_evidencia',
      'id_proy_indicador_avance',
      this.fileName,
      idAvance
    ).toPromise();

    return response?.ruta || '';
  } catch (error) {
    console.error('Error al subir el archivo:', error);
    throw error;
  }
}

// Función para descargar archivo
downloadAvanceFile(idAvance: number, fileName: string): void {
  this.servicios.downloadFile(
    'proy_indicador_avance',
    'ruta_evidencia',
    'id_proy_indicador_avance',
    idAvance
  ).subscribe(
    (response: Blob) => {
      // Crear URL del blob
      const url = window.URL.createObjectURL(response);
      
      // Crear elemento anchor temporal
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName || 'evidencia';
      document.body.appendChild(a);
      a.click();
      
      // Limpiar
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
    (error) => {
      console.error('Error al descargar el archivo:', error);
      if (error.status === 404) {
        alert('No se encontró el archivo solicitado');
      } else {
        alert('Error al descargar el archivo');
      }
    }
  );
}

// Variable para controlar si se puede editar
puedeEditar: boolean = false;

// Función para verificar si se puede editar según la fecha
verificarPermisoEdicion(fechaReportar: string): boolean {
  const fechaReporte = new Date(fechaReportar);
  const fechaActual = new Date();
  
  // Convertir ambas fechas a formato YYYY-MM-DD para comparar solo fechas
  const fechaReporteStr = fechaReporte.toISOString().split('T')[0];
  const fechaActualStr = fechaActual.toISOString().split('T')[0];
  
  return fechaReporteStr >= fechaActualStr;
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