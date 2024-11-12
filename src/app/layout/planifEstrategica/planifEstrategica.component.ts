import { Component, OnInit, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { routerTransition } from '../../router.animations';
import { servPlanifEstrategica } from '../../servicios/planifEstrategica';

@Component({
  selector: 'app-planifEstrategica',
  templateUrl: './planifEstrategica.component.html',
  styleUrls: ['./planifEstrategica.component.scss'],
  animations: [routerTransition()]
})
export class PlanifEstrategicaComponent implements OnInit {

  // Variables de paginación
  
  mainPage = 1;
  mainPageSize = 10;
  totalLength = 0;

  // Variables de datos principales
  planifEstrategica: any[] = [];
  planificacionEstrategicaSelected: any = null;

  constructor(
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,
    private servPlanifEstrategica: servPlanifEstrategica
  ) {}

  // Variables para los contadores en el encabezado
  idProyecto: number = 0;

  headerDataNro01: number = 0;
  headerDataNro02: number = 0;
  headerDataNro03: number = 0;
  headerDataNro04: number = 0;

  // Variables para modal

  modalTitle: string = '';
  // Variables para añadir/editar del Primer nodal OG-OE-RE
  elemento = '';
  padre = '';
  codigo = '';
  tipo = '';
  nombreElemento = '';
  descripcion = '';
  supuestosComentario = '';
  // Variables para añadir/editar del Segundo nodal IN
  categoria: any = "";
  subcategoria: any = "";
  tipoCategoria: any = "";
  lineaBase: any = null;
  medidas: any = null;
  metaFinal: any = null;
  medioVerificacion: any = null;

  // Mapeo de tipos
  tiposElemento = {
    'OG': { nivel: 1, nombre: 'Objetivo General' },
    'OE': { nivel: 2, nombre: 'Objetivo Específico' },
    'RE': { nivel: 3, nombre: 'Resultado' },
    'IN': { nivel: 4, nombre: 'Indicador' }
  };

  // INIT VIEW FUN - Inicialización de datos al cargar el componente
  ngOnInit(): void {
    this.getPlanifEstrategica(); // Obtiene datos del servicio
    this.countHeaderData(); // Calcula conteo de tipos
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

  // Función para generar código según la lógica especificada
  generarCodigo(tipo: string, padreCodigo?: string): string {
    if (tipo === 'OG') {
      const objetivosGenerales = this.planifEstrategica.filter(e => e.tipo === 'OG');
      const ultimoNumero = objetivosGenerales.length > 0 ? 
        Math.max(...objetivosGenerales.map(og => parseInt(og.codigo.split('.')[0]))) : 0;
      return `${ultimoNumero + 1}.0.0.0`;
    }

    if (!padreCodigo) return '';

    const partesPadre = padreCodigo.split('.');
    const nivelPadre = this.obtenerNivel(padreCodigo);
    let nuevosCodigos = [...partesPadre.map(Number)];

    // Obtener hermanos del mismo tipo bajo el mismo padre
    const hermanos = this.planifEstrategica.filter(e => {
      const partesHermano = e.codigo.split('.');
      return e.tipo === tipo && 
             partesHermano.slice(0, nivelPadre).join('.') === partesPadre.slice(0, nivelPadre).join('.');
    });

    // Determinar el siguiente número disponible
    const ultimoNumero = hermanos.length > 0 ?
      Math.max(...hermanos.map(h => parseInt(h.codigo.split('.')[nivelPadre]))) : 0;

    switch (tipo) {
      case 'OE':
        nuevosCodigos[1] = ultimoNumero + 1;
        nuevosCodigos[2] = 0;
        nuevosCodigos[3] = 0;
        break;
      case 'RE':
        nuevosCodigos[2] = ultimoNumero + 1;
        nuevosCodigos[3] = 0;
        break;
      case 'IN':
        nuevosCodigos[3] = ultimoNumero + 1;
        break;
    }

    return nuevosCodigos.join('.');
  }

  private obtenerNivel(codigo: string): number {
    const partes = codigo.split('.');
    for (let i = partes.length - 1; i >= 0; i--) {
      if (partes[i] !== '0') {
        return i;
      }
    }
    return 0;
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
    this.elemento = null;
    this.padre = "";
    this.codigo = null;
    this.categoria = "";
    this.subcategoria = "";
    this.tipo = "";
    this.descripcion = null;
    this.lineaBase = null;
    this.metaFinal = null;
    this.medioVerificacion = null;
    this.supuestosComentario = null;
  }

  // Inicializar modal de añadir
  initAddPlanifEstrategica(modalRef: TemplateRef<any>, tipoSeleccionado: string): void {
    this.limpiarModal();
    this.tipo = tipoSeleccionado;
    this.modalTitle = 'Añadir ' + this.tiposElemento[tipoSeleccionado].nombre;
    
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

  onPadreSelected(): void {
    if (!this.padre || !this.tipo) return;
    
    const padreElement = this.planifEstrategica.find(e => e.codigo === this.padre);
    if (!padreElement) return;

    this.codigo = this.generarCodigo(this.tipo, this.padre);
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
    this.elemento = '';
    this.padre = '';
    this.codigo = '';
    this.descripcion = '';
    this.supuestosComentario = '';
    this.medioVerificacion = '';
    this.tipo = '';
    this.nombreElemento = '';
    this.categoria = '';
    this.subcategoria = '';
    this.tipoCategoria = '';
    this.lineaBase = null;
    this.medidas = null;
    this.metaFinal = null;
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

  

  getPlanifEstrategica(): void {
    this.planifEstrategica = [
      {
        id_planificacion_estrategica: 1,
        tipo: 'OG',
        codigo: "1.0.0.0",
        nombre: "Conservación de bosques",
        descripcion: "Objetivo general de conservación",
        selected: false
      },
      {
        id_planificacion_estrategica: 2,
        tipo: 'OE',
        codigo: "1.1.0.0"
      },
      {
        id_planificacion_estrategica: 6,
        tipo: 'IN',
        codigo: "1.1.0.1",
        nombre: "Conservación de bosques3"
      },
      {
        id_planificacion_estrategica: 6,
        tipo: 'IN',
        codigo: "1.1.0.2",
        nombre: "Conservación"
      },
      {
        id_planificacion_estrategica: 6,
        tipo: 'IN',
        codigo: "1.1.1.3",
        nombre: "Conservación 2"
      },
      {
        id_planificacion_estrategica: 3,
        tipo: 'RE',
        codigo: "1.1.1.0"
      },
      {
        id_planificacion_estrategica: 4,
        tipo: 'IN',
        codigo: "1.1.1.1"
      },
      {
        id_planificacion_estrategica: 5,
        tipo: 'RE',
        codigo: "1.1.2.0",
        nombre: "Conservación de bosques2"
      },
      {
        id_planificacion_estrategica: 6,
        tipo: 'IN',
        codigo: "1.1.2.1",
        nombre: "Conservación de bosques3"
      },

    ];
    console.log(this.planifEstrategica); // Verifica los datos en la consola
      this.totalLength = this.planifEstrategica.length;
  }

  // GET Planificación Estratégica
  /*getPlanifEstrategica() {
    this.servPlanifEstrategica.getPlanifEstrategica().subscribe(
      (data: any) => {
      this.planifEstrategica = data[0].dato;
      this.countHeaderData();
    });
    (error) => {
      console.log(error);
    }
  }*/

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