import { Component, OnInit, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ServRiesgos } from "../../servicios/riesgos";
import { servicios } from "../../servicios/servicios";

@Component({
  selector: 'app-riesgos',
  templateUrl: './riesgos.component.html',
  styleUrls: ['./riesgos.component.scss'],
  animations: [routerTransition()]
})

export class RiesgosComponent implements OnInit {
  
  // Variables
  riesgos: any[] = [];
  riesgoSelected: any = null;

    mainPage = 1;
    mainPageSize = 10;
    totalLength = 0;

  constructor(
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,
    private servRiesgos: ServRiesgos,
    private servicios: servicios,
    ) {}

    idProyecto: any = 0;
    headerDataNro01: any = 0; 
    headerDataNro02: any = 0; 
    headerDataNro03: any = 0; 
    headerDataNro04: any = 0; 

    // ======= ======= NGMODEL VARIABLES SECTION ======= =======
    modalTitle: any = "";
    modalAction: string = '';

    id_proy_elemen_padre: any = "";
    idp_categoria: any = "";
    id_riesgo: any = "";
    id_proyecto: any = "";
    codigo: any = "";
    tituloRiesgo: any = "";
    fechaIdentificacion: any = "";
    riesgo: any = "";
    descripcion: any = "";
    vinculados: any = "";
    idp_identificacion: any = "";
    impacto: any = "";
    probabilidad: any = "";
    nivel: any = "";
    idp_ocurrencia: any = "";
    medidas: any = "";
    idp_efectividad: any = "";
    comentarios: any = "";
    fecha_hora_reg: any = "";
    id_persona_reg: any = "";
    sigla: any = "";
    color: any = "";
    // ======= ======= VARIABLES SECTION ======= =======
    componentes: any[] = [];
    riesgoCategoria: any[] = [];
    riesgoEfectividad: any[] = [];
    riegosVinvulados: any[] = [];
    riegosIdentificacion: any[] = [];
    riesgoImpacto: any[] = [];
    riesgoProbabilidad: any[] = [];
    riesgoNivel: any[] = [];
    riegosOcurrencia: any[] = [];
    riesgoAcciones: any[] = [];
    riesgoMedidas: any[] = [];


  // ======= ======= INIT VIEW FUN ======= =======
   ngOnInit(): void {
    this.getParametricas()
    this.getRiesgos();
    this.countHeaderData();
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
    // ======= GET COMPONENTES =======
    this.servRiesgos.getMetoElementos().subscribe(
      (data) => {
        this.componentes = data[0].dato;
      },
      (error) => {
        console.error(error);
      }
    );
  // ======= GET CATEGORIA =======
  // this.servicios.getParametricaByIdTipo(14).subscribe(
  //   (data) => {
  //     this.riesgoCategoria = data[0].dato;
  //   },
  //   (error) => {
  //     console.error(error);
  //   }
  // );
  this.servicios.getParametricaByIdTipo(14).subscribe(
    (data) => {
      console.log('Datos de categoría:', data);
      this.riesgoCategoria = Array.isArray(data[0]?.dato) ? data[0]?.dato : [];
    },
    (error) => {
      console.error('Error al cargar categorías:', error);
    }
  );
  
  // ======= ======= =======
    // ======= GET EECTIVIDAD =======
    this.servicios.getParametricaByIdTipo(17).subscribe(
      (data) => {
        this.riesgoEfectividad = data[0].dato;
      },
      (error) => {
        console.error(error);
      }
    );
  // ======= GET IMPACTO =======
  this.servRiesgos.getMetoElementos().subscribe(
    (data) => {
      this.riesgoImpacto = data[0].dato;
    },
    (error) => {
      console.error(error);
    }
  );
  // ======= ======= =======
  // ======= GET PROBABILIDAD =======
  this.servRiesgos.getMetoElementos().subscribe(
    (data) => {
      this.riesgoProbabilidad = data[0].dato;
    },
    (error) => {
      console.error(error);
    }
  );
  // ======= ======= =======
  // ======= GET NIVEL DE RIESGOS =======
  this.servRiesgos.getMetoElementos().subscribe(
    (data) => {
      this.riesgoNivel = data[0].dato;
    },
    (error) => {
      console.error(error);
    }
  );
   // ======= GET Individuales/Instituciones Vinculados =======
   this.servRiesgos.getMetoElementos().subscribe(
    (data) => {
      this.riegosVinvulados = data[0].dato;
    },
    (error) => {
      console.error(error);
    }
  );
   // ======= GET Identificación del Riesgo =======
   this.servicios.getParametricaByIdTipo(15).subscribe(
    (data) => {
      this. riegosIdentificacion = data[0].dato;
    },
    (error) => {
      console.error(error);
    }
  );
   // ======= GET Ocurrencia =======
   this.servicios.getParametricaByIdTipo(16).subscribe(
    (data) => {
      this. riegosOcurrencia = data[0].dato;
    },
    (error) => {
      console.error(error);
    }
  );
  // ======= GET Necesidad =======
  this.servicios.getParametricaByIdTipo(16).subscribe(
    (data) => {
      this. riesgoAcciones = data[0].dato;
    },
    (error) => {
      console.error(error);
    }
  );
  // ======= GET Efectividad =======
  this.servicios.getParametricaByIdTipo(17).subscribe(
    (data) => {
      this. riesgoMedidas = data[0].dato;
    },
    (error) => {
      console.error(error);
    }
  );
  }

