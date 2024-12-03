// Importacion de modulos y componentes Principales
import { Component, OnInit, TemplateRef, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// Importacion de servicios 
import { ProyectoService } from '../../services/proyectoData.service';
import { PlanifEstrategicaService } from '../../servicios/planifEstrategica';
import { servicios } from "../../servicios/servicios";
import { servIndicador } from '../../servicios/indicador';
import { MetoElementosService } from '../../servicios/metoElementos';
import { servAprendizaje } from "../../servicios/aprendizajes";
import {InstCategoriasService } from '../../servicios/instCategoria';

// Estructura del Decorador del Componente 
@Component({
  selector: 'app-planifEstrategica',
  templateUrl: './planifEstrategica.component.html',
  styleUrls: ['./planifEstrategica.component.scss'],
  animations: [routerTransition()]
})

export class PlanifEstrategicaComponent implements OnInit {
  
    // Variables de datos principales
    planifEstrategica: any[] = [];
    planificacionEstrategicaSelected: any = null;
    // Variables de paginación
    mainPage = 1;
    mainPageSize = 10;
    totalLength = 0;

    constructor(
      private modalService: NgbModal,
      private cdr: ChangeDetectorRef,
      private proyectoService: ProyectoService,
      private ServPlanifEstrategica: PlanifEstrategicaService,
      private servicios: servicios,
      private servApredizaje: servAprendizaje,
      private servIndicador: servIndicador,
      private ServMetoElementos: MetoElementosService,
      private ServInstCategorias: InstCategoriasService      
    ) {}
        // ======= ======= HEADER SECTION ======= =======
        idProyecto: any = parseInt(localStorage.getItem('currentIdProy'));
        idPersonaReg: any = parseInt(localStorage.getItem('currentIdPer'));
        @Output() selectionChange = new EventEmitter<any>();
        onChildSelectionChange(selectedId: any) {
          this.idProyecto = selectedId;
          localStorage.setItem('currentIdProy', (this.idProyecto).toString());
          this.proyectoService.seleccionarProyecto(this.idProyecto);
          this.getPlanifEstrategica();
        }

        headerDataNro01: any = 0;
        headerDataNro02: any = 0;
        headerDataNro03: any = 0;
        headerDataNro04: any = 0;
        // ======= ======= ======= ======= =======

        // Variables para modal
        modalAction: any = "";
        modalTitle: any = '';

          //Variables Generales
          id_proy_elemento: any = "";
          id_proyecto: any = "";
          id_meto_elemento: any = "";
          id_proy_elemento_padre: any = "";
          proyecto: any = "";
          elemento: any = "";
          codigo: any = "";
          descripcion: any = "";
          comentario: any = "";
          nivel: any = "";
          orden: any = "";
          idp_estado: any = "";
          tipoCategoria: any = "";
          lineaBase: any = null;
          medidas: any = null;
          metaFinal: any = null;
          medioVerificacion: any = null;
          sigla: any = "";
          color: any = "";
          meto_elemento: any = "";
          fecha_inicio: any = "";
          fecha_fin: any = "";
          fecha_fin_ampliada: any = "";
          fecha_fin_real: any = "";
          medida: any = "";
          meta_final: any = "";
          medio_verificacion: any = "";
          valor_esperado: any = "";	
          valor_reportado: any = "";
          fecha_hora_reporte: any = "";
          supuestosComentario: any = "";
          // Variables de Selección
          componentes: any[] = [];
          padre: any[] = [];
          categoria: any[] = [];
          subcategoria: any[] = [];
          tipo: string = '';

          planifELineaBase: any[] = [];

        // Nuevas variables para la funcionalidad
        selectedItem: any = null;
        periodData: any[] = [];
        projecData: any = null;
        tiposElemento: { [key: string]: { nombre: string } } = {
            'OG': { nombre: 'Objetivo General' },
            'OE': { nombre: 'Objetivo Específico' },
            'RE': { nombre: 'Resultado Esperado' },
            'IN': { nombre: 'Indicador' }
        };
        planifCategoria: any[] = [];
        planifSubCategoria: any[] = [];
        planifTipoCategoria: any[] = [];

       
    // INIT VIEW FUN - Inicialización de datos al cargar el componente
        ngOnInit(): void {
          this.getPlanifEstrategica(); // Obtiene datos del servicio
          this.getParametricas(); // Obtiene datos de las paramétricas
          this.getIndicador(); // Obtiene datos de los indicadores
          this.getMetoElementos(); // Obtiene datos de los meto elementos
          this.getCategorias(); // Obtiene datos de las categorías
          this.countHeaderData(); // Calcula conteo de tipos
        }
    // ======= ======= ======= ======= =======
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
              console.log('Datos de categoría:', data);
              this.planifCategoria = Array.isArray(data[0]?.dato) ? data[0]?.dato : [];
            },
            (error) => {
              console.error('Error al cargar categorías:', error);
            }
          );
          this.servicios.getParametricaByIdTipo(15).subscribe(
            (data) => {
              console.log('Datos de categoría:', data);
              this.planifSubCategoria = Array.isArray(data[0]?.dato) ? data[0]?.dato : [];
            },
            (error) => {
              console.error('Error al cargar categorías:', error);
            }
          );
          this.servicios.getParametricaByIdTipo(16).subscribe(
            (data) => {
              console.log('Datos de categoría:', data);
              this.planifTipoCategoria = Array.isArray(data[0]?.dato) ? data[0]?.dato : [];
            },
            (error) => {
              console.error('Error al cargar categorías:', error);
            }
          );

        }

        // Método para obtener categorías
        getCategorias() {
          this.ServInstCategorias.getCategoriaById(this.idProyecto).subscribe(
            (data) => {
              this.categoria = data;
            },
            (error) => {
              console.error('Error al cargar categorías:', error);
            }
          );
        }
        


    // ======= ======= GET INDICADOR ======= =======
    getIndicador(){
      this.servIndicador.getIndicadorByLiBase(this.lineaBase).subscribe(
        (data) => {
          console.log(data);
        },
        (error) => {
          console.error(error);
        }
      );
    }

    // ======= ======= GET METO ELEMENTOS ======= =======
    getMetoElementos(){
      this.ServMetoElementos.getAllMetoElementos().subscribe(
        (data) => {
          console.log(data);
        },
        (error) => {
          console.error(error);
        }
      );
    } 
        

