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
import { firstValueFrom } from 'rxjs';
import { Notify,Report,Confirm } from 'notiflix';
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
  }
  // ======= ======= COMBINACION DE DATOS LLAMADOS PARA LA TABLA PRINCIPAL ======= =======

  gestion_actual: any = 0;
  
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
          this.datosIndicadoresAvance = data[0].dato; 
          this.indicadoresAvance = [...this.datosIndicadoresAvance];
          // Obtener la gestión actual de la seleccionada por el usuario
          this.gestion_actual = this.datosIndicadoresAvance[0].gestion_actual;
          //console.log('Gestion Actual:', this.gestion_actual);
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
          this.combinarDatos();
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
        // Obtener todos los avances para este indicador
        const avancesIndicador = this.datosIndicadoresAvance.filter(
          avance => avance.id_proy_indicador === indicador.id_proy_indicador
        );
  
        // Obtener el último avance válido
        const ultimoAvance = this.getUltimoAvanceValido(avancesIndicador);
        
        const elemento = this.elementosData.find(
          elem => elem.id_proy_elemento === indicador.id_proy_elem_padre && 
                 this.isElementoActivo(elem.idp_estado)
        );
  
        return {
          ...indicador,
          elemento: elemento,
          avance: ultimoAvance,
          avances: avancesIndicador,
          selected: false
        };
      });
  
      // Ordenar por código
      this.ejecEstrategicaTable.sort((a, b) => {
        if (!a.codigo || !b.codigo) return 0;
        return a.codigo.localeCompare(b.codigo, undefined, {
          numeric: true,
          sensitivity: 'base'
        });
      });
  
      this.totalLength = this.ejecEstrategicaTable.length;
      this.countHeaderData();
      
      // Forzar la detección de cambios
      this.ejecEstrategicaTable = [...this.ejecEstrategicaTable];
      this.indicadoresAvance = [...this.indicadoresAvance];
    }
  }
 
  get ejecEstrategicaTablePaginada() {
    const start = (this.mainPage - 1) * this.mainPageSize;
    return this.ejecEstrategicaTable.slice(start, start + this.mainPageSize);
  }

  calculateAvancePer(item: any): number {
    if (!item?.avances) return 0;
    
    const ultimoAvance = this.getUltimoAvanceValido(item.avances);
    if (!ultimoAvance) return 0;
    
    const reportado = parseFloat(ultimoAvance.valor_reportado.toString().replace(/[^0-9.-]+/g, ''));
    const esperado = parseFloat(ultimoAvance.valor_esperado.toString().replace(/[^0-9.-]+/g, ''));
    
    if (isNaN(reportado) || isNaN(esperado) || esperado === 0) return 0;
    
    const porcentaje = Math.round((reportado / esperado) * 100);
    return Math.min(porcentaje, 100);
  }
  
  
  calculateAvanceTotal(item: any): number {
    if (!item?.avances || !item?.meta_final) return 0;
    
    const avance = this.getUltimoAvanceValido(item.avances);
    if (!avance) return 0;
    
    const reportado = parseFloat(avance.valor_reportado.toString().replace(/[^0-9.-]+/g, ''));
    const metaFinal = parseFloat(item.meta_final.toString().replace(/[^0-9.-]+/g, ''));
    
    if (isNaN(reportado) || isNaN(metaFinal) || metaFinal === 0) return 0;
    
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
      this.linea_base = this.convertToNumber(this.ejecEstrategicaSelected.linea_base).toString();
      this.medida = this.ejecEstrategicaSelected.medida;
      this.meta_final = this.convertToNumber(this.ejecEstrategicaSelected.meta_final).toString();
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
      console.log('Formulario enviado:', form.value);
      this.modalService.dismissAll();
    }
  }

  // Función para controlar la selección de checkboxes
  checkboxChanged(item: any) {
    if (item.selected) {
      // Deseleccionar otros items
      this.ejecEstrategicaTable.forEach(row => {
        if (row !== item) {
          row.selected = false;
        }
      });
      this.ejecEstrategicaSelected = item;
      
      // Filtrar los avances solo del indicador seleccionado
      this.indicadoresAvance = this.datosIndicadoresAvance
        .filter(avance => avance.id_proy_indicador === item.id_proy_indicador)
        .sort((a, b) => new Date(a.fecha_reportar).getTime() - new Date(b.fecha_reportar).getTime());
    } else {
      this.ejecEstrategicaSelected = null;
      // Limpiar la lista de avances cuando no hay selección
      this.indicadoresAvance = [];
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
  
    // Verificar si el avance pertenece al año actual para permitir edición
    const puedeEditarPorGestion = this.verificarPermisoEdicionConAvanceAnterior(item);
    if (!puedeEditarPorGestion) {
      //alert(`No se puede reportar el avance porque pertenece a la gestión ${new Date(item.fecha_reportar).getFullYear()} y la gestión actual es ${this.gestion_actual}.`);
      Notify.failure(`No se puede reportar el avance porque pertenece a la gestión ${new Date(item.fecha_reportar).getFullYear()} y la gestión actual es ${this.gestion_actual}.`);
      return; // No abrir el modal si no se puede editar
    }
    
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

  verificarPermisoEdicionConAvanceAnterior(item: any): boolean {
    // Obtener el año de la fecha a reportar
    const añoReporte = new Date(item.fecha_reportar).getFullYear();
    
    // Usar la gestión actual que viene del servicio
    const añoActual = this.gestion_actual || new Date().getFullYear();
    
    // Solo permitir editar si el reporte pertenece al año actual
    return añoReporte === parseInt(añoActual.toString());
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
      (data) => {
        console.log('Avance actualizado exitosamente');
        this.modalService.dismissAll();
        this.getEjecucionEstrategicaData(); 
      },
      (error) => {
        console.error('Error al actualizar avance:', error);
      }
    );
  }
  
  // Convertir valor a número para la barra de progreso
  convertToNumber(value: any): number {
    if (!value) {
      return 0;
    }
    return parseFloat(value.toString().replace(/[$,]/g, '')) || 0;
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
      //alert('No se puede editar el avance');
      Notify.failure('No se puede editar el avance');
      return;
    }

    if (!this.editAvance.id_proy_indica_avance) {
      //alert('No se puede editar el avance: ID inválido');
      Notify.failure('No se puede editar el avance: ID inválido');
      return;
    }
  
    // Verificar si se puede editar según la gestión
    if (!this.verificarPermisoEdicionConAvanceAnterior({
      fecha_reportar: this.editAvance.fecha_reportar
    })) {
      //alert('No se puede editar el avance porque pertenece a una gestión anterior.');
      Notify.failure('No se puede editar el avance porque pertenece a una gestión anterior.');
      return;
    }  
  
    const currentIndex = this.indicadoresAvance.findIndex(
      avance => avance.id_proy_indica_avance === this.editAvance.id_proy_indica_avance
    );
  
    const nuevoValor = this.convertToNumber(this.editAvance.valor_reportado);
    if (!this.validateAccumulativeProgress(nuevoValor, currentIndex)) {
      //alert('El valor reportado debe ser mayor al último valor reportado en caso de ser el primero debe ser mayor o igual a la linea base');
      Notify.failure('El reporte debe ser mayor al último valor reportado si es primero debe ser mayor o igual a la linea base');
      return;
    }
  
    try {
      const fechaActual = new Date();
      fechaActual.setHours(fechaActual.getHours() - 4);
      const fechaHoraActual = fechaActual.toISOString().slice(0, 19).replace('T', ' ');
  
      const datosActualizados = {
        p_accion: 'M1',
        p_id_proy_indicador_avance: this.editAvance.id_proy_indica_avance,
        p_id_proy_indicador: this.editAvance.id_proy_indicador,
        p_fecha_reportar: this.editAvance.fecha_reportar,
        p_fecha_hora_reporte: fechaHoraActual,
        p_valor_esperado: this.editAvance.valor_esperado.toString(),
        p_valor_reportado: nuevoValor.toString(),
        p_comentarios: this.editAvance.comentarios || '',
        p_ruta_evidencia: this.editAvance.ruta_evidencia || '',
        p_id_persona_reporte: this.idPersonaReg
      };
  
      // Primero actualizamos los datos del avance
      this.servIndicadorAvance.editIndicadorAvance(datosActualizados).subscribe(
        async (data) => {
          if (data && data[0]?.dato) {
            // Si hay un archivo seleccionado, lo subimos
            if (this.selectedFile) {
              await this.uploadFile(
                this.selectedFile,
                'proy_indicador_avance',
                'ruta_evidencia',
                'id_proy_indica_avance',
                "Evidencia_file_" + data[0].dato[0].id_proy_indica_avance,
                data[0].dato[0].id_proy_indica_avance
              );
            }
            
            // Actualizamos los datos del indicador
            await this.actualizarDatosIndicador(this.editAvance.id_proy_indicador);
            
            //alert('Avance actualizado exitosamente');
            Notify.success('Avance actualizado exitosamente');
            this.modalService.dismissAll();
            this.selectedFile = null; // Limpiamos la selección del archivo
            
            // Actualizamos la vista
            this.getEjecucionEstrategicaData();
          }
        },
        (error) => {
          console.error('Error al actualizar el avance:', error);
          //alert('Error al actualizar el avance');
          Notify.failure('Error al actualizar el avance');
        }
      );
    } catch (error) {
      console.error('Error:', error);
      //alert('Error en el proceso de actualización');
      Notify.failure('Error en el proceso de actualización');
    }
  }

  // Agregar función auxiliar para obtener el índice válido según la fecha
  private getValidIndexByDate(fechaReporte: string): number {
    return this.indicadoresAvance
      .sort((a, b) => new Date(a.fecha_reportar).getTime() - new Date(b.fecha_reportar).getTime())
      .findIndex(avance => avance.fecha_reportar === fechaReporte);
  }
  private async actualizarDatosIndicador(idProyIndicador: number) {
    try {
      // Obtener datos actualizados del indicador avance
      const response = await this.servIndicadorAvance.getIndicadoresAvance().toPromise();
      
      if (response && response[0]?.dato) {
        // Actualizar datosIndicadoresAvance completo
        this.datosIndicadoresAvance = response[0].dato;
        
        // Filtrar y actualizar indicadoresAvance solo para el indicador seleccionado
        this.indicadoresAvance = this.datosIndicadoresAvance
          .filter(avance => avance.id_proy_indicador === idProyIndicador)
          .sort((a, b) => new Date(a.fecha_reportar).getTime() - new Date(b.fecha_reportar).getTime());
        
        // Actualizar el elemento en ejecEstrategicaTable
        const index = this.ejecEstrategicaTable.findIndex(
          item => item.id_proy_indicador === idProyIndicador
        );
        
        if (index !== -1) {
          const ultimoAvance = this.getUltimoAvanceValido(this.indicadoresAvance);
          this.ejecEstrategicaTable[index] = {
            ...this.ejecEstrategicaTable[index],
            avance: ultimoAvance,
            avances: this.indicadoresAvance
          };
        }
        
        // Actualizar contadores
        this.countHeaderData();
      }
    } catch (error) {
      console.error('Error al actualizar datos del indicador:', error);
      throw error;
    }
  }

  // Variable para controlar si se puede editar