  // cargar riesgos por proyecto
onSubmit() {
  const nuevoRiesgo = {
    id_riesgo: this.id_riesgo || null,
    id_proyecto: this.id_proyecto || null,
    id_proy_elemen_padre: this.id_proy_elemen_padre || null,
    idp_categoria: this.idp_categoria || null,
    codigo: this.codigo || '',
    fecha: this.fechaIdentificacion || null,
    riesgo:  this.tituloRiesgo || '',
    descripcion: this.descripcion || '',
    vinculados: this.vinculados || '',
    idp_identificacion: this.idp_identificacion || null,
    impacto: this.impacto || '',
    probabilidad: this.probabilidad || '',
    nivel: this.nivel || '',
    idp_ocurrencia: this.idp_ocurrencia || null,
    medidas: this.medidas || '',
    idp_efectividad: this.idp_efectividad || null,
    comentarios: this.comentarios || '',
    id_persona_reg: this.id_persona_reg || null,
    fecha_hora_reg: this.fecha_hora_reg ||  this.getCurrentDateTime(),
  };

  if (this.modalAction === 'add') {
    this.servRiesgos.addRiesgo(nuevoRiesgo).subscribe(
      (response) => {
        console.log('Riesgo añadido:', response);
        this.getRiesgos(); // Recargar la tabla
      },
      (error) => {
        console.error('Error al añadir riesgo:', error);
      }
    );
  } else if (this.modalAction === 'edit') {
    this.servRiesgos.editRiesgo(nuevoRiesgo).subscribe(
      (response) => {
        console.log('Riesgo actualizado:', response);
        this.getRiesgos(); // Actualizar la tabla
      },
      (error) => {
        console.error('Error al editar riesgo:', error);
      }
    );
  }
}


  // ======= ======= OPEN MODALS FUN ======= =======
  openModal(content: TemplateRef<any>) {
    this.modalService.open(content, { size: 'xl' });
  }

  // ======= ======= GET MODAL TITLE FUN ======= =======
  getModalTitle(modalAction: any) {
      this.modalTitle = (modalAction == "add") ? ("Añadir Riesgo") : this.modalTitle;
      this.modalTitle = (modalAction == "edit") ? ("Editar Riesgo") : this.modalTitle;
      return this.modalTitle;
  }

  // ======= ======= RIESGOS TABLE PAGINATION ======= =======
  get riesgosTable() {
    const start = (this.mainPage - 1) * this.mainPageSize;
      return this.riesgos.slice(start, start + this.mainPageSize);
  }

  // ======= ======= CHECKBOX CHANGED ======= =======
  checkboxChanged(riesgoSel: any) {
    this.riesgos.forEach(riesgo => {
        if(riesgoSel.id_riesgo == riesgo.id_riesgo) {
            if(riesgoSel.selected) {
                this.riesgoSelected = riesgoSel;
            } 
            else {
                this.riesgoSelected = null;
            }
        } 
        else {
            riesgo.selected = false;
        }
    });
  }

  // ======= ======= INIT RIESGO MODEL ======= =======
 // ======= ======= INIT RIESGO MODEL ======= =======
 initRiesgoModel() {
  this.modalTitle = "";

  this.id_riesgo = "";
   this.fecha_hora_reg = this.getCurrentDateTime();
  // this.fecha_hora_reg = "";
  this.id_persona_reg = "";
  this.id_proy_elemen_padre = null;
  this.idp_categoria = null;
  this.id_proyecto = null;
  this.fechaIdentificacion = null;
  this.riesgo = "";
  this.tituloRiesgo = "";
  this.descripcion = "";
  this.vinculados = "";
  this.idp_identificacion = "";
  this.idp_ocurrencia = null;
  this.medidas = "";
  this.idp_efectividad = null;
  this.comentarios = "";

}

   // ======= ======= INIT ADD RIESGO ======= =======
   initAddRiesgo(modalScope: TemplateRef<any>) {
    this.initRiesgoModel(); 
    this.modalAction = "add"; 
    this.modalTitle = this.getModalTitle("add");
  
    // Valores predeterminados
    this.id_proyecto = this.idProyecto || null;
    this.fecha_hora_reg = this.getCurrentDateTime();
    this.openModal(modalScope); 
  }
  