//OPEN MODALS FUN Modal de añadir/editar
openModal(content: TemplateRef<any>, action: string) {
  this.getModalTitle(action);
  this.modalService.open(content, { size: 'xl' });
}

//GET MODAL TITLE FUN Define el título del modal según la acción
getModalTitle(modalAction: any) {
  this.modalTitle = (modalAction == "add") ? ("Añadir Planificación Estratégica") : this.modalTitle;
  this.modalTitle = (modalAction == "Indica") ? ("Indicador de Planificación Estratégica") : this.modalTitle;
  this.modalTitle = (modalAction == "edit") ? ("Editar Planificación Estratégica") : this.modalTitle;
  return this.modalTitle;
}

// ======= ======= ======= ======= =======
onSelectionChange(){
  const selectedComponente = this.componentes.find(comp => comp.id_meto_elemento == this.id_proy_elemento);
  if (selectedComponente) {
      this.color = selectedComponente.color;
      this.sigla = selectedComponente.sigla;
  }
}

 // Método para obtener nivel según tipo
 obtenerNivel(tipo: string): number {
  const niveles = { 'OG': 1, 'OE': 2, 'RE': 3, 'IN': 4 };
  return niveles[tipo] || 1;
}

// Método para actualizar códigos recursivamente
actualizarCodigos(elemento: any, codigoPadre: string = ''): void {
  const hijos = elemento.children || [];
  let codigoBase = codigoPadre ? codigoPadre : `${elemento.orden}.0.0.0`;

  hijos.forEach((hijo: any, index: number) => {
      const partesCodigo = codigoBase.split('.');
      
      switch (hijo.tipo) {
          case 'OG':
              hijo.codigo = `${index + 1}.0.0.0`;
              break;
          case 'OE':
              hijo.codigo = `${partesCodigo[0]}.${index + 1}.0.0`;
              break;
          case 'RE':
              hijo.codigo = `${partesCodigo[0]}.${partesCodigo[1]}.${index + 1}.0`;
              break;
          case 'IN':
              hijo.codigo = `${partesCodigo[0]}.${partesCodigo[1]}.${partesCodigo[2]}.${index + 1}`;
              break;
      }

      this.actualizarCodigos(hijo, hijo.codigo);
  });
}


