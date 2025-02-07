import { Component, OnInit, TemplateRef, EventEmitter, Output } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { NgbModal,NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ProyectoService } from '../../services/proyectoData.service';
import { servPersona } from "../../servicios/persona"; 
import {Params_generales} from "../../servicios/Params_generales";
import { ChangeDetectorRef } from '@angular/core';

//General
import { servicios } from "../../servicios/servicios";
import { ServOrganizacion } from "../../servicios/organizaciones";
//Beneficiarios
import { BeneficiariosService } from "../../servicios/Beneficiarios";
import {servUbicaGeografica} from "../../servicios/ubicaGeografica";
import {servListBenef} from "../../servicios/ListBeneficiarios";
import { servActividad } from "../../servicios/actividad";
//Aliados
import { servAliados } from "../../servicios/aliados";
import { servInstituciones } from "../../servicios/instituciones";

interface Beneficiario {
  id: number;
  fecha: string;
  departamento: string;
  municipio: string;
  comunidad: string;
  idp_organizacion_tipo: string;
  id_organizacion: string;
  id_proy_actividad: string;
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
  styleUrls: ['../../../styles/styles.scss'],
  animations: [routerTransition()]
})
export class BeneficiariosComponent implements OnInit {
  beneficiariosTable: Beneficiario[] = [];
  selectedBeneficiarios: Beneficiario | null = null;
  selectedAliados: any=null;
  beneficiariesForm: FormGroup;
  beneficiariesFormUbicacion:FormGroup;
  aliadosForm: FormGroup;
  organizacionForm: FormGroup;
  previousIdProyecto: any;
  selectedOrganizacionId: any;
  geografia: any;
  instituciones: any;
 

  constructor(
    private fb: FormBuilder,
    private beneficiariosService: BeneficiariosService,
    private personaService: servPersona,
    private ubicaGeograficaService: servUbicaGeografica,
    private cdr: ChangeDetectorRef,
    private servPersonaRoles: servPersona,
    private Params_generales:Params_generales,
    //General
    private modalService: NgbModal,
    private proyectoService: ProyectoService,
    private servicios: servicios,
    private ServOrganizacion: ServOrganizacion,
    //Beneficiarios
    private servUbicaGeografica: servUbicaGeografica,
    private servListBenef: servListBenef,
    private servActividad: servActividad,
    //Aliados
    private servAliados: servAliados,
    private servInstituciones:servInstituciones
  ) {}


  // ======= ======= VARIABLES SECTION ======= =======
      departamentos: any[] = [];
      provincias: any[] = [];
      municipios: any[] = [];
      comunidades: any[] = [];

