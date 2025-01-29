import { Component, OnInit, TemplateRef, EventEmitter, Output } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { NgbModal,NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ProyectoService } from '../../services/proyectoData.service';
import { BeneficiariosService } from "../../servicios/Beneficiarios";
import { servPersona } from "../../servicios/persona"; 
import {servListBenef} from "../../servicios/ListBeneficiarios";
import { servPersonaRoles } from "../../servicios/personaRoles";
import {Params_generales} from "../../servicios/Params_generales";
import { ChangeDetectorRef } from '@angular/core';
import {servUbicaGeografica} from "../../servicios/ubicaGeografica";
import { register } from 'module';
//General
import { servicios } from "../../servicios/servicios";
import { OrganizacionesService } from "../../servicios/organizaciones";
//Aliados
import { servAliados } from "../../servicios/aliados";
import { servInstituciones } from "../../servicios/instituciones";

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
  mainPage = 1;
  mainPageSize = 10;
  totalLength = 0;
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
    private servListBenef:servListBenef,
    private Params_generales:Params_generales,
    //General
    private modalService: NgbModal,
    private proyectoService: ProyectoService,
    private servicios: servicios,
    private OrganizacionesService: OrganizacionesService,
    //Aliados
    private servAliados: servAliados,
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
  tiposConvenio: any[] = [];
  peronsaRegistro:any="";

  parametrosGenerales: any[] = [];
  
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
      this.getActividades();
      this.loadDepartamentos();
      this.loadTiposOrganizacion();
      this.initAliadosForm();
      this.initOrganizacionForm();
      this.loadConvenios();
      this.loadInstitucion();
      this.loadRangosEdad();
      this.getParamGenerales();
      
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
    this.getActividades();
    this.loadDepartamentos();
    this.loadTiposOrganizacion();
    this.initAliadosForm();
    this.initOrganizacionForm();
    this.loadConvenios();
    this.loadRangosEdad();
    this.getParamGenerales();
    this.loadInstitucion();
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
    return org ? org.organizacion : 'Null';
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
// ======= ======= ======= ======= ======= ======= ======= ======= ======= ======= =======

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
      fecha: ['', Validators.required],
      departamento: [''],
      municipio: [{ value: '', disabled: true }],
      comunidad: [{ value: '', disabled: true }],
      tipoOrganizacion: ['', Validators.required],
      organizacion: ['', Validators.required],
      actividad: ['', Validators.required],
      evento: ['', Validators.required],
      mujeres: [{value: 0, disabled: true}],
      hombres: [{value: 0, disabled: true}],
      total: [{value: 0, disabled: true}],
      details:['', Validators.required],
      registeredBy: [{ value: '' ,disabled: true }] // Este campo es solo lectura
     

    });
  