// Función para mover elementos
moverElemento(elemento: any, direccion: 'arriba' | 'abajo'): void {
  const nivelActual = this.obtenerNivel(elemento.codigo);
  const partesCodigo = elemento.codigo.split('.');
  
  // Para OG, solo permitir cambio de número
  if (elemento.tipo === 'OG') {
    const objetivosGenerales = this.planifEstrategica
      .filter(e => e.tipo === 'OG')
      .sort((a, b) => parseInt(a.codigo) - parseInt(b.codigo));
    
    const indiceActual = objetivosGenerales.findIndex(og => og.codigo === elemento.codigo);
    if (direccion === 'arriba' && indiceActual > 0) {
      this.intercambiarElementos(elemento, objetivosGenerales[indiceActual - 1]);
    } else if (direccion === 'abajo' && indiceActual < objetivosGenerales.length - 1) {
      this.intercambiarElementos(elemento, objetivosGenerales[indiceActual + 1]);
    }
    return;
  }

  // Para otros elementos, buscar elementos del mismo tipo bajo el mismo padre
  const hermanos = this.planifEstrategica.filter(e => {
    const partesHermano = e.codigo.split('.');
    return e.tipo === elemento.tipo && 
           partesHermano.slice(0, nivelActual).join('.') === partesCodigo.slice(0, nivelActual).join('.');
  }).sort((a, b) => {
    const numA = parseInt(a.codigo.split('.')[nivelActual]);
    const numB = parseInt(b.codigo.split('.')[nivelActual]);
    return numA - numB;
  });

  const indiceActual = hermanos.findIndex(h => h.codigo === elemento.codigo);
  if (direccion === 'arriba' && indiceActual > 0) {
    this.intercambiarElementos(elemento, hermanos[indiceActual - 1]);
  } else if (direccion === 'abajo' && indiceActual < hermanos.length - 1) {
    this.intercambiarElementos(elemento, hermanos[indiceActual + 1]);
  }
}

private intercambiarElementos(elemento1: any, elemento2: any): void {
  const codigo1 = elemento1.codigo;
  const codigo2 = elemento2.codigo;
  
  // Intercambiar códigos
  elemento1.codigo = codigo2;
  elemento2.codigo = codigo1;
  
  // Actualizar códigos de los hijos
  this.actualizarCodigosHijos(elemento1);
  this.actualizarCodigosHijos(elemento2);
  
  this.ordenarElementos();
  this.cdr.detectChanges();
}

private actualizarCodigosHijos(elemento: any): void {
  const hijos = this.planifEstrategica.filter(e => 
    e.codigo.startsWith(elemento.codigo.slice(0, -2))
  );

  hijos.forEach(hijo => {
    if (hijo.id_planificacion_estrategica !== elemento.id_planificacion_estrategica) {
      const partesHijo = hijo.codigo.split('.');
      const partesElemento = elemento.codigo.split('.');
      
      // Actualizar solo las partes relevantes según el nivel
      switch (hijo.tipo) {
        case 'OE':
          partesHijo[0] = partesElemento[0];
          break;
        case 'RE':
          partesHijo[0] = partesElemento[0];
          partesHijo[1] = partesElemento[1];
          break;
        case 'IN':
          partesHijo[0] = partesElemento[0];
          partesHijo[1] = partesElemento[1];
          partesHijo[2] = partesElemento[2];
          break;
      }
      
      hijo.codigo = partesHijo.join('.');
    }
  });
}


