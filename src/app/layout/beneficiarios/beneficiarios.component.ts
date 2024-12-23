import { Component, OnInit, TemplateRef, EventEmitter, Output } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ProyectoService } from '../../services/proyectoData.service';
import { servicios } from "../../servicios/servicios";
import { BeneficiariosService } from "../../servicios/Beneficiarios";
import { AliadosService } from "../../servicios/aliados";
import { servPersona } from "../../servicios/persona";
import { servPersonaRoles } from "../../servicios/personaRoles";
import { ChangeDetectorRef } from '@angular/core';

import {servUbicaGeografica} from "../../servicios/ubicaGeografica";
import { register } from 'module';

interface Beneficiario {
  id: number;
  fecha: string;
  municipio: string;
  comunidad: string;
  tipoOrganizacion: string;
  organizacion: string;
  actividad: string;
  evento: string;
  details: string;
  mujeres: number;
  hombres: number;
  total: number;
  selected?: boolean;
}


@Component({
  selector: 'app-beneficiarios',
  templateUrl: './beneficiarios.component.html',
  styleUrls: ['./beneficiarios.component.scss'],

  animations: [routerTransition()]
})
export class BeneficiariosComponent implements OnInit {
  beneficiariosTable: Beneficiario[] = [];
  selectedBeneficiarios: Beneficiario | null = null;
  selectedAliados: any=null;
  beneficiariesForm: FormGroup;
  aliadosForm: FormGroup;

  mainPage = 1;
  mainPageSize = 10;
  totalLength = 0;

  constructor(
    private modalService: NgbModal,
    private proyectoService: ProyectoService,
    private fb: FormBuilder,
    private beneficiariosService: BeneficiariosService,
    
    private servicios: servicios,
    private aliadosService: AliadosService,
    private personaService: servPersona,
    private ubicaGeograficaService: servUbicaGeografica,
    private cdr: ChangeDetectorRef,
    private servPersonaRoles: servPersona
  ) {}


  // ======= ======= VARIABLES SECTION ======= =======
  departamentos: any[] = [];
  provincias: any[] = [];
  municipios: any[] = [];
  comunidades: any[] = [];
  tiposOrganizacion: any[] = [];
  actividades: any[] = [];
  organizaciones: any[] = [];
  organizacionTipo: any[] = [];
  aliadosTable: any[] = [];
  tiposConvenio: any[] = [];
  peronsaRegistro:any="";

  // ======= ======= HEADER SECTION ======= =======
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

  headerDataNro01: any = 0;
  headerDataNro02: any = 0;
  headerDataNro03: any = 0;
  headerDataNro04: any = 0;
  // ======= ======= ======= ======= =======

  // ====== VARIABLES DE PAGINACIÓN ======
  totalLengthBeneficiarios = 0;
  currentPageBeneficiarios = 1;
  pageSizeBeneficiarios = 10;

  totalLengthAliados = 0;
  currentPageAliados = 1;
  pageSizeAliados = 10;

  ngOnInit(): void {
    this.loadBeneficiarios();
    this.initForm();
    this.getActividades();
    this.loadDepartamentos();
    this.loadTiposOrganizacion();
    this.initAliadosForm();
    this.loadAliados();
    this.loadConvenios();
    this.countHeaderData();
    this.cargarPersonaRoles();
  }
//obtenr actividades
getActividades(): void {
  this.beneficiariosService.getActividades().subscribe(
    (response) => {
      console.log('Respuesta completa de actividades:', response);
      if (response[0]?.res === 'OK') {
        this.actividades = response[0].dato;
        console.log('Actividades cargadas:', this.actividades);
      }
    },
    (error) => console.error('Error al cargar actividades:', error)
  );
}

// inicializar formulario con los campos del beneficiario
  private initForm(): void {
    this.beneficiariesForm = this.fb.group({
      id: [{ value: '', disabled: true }],
      fecha: [''],
      department: [''],
      municipio: [''],
      comunidad: [''],
      tipoOrganizacion: [''],
      organizacion: [''],
      actividad: [''],
      evento: [''],
      mujeres: [0],
      hombres: [0],
      total: [{ value: 0, disabled: true  }],
      details: [''],
      registeredBy: [{ value: '' ,disabled: true }] // Este campo es solo lectura
     

    });

    
    
      // ======= GET organizacion tipo =======
  this.servicios.getParametricaByIdTipo(18).subscribe(
    (data) => {
      this. organizacionTipo = data[0].dato;
    },
    (error) => {
      console.error(error);
    }
  );
  }
  