puedeEditar: boolean = false;

/// Nueva función para validar el progreso acumulativo
validateAccumulativeProgress(newValue: number, currentIndex: number): boolean {
  // Permitir siempre el valor 0
  if (newValue === 0) return true;
  
  // Obtener los avances ordenados por fecha
  const avancesOrdenados = [...this.indicadoresAvance].sort(
    (a, b) => new Date(a.fecha_reportar).getTime() - new Date(b.fecha_reportar).getTime()
  );
  
  // Si es el primer registro, validar contra la línea base
  if (currentIndex === 0) {
    const lineaBase = parseFloat(this.ejecEstrategicaSelected?.linea_base?.toString().replace(/[^0-9.-]+/g, '') || '0');
    return newValue >= lineaBase;
  }
  
  // Para registros posteriores, obtener los avances anteriores
  const avancesAnteriores = avancesOrdenados.slice(0, currentIndex);
  
  // Encontrar el último valor reportado válido (mayor a 0)
  const ultimoValorValido = avancesAnteriores
    .reverse()
    .find(avance => this.convertToNumber(avance.valor_reportado) > 0);
  
  // Si no hay valor anterior válido, validar contra la línea base
  if (!ultimoValorValido) {
    const lineaBase = parseFloat(this.ejecEstrategicaSelected?.linea_base?.toString().replace(/[^0-9.-]+/g, '') || '0');
    return newValue >= lineaBase;
  }
  
  // Convertir el último valor válido a número
  const valorAnterior = this.convertToNumber(ultimoValorValido.valor_reportado);
  
  // El nuevo valor debe ser mayor o igual al anterior
  return newValue >= valorAnterior;
}