      beneficiariosOrganizacion: any[] = [];
      beneficiariosActividad: any[] = [];
      beneficiariosOrganizacionTipo: any[] = [];
  
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
      this.ngOnInit();
      this.loadGeografica();
      this.loadBeneficiarios();
      this.initForm();
      this.loadDepartamentos();
      this.loadRangosEdad();
      //General
      this.getParametricasOrganizaciones();
      //Aliados
      this.getParametricasAliados();
      this.getAliados();
      this.aliadosSelected = null;

  }

  headerDataNro01: any = 0;
  headerDataNro02: any = 0;
  headerDataNro03: any = 0;
  headerDataNro04: any = 0;
  // ======= ======= ======= ======= =======

  // ====== VARIABLES DE PAGINACIÓN ======
  pageSizeBeneficiarios = 10;
  currentPageBeneficiarios = 1;
  totalLengthBeneficiarios = 0;
  
  ngOnInit(): void {
    this.loadGeografica();
    this.loadBeneficiarios();
    this.initForm();
    this.loadDepartamentos();
    this.loadRangosEdad();
    //General
    this.getParametricasOrganizaciones();
    //Beneficiarios
    this.getParametricasBeneficiarios();
    //Aliados
    this.getParametricasAliados();
    this.getAliados();

  }
  // ======= ======= ======= ======= ======= ======= ======= ======= ======= ======= =======
      jsonToString(json: object): string {
        return JSON.stringify(json);
      }
      stringToJson(jsonString: string): object {
        return JSON.parse(jsonString);
      }
      // GET PARAMETRICAS
      getDescripcionSubtipo(idRegistro: any, paramList: any): string{
        const subtipo = paramList.find(elem => elem.id_subtipo == idRegistro);
        return subtipo ? subtipo.descripcion_subtipo : 'Null';
      }
      // GET ORGANIZACION
      getOrganizacion(idRegistro: any, paramList: any): string{
        const org = paramList.find(elem => elem.id_organizacion == idRegistro);
        return org ? org.organizacion : '';
      }
      // GET ACTIVIDAD
      getActividad(idRegistro: any, paramList: any): string{
        const actividad = paramList.find(elem => elem.id_proy_actividad == idRegistro);
        return actividad ? actividad.actividad : '';
      }
      // GET ORGANIZACION TIPO
      getOrganizacionTipo(idRegistro: any, paramList: any): string{
      const subtipo = paramList.find(elem => elem.id_subtipo == idRegistro);
      return subtipo ? subtipo.descripcion_subtipo : '';
      }
      // GET DE FECHA Y HORA
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
// ======= ======= ======= ======= ======= ======= ======= ======= ======= ======= =======
    getParametricasBeneficiarios(){
      // ACTIVIDADES POR ID_PROYECTO
      this.servActividad.getActividadesByIdProy(this.idProyecto).subscribe(
        (data) => {
          if(data[0]?.dato) {
            this.beneficiariosActividad = data[0].dato;
          }
        },
        (error) => {
          console.error('Error al cargar actividades:', error);
        }
      );
      // TIPOS DE ORGANIZACIÓN
      this.servicios.getParametricaByIdTipo(18).subscribe(
        (data) => {
          if(data[0]?.dato) {
            this.beneficiariosOrganizacionTipo = data[0].dato;
          }
        },
        (error) => {
          console.error('Error al cargar tipos de organización:', error);
        }
      );
      // ORGANIZACIONES POR ID PROYECTO
      this.ServOrganizacion.getOrganizacionByIdProy(this.idProyecto).subscribe(
        (data) => {
          if(data[0]?.dato) {
            this.beneficiariosOrganizacion = data[0].dato;
          }
        },
        (error) => {
          console.error('Error al cargar organizaciones:', error);
        }
      );
    }

      // inicializar formulario con los campos del beneficiario
      initForm(): void {
        this.beneficiariesForm = this.fb.group({
          id: [{value: '', disabled: true}],
          fecha: ['', [Validators.required]],
          departamento: ['', [Validators.required]],
          municipio: [{value: '', disabled: true}, [Validators.required]],
          comunidad: [{value: '', disabled: true}, [Validators.required]],
          id_proy_actividad: [null, [Validators.required]], 
          idp_organizacion_tipo: [null, [Validators.required]], 
          id_organizacion: [null, [Validators.required]],
          evento: ['', [Validators.required]],
          mujeres: [{value: 0, disabled: true}],
          hombres: [{value: 0, disabled: true}],
          total: [{value: 0, disabled: true}],
          details: ['', [Validators.required]],
          registeredBy: [{value: '', disabled: true}]
        });
      }
      // 
    loadGeografica():void{
      this.ubicaGeograficaService.getUbicaGeografica().subscribe(
        (response) => {
          if (response[0]?.res === 'OK') {
            this.geografia = response[0].dato;
          } else {
            console.error('Respuesta inválida del servicio:', response);
          }
        },
        (error) => console.error('Error al cargar departamentos:', error)
      );
    }

    loadDepartamentos(): void {
        this.ubicaGeograficaService.getUbicaciones(2, 1, 1).subscribe(
          (response) => {
            if (response[0]?.res === 'OK') {
              this.departamentos = response[0].dato;
            }
          },
          (error) => console.error('Error al cargar departamentos:', error)
        );
      }
    getIdDepartamento(nombre:any): number | undefined {
      const departamento =  this.geografia.find(muni => muni.nombre === nombre);
      return departamento ? departamento.id_ubica_geo : undefined;
    }
    getIdMunicipio(nombre: any): number | undefined {
      const municipio =  this.geografia.find(muni => muni.nombre === nombre);
      return municipio ? municipio.id_ubica_geo : undefined;
    }
    getIdComunidad(nombre: string): number | undefined {  
      const comunidad =  this.geografia.find(comu => comu.nombre === nombre);
      return comunidad ? comunidad.id_ubica_geo : undefined;
    }

    onDepartamentoChange(p_orden_departamento: any): void {
      const idDepartamento = this.getIdDepartamento(p_orden_departamento);

      if (!idDepartamento) {
          console.error('ID de departamento no encontrado');
          this.provincias = [];
          this.municipios = [];
          this.comunidades = [];
          return;
      }

      const nivelProvincia = 3; // Nivel correspondiente a las provincias
      const nivelMunicipio = 4; // Nivel correspondiente a los municipios
      const nivelComunidad = 5; // Nivel correspondiente a las comunidades
      const ramaDeseada = 1; // Ajustar según el valor correcto para "rama"

      // Filtrar provincias
      this.provincias = this.geografia.filter(
          (geo) =>
              geo.nivel === nivelProvincia &&
              geo.rama === ramaDeseada &&
              geo.id_ubica_geo_padre === idDepartamento
      );

      // Filtrar municipios basados en las provincias
      const idProvincias = this.provincias.map(provincia => provincia.id_ubica_geo);
      this.municipios = this.geografia.filter(
          (geo) =>
              geo.nivel === nivelMunicipio &&
              geo.rama === ramaDeseada &&
              idProvincias.includes(geo.id_ubica_geo_padre)
      );

      // Filtrar comunidades basadas en los municipios
      const idMunicipios = this.municipios.map(municipio => municipio.id_ubica_geo);
      this.comunidades = this.geografia.filter(
          (geo) =>
              geo.nivel === nivelComunidad &&
              geo.rama === ramaDeseada &&
              idMunicipios.includes(geo.id_ubica_geo_padre)
      );
      
      this.beneficiariesForm.get('municipio')?.enable();
      this.beneficiariesForm.get('comunidad')?.disable();
      this.beneficiariesForm.get('municipio')?.setValue('');
      this.beneficiariesForm.get('comunidad')?.setValue('');
    }
    onMunicipioChange(p_orden_municipio: any): void {
      if (!p_orden_municipio) {
        this.comunidades = [];
        return;
      }

      const idMunicipio = this.getIdMunicipio(p_orden_municipio);
      
      if (!idMunicipio) {
        console.error('ID de municipio no encontrado');
        return;
      }

      // Filtrar comunidades directamente usando el ID del municipio
      this.comunidades = this.geografia.filter(geo => 
        geo.nivel === 5 && 
        geo.rama === 1 && 
        geo.id_ubica_geo_padre === idMunicipio
      );

      // Habilitar campo de comunidad
      this.beneficiariesForm.get('comunidad')?.enable();
    }

  loadBeneficiarios(): void {
    this.beneficiariosService.getBeneficiarios(this.idProyecto).subscribe(
      (response) => {
        if (response[0]?.res === 'OK') {
          const rawBeneficiarios = Array.isArray(response[0]?.dato) ? response[0].dato : [];
          
          this.beneficiariosTable = rawBeneficiarios.map((item: any) => {
            // Buscar el tipo de organización
            const tipoOrg = this.beneficiariosOrganizacionTipo.find(
              tipo => tipo.id_subtipo === item.idp_organizacion_tipo
            );
  
            return {
              id: item.id,
              fecha: item.fecha,
              departamento: item.departamento,
              municipio: item.municipio || null,
              comunidad: item.comunidad || null,
              idp_organizacion_tipo: item.idp_organizacion_tipo || null,
              id_organizacion: item.id_organizacion || null,
              id_proy_actividad: item.id_proy_actividad || null,
              evento: item.titulo_evento || null,
              details: item.evento_detalle || null,
              mujeres: item.mujeres || 0,
              hombres: item.hombres || 0,
              total: item.total || 0,
            };
          });
  
          this.totalLengthBeneficiarios = this.beneficiariosTable.length;
          this.countHeaderData();
        }
      },
      (error) => console.error('Error al cargar los beneficiarios:', error)
    );
  }
  
  
  get paginatedBeneficiarios(): Beneficiario[] {
    const startIndex = (this.currentPageBeneficiarios - 1) * this.pageSizeBeneficiarios;
    const endIndex = startIndex + this.pageSizeBeneficiarios;
    return this.beneficiariosTable.slice(startIndex, endIndex);
  }
  

  // Manejo de selección en la tabla
  checkboxChanged(selectedBeneficiario: Beneficiario): void {
    // Limpiar la tabla de participantes antes de cargar los nuevos
    this.mostrarTablaParticipantes = false;
    this.planifData = [];
    this.tablaPersonas = [];
    
    // Actualizar selección en la tabla
    this.beneficiariosTable.forEach(b => (b.selected = b.id === selectedBeneficiario.id));
    
    // Filtrar el ID de la organización por el nombre proporcionado
    if (selectedBeneficiario.id_organizacion) {
      const organizacion = this.beneficiariosOrganizacionTipo.find(
        org => org.organizacion === selectedBeneficiario.id_organizacion
      );

      if (organizacion) {
        this.selectedOrganizacionId = organizacion.id_organizacion;
      } else {
        this.selectedOrganizacionId = null;
      }
    }

    // Actualizar el beneficiario seleccionado
    this.selectedBeneficiarios = selectedBeneficiario.selected ? selectedBeneficiario : null;
    if (this.selectedBeneficiarios) {
      this.cargarPersona(this.selectedBeneficiarios.id);
    }
  }