  planifData: any[] = []; // Datos originales del API
  tablaPersonas: any[] = []; // Datos procesados para la tabla
  
  cargarPersonaRoles() {
    this.servPersonaRoles.getPersonas().subscribe((response: any) => {
      if (response[0]?.res === 'OK') {
        this.planifData = response[0]?.dato || [];
        this.tablaPersonas = this.planifData.map((persona, index) => ({
          id: index + 1,
          comunidad: persona.id_inst_unidad || 'N/A',
          docIden: persona.nro_documento || 'Sin documento',
          nombreCompleto: `${persona.nombres || ''} ${persona.apellido_1 || ''} ${persona.apellido_2 || ''}`.trim(),
          rangoEdad: this.calcularRangoEdad(persona.fecha_nacimiento),
          sexo: persona.sexo || 'N/A',
        }));
        console.log('Datos transformados:', this.tablaPersonas);
        this.cdr.detectChanges(); // Actualiza manualmente la vista
      }
    });
  }
  
  // Función para obtener el nombre completo de una persona
  obtenerNombreCompleto(persona: any): string {
    const nombres = persona.nombres || '';
    const apellido1 = persona.apellido_1 || '';
    const apellido2 = persona.apellido_2 || '';
    return `${nombres} ${apellido1} ${apellido2}`.trim();
  }
  
  // Función para calcular el rango de edad (opcional)
  calcularRangoEdad(fechaNacimiento: string | null): string {
    if (!fechaNacimiento) return 'N/A';
  
    const fechaNac = new Date(fechaNacimiento);
    const edad = new Date().getFullYear() - fechaNac.getFullYear();
    if (edad < 18) return 'Menor de edad';
    if (edad <= 35) return '18-35 años';
    if (edad <= 60) return '36-60 años';
    return 'Mayor de 60 años';
  }
  


/// init aliados form
private initAliadosForm(): void {
  this.aliadosForm = this.fb.group({
    id: [{ value: '', disabled: true }],
    identificationDate: ['',],
    tipoOrganizacion: ['',], 
    institution: ['',],
    referentName: ['',],
    resultsLink: [''],
    convenio: ['',],
    registeredByAliado: [{ value: '' ,disabled: true }] // Este campo es solo lectura
   
  });
}
loadDepartamentos(): void {
    this.ubicaGeograficaService.getUbicaciones(2, 1, 1).subscribe(
      (response) => {
        if (response[0]?.res === 'OK') {
          this.departamentos = response[0].dato;
          console.log('Departamentos recibidos :', this.departamentos); 
        }
      },
      (error) => console.error('Error al cargar departamentos:', error)
    );
  }
  
