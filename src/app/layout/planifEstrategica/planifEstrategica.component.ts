// Importacion de modulos y componentes Principales
import { Component, OnInit, TemplateRef, ChangeDetectorRef} from '@angular/core';
import { routerTransition } from '../../router.animations';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

// Importacion de servicios 

import { PlanifEstrategicaService } from '../../servicios/planifEstrategica';
import { servicios } from "../../servicios/servicios";
import { servAprendizaje } from "../../servicios/aprendizajes";
import { servIndicador } from '../../servicios/indicador';


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
    // Variables de paginación
    mainPage = 1;
    mainPageSize = 10;
    totalLength = 0;
    constructor(
      private modalService: NgbModal,
      private cdr: ChangeDetectorRef,
      private ServPlanifEstrategica: PlanifEstrategicaService,
      private servicios: servicios,
      private servApredizaje: servAprendizaje,
      private servIndicador: servIndicador,
    ) {}

        // ======= ======= HEADER SECTION ======= =======
        idProyecto: any = parseInt(localStorage.getItem('currentIdProy'));
        idPersonaReg: any = parseInt(localStorage.getItem('currentIdPer'));
        namePersonaReg: any = localStorage.getItem('userFullName');
        onChildSelectionChange(selectedId: string) {
          this.idProyecto = selectedId;
          localStorage.setItem('currentIdProy', (this.idProyecto).toString());
    
          this.getParametricas();
          this.getPlanifEstrategica();
          this.initPlanifEstrategicaModel();
          this.planifEstrategicaSelected = null
        }

        headerDataNro01: any = 0;
        headerDataNro02: any = 0;
        headerDataNro03: any = 0;
        headerDataNro04: any = 0;
        // ======= ======= ======= ======= =======

        // ======= ======= NGMODEL VARIABLES SECTION ======= =======
        modalAction: any = "";
        modalTitle: any = '';

          //Variables PROY_ELEMENTO "Planificación Estratégica"
          id_proy_elemento: any = "";
          elemento: any = "";
          nivel: any = "";
          idp_estado: any = "";
          peso: any = "";

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
          planifCategoria: any[] = [];
          planifSubCategoria: any[] = [];
          planifTipoCategoria: any[] = [];

            //LLAMADO PARA TABLA
            planifEstrategicaTipo: any[] = [];
    


    // ======= ======= ======= ======= ======= ======= =======
    // ======= ======= VALDIATE FUNCTIONS SECTION ======= =======
        valComponente: any = true;
        ValidateComponente(){
          this.valComponente = true;
          if(!this.id_proy_elem_padre){
            this.valComponente = false;
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
          this.getParametricas(); // Obtiene datos de las paramétricas
          this.getPlanifEstrategica(); // Obtiene datos del servicio
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
          this.servicios.getParametricaByIdTipo(12).subscribe(
            (data) => {
              this.planifCategoria = data[0].dato;
            },
            (error) => {
              console.error(error);
            }
          );

          this.servicios.getParametricaByIdTipo(14).subscribe(
            (data) => {
              this.planifSubCategoria = data[0].dato;
            },
            (error) => {
              console.error(error);
            }
          );

          this.servicios.getParametricaByIdTipo(18).subscribe(
            (data) => {
              this.planifTipoCategoria = data[0].dato;
            },
            (error) => {
              console.error(error);
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
    // ======= ======= GET MODAL TITLE FUN ======= =======
      getModalTitle(modalAction: any) {
        this.modalTitle = (modalAction == "add") ? ("Añadir Planificación Estratégica") : (this.modalTitle);
        this.modalTitle = (modalAction == "edit") ? ("Editar Planificación Estratégica") : (this.modalTitle);
        return this.modalTitle;
      }
    // ======= ======= ======= ======= ======= ======= =======  ======= =======
      get planifEstrategicaTable() {
        const start = (this.mainPage - 1) * this.mainPageSize;
        return this.planifEstrategica.slice(start, start + this.mainPageSize);
      }
    // ======= ======= ======= ======= ======= ======= =======  ======= =======
    planifEstrategicaSelected: any = null;
    
    // ======= ======= CHECKBOX CHANGED ======= =======
      checkboxChanged(planifEstrategicaSel: any) {
        this.planifEstrategica.forEach(planifEstrategica => {
          if (planifEstrategicaSel.id_proy_indicador == planifEstrategica.id_proy_indicador) {
            if (planifEstrategicaSel.selected) {
              this.planifEstrategicaSelected = planifEstrategicaSel;
            } else {
              this.planifEstrategicaSelected = null;
            }
          } else {
            planifEstrategica.selected = false;
          }
        });
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
      return this.elementosMap[id_proy_elem_padre]?.color || '#000000'; // Negro por defecto
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
    




    
    tipo: string = '';
    selectedParentCodigo: string = '';
    
    onParentChange() {
      if (!this.tipo) {
        console.error("No se ha seleccionado un tipo válido.");
        return;
      }
    
      const id_proy_elem_padre = this.getIdProyElemPadre(this.tipo);
    
      if (this.selectedParentCodigo) {
        // Solo si hay un padre seleccionado, genera el código
        this.codigo = this.generateCodigo(id_proy_elem_padre, this.planifEstrategica, this.selectedParentCodigo);
      } else {
        // Si no se ha seleccionado un padre (por ejemplo, para Objetivo General), genera un código base
        this.codigo = this.generateCodigo(id_proy_elem_padre, this.planifEstrategica);
      }
      console.log("Código generado: ", this.codigo);  // Verificar que el código se genera correctamente
    }
    
    generateCodigo(id_proy_elem_padre: number, planifEstrategica: any[], selectedParentCodigo: string = ""): string {
      if (id_proy_elem_padre === 1) {
        // Generar código para Objetivo General
        const maxCode = Math.max(...planifEstrategica
          .filter(el => el.codigo.startsWith("1."))
          .map(el => parseInt(el.codigo.split(".")[0], 10)), 0);
        return `${maxCode + 1}.0.0.0`;
      }
    
      // Si es Objetivo Específico (2), buscar en los existentes
      if (id_proy_elem_padre === 2 && selectedParentCodigo) {
        const parentCode = selectedParentCodigo.split(".")[0]; // Extraer el primer dígito del padre
        const maxSpecificCode = Math.max(...planifEstrategica
          .filter(el => el.codigo.startsWith(`${parentCode}.`))
          .map(el => parseInt(el.codigo.split(".")[1], 10)), 0);
        return `${parentCode}.${maxSpecificCode + 1}.0.0`;
      }
    
      // Similar para otros tipos
      if (id_proy_elem_padre === 3 && selectedParentCodigo) {
        const parentParts = selectedParentCodigo.split(".");
        const maxResultCode = Math.max(...planifEstrategica
          .filter(el => el.codigo.startsWith(`${parentParts[0]}.${parentParts[1]}.`))
          .map(el => parseInt(el.codigo.split(".")[2], 10)), 0);
        return `${parentParts[0]}.${parentParts[1]}.${maxResultCode + 1}.0`;
      }
    
      if (id_proy_elem_padre === 4 && selectedParentCodigo) {
        const parentParts = selectedParentCodigo.split(".");
        const maxIndicatorCode = Math.max(...planifEstrategica
          .filter(el => el.codigo.startsWith(`${parentParts[0]}.${parentParts[1]}.${parentParts[2]}.`))
          .map(el => parseInt(el.codigo.split(".")[3], 10)), 0);
        return `${parentParts[0]}.${parentParts[1]}.${parentParts[2]}.${maxIndicatorCode + 1}`;
      }
    
      return ""; // Retorna vacío si no es un tipo válido
    }
    
    getIdProyElemPadre(tipo: string): number {
      switch (tipo) {
        case 'OG': return 1; // Objetivo General
        case 'OE': return 2; // Objetivo Específico
        case 'RE': return 3; // Resultado Estratégico
        case 'IN': return 4; // Indicador
        default: return 0; // Caso desconocido
      }
    }
    
    validarPadre(tipo: string, parentCodigo: string): boolean {
      const id_proy_elem_padre = this.getIdProyElemPadre(tipo);
    
      // OG no necesita padres
      if (id_proy_elem_padre === 1) {
        return false;
      }
    
      // Valida que el padre sea adecuado para el tipo seleccionado
      const parentParts = parentCodigo.split(".");
      switch (id_proy_elem_padre) {
        case 2: // OE necesita un OG (1)
          return parentParts[1] === "0" && parentParts[2] === "0" && parentParts[3] === "0";
        case 3: // RE necesita un OE (2)
          return parentParts[2] === "0" && parentParts[3] === "0";
        case 4: // IN necesita cualquier otro tipo válido como padre
          return true;
        default:
          return false;
      }
    }



// Función para mover un elemento dentro de planifEstrategica sin modificar los códigos
moverElemento(elemento: any, direccion: string): void {
  const index = this.planifEstrategica.indexOf(elemento);

  if (index === -1) {
    console.error("Elemento no encontrado");
    return;
  }

  // Validar si el elemento pertenece al OG (padre 1) y solo puede moverse dentro de él
  if (!this.perteneceAOg(elemento)) {
    console.error("Este elemento no pertenece al OG y no puede ser movido.");
    return;
  }

  // Determinar la nueva posición basada en la dirección
  let newIndex = direccion === 'arriba' ? index - 1 : index + 1;

  // Validar si el nuevo índice está dentro de los límites del array
  if (newIndex < 0 || newIndex >= this.planifEstrategica.length) {
    console.log("No se puede mover más allá de los límites");
    return;
  }

  // Cambiar el orden de los elementos dentro de planifEstrategica
  const temp = this.planifEstrategica[index];
  this.planifEstrategica[index] = this.planifEstrategica[newIndex];
  this.planifEstrategica[newIndex] = temp;

  console.log("Elemento movido correctamente");
}

// Función para verificar si un elemento pertenece al OG (padre 1)
perteneceAOg(elemento: any): boolean {
  return elemento.codigo.startsWith('1.');
}

    

        
        

    // ======= ======= INIT PLANIFICACION ESTRATEGICA NGMODEL ======= =======
      initPlanifEstrategicaModel() {
        this.modalTitle = "";

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
      
      }
  // ======= ======= ======= ======= ======= ======= =======  ======= =======
    // ======= ======= GET INDICADORES ======= =======
      getPlanifEstrategica() {
        this.servIndicador.getIndicadorByIdProy(this.idProyecto).subscribe(
          (data: any) => {
            this.planifEstrategica = (data[0].dato)?(data[0].dato):([]);
            this.totalLength = this.planifEstrategica.length;
            this.countHeaderData();
          },
          (error) => {
            console.error(error);
          }
        );
      }
  // ======= ======= ======= ======= ======= ======= =======  ======= =======
    initAddPlanifEstrategica(modalScope: TemplateRef<any>){
      this.initPlanifEstrategicaModel();

      this.modalAction = "add";
      this.modalTitle = this.getModalTitle("add");

      this.openModal(modalScope);
    }
  // ======= ======= ======= ======= ======= ======= =======  ======= =======

    addIndicador(){
      const objIndicador = {
        p_id_proy_indicador: 0,
        p_id_proyecto: parseInt(this.idProyecto,10),
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
        p_inst_categoria_3: this.inst_categoria_3
      };
      this.servIndicador.addIndicador(objIndicador).subscribe(
        (data) => {
          this.getPlanifEstrategica();
        },
        (error) => {
          console.error(error);
        }
      );
    }
  // ======= ======= ======= ======= ======= ======= =======  ======= =======
    initEditPlanifEstrategica(planifEstrategicaOGOERE: TemplateRef<any>, planifEstrategicaIN: TemplateRef<any>){
      if (!this.planifEstrategicaSelected) {
        console.error("No hay un elemento seleccionado para editar.");
        return;
      }
      this.initPlanifEstrategicaModel ();

      this.modalAction = "edit";
      this.modalTitle = this.getModalTitle("edit");

      this.id_proy_indicador = this.planifEstrategicaSelected.id_proy_indicador;
      this.id_proyecto = this.planifEstrategicaSelected.id_proyecto;
      this.id_proy_elem_padre = this.planifEstrategicaSelected.id_proy_elem_padre;
      this.codigo = this.planifEstrategicaSelected.codigo;
      this.indicador = this.planifEstrategicaSelected.indicador;
      this.descripcion = this.planifEstrategicaSelected.descripcion;
      this.comentario = this.planifEstrategicaSelected.comentario;
      this.orden = this.planifEstrategicaSelected.orden;
      this.linea_base = this.planifEstrategicaSelected.linea_base;
      this.medida = this.planifEstrategicaSelected.medida;
      this.meta_final = this.planifEstrategicaSelected.meta_final;
      this.medio_verifica = this.planifEstrategicaSelected.medio_verifica;
      this.id_estado = this.planifEstrategicaSelected.id_estado;
      this.inst_categoria_1 = this.planifEstrategicaSelected.inst_categoria_1;
      this.inst_categoria_2 = this.planifEstrategicaSelected.inst_categoria_2;
      this.inst_categoria_3 = this.planifEstrategicaSelected.inst_categoria_3;

      this.sigla = this.planifEstrategicaSelected.sigla;
      this.color = this.planifEstrategicaSelected.color;

      // Abrir el modal correspondiente
        switch (this.id_proy_elem_padre) {
          case 1: // Objetivo General
          case 2: // Objetivo Específico
          case 3: // Resultado Estratégico
            this.openModal(planifEstrategicaOGOERE);
            break;
          case 4: // Indicador
            this.openModal(planifEstrategicaIN);
            break;
          default:
            console.error("Tipo de elemento desconocido.");
  }
    }
  // ======= ======= ======= ======= ======= ======= =======  ======= =======
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
        p_inst_categoria_3: this.inst_categoria_3
      };
      this.servIndicador.editIndicador(objIndicador).subscribe(
        (data) => {
          this.getPlanifEstrategica();
        },
        (error) => {
          console.error(error);
        }
      );
    }
  // ======= ======= ======= ======= ======= ======= =======  ======= =======
    initDeletePlanifEstrategica(modalScope: TemplateRef<any>){
      this.initPlanifEstrategicaModel();

      this.id_proy_indicador = this.planifEstrategicaSelected.id_proy_indicador;
     
      this.openModal(modalScope);
    }
  // ======= ======= ======= ======= ======= ======= =======  ======= =======
    deleteIndicador(){
      this.servIndicador.deleteIndicador(this.id_proy_indicador).subscribe(
        (data) => {
          this.closeModal();
          this.getPlanifEstrategica();
        },
        (error) => {
          console.error(error);
        }
      );
    }
  // ======= ======= ======= ======= ======= ======= =======  ======= =======


// COUNT HEADER DATA
countHeaderData(): void {
  // Inicializamos los contadores
  this.headerDataNro01 = 0;
  this.headerDataNro02 = 0;
  this.headerDataNro03 = 0;
  this.headerDataNro04 = 0;

  // Recorremos solo una vez el arreglo y actualizamos los contadores
  this.planifEstrategica.forEach(e => {
    switch (e.tipo) {
      case 'OG':
        this.headerDataNro01++;
        break;
      case 'OE':
        this.headerDataNro02++;
        break;
      case 'RE':
        this.headerDataNro03++;
        break;
      case 'IN':
        this.headerDataNro04++;
        break;
    }
  });
}


// ======= ======= SUBMIT FORM ======= =======
    onSubmit(): void {
      // ======= VALIDATION SECTION =======
      let valForm = false;

      this.ValidateComponente();
      this.ValidateCategoria();
      this.ValidateSubCategoria();
      this.ValidateTipoCategoria();

      valForm = 
        this.valComponente &&
        this.valCategoria &&
        this.valSubCategoria &&
        this.valTipoCategoria;
       

      // ======= ACTION SECTION =======
      if(valForm){
        if(this.modalAction == "add"){
          this.addIndicador();
        }
        else{
          this.editIndicador();
        }
        this.closeModal();
      }
    }
    // ======= ======= ======= ======= =======


}