this.beneficiariesFormUbicacion=this.fb.group({

  departamento: [''],
  municipio: [''],
  comunidad: ['']
});
    
    
      // ======= GET organizacion para aliados  =======
      this.OrganizacionesService.getOrganizacionByIdProy(this.idProyecto).subscribe(
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
  
  /// init aliados form
  private initAliadosForm(): void {
    this.aliadosForm = this.fb.group({
      id: [{ value: '', disabled: true }],
      identificationDate: ['', Validators.required],
      tipoOrganizacion: ['', Validators.required], 
      institution: ['', Validators.required],
      referentName: ['', Validators.required],
      resultsLink: ['', Validators.required],
      convenio:['', Validators.required],
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
    // Limpiar la tabla de participantes antes de cargar los nuevos
    this.mostrarTablaParticipantes = false;
    this.planifData = [];
    this.tablaPersonas = [];
    
    // Actualizar selección en la tabla
    this.beneficiariosTable.forEach(b => (b.selected = b.id === selectedBeneficiario.id));
    
    // Filtrar el ID de la organización por el nombre proporcionado
    if (selectedBeneficiario.organizacion) {
      const organizacion = this.organizacionTipo.find(
        org => org.organizacion === selectedBeneficiario.organizacion
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
  if (!isListModal) {
    this.selectedBeneficiarios = beneficiario || null;

    if (beneficiario) {
      // Primero cargar el departamento y esperar que se actualicen las listas
      this.beneficiariesForm.patchValue({
        id: beneficiario.id,
        fecha: beneficiario.fecha,
        departamento: beneficiario.departamento
      });

      // Forzar la carga de municipios
      this.onDepartamentoChange(beneficiario.departamento);

      // Esperar un momento para que se actualicen las listas
      setTimeout(() => {
        this.beneficiariesForm.patchValue({
          municipio: beneficiario.municipio
        });
        
        // Forzar la carga de comunidades
        this.onMunicipioChange(beneficiario.municipio);

        // Esperar otro momento para que se carguen las comunidades
        setTimeout(() => {
          this.beneficiariesForm.patchValue({
            comunidad: beneficiario.comunidad,
            tipoOrganizacion: beneficiario.tipoOrganizacion,
            organizacion: beneficiario.organizacion,
            actividad: beneficiario.actividad,
            evento: beneficiario.evento,
            mujeres: beneficiario.mujeres,
            hombres: beneficiario.hombres,
            total: beneficiario.total,
            details: beneficiario.details,
            registeredBy: this.namePersonaReg
          });
        }, 100);
      }, 100);
    } else {
      this.beneficiariesForm.reset({
        registeredBy: this.namePersonaReg
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

   // Guardar o actualizar beneficiario
   onSubmit(): void {
    if (this.beneficiariesForm.invalid) {
      // Marca todos los controles como tocados para activar los mensajes de error
      this.beneficiariesForm.markAllAsTouched();
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
                this.modalService.dismissAll();// esto es para cerrar el modal

            } else {
                this.addBeneficiario(beneficiarioData);
                this.modalService.dismissAll();// esto es para cerrar el modal
            }
        },
        (error) => {
            console.error('Error al procesar la organización:', error);
            alert('No se pudo procesar la organización. Por favor, intenta de nuevo.');
        }
    );
}
loadInstitucion():void{
  this.servInstituciones.getInstitucionesById(this.parametrosGenerales?.[0]?.id_institucion).subscribe(
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
      comunidad: [{ value: '', disabled: true }],
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
      comunidad: this.selectedBeneficiarios.comunidad || 'Sin comunidad',
      docIden: persona.num_doc_identidad || 'Sin documento',
      nombreCompleto: persona.nombre || 'Sin nombre',
      rangoEdad: this.getRangoEdadNombre(persona.idp_rango_edad),
      sexo: persona.es_hombre !== undefined ? 
        (persona.es_hombre ? 'Hombre' : 'Mujer') : 'N/A',
      id_real: persona.id_proy_bene_lista
    }));
  }

  getComunidad(id: any): any {
    const comunidad = this.geografia.find(muni => muni.id_ubica_geo === Number(id));
    if (comunidad) {      
      return comunidad.nombre;
    } else {
      console.warn(`No se encontró la comunidad con id: ${id}`);
      return 'Desconocida'; 
    }
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
      comunidad: this.selectedBeneficiarios.comunidad 
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
      comunidad: this.getIdComunidad(this.selectedBeneficiarios.comunidad),
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
          this.OrganizacionesService.getOrganizacionByIdProy(this.idProyecto).subscribe(
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
            this.getAliados();
            console.error('Error al guardar aliado');
          },
          (error) => {
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
            this.getAliados();
          },
          (error) => {
            console.error(error);
          }
        );
        }

    // ======= ======= ======= ======= VALIDATION ALIADOS======= ======= ======= =======
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


        
getParamGenerales():void{
  this.Params_generales.getAllParams_generales().subscribe(
    (response) => {
      if (response[0]?.res === 'OK') {
        this.parametrosGenerales = response[0].dato;
        this.loadInstitucion();
      }
    },
    (error) => console.error('Error al cargar parametros generales:', error)
  );

}

openAliadoModal(modal: TemplateRef<any>, aliado?: any): void {
  this.selectedAliados = aliado || null;

  if (aliado) { // en modo edición
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
    
  } else { // en modo creación
    this.aliadosForm.reset({
      id: null,
      identificationDate: null,
      tipoOrganizacion: "",
      referentName: "", 
      resultsLink: "",
      convenio: "", 
      registeredByAliado: this.namePersonaReg || null,
    });
    
    this.aliadosForm.patchValue({
      registeredByAliado: this.namePersonaReg || null
    });
  }

  this.modalService.open(modal,{ size: 'xl' }).result.finally(() => {
    this.selectedAliados = null;
  });
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
  if (this.aliadosForm.invalid) {
    // Marca todos los controles como tocados para activar los mensajes de error
    this.aliadosForm.markAllAsTouched();
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

}

// cargar convenios
loadConvenios(): void {
  this.servicios.getParametricaByIdTipo(21).subscribe(
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