  onDepartamentoChange(p_orden_departamento: number): void {
    console.log('Departamento seleccionado en el select: ', p_orden_departamento);
    this.provincias = [];
    this.municipios = [];
    this.comunidades = [];
    this.ubicaGeograficaService.getUbicaciones(3, 1, p_orden_departamento).subscribe(
      (response) => {
        if (response[0]?.res === 'OK') {
          this.provincias = response[0].dato;
          console.log('Provincias recibidas:', this.provincias);
          this.provincias.forEach(provincia => {
            this.ubicaGeograficaService.getUbicaciones(4, 1, provincia.orden).subscribe(
              (response) => {
                if (response[0]?.res === 'OK') {
                  this.municipios = this.municipios.concat(response[0].dato);
                  console.log('Municipios recibidos:', this.municipios);
                }
              },
              (error) => console.error('Error al cargar municipios:', error)
            );
          });
        }
      },
      (error) => console.error('Error al cargar provincias:', error)
    );
  }
  onMunicipioChange(p_orden_monucipio: number): void {
    console.log('Municipio seleccionado en el select:', p_orden_monucipio);
    this.ubicaGeograficaService.getUbicaciones(5, 1,p_orden_monucipio).subscribe(
      (response) => {
        if (response[0]?.res === 'OK') {
          this.comunidades = response[0].dato;
          console.log('comunidades  recibidos :', this.comunidades); 
        }
      },
      (error) => console.error('Error al cargar comunidades:', error)
    );
  }



  loadTiposOrganizacion(): void {
    this.servicios.getParametricaByIdTipo(18).subscribe(
      (response) => {
        if (response[0]?.res === 'OK') {
          this.tiposOrganizacion = response[0].dato.map((item: any) => ({
            id: item.id_subtipo,
            nombre: item.descripcion_subtipo
          }));
        }
      },
      (error) => console.error('Error al cargar tipos de organización:', error)
    );
  }
 onTipoOrganizacionChange(tipoOrganizacionId: number): void {
    this.beneficiariosService.getOrganizacionesPorTipo(tipoOrganizacionId).subscribe(
      (response) => {
        if (response[0]?.res === 'OK') {
          this.organizaciones = response[0].dato;
        }
      },
      (error) => console.error('Error al cargar organizaciones:', error)
    );
  }
  loadBeneficiarios(): void {
    this.beneficiariosService.getBeneficiarios().subscribe(
      (response) => {
        console.log('Datos recibidos del servicio:', response);
        console.log('nombre de la persona', this.namePersonaReg);  
  
        if (response[0]?.res === 'OK') {
          const rawBeneficiarios = response[0].dato || [];
  
          this.beneficiariosTable = rawBeneficiarios.map((item: any) => ({
            id: item.id,
            fecha: item.fecha,
            municipio: item.municipio || 'Sin municipio',
            comunidad: item.comunidad || 'Sin comunidad',
            tipoOrganizacion: item.organizacion_tipo || 'Sin tipo',
            organizacion: item.organizacion || 'Sin organización',
            actividad: item.actividad || 'Sin actividad',
            evento: item.titulo_evento || 'Sin evento',
            details: item.evento_detalle || 'Sin detalles',
            mujeres: item.mujeres || 0,
            hombres: item.hombres || 0,
            total: item.total || 0,
          }));
  
          this.totalLengthBeneficiarios = this.beneficiariosTable.length;
  
          // Llamada a countHeaderData después de cargar los beneficiarios
          this.countHeaderData();
        } else {
          console.error('Respuesta inválida del servicio:', response);
        }
      },
      (error) => {
        console.error('Error al cargar los beneficiarios:', error);
      }
    );
  }
  
  get paginatedBeneficiarios(): Beneficiario[] {
    const startIndex = (this.currentPageBeneficiarios - 1) * this.pageSizeBeneficiarios;
    const endIndex = startIndex + this.pageSizeBeneficiarios;
    return this.beneficiariosTable.slice(startIndex, endIndex);
  }
  