// Método para abrir el modal en modo edición o creación
openModal(modal: TemplateRef<any>, beneficiario?: Beneficiario, isListModal: boolean = false): void {
  if (!isListModal) {
    this.selectedBeneficiarios = beneficiario || null;

    if (beneficiario) {
      // Convertir explícitamente a números
      const idPoryActividad = beneficiario.id_proy_actividad ? Number(beneficiario.id_proy_actividad) : null;
      const idpOrganizacionTipo = beneficiario.idp_organizacion_tipo ? Number(beneficiario.idp_organizacion_tipo) : null;
      const idOrganizacion = beneficiario.id_organizacion ? Number(beneficiario.id_organizacion) : null;

      this.beneficiariesForm.patchValue({
        id: beneficiario.id,
        fecha: beneficiario.fecha,
        departamento: beneficiario.departamento,
        id_proy_actividad: idPoryActividad,
        idp_organizacion_tipo: idpOrganizacionTipo,
        id_organizacion: idOrganizacion,
        evento: beneficiario.evento,
        mujeres: Number(beneficiario.mujeres),
        hombres: Number(beneficiario.hombres),
        total: Number(beneficiario.total),
        details: beneficiario.details,
        registeredBy: this.namePersonaReg
      });

      // Forzar la carga de datos dependientes
      this.onDepartamentoChange(beneficiario.departamento);
      
      setTimeout(() => {
        this.beneficiariesForm.patchValue({
          municipio: beneficiario.municipio,
          comunidad: beneficiario.comunidad
        });
      }, 100);
    } else {
      this.beneficiariesForm.reset({
        registeredBy: this.namePersonaReg,
        mujeres: 0,
        hombres: 0,
        total: 0
      });
    }
  }

  document.querySelector('app-root')?.setAttribute('inert', 'true');
  this.modalService.open(modal, { size: 'xl' }).result.finally(() => {
    document.querySelector('app-root')?.removeAttribute('inert');
  });
}


saveLocationSelection() : void{
const formV=this.beneficiariesFormUbicacion.getRawValue();
const ubicaionData={
  departamento:formV.departamento,
  municipio:formV.municipio,
  comunidad:formV.comunidad
}
this.beneficiariesForm.patchValue({
  departamento:formV.departamento,
  municipio:formV.municipio,
  comunidad:formV.comunidad
})
}