// Planificación Estratégica TABLE PAGINATION
get planifEstrategicaTable() {
  if (!this.planifEstrategica) {
    return [];
  }
  const start = (this.mainPage - 1) * this.mainPageSize;
  return this.planifEstrategica.slice(start, start + this.mainPageSize);
}

get planificacionEstrategicaTable() {
  return this.planifEstrategica;
}



// CHECKBOX CHANGED
checkboxChanged(planificacionEstrategicaSel: any) {
  this.planifEstrategica.forEach(planificacionEstrategica => {
    if (planificacionEstrategicaSel.id_planificacion_estrategica == planificacionEstrategica.id_planificacion_estrategica) {
      if (planificacionEstrategicaSel.selected) {
        this.planificacionEstrategicaSelected = planificacionEstrategicaSel;
      } else {
        this.planificacionEstrategicaSelected = null;
      }
    } else {
      planificacionEstrategica.selected = false;
    }
  });
}

// INIT Planificación Estratégica NGMODEL

initPlanifEstrategicaModel() {
  this.id_proy_elemento = "";
  this.id_proyecto = "";
  this.id_meto_elemento = "";
  this.id_proy_elemento_padre = "";
  this.proyecto = "";
  this.elemento = "";
  this.codigo = "";
  this.descripcion = "";
  this.comentario = "";
  this.nivel = "";
  this.orden = "";
  this.idp_estado = "";
  this.tipoCategoria = "";
  this.lineaBase = "";
  this.medidas = "";
  this.metaFinal = "";
  this.medioVerificacion = "";
  this.sigla = "";
  this.color = "ffffff";

  this.meto_elemento = "";
  this.fecha_inicio = "";
  this.fecha_fin = "";
  this.fecha_fin_ampliada = "";
  this.fecha_fin_real = "";
  this.medida = "";
  this.meta_final = "";
  this.medio_verificacion = "";
  this.valor_esperado = "";	
  this.valor_reportado = "";
  this.fecha_hora_reporte = "";
}

// Inicializar modal de añadir
initAddPlanifEstrategica(modalRef: TemplateRef<any>, tipoSeleccionado: string): void {
  this.planificacionEstrategicaSelected = {
    tipo: '',
    codigo: '',
    nombre: '',
    descripcion: '',
    lineaBase: '',
    metaFinal: '',
    medioVerificacion: '',
    supuestosComentario: ''
  };
  // Si es OG, generar código automáticamente
  if (tipoSeleccionado === 'OG') {
    const nextOGNumber = this.getNextOGNumber();
    this.codigo = `${nextOGNumber}.0.0.0`;
  } else {
    // Para otros tipos, mostrar padres disponibles
    this.obtenerPadresDisponibles(tipoSeleccionado);
  }
  
  this.modalService.open(modalRef, { size: 'xl', backdrop: 'static' });
}

private getNextOGNumber(): number {
  const ogElements = this.planifEstrategica.filter(e => e.tipo === 'OG');
  return ogElements.length > 0 
    ? Math.max(...ogElements.map(og => parseInt(og.codigo.split('.')[0]))) + 1 
    : 1;
}

obtenerPadresDisponibles(tipo: string): any[] {
  switch (tipo) {
    case 'OE':
      return this.planifEstrategica.filter(e => e.tipo === 'OG');
    case 'RE':
      return this.planifEstrategica.filter(e => e.tipo === 'OE' || e.tipo === 'OG');
    case 'IN':
      return this.planifEstrategica.filter(e => e.tipo === 'RE' || e.tipo === 'OE' || e.tipo === 'OG');
    default:
      return [];
  }
}


private ordenarElementos(): void {
  this.planifEstrategica.sort((a, b) => {
    const codigoA = a.codigo.split('.').map(Number);
    const codigoB = b.codigo.split('.').map(Number);
    
    for (let i = 0; i < 4; i++) {
      if (codigoA[i] !== codigoB[i]) {
        return codigoA[i] - codigoB[i];
      }
    }
    return 0;
  });
}