  // Manejo de selección en la tabla
  checkboxChanged(selectedBeneficiario: Beneficiario): void {
    this.beneficiariosTable.forEach(b => (b.selected = b.id === selectedBeneficiario.id));
    this.selectedBeneficiarios = selectedBeneficiario.selected ? selectedBeneficiario : null;
  }
  

// Método para abrir el modal en modo edición o creación
openModal(modal: TemplateRef<any>, beneficiario?: Beneficiario): void {
  this.selectedBeneficiarios = beneficiario || null;

  if (beneficiario) {
    this.beneficiariesForm.patchValue({
      id: this.selectedBeneficiarios.id,
      fecha: beneficiario.fecha,
      municipio: this.selectedBeneficiarios.municipio,
      comunidad: beneficiario.comunidad,
      tipoOrganizacion: beneficiario.tipoOrganizacion,
      organizacion: beneficiario.organizacion,
      actividad: beneficiario.actividad,
      evento: beneficiario.evento,
      mujeres: beneficiario.mujeres,
      hombres: beneficiario.hombres,
      total: beneficiario.total,
      details: beneficiario.details,
 
      registeredBy: this.namePersonaReg // Asignar el nombre 


    });
    console.log('datos cargados al formulario:', this.beneficiariesForm.value);


  } else {

    this.beneficiariesForm.reset();
    // ASIGNAr el nombre de la persona que registra al formulario
    console.log('Nombre de la persona registrada primer verificacion:', this.namePersonaReg);
    this.beneficiariesForm.patchValue({
     registeredBy: this.namePersonaReg 

   });
    
  }

  document.querySelector('app-root')?.setAttribute('inert', 'true'); 
  this.modalService.open(modal).result.finally(() => {
    document.querySelector('app-root')?.removeAttribute('inert'); 
  });
}


   // Guardar o actualizar beneficiario
  onSubmit(): void {
      if (!this.beneficiariesForm.valid) {
          console.error('Formulario inválido:', this.beneficiariesForm.errors);
          return;
      }
  
      const formValue = this.beneficiariesForm.getRawValue();
      const beneficiarioData = {
          id: formValue.id || null,
          id_proyecto: parseInt(this.idProyecto,10),
          fecha: formValue.fecha || null,
          department: formValue.department || null,
          municipio: formValue.municipio || null,
          comunidad: formValue.comunidad || null,
          tipoOrganizacion: formValue.tipoOrganizacion || null,
          organizacion: formValue.organizacion || null,
          actividad: formValue.actividad || null,
          evento: formValue.evento || '',
          mujeres: formValue.mujeres || 0,
          hombres: formValue.hombres || 0,
          total: (formValue.mujeres || 0) + (formValue.hombres || 0),
          details: formValue.details || '',
          registeredBy: this.idPersonaReg || null,
      };
  
      console.log('Datos normalizados para enviar:', beneficiarioData);
  
      if (beneficiarioData.id) {
          this.editBeneficiario(beneficiarioData);
      } else {
          this.addBeneficiario(beneficiarioData);
      }


      this.loadBeneficiarios();
  }
  
  // Método para editar beneficiario
  editBeneficiario(beneficiarioData: any): void {
      this.beneficiariosService.editBeneficiario(beneficiarioData).subscribe(
          (response) => {
              console.log('Respuesta del backend (edición):', response);
              if (response[0]?.res === 'OK') {
                  this.loadBeneficiarios();
                  this.modalService.dismissAll();
              } else {
                  console.error('Error en la respuesta del backend (edición):', response);
              }
          },
          (error) => console.error('Error al editar beneficiario:', error)
      );
  }
  
  // Método para agregar beneficiario
  addBeneficiario(beneficiarioData: any): void {
      this.beneficiariosService.addBeneficiario(beneficiarioData).subscribe(
          (response) => {
              console.log('Respuesta del backend (creación):', response);
              if (response[0]?.res === 'OK') {
                  this.loadBeneficiarios();
                  this.modalService.dismissAll();
              } else {
                  console.error('Error en la respuesta del backend (creación):', response);
              }
          },
          (error) => console.error('Error al guardar beneficiario:', error)
      );
  }

  openDeleteBeneficiarioModal(deleteBeneficiarioModal: TemplateRef<any>): void {
    const modalRef = this.modalService.open(deleteBeneficiarioModal, { centered: true });
  
    modalRef.result.then(
      (result) => {
        if (result === 'Eliminar') {
          this.onDeleteBeneficiario(); // Proceder con la eliminación solo si se confirma
        }
      },
      (reason) => {
        console.log('Modal cerrado sin eliminar:', reason);
      }
    );
  }
  