/// Función modificada para verificar permisos de edición basado en la gestión (año)
verificarPermisoEdicion(fechaReportar: string): boolean {
  // Obtener el año de la fecha de reporte
  const añoReporte = new Date(fechaReportar).getFullYear();
  
  // Usar la gestión actual que ya viene del servicio
  const añoActual = this.gestion_actual || new Date().getFullYear();

  // Permitir edición solo si el año del reporte es igual al año actual
  return añoReporte === parseInt(añoActual.toString());
}

// Función auxiliar actualizada para obtener el último avance válido
getUltimoAvanceValido(avances: any[]): any {
  if (!avances || avances.length === 0) return null;
  
  // Ordenar avances por fecha de reporte
  const avancesOrdenados = [...avances].sort((a, b) => 
    new Date(a.fecha_reportar).getTime() - new Date(b.fecha_reportar).getTime()
  );

  const fechaActual = new Date();
  fechaActual.setHours(fechaActual.getHours() - 4); // Ajuste a hora Bolivia

  // Primero, buscar el último avance que tenga un valor reportado mayor a 0
  const ultimoConValor = [...avancesOrdenados]
    .reverse()
    .find(avance => {
      const valorReportado = parseFloat(String(avance.valor_reportado).replace(/[^0-9.-]+/g, ''));
      return valorReportado > 0;
    });

  if (ultimoConValor) {
    return ultimoConValor;
  }

  // Si no hay ninguno con valor reportado, buscar el último avance vencido
  const ultimoVencido = [...avancesOrdenados]
    .reverse()
    .find(avance => {
      const fechaReporte = new Date(avance.fecha_reportar);
      fechaReporte.setHours(23, 59, 59, 999);
      return fechaReporte <= fechaActual;
    });

  // Si no hay vencidos, retornar el primer avance programado
  return ultimoVencido || avancesOrdenados[0];
}