  // ======= ======= INIT EDIT RIESGO ======= =======
  initEditRiesgo(modalScope: TemplateRef<any>) {
    if (!this.riesgoSelected) {
      console.error('No se ha seleccionado ningún riesgo para editar');
      return;
    }
    this.initRiesgoModel(); 
    this.modalAction = "edit";
    this.modalTitle = this.getModalTitle("edit");
  
    // Asignar valores del riesgo seleccionado al formulario
    this.id_riesgo = this.riesgoSelected.id_riesgo;
    this.id_proyecto = this.riesgoSelected.id_proyecto;
    this.id_proy_elemen_padre = this.riesgoSelected.id_proy_elemen_padre;
    this.idp_categoria = this.riesgoSelected.idp_categoria;
    this.codigo = this.riesgoSelected.codigo;
    this.fechaIdentificacion = this.riesgoSelected.fechaIdentificacion;
    this.riesgo = this.riesgoSelected.riesgo;
    this.descripcion = this.riesgoSelected.descripcion;
    this.vinculados = this.riesgoSelected.vinculados;
    this.idp_identificacion = this.riesgoSelected.idp_identificacion;
    this.impacto = this.riesgoSelected.impacto;
    this.probabilidad = this.riesgoSelected.probabilidad;
    this.nivel = this.riesgoSelected.nivel;
    this.idp_ocurrencia = this.riesgoSelected.idp_ocurrencia;
    this.medidas = this.riesgoSelected.medidas;
    this.idp_efectividad = this.riesgoSelected.idp_efectividad;
    this.comentarios = this.riesgoSelected.comentarios;
  
    // Corregir la asignación de tituloRiesgo
    this.tituloRiesgo = this.riesgoSelected.riesgo || '';
    this.openModal(modalScope); 
  }

  // ======= ======= INIT DELETE RIESGO ======= =======
  initDeleteRiesgo(): void {
    if (!this.riesgoSelected) {
        console.error('No se ha seleccionado ningún riesgo para eliminar');
        return;
    }

    const confirmDelete = confirm(`¿Estás seguro de que deseas eliminar el riesgo con ID ${this.riesgoSelected.id_riesgo}?`);

    if (confirmDelete) {
        this.servRiesgos.deleteRiesgo(this.riesgoSelected.id_riesgo).subscribe(
            (response) => {
                console.log('Riesgo eliminado:', response);
                this.getRiesgos(); // Actualiza la tabla después de eliminar
                this.riesgoSelected = null; // Limpia la selección
            },
            (error) => {
                console.error('Error al eliminar el riesgo:', error);
            }
        );
    }
  }

  getRiesgos(): void {
    this.servRiesgos.getRiesgos()
        .subscribe(
            (data) => {
                console.log('Datos recibidos:', data);
             
                this.riesgos = Array.isArray(data[0]?.dato) ? data[0].dato : [];
                this.totalLength = this.riesgos.length; // Actualiza el total de registros
                this.countHeaderData(); // Recalcula las estadísticas
            },
            (error) => {
                console.error(error);
            }
        );
  }
      mapNivel(value: any): string {
        switch (value) {
          case '1':
            return 'Bajo';
          case '2':
            return 'Medio';
          case '3':
            return 'Alto';
          default:
            return 'Desconocido';
        }
      }

 
  // ======= ======= COUNT HEADER DATA FUNCTION ======= =======
  countHeaderData(): void {
    this.headerDataNro01 = 0;
    this.headerDataNro02 = 0;
    this.headerDataNro03 = 0;
    this.headerDataNro04 = 0;

    this.riesgos.forEach((riesgo) => {
        const nivel = Number(riesgo.nivel); 
        if (nivel === 3) {
            this.headerDataNro03 += 1;
        } else if (nivel === 2) {
            this.headerDataNro02 += 1;
        } else if (nivel === 1) {
            this.headerDataNro01 += 1;
        }
        if (riesgo.medidas === 'Si') {
            this.headerDataNro04 += 1;
        }
    });

    console.log('Contadores:', {
        alto: this.headerDataNro03,
        medio: this.headerDataNro02,
        bajo: this.headerDataNro01,
        medidas: this.headerDataNro04,
    });
  }

    getRiesgosAlto(): number {
      return this.headerDataNro03;
    }

    getRiesgosMedio(): number {
      return this.headerDataNro02;
    }

    getRiesgosBajo(): number {
      return this.headerDataNro01;
    }

    getRiesgosMedidas(): number {
      return this.headerDataNro04;
    }

}