  // Eliminar beneficiario
  onDeleteBeneficiario(): void {
    if (this.selectedBeneficiarios) {
      this.beneficiariosService.deleteBeneficiario(this.selectedBeneficiarios.id).subscribe(
        (response) => {
          console.log('Respuesta del backend (eliminar):', response);
          if (response[0]?.res === 'OK') {
            console.log('Beneficiario eliminado correctamente');
            this.loadBeneficiarios(); // Recargar la lista después de eliminar
            this.selectedBeneficiarios = null; // Reiniciar selección
          } else {
            console.error('Error en la respuesta del backend (eliminar):', response);
          }
        },
        (error) => console.error('Error al eliminar beneficiario:', error)
      );
    } else {
      console.warn('No hay beneficiario seleccionado para eliminar');
    }
  }

/// ahora alido 
 // Abrir el modal para crear o editar un aliado
 loadAliados(): void {
  this.aliadosService.getAliados().subscribe(
    (response) => {
      if (response[0]?.res === 'OK') {
        const rawAliados = response[0].dato || [];
        this.aliadosTable = rawAliados.map((item: any) => ({
          id: item.id,
          fecha: item.fecha,
          institucion: item.institucion || 'Sin institución',
          referente: item.referente || 'Sin referente',
          vinculo: item.vinculo || 'Sin vínculo',
          convenio: item.convenio || 'Sin convenio',
        }));

   
        this.totalLengthAliados = this.aliadosTable.length;
      } else {
        console.error('Respuesta inválida del servicio de aliados:', response);
      }
    },
    (error) => console.error('Error al cargar los aliados:', error)
  );
}


// agregar aliado


openAliadoModal(modal: TemplateRef<any>, aliado?: any): void {
  this.selectedAliados = aliado || null;

  if (aliado) {
    this.aliadosForm.patchValue({
      id: aliado.id,
      identificationDate: aliado.fecha,
      tipoOrganizacion: aliado.tipoOrganizacion || null,
      institution: aliado.institucion || null,
      referentName: aliado.referente || null,
      resultsLink: aliado.vinculo || null,
      convenio: aliado.convenio || null,
      registeredByAliado: this.namePersonaReg || null
    });
    console.log('nombre de persoanregistro en alidados ',this.namePersonaReg);
    
  } else {
    this.aliadosForm.reset();
    this.aliadosForm.patchValue({
      registeredByAliado: this.namePersonaReg || null
    });
  }

  this.modalService.open(modal).result.finally(() => {
    this.selectedAliados = null;
  });
}


checkboxChangedAliado(selectedAliado: any): void {
  this.aliadosTable.forEach(a => (a.selected = a.id === selectedAliado.id));
  this.selectedAliados = selectedAliado.selected ? selectedAliado : null;
}

onSubmitAliadosForm(): void {
  if (!this.aliadosForm.valid) {
    console.error('Formulario inválido:', this.aliadosForm.errors);
    return;
  }

  const aliadoData = this.aliadosForm.getRawValue();
  const aliadoPayload = {
    id: aliadoData.id || null,
    id_proyecto:this.idProyecto,
    fecha: aliadoData.identificationDate || null,
    tipoOrganizacion: aliadoData.tipoOrganizacion || null,
    institucion: aliadoData.institution || null,
    referente: aliadoData.referentName || null,
    vinculo: aliadoData.resultsLink || null,
    convenio: aliadoData.convenio || null,
    registeredBy: aliadoData.registeredBy || null
  };

  if (aliadoPayload.id) {
    this.editAliado(aliadoPayload);
  } else {
    this.addAliado(aliadoPayload);
  }
}


addAliado(aliadoData: any): void {
  this.aliadosService.addAliado(aliadoData).subscribe(
    (response) => {
      console.log('Respuesta del backend (añadir aliado):', response);
      if (response[0]?.res === 'OK') {
        this.loadAliados();
        this.modalService.dismissAll();
      } else {
        console.error('Error en la respuesta del backend (añadir aliado):', response);
      }
    },
    (error) => console.error('Error al añadir aliado:', error)
  );
}

editAliado(aliadoData: any): void {
  this.aliadosService.editAliado(aliadoData).subscribe(
    (response) => {
      console.log('Respuesta del backend (editar aliado):', response);
      if (response[0]?.res === 'OK') {
        this.loadAliados();
        this.modalService.dismissAll();
      } else {
        console.error('Error en la respuesta del backend (editar aliado):', response);
      }
    },
    (error) => console.error('Error al editar aliado:', error)
  );
}

openDeleteAliadoModal(deleteAliadoModal: any): void {
  const modalRef = this.modalService.open(deleteAliadoModal, { centered: true });

  modalRef.result.then(
    (result) => {
      if (result === 'Eliminar') {
        this.onDeleteAliado(modalRef); // Proceder con la eliminación
      }
    },
    (reason) => {
      console.log('Modal cerrado sin eliminar:', reason);
    }
  );
}

// Eliminar Aliado
onDeleteAliado(modalRef: any): void {
  if (this.selectedAliados) {
    this.aliadosService.deleteAliado(this.selectedAliados.id).subscribe(
      (response) => {
        console.log('Respuesta del backend (eliminar aliado):', response);
        if (response[0]?.res === 'OK') {
          console.log('Aliado eliminado correctamente');
          this.loadAliados(); // Recargar la lista después de eliminar
          this.selectedAliados = null; // Reiniciar selección
          modalRef.close(); // Cerrar el modal
        } else {
          console.error('Error en la respuesta del backend (eliminar aliado):', response);
        }
      },
      (error) => {
        console.error('Error al eliminar aliado:', error);
        modalRef.close(); // También cerrar el modal en caso de error
      }
    );
  }
}


// cargar convenios
loadConvenios(): void {
  this.servicios.getParametricaByIdTipo(5).subscribe(
    (response) => {
      if (response[0]?.res === 'OK') {
        this.tiposConvenio = response[0].dato.map((item: any) => ({
          id: item.id_subtipo,
          descripcion: item.descripcion_subtipo,
        }));
        console.log('Convenios cargados:', this.tiposConvenio);
      }
    },
    (error) => console.error('Error al cargar convenios:', error)
  );
}

get paginatedAliados(): any[] {
  const startIndex = (this.currentPageAliados - 1) * this.pageSizeAliados;
  const endIndex = startIndex + this.pageSizeAliados;
  return this.aliadosTable.slice(startIndex, endIndex);
}

countHeaderData() {
  // Inicializar contadores
  this.headerDataNro01 = 0;
  this.headerDataNro02 = 0;
  this.headerDataNro03 = 0;
  this.headerDataNro04 = 0;

  // Iterar sobre la tabla de beneficiarios
  this.beneficiariosTable.forEach((beneficiario) => {
    // Contar comunidades presentes en la lista de comunidades
    if (this.comunidades.includes(beneficiario.comunidad)) {
      this.headerDataNro04++;
    }

    // Contar beneficiarios que sean mujeres
    if (beneficiario.mujeres && typeof beneficiario.mujeres === 'number') {
      this.headerDataNro02 += beneficiario.mujeres;
    }

    // Contar beneficiarios que sean hombres
    if (beneficiario.hombres && typeof beneficiario.hombres === 'number') {
      this.headerDataNro03 += beneficiario.hombres;
    }

    // Contar aliados (condición a ajustar según tus necesidades)
    if (beneficiario.total !== undefined && typeof beneficiario.total === 'number') {
      this.headerDataNro01++;
    }
  });
}



}