// Inicializar modal de edición
initEditPlanifEstrategica(modalRef: TemplateRef<any>): void {
  if (!this.planificacionEstrategicaSelected) return;
  
  this.limpiarModal();
  this.modalTitle = 'Editar ' + this.tiposElemento[this.planificacionEstrategicaSelected.tipo]?.nombre;
  
  // Solo permitir editar nombre, descripción y supuestos
  this.elemento = this.planificacionEstrategicaSelected.nombre;
  this.descripcion = this.planificacionEstrategicaSelected.descripcion || '';
  this.supuestosComentario = this.planificacionEstrategicaSelected.supuestosComentario || '';
  
  this.modalService.open(modalRef, { size: 'xl' });
}

private limpiarModal(): void {
  this.initPlanifEstrategicaModel();
  this.padre = null;
  this.categoria = null;
  this.subcategoria = null;
  this.tipo = '';
  this.modalTitle = '';
  this.modalAction = '';
  this.selectedItem = null;
  this.planificacionEstrategicaSelected = null;
}


// INIT DELETE Planificación Estratégica
initDeletePlanifEstrategica() {

}

getButtonStyle(tipo: string) {
  switch (tipo) {
    case 'OG':
      return { margin: '0 auto', padding: '5px', position: 'relative', left: '0px' };
    case 'OE':
      return { margin: '0 auto', padding: '5px', position: 'relative', left: '10px' };
    case 'RE':
      return { margin: '0 auto', padding: '5px', position: 'relative', left: '20px' };
    case 'IN':
      return { margin: '0 auto', padding: '5px', position: 'relative', left: '30px' };
    default:
      return { margin: '0 auto', padding: '5px' };
  }
}


// GET Planificación Estratégica
getPlanifEstrategica() {
  this.ServPlanifEstrategica.getAllPlanifElements().subscribe(
    (data: any) => {
    this.planifEstrategica = data[0].dato;
    this.countHeaderData();
  });
  (error) => {
    console.log(error);
  }
}

// COUNT HEADER DATA
countHeaderData(): void {
  this.headerDataNro01 = this.planifEstrategica.filter(e => e.tipo === 'OG').length;
  this.headerDataNro02 = this.planifEstrategica.filter(e => e.tipo === 'OE').length;
  this.headerDataNro03 = this.planifEstrategica.filter(e => e.tipo === 'RE').length;
  this.headerDataNro04 = this.planifEstrategica.filter(e => e.tipo === 'IN').length;
}

// Función para guardar nuevo elemento o editar existente
guardarElemento() {
  const nuevoElemento = {
    id_planificacion_estrategica: this.planificacionEstrategicaSelected?.id_planificacion_estrategica || this.generarNuevoId(),
    tipo: this.tipo,
    codigo: this.codigo,
    nombre: this.elemento,
    descripcion: this.descripcion,
    lineaBase: this.lineaBase,
    metaFinal: this.metaFinal,
    medioVerificacion: this.medioVerificacion,
    supuestosComentario: this.supuestosComentario,
    selected: false
  };

  if (this.planificacionEstrategicaSelected) {
    // Actualizar elemento existente
    const index = this.planifEstrategica.findIndex(
      e => e.id_planificacion_estrategica === this.planificacionEstrategicaSelected.id_planificacion_estrategica
    );
    if (index !== -1) {
      this.planifEstrategica[index] = { ...this.planifEstrategica[index], ...nuevoElemento };
    }
  } else {
    // Agregar nuevo elemento
    this.planifEstrategica.push(nuevoElemento);
  }

  this.ordenarElementos();
  this.modalService.dismissAll();
  this.countHeaderData();
}

private generarNuevoId(): number {
  return Math.max(...this.planifEstrategica.map(e => e.id_planificacion_estrategica), 0) + 1;
}
// Función para cerrar el modal sin guardar
cancelar(): void {
  this.modalService.dismissAll();
}

}