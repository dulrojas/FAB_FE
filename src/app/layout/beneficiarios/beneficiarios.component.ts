import { Component, OnInit, TemplateRef, EventEmitter, Output } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { NgbModal,NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ProyectoService } from '../../services/proyectoData.service';
import { servicios } from "../../servicios/servicios";
import { BeneficiariosService } from "../../servicios/Beneficiarios";
import { AliadosService } from "../../servicios/aliados";
import { servPersona } from "../../servicios/persona";
import {OrganizacionesService} from "../../servicios/organizaciones"; 
import {servListBenef} from "../../servicios/ListBeneficiarios";
import {servInstituciones} from "../../servicios/instituciones";
import { servPersonaRoles } from "../../servicios/personaRoles";
import { ChangeDetectorRef } from '@angular/core';

import {servUbicaGeografica} from "../../servicios/ubicaGeografica";
import { register } from 'module';

interface Beneficiario {
  id: number;
  fecha: string;
  departamento: string;
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
  beneficiariesFormUbicacion:FormGroup;
  aliadosForm: FormGroup;
  organizacionForm: FormGroup;
  mainPage = 1;
  mainPageSize = 10;
  totalLength = 0;
  previousIdProyecto: any;
  selectedOrganizacionId: any;
  geografia: any;
  instituciones: any;
 

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
    private servPersonaRoles: servPersona,
    private OrganizacionesService:OrganizacionesService,
    private servListBenef:servListBenef,
    private servInstituciones:servInstituciones
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
  @Output() selectionChange = new EventEmitter<any>();
  onChildSelectionChange(selectedId: string) {
    this.idProyecto = selectedId;
    localStorage.setItem('currentIdProy', (this.idProyecto).toString());
//    this.ngOnInit();
    this.loadBeneficiarios();
    this.loadAliados();
    this.initForm();
    // ======= *ADD A GETTER DOWN HERE* =======
    // this.getLogros();
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
  
  pageSizeAliados = 10;
  currentPageAliados = 1;
  totalLengthAliados = 0;
  
  ngOnInit(): void {
    this.loadGeografica();
    this.loadBeneficiarios();
    this.initForm();
    this.getActividades();
    this.loadDepartamentos();
    this.loadTiposOrganizacion();
    this.initAliadosForm();
    this.initOrganizacionForm();
    this.loadAliados();
    this.loadConvenios();
    this.loadInstitucion();
    

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
   initForm(): void {
    this.beneficiariesForm = this.fb.group({
      id: [{ value: '', disabled: true }],
      fecha: [''],
      departamento: [''],
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
this.beneficiariesFormUbicacion=this.fb.group({

  departamento: [''],
  municipio: [''],
  comunidad: ['']
});
    
    
      // ======= GET organizacion para aliados  =======
      this.OrganizacionesService.getOrganizacionByProyecto(this.idProyecto).subscribe(
        (data) => {
          if (data.length > 0 && data[0].res === "OK") {
            this.organizacionTipo = data.map(item => item.dato);
            console.log('Organizaciones tipo recibidas para aliados:', this.organizacionTipo);
          } else {
            console.warn('No se encontraron datos para el proyecto.');
            this.organizacionTipo = [];
          }
        },
        (error) => {
          console.error('Error al obtener las organizaciones:', error);
        }
      );
      
   
  }
  

  planifData: any[] = []; // Datos originales del API
  tablaPersonas: any[] = []; // Datos procesados para la tabla
  getComunidad(id: any): any {
    console.log('El id recibido es:', id);
    const comunidad = this.geografia.find(muni => muni.id_ubica_geo === Number(id));
    if (comunidad) {
      console.log('Nombre de la comunidad es:', comunidad.nombre);
      return comunidad.nombre;
    } else {
      console.warn(`No se encontró la comunidad con id: ${id}`);
      return 'Desconocida'; 
    }
  }
  
cargarPersona(id_beneficiario: any) {
  this.servListBenef.getlistBeneficiariosByBene(id_beneficiario).subscribe(
    (response: any) => {
      if (Array.isArray(response) && response.length > 0 && response[0]?.res === 'OK') {
        this.planifData = response[0]?.dato || [];

        this.tablaPersonas = this.planifData.map((persona, index) => ({
          id: index + 1,
          comunidad:this.getComunidad(persona.comunidad) || 'N/A', // Validación de campo comunidad
          docIden: persona?.num_doc_identidad || 'Sin documento', // Validación de documento de identidad
          nombreCompleto: persona?.nombre || 'Sin nombre', // Validación de nombre
          rangoEdad: persona?.idp_rango_edad || 'Sin rango', // Validación de rango de edad
          sexo: persona?.es_hombre !== undefined 
            ? (persona.es_hombre ? 'Hombre' : 'Mujer') 
            : 'N/A',
        }));

        console.log('Datos transformados:', this.tablaPersonas);

        // Asegúrate de marcar la vista para detección de cambios si estás fuera de ciclos de Angular
        this.cdr.detectChanges();
      } else {
        console.error('Error en la respuesta o datos no disponibles:', response);
        this.tablaPersonas = []; 
      }
    },
    (error) => {
      console.error('Error al cargar los datos:', error);
      this.tablaPersonas = []; 
    }
  );
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
private initOrganizacionForm():void{
  this.organizacionForm=this.fb.group({
    id_organizzacion:[''],
    id_institucion:[''],
    id_proyecto:[''],
    id_tipo_organizacion:[''],
    organizacion:['']
  });
}

  loadGeografica():void{
    this.ubicaGeograficaService.getUbicaGeografica().subscribe(
      (response) => {
        console.log('Datos recibidos del servicio:', response);
        if (response[0]?.res === 'OK') {
          this.geografia = response[0].dato;
          console.log('tpdas las obucaiones recibidas:', this.geografia);
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
            console.log('Departamentos recibidos :', this.departamentos); 
          }
        },
        (error) => console.error('Error al cargar departamentos:', error)
      );
    }
  getIdDepartamento(nombre:any): number | undefined {
    const departamento =  this.geografia.find(muni => muni.nombre === nombre);
    console.log(' vamos a  filtrar el departamento aqui : ',this.geografia)
    return departamento ? departamento.id_ubica_geo : undefined;
  }
  getIdMunicipio(nombre: any): number | undefined {
    const municipio =  this.geografia.find(muni => muni.nombre === nombre);
    console.log( ' para obtener eñ id del municipiooooo: ', this.geografia)
    return municipio ? municipio.id_ubica_geo : undefined;
  }
  getIdComunidad(nombre: string): number | undefined {  
    const comunidad =  this.geografia.find(comu => comu.nombre === nombre);
    return comunidad ? comunidad.id_ubica_geo : undefined;
  }
  getIdOrgamnizacion(nombre: string): number | undefined {  
    const organizacion = this.tiposOrganizacion.find(orga => orga.organizacion === nombre);
    return organizacion ? organizacion.id_organizacion : undefined;
  }
  onDepartamentoChange(p_orden_departamento: any): void {
    console.log('nombre recibido de departamento : ', p_orden_departamento)
    const idDepartamento = this.getIdDepartamento(p_orden_departamento);
    console.log('Departamento seleccionado en el select: ', idDepartamento);

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
    console.log('Provincias filtradas:', this.provincias);

    // Filtrar municipios basados en las provincias
    const idProvincias = this.provincias.map(provincia => provincia.id_ubica_geo);
    this.municipios = this.geografia.filter(
        (geo) =>
            geo.nivel === nivelMunicipio &&
            geo.rama === ramaDeseada &&
            idProvincias.includes(geo.id_ubica_geo_padre)
    );
    console.log('Municipios filtrados:', this.municipios);

    // Filtrar comunidades basadas en los municipios
    const idMunicipios = this.municipios.map(municipio => municipio.id_ubica_geo);
    this.comunidades = this.geografia.filter(
        (geo) =>
            geo.nivel === nivelComunidad &&
            geo.rama === ramaDeseada &&
            idMunicipios.includes(geo.id_ubica_geo_padre)
    );
    console.log('Comunidades filtradas:', this.comunidades);
}
  onMunicipioChange(p_orden_monucipio: any): void {
    const idMunicipio = this.getIdMunicipio(p_orden_monucipio);
    console.log('Municipio seleccionado en el select:', idMunicipio);

    if (!idMunicipio) {
        console.error('ID de municipio no encontrado');
        this.comunidades = [];
        return;
    }

    // Filtrar las comunidades basándose en el nivel, rama y padre
    const nivelDeseado = 5; // Nivel correspondiente a las comunidades
    const ramaDeseada = 1; // Ajustar según el valor correcto para "rama"
console.log('estas son las comunidades de donde se filtrarran :' , this.geografia)
    this.comunidades = this.geografia.filter(
        (geo) =>
            geo.nivel === nivelDeseado &&
            geo.rama === ramaDeseada &&
            geo.id_ubica_geo_padre === idMunicipio
    );

    console.log('Comunidades filtradas:', this.comunidades);
}




  loadTiposOrganizacion(): void {
    this.servicios.getParametricaByIdTipo(18).subscribe(
      (response) => {
        if (response[0]?.res === 'OK') {
          this.tiposOrganizacion = response[0].dato.map((item: any) => ({
            id: item.idp,
            nombre: item.descripcion_subtipo
            
          }));
        }
        console.log(' organizaciones tiporecibidads:  ',this.tiposOrganizacion)
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
    this.beneficiariosService.getBeneficiarios(this.idProyecto).subscribe(
      (response) => {
        console.log('Datos recibidos del servicio:', response);
        console.log('nombre de la persona', this.namePersonaReg);
  
        if (response[0]?.res === 'OK') {
          const rawBeneficiarios = Array.isArray(response[0]?.dato) ? response[0].dato : [];
  
          console.log('Beneficiarios procesados:', rawBeneficiarios);
  
          this.beneficiariosTable = rawBeneficiarios.map((item: any) => ({
            id: item.id,
            fecha: item.fecha,
            departamento:item.departamento,
            municipio: item.municipio || null,
            comunidad: item.comunidad ||null,
            tipoOrganizacion: item.organizacion_tipo || null,
            organizacion: item.organizacion || null,
            actividad: item.actividad || null,
            evento: item.titulo_evento ||null,
            details: item.evento_detalle ||null,
            mujeres: item.mujeres || 0,
            hombres: item.hombres || 0,
            total: item.total || 0,
          }));
  
          this.totalLengthBeneficiarios = this.beneficiariosTable.length;
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
    // Actualizar selección en la tabla
    this.beneficiariosTable.forEach(b => (b.selected = b.id === selectedBeneficiario.id));

    // Filtrar el ID de la organización por el nombre proporcionado
    if (selectedBeneficiario.organizacion) {
   
        const organizacion = this.organizacionTipo.find(
            org => org.organizacion === selectedBeneficiario.organizacion
        );

        if (organizacion) {
          this.selectedOrganizacionId = organizacion.id_organizacion; // Asignar el ID de la organización
          console.log('organizacion id  de bene es :', this.selectedOrganizacionId);
        } else {
            console.warn(
                `No se encontró una organización con el nombre: ${selectedBeneficiario.organizacion}`
            );
            this.selectedOrganizacionId= null; // Manejo para casos donde no existe
        }
    }

    // Actualizar el beneficiario seleccionado
    this.selectedBeneficiarios = selectedBeneficiario.selected ? selectedBeneficiario : null;

    console.log('Beneficiario actualizado:', selectedBeneficiario);
}

openModalUbicaciones(modal: TemplateRef<any>){
  this.beneficiariesFormUbicacion.reset();
  // Abrir el modal
  document.querySelector('app-root')?.setAttribute('inert', 'true');
  this.modalService.open(modal, { size: 'xl' }).result.finally(() => {
    document.querySelector('app-root')?.removeAttribute('inert');
  });
}

// Método para abrir el modal en modo edición o creación
openModal(modal: TemplateRef<any>, beneficiario?: Beneficiario, isListModal: boolean = false): void {
  if (!isListModal) { // Solo modificar el formulario si no es el modal de lista
    this.selectedBeneficiarios = beneficiario || null;
    console.log('Formulario antes de ser cargado al editar:', beneficiario);

    if (beneficiario) { // Modo edición
      this.beneficiariesForm.patchValue({
        id: this.selectedBeneficiarios.id,
        fecha: beneficiario.fecha,
        departamento: beneficiario.departamento,
        municipio: beneficiario.municipio,
        comunidad: beneficiario.comunidad,
        tipoOrganizacion: beneficiario.tipoOrganizacion,
        organizacion: beneficiario.organizacion,
        actividad: beneficiario.actividad,
        evento: beneficiario.evento,
        mujeres: beneficiario.mujeres,
        hombres: beneficiario.hombres,
        total: beneficiario.total,
        details: beneficiario.details,
        registeredBy: this.namePersonaReg, // Asignar el nombre
      });
      this.cargarPersona(this.selectedBeneficiarios.id);
      this.onDepartamentoChange(this.selectedBeneficiarios.departamento);
      this.onMunicipioChange(this.selectedBeneficiarios.municipio);
      console.log('Datos cargados al formulario:', this.beneficiariesForm.value);
    } else { // Modo creación
      this.beneficiariesForm.reset();
      console.log('Nombre de la persona registrada (verificación):', this.namePersonaReg);
      this.beneficiariesForm.patchValue({
        registeredBy: this.namePersonaReg,
      });
    }
  }

  // Abrir el modal
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

   // Guardar o actualizar beneficiario
   onSubmit(): void {
    if (!this.beneficiariesForm.valid) {
        console.error('Formulario inválido:', this.beneficiariesForm.errors);
        return;
    }

    const formValue = this.beneficiariesForm.getRawValue();
    const isEditingOrganizacion = !!formValue.organizacion; // Verifica si hay una organización existente

    // Usar el ID global de la organización
    const organizacionId = this.selectedOrganizacionId || null;

    console.log('ID de organización seleccionado:', organizacionId);

    const organizacionData = {
        p_id_organizacion: organizacionId==null ?null:organizacionId ,
        p_id_proyecto: parseInt(this.idProyecto, 10),
        p_id_institucion: 1,
        p_idp_tipo_organizacion: this.getIdTipoOrganizacion(formValue.tipoOrganizacion) ,
        p_organizacion: formValue.organizacion,
    };

    console.log('Datos para organización:', organizacionData);

    const organizacionObservable =  organizacionId!=null
        ? this.OrganizacionesService.editOrganizacion(organizacionData) // Llamada para editar
        : this.OrganizacionesService.addOrganizacion(organizacionData); // Llamada para crear

    organizacionObservable.subscribe(
        (response) => {
            console.log(
              organizacionId!=null ? 'Organización editada con éxito:' : 'Organización creada con éxito:',
                response
            );

            const organizacionResponse = Array.isArray(response) ? response[0] : response;
            const finalOrganizacionId = organizacionResponse?.dato?.id || organizacionId;

            if (!finalOrganizacionId) {
                console.error('No se pudo obtener el ID de la organización');
                alert('Hubo un problema con la organización. Por favor, intenta de nuevo.');
                return;
            }

            // Beneficiario
            const isEditingBeneficiario = !!formValue.id; // Verifica si hay un beneficiario existente
            const beneficiarioData = {
                id: isEditingBeneficiario ? formValue.id : null,
                id_proyecto: parseInt(this.idProyecto, 10),
                fecha: formValue.fecha || null,
                departamento: formValue.departamento || null,
                municipio: this.getIdMunicipio(formValue.municipio) || null,
                comunidad: this.getIdComunidad(formValue.comunidad) || null,
                tipoOrganizacion: this.getIdTipoOrganizacion(formValue.tipoOrganizacion) || null,
                organizacion: finalOrganizacionId,
                actividad: this.getIdActividad(formValue.actividad) || null,
                evento: formValue.evento || '',
                mujeres: formValue.mujeres || 0,
                hombres: formValue.hombres || 0,
                total: (formValue.mujeres || 0) + (formValue.hombres || 0),
                details: formValue.details || '',
                registeredBy: this.idPersonaReg || null,
            };

            console.log('Datos normalizados para beneficiario:', beneficiarioData);

            if (isEditingBeneficiario) {
                this.editBeneficiario(beneficiarioData);
            } else {
                this.addBeneficiario(beneficiarioData);
            }
        },
        (error) => {
            console.error('Error al procesar la organización:', error);
            alert('No se pudo procesar la organización. Por favor, intenta de nuevo.');
        }
    );
}
loadInstitucion():void{
  this.servInstituciones.getInstituciones().subscribe(
    (response) => {
      if (response[0]?.res === 'OK') {
        this.instituciones = response[0].dato;
      console.log('instituciones ************* recibidos :', this.instituciones); 
      }
    },
    (error) => console.error('Error al cargar departamentos:', error)
  );

}
onSubmitOrganize(): void {
  const formValue = this.organizacionForm.getRawValue();
  const organizacionData = {
    p_id_organizacion: null,
    p_id_proyecto: parseInt(this.idProyecto, 10),
    p_id_institucion: parseInt(formValue.id_institucion, 10),
    p_idp_tipo_organizacion: this.getIdTipoOrganizacion(formValue.id_tipo_organizacion),
    p_organizacion: formValue.organizacion,
  };


    console.log('Se envió el ', organizacionData);
    this.OrganizacionesService.addOrganizacion(organizacionData).subscribe();
    this.ngOnInit()
  this.loadBeneficiarios();
}
getIdTipoOrganizacion(nombre :any){
  const tipoOrganizacion =  this.tiposOrganizacion.find(TOr => TOr.nombre === nombre);
    return tipoOrganizacion ? tipoOrganizacion.id : undefined;
}

getIdActividad(nombre :any){
  const getIdActividad =  this.actividades.find(acti => acti.actividad === nombre);
    return getIdActividad ? getIdActividad.id_proy_actividad : undefined;
}
  
  // Método para editar beneficiario
  editBeneficiario(beneficiarioData: any): void {
      this.beneficiariosService.editBeneficiario(beneficiarioData).subscribe(
          (response) => {
              console.log('Respuesta del backend (edición):', response);
              if (response[0]?.res === 'OK') {
                  this.loadBeneficiarios();
                  this.initForm();
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
                this.initForm();
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
  this.aliadosService.getAliadosByProyecto(this.idProyecto).subscribe(
    (response) => {
      if (response[0]?.res === 'OK') {
        const rawAliados = response[0].dato || [];
        this.aliadosTable = rawAliados.map((item: any) => ({
          id: item.id,
          fecha: item.fecha,
          institucion: item.institucion || null,
          referente: item.referente ||null,
          vinculo: item.vinculo || null,
          convenio: item.convenio || null,
        }));

  
        this.totalLengthAliados = this.aliadosTable.length;
      } else {
        console.error('Respuesta inválida del servicio de aliados:', response);
      }
    },
    (error) => console.error('Error al cargar los aliados:', error)
  );
  this.countHeaderData();
}


// agregar aliado


openAliadoModal(modal: TemplateRef<any>, aliado?: any): void {
  this.selectedAliados = aliado || null;

  if (aliado) {
    this.aliadosForm.patchValue({
      id: aliado.id,
      identificationDate: aliado.fecha,
      tipoOrganizacion: aliado.institucion || null,
      institution: aliado.institucion || null,
      referentName: aliado.referente || null,
      resultsLink: aliado.vinculo || null,
      convenio: aliado.convenio || null,
      registeredByAliado: this.namePersonaReg || null
    });
    console.log(' datos cargados al formulario de aliados: ',this.aliadosForm.value )
    console.log('nombre de persoanregistro en alidados ',this.namePersonaReg);
    
  } else {
    this.aliadosForm.reset();
    this.aliadosForm.patchValue({
      registeredByAliado: this.namePersonaReg || null
    });
  }

  this.modalService.open(modal,{ size: 'xl' }).result.finally(() => {
    this.selectedAliados = null;
  });
}


checkboxChangedAliado(selectedAliado: any): void {
  this.aliadosTable.forEach(a => (a.selected = a.id === selectedAliado.id));
  this.selectedAliados = selectedAliado.selected ? selectedAliado : null;
}

getIdOrgamnizacionesAliados(nombre: string): number | undefined {  
  const organizacion = this.organizacionTipo.find(orga => orga.organizacion === nombre);
  return organizacion ? organizacion.id_organizacion : undefined;
}
getIdConvenio(nombre: string): number | undefined {  
  const convenio = this.tiposConvenio.find(conve => conve.descripcion === nombre);
  return convenio ? convenio.id : undefined;
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
    tipoOrganizacion:this.getIdOrgamnizacionesAliados(aliadoData.tipoOrganizacion) || null,
    institucion: aliadoData.institution || null,
    referente: aliadoData.referentName || null,
    vinculo: aliadoData.resultsLink || null,
    convenio: this.getIdConvenio(aliadoData.convenio) || null,
    registeredBy: this.idPersonaReg || null
  };
  console.log( 'datos de aliados normalizados ', aliadoPayload)

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