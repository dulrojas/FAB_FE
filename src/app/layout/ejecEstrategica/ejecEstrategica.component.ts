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

    // Verificar si el avance anterior es válido para editar
    const fechaValidaParaEditar = this.verificarPermisoEdicionConAvanceAnterior(item);
    if (!fechaValidaParaEditar) {
      alert('No se puede editar este avance porque el avance anterior aún está vigente.');
      return; // No abrir el modal si la fecha no es válida
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
  // Función para verificar si se puede editar el avance si la fecha actual aun no vencio
    verificarPermisoEdicionConAvanceAnterior(item: any): boolean {
      // Obtiene el avance anterior en función de la fecha
      const indiceAvanceAnterior = this.getValidIndexByDate(item.fecha_reportar);
      
      if (indiceAvanceAnterior > 0) {
        const avanceAnterior = this.indicadoresAvance[indiceAvanceAnterior - 1];
        const fechaReporteAnterior = new Date(avanceAnterior.fecha_reportar);
        const fechaActual = new Date();
        
        // Convertir a UTC-4 (Bolivia)
        fechaReporteAnterior.setHours(fechaReporteAnterior.getHours() - 4);
        fechaActual.setHours(fechaActual.getHours() - 4);
        
        // Comparar si la fecha del avance anterior aún está vigente
        if (fechaReporteAnterior >= fechaActual) {
          return false; // No se puede editar si la fecha del avance anterior es posterior o igual a la actual
        }
      }

      return true; // Si el avance anterior no existe o su fecha es válida para editar
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

    // Encontrar el índice del avance actual
    const currentIndex = this.indicadoresAvance.findIndex(
      avance => avance.id_proy_indica_avance === this.editAvance.id_proy_indica_avance
    );

    // Validar el nuevo valor reportado
    const nuevoValor = this.convertToNumber(this.editAvance.valor_reportado);
    if (!this.validateAccumulativeProgress(nuevoValor, currentIndex)) {
      alert('El valor reportado debe ser mayor al último valor reportado');
      return;
    }

    try {
      const fechaActual = new Date();
      fechaActual.setHours(fechaActual.getHours() - 4);
      const fechaHoraActual = fechaActual.toISOString().slice(0, 19).replace('T', ' ');

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
        p_valor_reportado: nuevoValor.toString(),
        p_comentarios: this.editAvance.comentarios || '',
        p_ruta_evidencia: rutaEvidencia,
        p_id_persona_reporte: this.idPersonaReg
      };

      const response = await this.servIndicadorAvance.editIndicadorAvance(datosActualizados).toPromise();
      
      if (response && response[0]?.dato) {
        await this.actualizarDatosIndicador(this.editAvance.id_proy_indicador);
        
        this.fileData = null;
        this.fileName = '';
        this.fileUrl = null;
        
        alert('Avance actualizado exitosamente');
        this.modalService.dismissAll();
      } else {
        throw new Error('No se recibió respuesta del servidor');
      }
      
    } catch (error) {
      console.error('Error:', error);
      alert('Error en el proceso de actualización');
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
//  ======= ======= ======= ======= ======= ======= =======  ======= =======  ======= =======
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
//  ======= ======= ======= ======= ======= ======= =======  ======= =======  ======= =======
// Variable para controlar si se puede editar
puedeEditar: boolean = false;

/// Nueva función para validar el progreso acumulativo
validateAccumulativeProgress(newValue: number, currentIndex: number): boolean {
  // Permitir siempre el valor 0
  if (newValue === 0) return true;
  
  // Si es el primer registro, solo validar que no sea negativo
  if (currentIndex === 0) return newValue >= 0;
  
  // Obtener los avances anteriores ordenados por fecha
  const avancesAnteriores = this.indicadoresAvance
    .slice(0, currentIndex)
    .sort((a, b) => new Date(a.fecha_reportar).getTime() - new Date(b.fecha_reportar).getTime());
  
  // Encontrar el último valor reportado válido (mayor a 0)
  const ultimoValorValido = avancesAnteriores
    .reverse()
    .find(avance => this.convertToNumber(avance.valor_reportado) > 0);
  
  // Si no hay valor anterior válido, solo validar que no sea negativo
  if (!ultimoValorValido) return newValue >= 0;
  
  // Convertir el último valor válido a número
  const valorAnterior = this.convertToNumber(ultimoValorValido.valor_reportado);
  
  // El nuevo valor debe ser mayor o igual al anterior (si no es 0)
  return newValue >= valorAnterior;
}

// Actualiza la función de verificación de permisos de edición
verificarPermisoEdicion(fechaReportar: string): boolean {
  const fechaReporte = new Date(fechaReportar);
  const fechaActual = new Date();
  
  // Convertir a UTC-4 (Bolivia)
  fechaReporte.setHours(fechaReporte.getHours() - 4);
  fechaActual.setHours(fechaActual.getHours() - 4);
  
  // Comparar solo las fechas
  return fechaReporte.toISOString().split('T')[0] >= fechaActual.toISOString().split('T')[0];
}

getUltimoAvanceValido(avances: any[]): any {
  if (!avances || avances.length === 0) return null;
  
  // Ordenar avances por fecha de reporte (del más antiguo al más reciente)
  const avancesOrdenados = [...avances].sort((a, b) => 
    new Date(a.fecha_reportar).getTime() - new Date(b.fecha_reportar).getTime()
  );

  // Primero buscar el último avance que tenga valor reportado (incluso si es fecha futura)
  const ultimoConValor = [...avancesOrdenados]
    .reverse()
    .find(avance => parseFloat(String(avance.valor_reportado).replace(/[^0-9.-]+/g, '')) > 0);

  if (ultimoConValor) {
    return ultimoConValor;
  }

  // Si no hay ninguno con valor reportado, devolver el último vencido
  const fechaActual = new Date();
  fechaActual.setHours(0, 0, 0, 0);

  const ultimoVencido = [...avancesOrdenados]
    .reverse()
    .find(avance => {
      const fechaReporte = new Date(avance.fecha_reportar);
      fechaReporte.setHours(0, 0, 0, 0);
      return fechaReporte < fechaActual;
    });

  return ultimoVencido || avancesOrdenados[0];
}

// Función para obtener la próxima fecha a reportar
getProximaFechaReporte(avances: any[]): string {
  if (!avances || avances.length === 0) return '-';
  
  const fechaActual = new Date();
  const avancesOrdenados = [...avances].sort((a, b) => 
    new Date(a.fecha_reportar).getTime() - new Date(b.fecha_reportar).getTime()
  );
  
  // Buscar la próxima fecha de reporte
  const proximaFecha = avancesOrdenados.find(avance => 
    new Date(avance.fecha_reportar) >= fechaActual
  );
  
  // Si no hay próxima fecha, retornar la última fecha disponible
  return proximaFecha ? 
    proximaFecha.fecha_reportar : 
    avancesOrdenados[avancesOrdenados.length - 1].fecha_reportar;
}



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