// Función para obtener la próxima fecha a reportar
getProximaFechaReporte(avances: any[]): string {
  if (!avances || avances.length === 0) return null;
  
  // Obtener fecha actual en zona horaria de Bolivia
  const fechaActual = new Date();
  fechaActual.setHours(fechaActual.getHours() - 4); // Ajuste a hora Bolivia
  
  // Ordenar avances por fecha
  const avancesOrdenados = [...avances].sort((a, b) => 
    new Date(a.fecha_reportar).getTime() - new Date(b.fecha_reportar).getTime()
  );
  
  // Encontrar la fecha actual de reporte (el período en el que estamos)
  const fechaActualReporte = avancesOrdenados.find(avance => {
    const fechaAvance = new Date(avance.fecha_reportar);
    fechaAvance.setHours(23, 59, 59, 999); // Establecer al final del día
    return fechaActual <= fechaAvance;
  });
  
  // Si encontramos un período actual, lo retornamos
  if (fechaActualReporte) {
    return fechaActualReporte.fecha_reportar;
  }
  
  // Si no encontramos un período actual (todos los períodos han vencido),
  // retornamos el último período disponible
  return avancesOrdenados[avancesOrdenados.length - 1].fecha_reportar;
}

// ======= ======= ======= ======= FUNCION PARA ARCHIVOS ======= =======  ======= =======
     // ======= ======= GET INST OBJETIVOS ======= =======
     onFileChange(event: any) {
      const file = event.target.files[0];
    
      if (file) {
        const allowedExtensions = ['pdf', 'png', 'jpg', 'jpeg'];
        const fileSizeLimit = 5 * 1024 * 1024; // 5MB
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
        if (!allowedExtensions.includes(fileExtension!)) {
          //alert('Formato no permitido. Solo PDF, PNG, JPG, JPEG');
          Notify.failure('Formato no permitido. Solo PDF, PNG, JPG, JPEG');
          return;
        }
    
        if (file.size > fileSizeLimit) {
          //alert('El archivo es demasiado grande. Máximo permitido: 5MB.');
          Notify.failure('El archivo es demasiado grande. Máximo permitido: 5MB.');
          return;
        }
    
        this.selectedFile = file;
      }
    }
    // ======= ======= UPLOAD FILE FUN ======= =======
    uploadFile(file: any, nombreTabla: any, campoTabla: any, idEnTabla: any, fileName: any, idRegistro: any) {
      return new Promise((resolve, reject) => {
        if (!file) {
          resolve(null);
          return;
        }
    
        this.servicios.uploadFile(file, nombreTabla, campoTabla, idEnTabla, fileName, idRegistro).subscribe(
          (response) => {
            console.log('Archivo subido correctamente');
            resolve(response);
          },
          (error) => {
            console.error('Error al subir el archivo:', error);
            reject(error);
          }
        );
      });
    }

    // ======= ======= DOWNLOAD FILE FUN ======= =======
    async avancesDownload(campo_avances: string, item?: any) {
      try {
        // Usar el ID del elemento específico si se proporciona, de lo contrario usar el ID del editAvance
        const idRegistro = item 
          ? item.id_proy_indica_avance 
          : this.editAvance.id_proy_indica_avance;
    
        const avanceDocumentoURL = await this.downloadFile(
          'proy_indicador_avance',
          campo_avances,
          'id_proy_indica_avance',
          idRegistro
        );
    
        if (avanceDocumentoURL) {
          const fileName = item 
            ? this.getFileName(item.ruta_evidencia) 
            : this.getFileName(this.editAvance.ruta_evidencia);
    
          const a = document.createElement('a');
          a.href = avanceDocumentoURL;
          a.download = fileName || `Evidencia_${idRegistro}.pdf`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(avanceDocumentoURL);
        } else {
          //alert('No se encontró ningún archivo adjunto.');
          Notify.failure('No se encontró ningún archivo adjunto.');
        }
      } catch (error) {
        console.error('Error al descargar el archivo:', error);
        //alert('Error al descargar el archivo. Por favor, intente nuevamente.');
        Notify.failure('Error al descargar el archivo. Por favor, intente nuevamente.');
      }
    }  
    
    // Función auxiliar para obtener el nombre del archivo de la ruta
    getFileName(rutaCompleta: string): string {
      if (!rutaCompleta) return '';
      const partes = rutaCompleta.split('/');
      return partes[partes.length - 1];
    }
    // ======= ======= DOWNLOAD FILE ======= =======
    async downloadFile(nombreTabla: string, campoTabla: string, idEnTabla: string, idRegistro: number): Promise<string | null> {
      try {
        const response = await this.servicios.downloadFile(nombreTabla, campoTabla, idEnTabla, idRegistro).toPromise();
        
        if (response instanceof Blob) {
          // Crear un URL único para cada descarga
          const url = window.URL.createObjectURL(new Blob([response], { type: response.type }));
          return url;
        } else {
          console.warn('La respuesta no es un Blob');
          return null;
        }
      } catch (error) {
        if (error.status === 404) {
          console.warn('Archivo no encontrado');
          return null;
        }
        console.error('Error al descargar el archivo:', error);
        return null;
      }
    }