onSubmit(): void {
  // Habilitar temporalmente los campos deshabilitados para obtener sus valores
  const mujeres = this.beneficiariesForm.get('mujeres');
  const hombres = this.beneficiariesForm.get('hombres');
  const total = this.beneficiariesForm.get('total');
  
  mujeres?.enable();
  hombres?.enable();
  total?.enable();

  if (this.beneficiariesForm.invalid) {
    Object.keys(this.beneficiariesForm.controls).forEach(key => {
      const control = this.beneficiariesForm.get(key);
      control?.markAsTouched();
    });
    
    // Volver a deshabilitar los campos
    mujeres?.disable();
    hombres?.disable();
    total?.disable();
    return;
  }

  const formValue = this.beneficiariesForm.getRawValue();
  
  // Asegurarnos de que los valores numéricos sean números y no null
  const beneficiarioData = {
    id: formValue.id || null,
    id_proyecto: this.idProyecto ? Number(this.idProyecto) : null,
    fecha: formValue.fecha || new Date().toISOString().split('T')[0],
    departamento: formValue.departamento,
    municipio: formValue.municipio ? this.getIdMunicipio(formValue.municipio) : null,
    comunidad: formValue.comunidad ? this.getIdComunidad(formValue.comunidad) : null,
    id_proy_actividad: Number(formValue.id_proy_actividad),
    idp_organizacion_tipo: Number(formValue.idp_organizacion_tipo),
    id_organizacion: Number(formValue.id_organizacion),
    evento: formValue.evento || '',
    mujeres: Number(formValue.mujeres) || 0,
    hombres: Number(formValue.hombres) || 0,
    total: Number(formValue.mujeres || 0) + Number(formValue.hombres || 0),
    details: formValue.details || '',
    registeredBy: this.idPersonaReg ? Number(this.idPersonaReg) : null
  };

  // Volver a deshabilitar los campos
  mujeres?.disable();
  hombres?.disable();
  total?.disable();

  if (formValue.id) {
    this.editBeneficiario(beneficiarioData);
  } else {
    this.addBeneficiario(beneficiarioData);
  }
}
  
  // Método para editar beneficiario
  editBeneficiario(beneficiarioData: any): void {
    this.beneficiariosService.editBeneficiario(beneficiarioData).subscribe({
      next: (response) => {
        if (response[0]?.res === 'OK') {
          this.loadBeneficiarios();
          this.modalService.dismissAll();
          this.selectedBeneficiarios = null;
          alert('Beneficiario editado exitosamente');
        } else {
          console.error('Error en la respuesta:', response);
        }
      },
      error: (error) => {
        console.error('Error al editar:', error);
        alert('Error al editar beneficiario');
      }
    });
  }
  
  addBeneficiario(beneficiarioData: any): void {
    this.beneficiariosService.addBeneficiario(beneficiarioData).subscribe({
      next: (response) => {
        if (response[0]?.res === 'OK') {
          this.loadBeneficiarios();          
          this.modalService.dismissAll();
          alert('Beneficiario agregado exitosamente');
        } else {
          console.error('Error en la respuesta del backend:', response);
        }
      },
      error: (error) => {
        console.error('Error al añadir beneficiario:', error);
        alert('Error al añadir beneficiario');
      }
    });
  }

  openDeleteBeneficiarioModal(deleteBeneficiarioModal: TemplateRef<any>): void {
    const modalRef = this.modalService.open(deleteBeneficiarioModal, { centered: true });
  
    modalRef.result.then(
      (result) => {
        if (result === 'Eliminar') {
          this.onDeleteBeneficiario(); 
        }
      },
      (reason) => {
        console.error('Modal cerrado sin eliminar:', reason);
      }
    );
  }
  
  // Eliminar beneficiario
  onDeleteBeneficiario(): void {
    if (this.selectedBeneficiarios) {
      this.beneficiariosService.deleteBeneficiario(this.selectedBeneficiarios.id).subscribe(
        (response) => {
          if (response[0]?.res === 'OK') {
            this.loadBeneficiarios(); 
            this.selectedBeneficiarios = null;
            alert('Beneficiario eliminado correctamente'); 
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
// ======= ======= ======= ======= ======= ======= =======  ======= =======
 // ======= ======= LISTA DE BENEFICICIARIOS - proy_bene_lista ======= =======

  planifData: any[] = [];
  tablaPersonas: any[] = [];
  participanteForm: FormGroup;
  rangosEdad: any[] = [];
  modalRefParticipante: NgbModalRef;
  mostrarTablaParticipantes: boolean = false;
  contadorParticipantes: number = 1;
  initParticipanteForm(): void {
    this.participanteForm = this.fb.group({
      id_proy_bene_lista: [null],
      id_proy_beneficiario: [null],
      comunidad: ['', [
        Validators.required,
        Validators.maxLength(50)
      ]],
      num_doc_identidad: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(10),
        Validators.pattern(/^[0-9]+$/)
      ]],
      nombre: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ]],
      idp_rango_edad: ['', Validators.required],
      es_hombre: [true]
    });
  }
 
  cargarPersona(id_beneficiario: number): void {
    if (!id_beneficiario) {
      console.error('ID de beneficiario no válido');
      this.mostrarTablaParticipantes = false;
      this.planifData = [];
      this.tablaPersonas = [];
      return;
    }

    this.servListBenef.getListBeneByIdProy(id_beneficiario).subscribe({
      next: (response: any) => {
        if (Array.isArray(response) && response.length > 0 && response[0]?.res === 'OK') {
          // Filtramos solo los beneficiarios que corresponden al id_beneficiario actual
          this.planifData = response[0].dato.filter(item => 
            item.id_proy_beneficiario === id_beneficiario
          );
          
          // Solo mostrar la tabla si hay datos
          this.mostrarTablaParticipantes = this.planifData.length > 0;
          
          this.contadorParticipantes = 1; // Reiniciar contador
          this.procesarDatosPersonas();
        } else {
          console.error('Formato de respuesta inválido:', response);
          this.mostrarTablaParticipantes = false;
          this.planifData = [];
          this.tablaPersonas = [];
        }
      },
      error: (error) => {
        console.error('Error al cargar la lista de beneficiarios:', error);
        this.mostrarTablaParticipantes = false;
        this.planifData = [];
        this.tablaPersonas = [];
      },
      complete: () => {
        this.cdr.detectChanges();        
      }
    });
  }

  private procesarDatosPersonas(): void {
    if (!this.selectedBeneficiarios) return;
  
    this.tablaPersonas = this.planifData.map((persona) => ({
      id: this.contadorParticipantes++,
      comunidad: persona.comunidad || 'Sin comunidad',
      docIden: persona.num_doc_identidad || 'Sin documento',
      nombreCompleto: persona.nombre || 'Sin nombre',
      rangoEdad: this.getRangoEdadNombre(persona.idp_rango_edad),
      sexo: persona.es_hombre !== undefined ? 
        (persona.es_hombre ? 'Hombre' : 'Mujer') : 'N/A',
      id_real: persona.id_proy_bene_lista
    }));
  }

  getRangoEdadNombre(id: number): string {
    if (!id || !this.rangosEdad) return 'N/A';
    
    const rango = this.rangosEdad.find(r => r.id === id);
    return rango?.descripcion || 'N/A';
  }
  loadRangosEdad(): void {
    this.servicios.getParametricaByIdTipo(20).subscribe({
      next: (response) => {
        if (response[0]?.res === 'OK') {
          this.rangosEdad = response[0].dato.map((item: any) => ({
            id: item.id_subtipo,
            descripcion: item.descripcion_subtipo
          }));
          
          if (this.selectedBeneficiarios?.id) {
            this.cargarPersona(this.selectedBeneficiarios.id);
          }
        }
      },
      error: (error) => {
        console.error('Error al cargar rangos de edad:', error);
        this.rangosEdad = [];
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

  // Función para abrir el modal de nuevo participante
  openParticipanteModal(modal: any): void {
    if (!this.selectedBeneficiarios) {
      console.error('No hay beneficiario seleccionado');
      return;
    }

    this.initParticipanteForm();
    this.participanteForm.patchValue({
      id_proy_beneficiario: this.selectedBeneficiarios.id,
    });

    this.modalRefParticipante = this.modalService.open(modal, { 
      size: 'lg',
      backdrop: 'static'
    });
  }
  
  onSubmitParticipante(): void {
    if (this.participanteForm.invalid) {
      Object.keys(this.participanteForm.controls).forEach(key => {
        const control = this.participanteForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
      return;
    }
     
    const formValue = this.participanteForm.getRawValue();
  
    const participanteData = {
      id_proy_beneficiario: this.selectedBeneficiarios.id,
      comunidad: formValue.comunidad,
      num_doc_identidad: formValue.num_doc_identidad,
      nombre: formValue.nombre,
      idp_rango_edad: formValue.idp_rango_edad,
      es_hombre: formValue.es_hombre
    };
  
    this.servListBenef.addListBene(participanteData).subscribe({
      next: (response) => {
        if (response[0]?.res === 'OK') {
          // Primero cargar la persona
          this.cargarPersona(this.selectedBeneficiarios.id);
          // Luego actualizar totales
          this.actualizarTotales();
          // Actualizar la vista completa
          this.loadBeneficiarios();
          this.participanteForm.reset();
          this.modalRefParticipante.close();
        } else {
          console.error('Error en la respuesta:', response);
        }
      },
      error: (error) => {
        console.error('Error al guardar participante:', error);
      }
    });
  }
  // Función para eliminar participante
  deleteParticipante(index: number): void {
    const participante = this.tablaPersonas.find(p => p.id === index);
    if (!participante?.id_real) {
      console.error('ID de participante no válido');
      return;
    }
  
    this.servListBenef.deleteListBene(participante.id_real).subscribe({
      next: (response) => {
        if (response[0]?.res === 'OK') {
          // Filtrar localmente
          this.tablaPersonas = this.tablaPersonas.filter(p => p.id !== index);
          this.planifData = this.planifData.filter(p => p.id_proy_bene_lista !== participante.id_real);
  
          if (this.selectedBeneficiarios) {
            // Actualizar totales
            const nuevoTotal = {
              hombres: participante.sexo === 'Hombre' ? 
                this.selectedBeneficiarios.hombres - 1 : 
                this.selectedBeneficiarios.hombres,
              mujeres: participante.sexo === 'Mujer' ? 
                this.selectedBeneficiarios.mujeres - 1 : 
                this.selectedBeneficiarios.mujeres              
            };
  
            // Forzar actualización de totales
            this.actualizarTotales();
  
            // Forzar detección de cambios
            this.cdr.detectChanges();
          }
        } else {
          console.error('Error en la respuesta:', response);
        }
      },
      error: (error) => {
        console.error('Error al eliminar participante:', error);
      }
    });
  }
  private actualizarTotales(): void {
    if (!this.selectedBeneficiarios) return;
  
    this.servListBenef.getListBeneByIdProy(this.selectedBeneficiarios.id).subscribe({
      next: (response) => {
        if (response[0]?.res === 'OK') {
          const participantes = response[0].dato;
          
          // Calcular totales
          const totales = participantes.reduce((acc, curr) => {
            if (curr.es_hombre) {
              acc.hombres += 1;
            } else {
              acc.mujeres += 1;
            }
            return acc;
          }, { hombres: 0, mujeres: 0 });
  
          // Actualizar el formulario
          this.beneficiariesForm.patchValue({
            mujeres: totales.mujeres,
            hombres: totales.hombres,
            total: totales.hombres + totales.mujeres
          });
  
          // Preparar datos para actualizar
          const beneficiarioActualizado = {
            ...this.selectedBeneficiarios,
            hombres: totales.hombres,
            mujeres: totales.mujeres,
            total: totales.hombres + totales.mujeres
          };
  
          // Actualizar en la base de datos
          this.beneficiariosService.editBeneficiario(beneficiarioActualizado).subscribe({
            next: (updateResponse) => {
              if (updateResponse[0]?.res === 'OK') {
                // Actualizar la tabla local
                const index = this.beneficiariosTable.findIndex(b => b.id === this.selectedBeneficiarios.id);
                if (index !== -1) {
                  this.beneficiariosTable[index] = {
                    ...this.beneficiariosTable[index],
                    hombres: totales.hombres,
                    mujeres: totales.mujeres,
                    total: totales.hombres + totales.mujeres
                  };
                }
                // Forzar la detección de cambios
                this.cdr.detectChanges();
                // Actualizar los contadores del header
                this.countHeaderData();
              }
            },
            error: (error) => console.error('Error al actualizar beneficiario:', error)
          });
        }
      },
      error: (error) => console.error('Error al obtener lista de participantes:', error)
    });
  }

// ======= ======= ======= ======= ======= ======= =======  ======= =======

// ======= ======= ======= ======= ======= ======= =======  ======= =======
// ======= ======= =======  ALIADOS - PROY_ALIADOS  ======= ======= =======
// ======= ======= ======= ======= ======= ======= =======  ======= =======
    // ======= ======= NGMODEL VARIABLES GENERALES ======= =======
        aliados: any[] = [];
        mainPageAliados = 1;
        mainPageSizeAliados = 10;
        totalLengthAliados = 0;

    // ======= ======= NGMODEL VARIABLES SECTION ALIADOS ======= =======
        modalTitleAliado: any = "";
        modalActionAliado: any = '';

        id_proy_aliado: any = '';
        id_proyecto: any = '';
        fecha: any = '';
        id_organizacion: any = '';
        referente: any = '';
        vinculo: any = '';
        idp_convenio: any = '';
        id_persona_reg: any = '';
        fecha_hora_reg: any = '';

        aliados_persona_registro: any = "";
        aliados_fecha_registro: any = "";
    // ======= ======= LLAMADOS A SELECCIONADORES PARA NODAL ALIADOS ======= =======
        aliadosOrganizacion: any[] = [];
        aliadosConvenio: any[] = [];
    // ======= ======= GET PARAMETRICAS ALIADOS ======= =======
        getParametricasAliados():void{
          // ======= GET ORGANIZACIONES =======
          this.ServOrganizacion.getOrganizacionByIdProy(this.idProyecto).subscribe(
            (data) => {
              this.aliadosOrganizacion = data[0].dato;
            },
            (error) => {
              console.error(error);
            }
          );
          // ======= GET CONVENIO =======
          this.servicios.getParametricaByIdTipo(21).subscribe(
            (data) => {
              this.aliadosConvenio = data[0].dato;
            },
            (error) => {
              console.error(error);
            }
          );
        }
    // ======= ======= VALDIATE FUNCTIONS SECTION ======= =======
        valReferente: any = true;
        ValidateReferente(){
          this.valReferente = true;
          if((!this.referente)||(this.referente.length >= 100)){
            this.valReferente = false;
          }
        }
        valVinculo: any = true;
        ValidateVinculo(){
          this.valVinculo = true;
          if((!this.vinculo)||(this.vinculo.length >= 255)){
            this.valVinculo = false;
          }
        }

    // ======= ======= OPEN MODALS FUN ======= =======
        private modalRef: NgbModalRef | null = null;
        openModalAliado(content: TemplateRef<any>) {
        this.modalRef = this.modalService.open(content, { size: 'xl' });
        }
        closeModalAliado() {
        if (this.modalRef) {
          this.modalRef.close(); 
          this.modalRef = null;
        }
        }
    // ======= ======= GET ALIADOS ======= =======
        getModalTitleAliado(modalActionAliado: any) {
        this.modalTitleAliado = (modalActionAliado == "add") ? ("Añadir Aliado") : this.modalTitleAliado;
        this.modalTitleAliado = (modalActionAliado == "edit") ? ("Editar Aliado") : this.modalTitleAliado;
        return this.modalTitleAliado;
        }
    // ======= ======= ALIADOS TABLE PAGINATION ======= =======
        get aliadosTable() {
        const start = (this.mainPageAliados - 1) * this.mainPageSizeAliados;
          return this.aliados.slice(start, start + this.mainPageSizeAliados);
        }
    // ======= ======= ======= ======= =======
        aliadosSelected: any = null;
    // ======= ======= ======= ======= =======
        checkboxChangedAliado(aliadoSel: any): void {
        this.aliados.forEach(aliado =>{
          if(aliadoSel.id_proy_aliado == aliado.id_proy_aliado){
            if(aliadoSel.selected){
              this.aliadosSelected = aliadoSel;
            }
            else{
              this.aliadosSelected = null;
            }
          }
          else{
            aliado.selected = false;
          }
        });
        }
    // ======= ======= INIT ALIADOS MODEL ======= =======
        initAliadosModel(){
        this.modalTitleAliado = "";

        this.id_proy_aliado = 0;
        this.id_proyecto = '';
        this.id_organizacion = '';
        this.referente = '';
        this.vinculo = '';
        this.idp_convenio = '';
        this.id_persona_reg = '';
        this.fecha = null;

        this.aliados_persona_registro = this.namePersonaReg;
        this.aliados_fecha_registro = "";

        this.valReferente = true;
        this.valVinculo = true;
        }
    // ======= ======= GET ALIADOS ======= =======
        getAliados(){
        this.servAliados.getAliadosByIdProy(this.idProyecto).subscribe(
          (data) => {
            this.aliados = (data[0].dato)?(data[0].dato):([]);
            this.totalLengthAliados = this.aliados.length;
            this.countHeaderData();
          },
          (error) => {
            console.error(error);
          }
        );
        }
    // ======= ======= INIT ADD ALIADOS ======= =======
        initAddAliado(modalScope: TemplateRef<any>){
        this.initAliadosModel();

        this.aliados_fecha_registro = this.getCurrentDateTime();

        this.modalActionAliado = "add";
        this.modalTitleAliado = this.getModalTitleAliado("add");

        this.openModalAliado(modalScope);
        }
    // ======= ======= ADD ALIADOS ======= =======
        addAliado(){
        const objAliado = {
          p_id_proy_aliado: 0,
          p_id_proyecto: this.idProyecto,
          p_id_organizacion: this.id_organizacion,
          p_referente: this.referente,
          p_vinculo: this.vinculo,
          p_idp_convenio: this.idp_convenio,
          p_id_persona_reg: parseInt(this.idPersonaReg,10),
          p_fecha: this.fecha,
          p_fecha_hora_reg: null
        };
        this.servAliados.addAliado(objAliado).subscribe(
          (data) => {
            alert('Aliado agregado exitosamente');
            this.getAliados();
            console.error('Error al guardar aliado');
          },
          (error) => {
            alert('Error al guardar aliado');
            console.error(error);
          }
        );
        }
    // ======= ======= INIT EDIT ALIADOS ======= =======
        initEditAliado(modalScope: TemplateRef<any>){
        this.initAliadosModel();
        this.modalActionAliado = "edit";
        this.modalTitleAliado = this.getModalTitleAliado("edit");

        this.id_proy_aliado = this.aliadosSelected.id_proy_aliado;
        this.id_proyecto = this.aliadosSelected.id_proyecto;      
        this.id_organizacion = this.aliadosSelected.id_organizacion;
        this.referente = this.aliadosSelected.referente;
        this.vinculo = this.aliadosSelected.vinculo;
        this.idp_convenio = this.aliadosSelected.idp_convenio;
        this.id_persona_reg = this.aliadosSelected.id_persona_reg;
        this.fecha = this.aliadosSelected.fecha;
        this.aliados_fecha_registro = this.aliadosSelected.fecha_hora_reg;

        this.openModalAliado(modalScope);
        }
    // ======= ======= EDIT ALIADOS ======= =======
        editAliado(){
        const objAliado = {
          p_id_proy_aliado: this.id_proy_aliado,
          p_id_proyecto: this.id_proyecto,        
          p_id_organizacion: this.id_organizacion,
          p_referente: this.referente,
          p_vinculo: this.vinculo,
          p_idp_convenio: this.idp_convenio,
          p_id_persona_reg: this.id_persona_reg,
          p_fecha: this.fecha,
          p_fecha_hora_reg: this.getCurrentDateTime()
        };
        this.servAliados.editAliado(objAliado).subscribe(
          (data) => {
            this.getAliados();
          },
          (error) => {
            console.error(error);
          }
        );
        }
    // ======= ======= INIT DELETE ALIADOS ======= =======
        initDeleteAliado(modalScope: TemplateRef<any>){
        this.initAliadosModel();

        this.id_proy_aliado = this.aliadosSelected.id_proy_aliado;

        this.openModalAliado(modalScope);
        }
        // ======= ======= DELETE ALIADOS ======= =======
        deleteAliado(){
        this.servAliados.deleteAliado(this.aliadosSelected.id_proy_aliado).subscribe(
          (data) => {
            this.closeModalAliado();
            this.aliadosSelected = null;
            this.getAliados();
          },
          (error) => {
            console.error(error);
          }
        );
        }

    // ======= ======= ======= ======= VALIDATION ALIADOS ======= ======= ======= =======
        onSubmitAliados(): void{
        // ======= VALIDATION SECTION =======
        let valForm = false;
        this.ValidateReferente();
        this.ValidateVinculo();    

        valForm = 
          this.valReferente &&
          this.valVinculo;        

        // ======= ACTION SECTION =======
        if(valForm){
          if (this.modalActionAliado === 'add') {
            this.addAliado();
          } else {
            this.editAliado();
          } 
          this.closeModalAliado();
          }
        }
    // ======= ======= ======= ======= ======= ======= =======  ======= =======
  // ======= ======= =======      ORGANIZACIONES      ======= ======= =======
  // ======= ======= ======= ======= ======= ======= =======  ======= =======  
      // ======= ======= NGMODEL VARIABLES GENERALES ======= =======
      organizaciones: any[] = [];
      // ======= ======= NGMODEL VARIABLES SECTION ORGANIZACIONES ======= =======
          modalActionOrganizacion: any = '';
      
          //id_organizacion: any = '';
          id_institucion: number = 1;
          //id_proyecto: any = '';
          idp_tipo_organizacion: any = '';
          organizacion: any = '';
      // ======= ======= LLAMADOS A SELECCIONADORES PARA NODAL ORGANIZACIONES ======= =======
          orgTipoOrganizacion: any[] = [];
      // ======= ======= GET PARAMETRICAS ALIADOS ======= =======
          getParametricasOrganizaciones():void{
            // ======= GET TIPO ORGANIZACION =======
            this.servicios.getParametricaByIdTipo(18).subscribe(
              (data) => {
                this.orgTipoOrganizacion = data[0].dato;
              },
              (error) => {
                console.error(error);
              }
            );
          }
      // ======= ======= VALDIATE FUNCTIONS SECTION ======= =======
          valTipoOrganizacion: any = true;
          ValidateTipoOrganizacion(){
            this.valTipoOrganizacion = true;
            if(!this.idp_tipo_organizacion){
              this.valTipoOrganizacion= false;
            }
          }
          valOrganizacion: any = true;
          ValidateOrganizacion(){
            this.valOrganizacion = true;
            if((!this.organizacion)||(this.organizacion.length >= 100)){
              this.valOrganizacion = false;
            }
          }     
      // ======= ======= OPEN MODALS FUN ======= =======
        //private modalRef: NgbModalRef | null = null;
          openModalOrg(content: TemplateRef<any>) {
          this.initOrganizacionModel()  
          this.modalRef = this.modalService.open(content, { size: 'xl' });
          }
          closeModalOrg() {
          if (this.modalRef) {
            this.modalRef.close(); 
            this.modalRef = null;
            }
          }
      // ======= ======= INIT ORGANIZACIONES MODEL ======= =======
          initOrganizacionModel(){

          this.id_organizacion = 0;
          this.id_institucion = 1;
          this.id_proyecto = "";
          this.idp_tipo_organizacion = '';
          this.organizacion = '';

          this.valTipoOrganizacion = true;
          this.valOrganizacion = true;
          }
      // ======= ======= GET ORGANIZACIONES ======= =======
          getOrganizaciones(){
          this.ServOrganizacion.getOrganizacionByIdProy(this.idProyecto).subscribe(
            (data) => {
              this.organizaciones = (data[0].dato)?(data[0].dato):([]);
            },
            (error) => {
              console.error(error);
            }
          );
          }
       // ======= ======= INIT ADD ORGANIZACIONES ======= =======
       initAddOrganizacion(modalScope: TemplateRef<any>){
        this.initOrganizacionModel();

        this.modalActionOrganizacion = "add";

        this.openModalOrg(modalScope);
        }
      // ======= ======= ADD ORGANIZACIONES ======= =======
          addOrganizacion(){
          const objOrganizacion = {
            p_id_organizacion: 0,
            p_id_institucion: 1,
            p_id_proyecto: this.idProyecto,
            p_idp_tipo_organizacion: this.idp_tipo_organizacion,
            p_organizacion: this.organizacion,
          };
          this.ServOrganizacion.addOrganizacion(objOrganizacion).subscribe(
            (data) => {
              alert('Organización agregada exitosamente');
              this.getOrganizaciones();
              this.getParametricasAliados();
              this.getParametricasBeneficiarios();
              this.closeModalOrg();              
            },
            (error) => {
              console.error(error);
              alert('Error al guardar la organización');
            }
          );
          }
    // ======= ======= ======= ======= VALIDATION ORGANIZACIONES ======= ======= ======= ======= 
          onSubmitOrganizaciones(): void{
            // ======= VALIDATION SECTION =======
            let valForm = false;
            this.ValidateTipoOrganizacion();
            this.ValidateOrganizacion();
                
            if (this.valTipoOrganizacion && this.valOrganizacion) {
              this.addOrganizacion();
            }
          }
    // ======= ======= ======= ======= ======= ======= =======  ======= =======

countHeaderData() {
  // Inicializar contadores
  this.headerDataNro01 = 0;
  this.headerDataNro02 = 0;
  this.headerDataNro03 = 0;
  this.headerDataNro04 = 0;

  // Iterar sobre la tabla de beneficiarios
  this.beneficiariosTable.forEach((beneficiario) => {
    // Contar comunidades presentes en la lista de comunidades
    if (beneficiario.comunidad && typeof beneficiario.comunidad === 'string') {
      this.headerDataNro01 += 1;
    }


    // Contar beneficiarios que sean mujeres
    if (beneficiario.mujeres && typeof beneficiario.mujeres === 'number') {
      this.headerDataNro02 += beneficiario.mujeres;
    }

    // Contar beneficiarios que sean hombres
    if (beneficiario.hombres && typeof beneficiario.hombres === 'number') {
      this.headerDataNro03 += beneficiario.hombres;
    }

    // Contar Aliados
    this.headerDataNro04 = this.aliadosTable.length;
 
  });
}

}