//  ======= ======= ======= ======= ======= ======= =======  ======= =======  ======= =======

countHeaderData() {
  if (this.ejecEstrategicaTable && this.ejecEstrategicaTable.length > 0) {
    // Total de indicadores
    this.headerDataNro01 = this.ejecEstrategicaTable.length;

    // Metas de período cumplidas
    this.headerDataNro02 = this.ejecEstrategicaTable.filter(item => {
      const avance = this.getUltimoAvanceValido(item.avances);
      if (!avance) return false;
      
      const reportado = parseFloat(avance.valor_reportado.toString().replace(/[^0-9.-]+/g, ''));
      const esperado = parseFloat(avance.valor_esperado.toString().replace(/[^0-9.-]+/g, ''));
      
      if (isNaN(reportado) || isNaN(esperado) || esperado === 0) return false;
      
      return reportado >= esperado;
    }).length;

    // Indicadores sin avance
    this.headerDataNro03 = this.ejecEstrategicaTable.filter(item => {
      const avance = this.getUltimoAvanceValido(item.avances);
      return !avance || parseFloat(avance.valor_reportado) === 0;
    }).length;

    // Meta final cumplida
    this.headerDataNro04 = this.ejecEstrategicaTable.filter(item => {
      const avance = this.getUltimoAvanceValido(item.avances);
      if (!avance) return false;
      
      const reportado = parseFloat(avance.valor_reportado.toString().replace(/[^0-9.-]+/g, ''));
      const metaFinal = parseFloat(item.meta_final.toString().replace(/[^0-9.-]+/g, ''));
      
      if (isNaN(reportado) || isNaN(metaFinal) || metaFinal === 0) return false;
      
      return reportado >= metaFinal;
    }).length;
  }
}

}