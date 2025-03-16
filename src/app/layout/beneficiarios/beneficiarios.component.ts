import { Component, OnInit, TemplateRef, EventEmitter, Output} from '@angular/core';
import { routerTransition } from '../../router.animations';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ProyectoService } from '../../services/proyectoData.service';

import { servicios } from "../../servicios/servicios";
//Beneficiarios
import { servBeneficiarios } from '../../servicios/beneficiarios';
import {servUbicaGeografica} from "../../servicios/ubicaGeografica";
import {servListBenef} from "../../servicios/ListBeneficiarios";
import { servActividad } from "../../servicios/actividad";
//Aliados
import { servAliados } from "../../servicios/aliados";
import { servInstituciones } from "../../servicios/instituciones";
//Organizaciones
import { ServOrganizacion } from "../../servicios/organizaciones";

@Component({
  selector: 'app-beneficiarios',
  templateUrl: './beneficiarios.component.html',
  styleUrls: ['../../../styles/styles.scss'],
  animations: [routerTransition()]
})
export class BeneficiariosComponent implements OnInit {

  constructor(
    //General
    private modalService: NgbModal,
    private proyectoService: ProyectoService,
    private servicios: servicios,
    //Beneficiarios
    private servBeneficiarios: servBeneficiarios,
    private servUbicaGeografica: servUbicaGeografica,
    private servListBenef: servListBenef,
    private servActividad: servActividad,
    //Aliados
    private servAliados: servAliados,
    private servInstituciones:servInstituciones,
    //Organizaciones
    private ServOrganizacion: ServOrganizacion,
  ) {}
  
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
        //Beneficiarios
        this.getParametricasBeneficiarios();
        this.getBeneficiarios();
        this.beneficiariosSelected = null;
        //Lista de Beneficiarios
        this.getParametricasBeneficiariosLista();
        this.getBeneficiariosLista();
        this.beneficiariosListaSelected = null;
        //Aliados
        this.getParametricasAliados();
        this.getAliados();
        this.aliadosSelected = null;
        //Organizaciones
        this.getParametricasOrganizaciones();
      }
  // ======= ======= ======= ======= =======
      headerDataNro01: any = 0;
      headerDataNro02: any = 0;
      headerDataNro03: any = 0;
      headerDataNro04: any = 0;
  // ======= ======= ======= ======= =======
      ngOnInit(): void {
        //Beneficiarios
        this.getParametricasBeneficiarios();
        this.getBeneficiarios();
         //Lista de Beneficiarios del Proyecto
        this.getBeneficiariosListaPorProyecto();
        //Lista de Beneficiarios
        this.getParametricasBeneficiariosLista();
        this.getBeneficiariosLista();
        //Aliados
        this.getParametricasAliados();
        this.getAliados();
        //Organizaciones
        this.getParametricasOrganizaciones();
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
        return subtipo ? subtipo.descripcion_subtipo : '';
      }
      // GET ORGANIZACION
      getOrganizacion(idRegistro: any, paramList: any[]): string {
        if (!paramList || paramList.length === 0) {
            return ''; 
        }
        const org = paramList.find(elem => elem.id_organizacion == idRegistro);
        return org ? org.organizacion : '';
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
// ======= ======= =======    BENEFICIARIOS - PROY_BENEFICIARIOS   ======= ======= =======
// ======= ======= ======= ======= ======= ======= ======= ======= ======= ======= ======= 
  // ======= ======= NGMODEL VARIABLES GENERALES ======= =======  
      beneficiarios: any[] = [];
      mainPageBeneficiarios = 1;
      mainPageSizeBeneficiarios = 10;
      totalLengthBeneficiarios = 0;
  // ======= ======= NGMODEL VARIABLES SECTION BENEFICIARIOS ======= =======
      modalTitleBeneficiario: any = "";
      modalActionBeneficiario: any = '';
      
      id_proy_beneficiario: any = '';
      id_proyecto: any = '';
      mujeres: any = '';
      hombres: any = '';
      get total(): number {
        return (this.mujeres || 0) + (this.hombres || 0);
      }
      titulo_evento: any = '';
      evento_detalle: any = '';
      id_ubica_geo_depto: any = '';
      id_ubica_geo_muni: any = '';
      id_ubica_geo_comu: any = '';
      id_proy_actividad: any = '';
      idp_tipo_evento: any = '';
      ruta_documento: any = '';
      id_persona_reg: any = '';
      fecha: any = '';
      fecha_hora_reg: any = '';

      ubica_geo_muni: any = '';

      beneficiarios_persona_registro: any = "";
      beneficiarios_fecha_registro: any = "";
  // ======= ======= LLAMADOS A SELECCIONADORES PARA NODAL BENEFICIARIOS ======= =======
      beneficiariosTipoEvento: any[] = [];
      beneficiariosUbicaDepto: any[] = [];
      beneficiariosUbicaMuni: any[] = [];
      beneficiariosActividades: any[] = [];
      
      // GET UBICACION GEOGRAFICA
      getUbicacionGeografica(idRegistro: any, paramList: any[]): string {
        if (!idRegistro || !paramList || paramList.length === 0) {
          return '';
        }
        const ubicacion = paramList.find(elem => elem.id_ubica_geo == idRegistro);
        return ubicacion ? ubicacion.nombre : '';
      }
      // GET ACTIVIDAD
      getActividad(idRegistro: any, paramList: any[]): string {
        if (!paramList || paramList.length === 0) {
            return '';
        }
        const actividad = paramList.find(elem => elem.id_proy_actividad == idRegistro);
        return actividad ? actividad.actividad : '';
      }

  // ======= ======= GET PARAMETRICAS BENEFICIARIOS ======= =======
      getParametricasBeneficiarios():void{
        // ======= GET TIPO EVENTO =======
        this.servicios.getParametricaByIdTipo(25).subscribe(
          (data) => {
            this.beneficiariosTipoEvento = data[0].dato;
          },
          (error) => {
            console.error(error);
          }
        );
        // ======= GET UBICA GEO DEPARTAMENTO =======
        this.servUbicaGeografica.getUbiDepartamentos("Departamento").subscribe(
          (data) => {
            this.beneficiariosUbicaDepto = data[0].dato;
          },
          (error) => {
            console.error(error);
          }
        );
        // ======= GET ACTIVIDADES =======
        this.servActividad.getActividadesByIdProy(this.idProyecto).subscribe(
          (data) => {
            if(data[0].dato != null){
              this.beneficiariosActividades = data[0].dato;
            }
            else{
              this.beneficiariosActividades = [];
            }
          },
          (error) => {
            console.error(error);
            this.beneficiariosActividades = [];
          }
        );
      } 
      cargarMunicipiosPorDepartamento(idDepartamento: any) {
        if (idDepartamento) {
          this.servUbicaGeografica.getUbiMunicipios(idDepartamento).subscribe(
            (data) => {
              this.beneficiariosUbicaMuni = data[0].dato;
            },
            (error) => {
              console.error(error);
              this.beneficiariosUbicaMuni = [];
            }
          );
        } else {
          this.beneficiariosUbicaMuni = [];
        }        
        this.id_ubica_geo_muni = null;
      }

  // ======= ======= VALDIATE FUNCTIONS SECTION ======= =======
      valTituloEvento:any = true;
      ValidateTituloEvento(){
        this.valTituloEvento = true;
        if((!this.titulo_evento)||(this.titulo_evento.length >= 50)){
          this.valTituloEvento = false;
        }
      }
  // ======= ======= OPEN MODALS FUN ======= =======
      private modalRef: NgbModalRef | null = null;
      openModalBeneficiario(content: TemplateRef<any>) {
        this.modalRef = this.modalService.open(content, { size: 'xl' });
      }
      closeModalBeneficiario() {
        if (this.modalRef) {
          this.modalRef.close(); 
          this.modalRef = null;
        }
      }
  // ======= ======= GET BENEFICIARIOS ======= =======
      getModalTitleBeneficiario(modalActionBeneficiario: any) {
        this.modalTitleBeneficiario = (modalActionBeneficiario == "add") ? ("Añadir Beneficiario") : this.modalTitleBeneficiario;
        this.modalTitleBeneficiario = (modalActionBeneficiario == "edit") ? ("Editar Beneficiario") : this.modalTitleBeneficiario;
        return this.modalTitleBeneficiario;
      }
  // ======= ======= BENEFICIARIOS TABLE PAGINATION ======= =======
      get beneficiariosTable() {
        const start = (this.mainPageBeneficiarios - 1) * this.mainPageSizeBeneficiarios;
        return this.beneficiarios.slice(start, start + this.mainPageSizeBeneficiarios);
      }
  // ======= ======= ======= ======= =======
      beneficiariosSelected: any = null;
  // ======= ======= ======= ======= =======
      checkboxChangedBeneficiario(beneficiarioSel: any): void {
        this.beneficiarios.forEach(beneficiario => {
          if(beneficiarioSel.id_proy_beneficiario == beneficiario.id_proy_beneficiario){
            if(beneficiarioSel.selected){
              this.beneficiariosSelected = beneficiarioSel;
            }
            else{
              this.beneficiariosSelected = null;
            }
          }
          else{
            beneficiario.selected = false;
          }
        });
      }
  // ======= ======= ======= ======= RUTA_DOCUMENTOS BENEFICIARIOS ======= =======
      selectedFileBeneficiario: File | null = null;
      fileNameBeneficiario: string = '';
      onFileChangeBeneficiario(event: any): void {
        const files = event.target.files;
        if (files && files.length > 0) {
          this.selectedFileBeneficiario = files[0];
          this.fileNameBeneficiario = this.selectedFileBeneficiario.name;
        } else {
          this.selectedFileBeneficiario = null;
          this.fileNameBeneficiario = '';
        }
      }
      getFileNameBeneficiario(rutaCompleta: string): string {
        if (!rutaCompleta) return '';
        const partes = rutaCompleta.split('/');
        return partes[partes.length - 1];
      }      
      // ======= ======= UPLOAD FILE FUN ======= =======
      uploadFile(file: any, nombreTabla: any, campoTabla: any, idEnTabla: any, fileName: any, idRegistro: any){
        this.servicios.uploadFile(file, nombreTabla, campoTabla, idEnTabla, fileName, idRegistro).subscribe(
          (response) => {
          },
          (error) => {
            console.error('Error al subir el archivo:', error);
          }
        );
      } 
      // ======= ======= DOWNLOAD IMAGE FUN ======= =======
      downloadFile(nombreTabla: any, campoTabla: any, idEnTabla: any, idRegistro: any){
        return new Promise((resolve, reject) => {
          this.servicios.downloadFile(nombreTabla, campoTabla, idEnTabla, idRegistro).subscribe(
            (response: Blob) => {
              if (response instanceof Blob) {
                const url = window.URL.createObjectURL(response);
                resolve(url);
              } 
              else {
                resolve(null); 
              }
            },
            (error) => {
              if (error.status === 404) {
                resolve(null);
              } 
              else {
                reject(error);
              }
            }
          );
        });
      }     
      // Descargar documento de beneficiario
      downloadDocumentoBeneficiario(): void {
        if (!this.ruta_documento) {
          alert('No hay documento disponible para descargar');
          return;
        }
        
        this.downloadFile('proy_beneficiarios', 'ruta_documento', 'id_proy_beneficiario', this.id_proy_beneficiario)
          .then((url: any) => {
            if (url) {
              const link = document.createElement('a');
              link.href = url;
              link.download = this.getFileNameBeneficiario(this.ruta_documento);
              link.click();
              window.URL.revokeObjectURL(url);
            } else {
              alert('No se pudo descargar el documento');
            }
          })
          .catch(error => {
            console.error('Error al descargar el documento:', error);
            alert('Error al descargar el documento');
          });
      } 
  // ======= ======= INIT BENEFICIARIOS MODEL ======= =======
      initBeneficiariosModel() {
        this.modalTitleBeneficiario = "";
      
        this.id_proy_beneficiario = 0;
        this.id_proyecto = "";
        this.mujeres = 0; 
        this.hombres = 0; 
        this.titulo_evento = '';
        this.evento_detalle = null;
        this.id_ubica_geo_depto = '';
        this.id_ubica_geo_muni = '';
        this.id_ubica_geo_comu = '';
        this.id_proy_actividad = null; 
        this.idp_tipo_evento = '';
        this.ruta_documento = null;
        this.id_persona_reg = '';
        this.fecha = null;
      
        this.ubica_geo_muni = '';
      
        this.beneficiarios_persona_registro = this.namePersonaReg;
        this.beneficiarios_fecha_registro = "";
      
        this.selectedFileBeneficiario = null;
        this.fileNameBeneficiario = '';
      
        this.valTituloEvento = true;
      }
  // ======= ======= GET BENEFICIARIOS ======= =======
      getBeneficiarios() {
        this.servBeneficiarios.getBeneficiariosByIdProy(this.idProyecto).subscribe(
          (data) => {
            this.beneficiarios = (data[0].dato) ? (data[0].dato) : ([]);
            this.totalLengthBeneficiarios = this.beneficiarios.length;
            
            this.countHeaderData();
          },
          (error) => {
            console.error(error);
          }
        );
      }
      isEditingBeneficiario: any = false; 
  // ======= ======= INIT ADD BENEFICIARIOS ======= =======
      initAddBeneficiario(modalScope: TemplateRef<any>){
        this.initBeneficiariosModel();

        this.beneficiarios_fecha_registro = this.getCurrentDateTime();

        this.modalActionBeneficiario = "add";
        this.modalTitleBeneficiario = this.getModalTitleBeneficiario("add");

        this.isEditingBeneficiario = false;
      
        this.mujeres = 0;
        this.hombres = 0;
        this.beneficiariosUbicaMuni = [];

        this.openModalBeneficiario(modalScope);      
      }
  // ======= ======= ADD BENEFICIARIOS ======= =======
      addBeneficiario() {
        const objBeneficiario = {
          p_id_proy_beneficiario: 0,
          p_id_proyecto: this.idProyecto,
          p_mujeres: this.mujeres || 0,
          p_hombres: this.hombres || 0,
          p_titulo_evento: this.titulo_evento,
          p_evento_detalle: this.evento_detalle,
          p_id_ubica_geo_depto: this.id_ubica_geo_depto || null,
          p_id_ubica_geo_muni: this.id_ubica_geo_muni || null,
          p_id_ubica_geo_comu: this.id_ubica_geo_comu || null,
          p_id_proy_actividad: this.id_proy_actividad || null,
          p_idp_tipo_evento: this.idp_tipo_evento,
          p_ruta_documento: null,
          p_id_persona_reg: parseInt(this.idPersonaReg, 10),
          p_fecha: this.fecha,
          p_fecha_hora_reg: null
        };
      
        this.servBeneficiarios.addBeneficiario(objBeneficiario).subscribe(
          (data) => {
            alert('Beneficiario agregado exitosamente.');
            this.beneficiariosSelected = null;
            this.getBeneficiarios();            
            this.closeModalBeneficiario();
          },
          (error) => {
            console.error(error);
            alert('Error al guardar beneficiario');
          }
        );
      }
  // ======= ======= INIT EDIT BENEFICIARIOS ======= =======
      initEditBeneficiario(modalScope: TemplateRef<any>){
        this.initBeneficiariosModel();
        this.modalActionBeneficiario = "edit";
        this.modalTitleBeneficiario = this.getModalTitleBeneficiario("edit");
        this.isEditingBeneficiario = true;

        this.id_proy_beneficiario = this.beneficiariosSelected.id_proy_beneficiario;
        this.id_proyecto = this.beneficiariosSelected.id_proyecto;
        this.mujeres = this.beneficiariosSelected.mujeres;
        this.hombres = this.beneficiariosSelected.hombres;
        this.titulo_evento = this.beneficiariosSelected.titulo_evento;
        this.evento_detalle = this.beneficiariosSelected.evento_detalle;
        this.id_ubica_geo_depto = this.beneficiariosSelected.id_ubica_geo_depto;
        this.id_ubica_geo_muni = this.beneficiariosSelected.id_ubica_geo_muni;
        this.id_ubica_geo_comu = this.beneficiariosSelected.id_ubica_geo_comu;
        this.id_proy_actividad = this.beneficiariosSelected.id_proy_actividad;
        this.idp_tipo_evento = this.beneficiariosSelected.idp_tipo_evento;
        this.ruta_documento = this.beneficiariosSelected.ruta_documento;
        this.id_persona_reg = this.beneficiariosSelected.id_persona_reg;
        this.fecha = this.beneficiariosSelected.fecha;
        this.beneficiarios_fecha_registro = this.beneficiariosSelected.fecha_hora_reg;

        this.ubica_geo_muni = this.beneficiariosSelected.ubica_geo_muni;

        if (this.id_ubica_geo_depto) {
          this.cargarMunicipiosPorDepartamento(this.id_ubica_geo_depto);
          setTimeout(() => {     
            this.id_ubica_geo_muni = this.beneficiariosSelected.id_ubica_geo_muni;       
          }, 500);
        }
        
        this.openModalBeneficiario(modalScope);
      }
  // ======= ======= EDIT BENEFICIARIOS ======= =======
  calculateTotal() {
    const total = (this.mujeres || 0) + (this.hombres || 0);
    return total;
  }
      editBeneficiario() {
        const objBeneficiario = {
          p_id_proy_beneficiario: this.id_proy_beneficiario,
          p_id_proyecto: this.id_proyecto,
          p_mujeres: this.mujeres || 0,
          p_hombres: this.hombres || 0,
          p_titulo_evento: this.titulo_evento,
          p_evento_detalle: this.evento_detalle,
          p_id_ubica_geo_depto: this.id_ubica_geo_depto || null,
          p_id_ubica_geo_muni: this.id_ubica_geo_muni || null,
          p_id_ubica_geo_comu: this.id_ubica_geo_comu || null,
          p_id_proy_actividad: this.id_proy_actividad || null,
          p_idp_tipo_evento: this.idp_tipo_evento,
          p_ruta_documento: this.ruta_documento || null, 
          p_id_persona_reg: this.id_persona_reg,
          p_fecha: this.fecha,
          p_fecha_hora_reg: this.getCurrentDateTime()
        };
      
        this.servBeneficiarios.editBeneficiario(objBeneficiario).subscribe(
          (data) => {
            // Si hay un archivo seleccionado, subirlo
            if (this.selectedFileBeneficiario) {
              const fileName = `beneficiario_${this.id_proy_beneficiario}_${Date.now()}_${this.fileNameBeneficiario}`;
              this.uploadFile(
                this.selectedFileBeneficiario, 
                'proy_beneficiarios', 
                'ruta_documento', 
                'id_proy_beneficiario', 
                fileName, 
                this.id_proy_beneficiario
              );
            }
            
            alert('Beneficiario editado exitosamente');
            this.beneficiariosSelected = null;
            this.getBeneficiarios();
            this.closeModalBeneficiario();
          },
          (error) => {
            alert('Error al editar beneficiario');
            console.error(error);
          }
        );
      }     
  // ======= ======= INIT DELETE BENEFICIARIOS ======= =======
      initDeleteBeneficiario(modalScope: TemplateRef<any>){
        this.initBeneficiariosModel();

        this.id_proy_beneficiario = this.beneficiariosSelected.id_proy_beneficiario;

        this.openModalBeneficiario(modalScope);
      }
  // ======= ======= DELETE BENEFICIARIOS ======= =======
      deleteBeneficiario(){
        this.servBeneficiarios.deleteBeneficiario(this.beneficiariosSelected.id_proy_beneficiario).subscribe(
          (data) => {
            alert('Beneficiario eliminado exitosamente');
            this.closeModalBeneficiario();
            this.beneficiariosSelected = null;
            this.getBeneficiarios();
          },
          (error) => {
            alert('Error al eliminar beneficiario');
            console.error(error);
          }
        );
      }

  // ======= ======= ======= ======= VALIDATION BENEFICIARIOS ======= ======= ======= =======
      onSubmitBeneficiario(): void{
        // ======= VALIDATION SECTION =======
        let valForm = false;
        this.ValidateTituloEvento();

        valForm = 
          this.valTituloEvento ;

        // ======= ACTION SECTION =======
        if(valForm){
          if (this.modalActionBeneficiario === 'add') {
            this.addBeneficiario();
          } else {
            this.editBeneficiario();
          } 
          this.closeModalBeneficiario();
        }
      }
  // ======= ======= GET LISTA DE BENEFICIARIOS POR PROYECTO LLAMADO DESDE BENEFICIARIOS ======= ======= 
      
      beneficiariosListaProyecto: any[] = [];
      mainPageBeneficiariosListaProyecto = 1;
      mainPageSizeBeneficiariosListaProyecto = 10;
      totalLengthBeneficiariosListaProyecto = 0;
      beneficiariosListaProyectoSelected: any[] = [];

      getBeneficiariosListaPorProyecto() {
        this.servBeneficiarios.getBeneficiariosListaPorIdProy(this.idProyecto).subscribe(
          (data) => {
            this.beneficiariosListaProyecto = (data[0].dato) ? (data[0].dato) : ([]); 
            this.totalLengthBeneficiariosListaProyecto = this.beneficiariosListaProyecto.length;
          },
          (error) => {
            console.error(error);         
          }
        );
      }

      get beneficiariosListaProyectoTable() {
        const start = (this.mainPageBeneficiariosListaProyecto - 1) * this.mainPageSizeBeneficiariosListaProyecto;
        return this.beneficiariosListaProyecto.slice(start, start + this.mainPageSizeBeneficiariosListaProyecto);
      }

      checkboxChangedBeneficiarioListaProyecto(beneficiarioSel: any): void {
        if (beneficiarioSel.selected) {
          // Verifica si el beneficiario no está ya seleccionado antes de agregarlo
          if (!this.beneficiariosListaProyectoSelected.some(b => b.num_doc_identidad === beneficiarioSel.num_doc_identidad)) {
            this.beneficiariosListaProyectoSelected.push(beneficiarioSel);
          }
        } else {
          // Elimina el beneficiario de la lista seleccionada
          this.beneficiariosListaProyectoSelected = this.beneficiariosListaProyectoSelected.filter(b => b.num_doc_identidad !== beneficiarioSel.num_doc_identidad);
        }
      }
    
    // ======= ======= IMPORT BENEFICIARIOS LISTA PROYECTO ======= =======
    importBeneficiariosListaProyecto() {
      if (!this.beneficiariosListaProyectoSelected) {
        alert('Por favor seleccione un beneficiario para importar');
        return;
      }
      
      // Aquí iría la lógica para importar el beneficiario seleccionado
      // Por ejemplo, agregar el beneficiario a otra lista o realizar alguna acción
      
      alert('Beneficiario importado exitosamente');
      this.closeModalBeneficiarioListaProyecto();
    }

    // ======= ======= OPEN/CLOSE MODAL BENEFICIARIO LISTA PROYECTO ======= =======
    private modalRefListaProyecto: NgbModalRef | null = null;

    openModalBeneficiarioListaProyecto(content: TemplateRef<any>) {
      this.getBeneficiariosListaPorProyecto();  // Asegura que los beneficiarios se carguen
      this.modalRefListaProyecto = this.modalService.open(content, { size: 'xl' });
    }

    closeModalBeneficiarioListaProyecto() {
      if (this.modalRefListaProyecto) {
        this.modalRefListaProyecto.close(); 
        this.modalRefListaProyecto = null;
      }
    }  
      
// ======= ======= ======= ======= ======= ======= =======  ======= =======
// ======= ======= LISTA DE BENEFICIARIOS - PROY_BENE_LISTA ======= =======
// ======= ======= ======= ======= ======= ======= =======  ======= =======
    // ======= ======= NGMODEL VARIABLES GENERALES ======= =======
        beneficiariosLista: any[] = [];
        mainPageBeneficiariosLista = 1;
        mainPageSizeBeneficiariosLista = 10;
        totalLengthBeneficiariosLista = 0;
    // ======= ======= NGMODEL VARIABLES SECTION BENEFICIARIOS LISTA ======= =======
        modalTitleBeneficiarioLista: any = "";
        modalActionBeneficiarioLista: any = '';
        
        id_proy_bene_lista: any = '';
        //id_proy_beneficiario: any = '';       
        num_doc_identidad: any = '';
        nombre: any = '';        
        es_hombre: any = '';
        idp_organizacion_tipo: any = '';
        idp_organizacion_subtipo: any = '';
        //id_ubica_geo_depto: any = '';
        //id_ubica_geo_muni: any = '';
        //id_ubica_geo_comu: any = '';
        comunidad_no_registrada: any = '';
        idp_rango_edad: any = '';

        tipo_actor: any = '';
        institucion_comunidad: any = '';
        rango_edad: any = '';

        mujeresCount: number = 0;
        hombresCount: number = 0;
        totalCount: number = 0;

    // ======= ======= LLAMADOS A SELECCIONADORES PARA NODAL BENEFICIARIOS LISTA ======= =======
        beneficiariosListaOrganizacionTipo: any[] = [];
        beneficiariosListaOrganizacionSubTipo: any[] = [];
        beneficiariosListaUbicaDepto: any[] = [];
        beneficiariosListaUbicaMuni: any[] = [];

        beneficiariosListaRangoEdad: any[] = [];
    // ======= ======= GET PARAMETRICAS BENEFICIARIOS LISTA ======= =======
        getParametricasBeneficiariosLista():void{          
          // ======= GET ORGANIZACION TIPO =======
          this.servicios.getParametricaByIdTipo(18).subscribe(
            (data) => {
              this.beneficiariosListaOrganizacionTipo = data[0].dato;
            },
            (error) => {
              console.error(error);
            }
          );
          // ======= GET ORGANIZACION SUBTIPO =======
          this.servicios.getParametricaByIdTipo(26).subscribe(
            (data) => {
              this.beneficiariosListaOrganizacionSubTipo = data[0].dato;
            },
            (error) => {
              console.error(error);
            }
          );
          // ======= GET UBICA GEO DEPARTAMENTO =======
          this.servUbicaGeografica.getUbiDepartamentos("Departamento").subscribe(
            (data) => {
              this.beneficiariosListaUbicaDepto = data[0].dato;
            },
            (error) => {
              console.error(error);
            }
          );
          // ======= GET RANGO EDAD =======
          this.servicios.getParametricaByIdTipo(20).subscribe(
            (data) => {
              this.beneficiariosListaRangoEdad = data[0].dato;
            },
            (error) => {
              console.error(error);
            }
          );
        }
        
        // ======= ======= GET MUNICIPIO ======= =======
        cargarMunicipiosPorDepartamentoLista(idDepartamentoLista: any) {
          if (idDepartamentoLista) {
            this.servUbicaGeografica.getUbiMunicipios(idDepartamentoLista).subscribe(
              (data) => {
                this.beneficiariosListaUbicaMuni = data[0].dato;
              },
              (error) => {
                console.error(error);
                this.beneficiariosListaUbicaMuni = [];
              }
            );
          } else {
            this.beneficiariosListaUbicaMuni = [];
          }        
          this.id_ubica_geo_muni = null;
        }



        canOpenBeneficiarioListaModal(): boolean {
          // Permitir abrir cuando hay un beneficiario seleccionado, sin importar si está en modo edición
          return this.beneficiariosSelected !== null;
        }
        // Función para abrir la lista de beneficiarios
        openBeneficiariosLista(modalScope: TemplateRef<any>) {
          if (this.canOpenBeneficiarioListaModal()) {
            // Cargar la lista de beneficiarios para el beneficiario seleccionado
            this.getBeneficiariosLista();
            // Cargar parametricas necesarias
            this.getParametricasBeneficiariosLista();
            // Abrir el modal
            this.openModalBeneficiarioLista(modalScope);
          } else {
            alert('Primero debe seleccionar un beneficiario');
          }
        }
        // Función para contar hombres, mujeres y el total
        countBeneficiarios(): void {
          // Cambiar la lógica de comparación con "M" para hombre y "F" para mujer
          this.mujeresCount = this.beneficiariosLista.filter(bene => bene.genero === 'F').length;
          this.hombresCount = this.beneficiariosLista.filter(bene => bene.genero === 'M').length;
          this.totalCount = this.mujeresCount + this.hombresCount;  
        }        
    // ======= ======= VALDIATE FUNCTIONS SECTION ======= =======
        valNumDocIdentidad: any = true;
        ValidateNumDocIdentidad(){
          this.valNumDocIdentidad = true;
          if(!this.num_doc_identidad || this.num_doc_identidad.length >= 10){
            this.valNumDocIdentidad = false;
            return;
          }
          // Validar que solo sean números
          if(!/^\d+$/.test(this.num_doc_identidad)){
            this.valNumDocIdentidad = false;
          }
        }
        valNombre: any = true;
        ValidateNombre(){
          this.valNombre = true;
          if((!this.nombre)||(this.nombre.length >= 100)){
            this.valNombre = false;
          }
        }
    // ======= ======= OPEN MODALS FUN ======= =======
        openModalBeneficiarioLista(content: TemplateRef<any>) {
          this.modalRef = this.modalService.open(content, { size: 'xl' });
        }
        closeModalBeneficiarioLista() {
          if (this.modalRef) {
            this.modalRef.close(); 
            this.modalRef = null;
          }
        }
    // ======= ======= GET BENEFICIARIOS LISTA ======= =======
        getModalTitleBeneficiarioLista(modalActionBeneficiarioLista: any) {
          this.modalTitleBeneficiarioLista = (modalActionBeneficiarioLista == "add") ? ("Añadir Participante") : this.modalTitleBeneficiarioLista;
          this.modalTitleBeneficiarioLista = (modalActionBeneficiarioLista == "edit") ? ("Editar Participante") : this.modalTitleBeneficiarioLista;
          return this.modalTitleBeneficiarioLista;
        }
    // ======= ======= BENEFICIARIOS LISTA TABLE PAGINATION ======= =======
        get beneficiariosListaTable() {
          const start = (this.mainPageBeneficiariosLista - 1) * this.mainPageSizeBeneficiariosLista;
          return this.beneficiariosLista.slice(start, start + this.mainPageSizeBeneficiariosLista);
        }
    // ======= ======= ======= ======= =======
        beneficiariosListaSelected: any = null;
    // ======= ======= ======= ======= =======
        checkboxChangedBeneficiarioLista(beneficiarioListaSel: any): void {
          this.beneficiariosLista.forEach(beneficiarioLista => {
            if(beneficiarioListaSel.id_proy_bene_lista == beneficiarioLista.id_proy_bene_lista){
              if(beneficiarioListaSel.selected){
                this.beneficiariosListaSelected = beneficiarioListaSel;
              }
              else{
                this.beneficiariosListaSelected = null;
              }
            }
            else{
              beneficiarioLista.selected = false;
            }
          });
        }
    // ======= ======= INIT BENEFICIARIOS LISTA MODEL ======= =======
        initBeneficiariosListModel(){
          this.modalTitleBeneficiarioLista = "";

          this.id_proy_bene_lista = 0;
          this.id_proy_beneficiario = '';         
          this.num_doc_identidad = '';
          this.nombre = '';          
          this.es_hombre = null;
          this.idp_organizacion_tipo = '';
          this.idp_organizacion_subtipo = '';
          this.id_ubica_geo_depto = null;
          this.id_ubica_geo_muni  = null;
          this.id_ubica_geo_comu = null;
          this.comunidad_no_registrada = '';
          this.idp_rango_edad = '';

          this.tipo_actor = '';
          this.institucion_comunidad = '';
          this.rango_edad = '';

          this.valNumDocIdentidad = true;
          this.valNombre = true;
        }
    // ======= ======= GET BENEFICIARIOS LISTA ======= =======
        getBeneficiariosLista() {
          if (!this.beneficiariosSelected || !this.beneficiariosSelected.id_proy_beneficiario) {
            this.beneficiariosLista = [];
            this.totalLengthBeneficiariosLista = 0;
            return;
          }
          const idBeneficiario = this.beneficiariosSelected.id_proy_beneficiario;
        
          this.servListBenef.getListBeneByIdProyBene(idBeneficiario).subscribe(
            (data) => {
              if (data && data[0] && data[0].dato) {
                this.beneficiariosLista = data[0].dato;                
              } else {
                this.beneficiariosLista = [];
              }
        
              this.totalLengthBeneficiariosLista = this.beneficiariosLista.length;
              this.countBeneficiarios();
            },
            (error) => {
              console.error('Error al cargar lista de beneficiarios:', error);
              this.beneficiariosLista = [];
              this.totalLengthBeneficiariosLista = 0;
            }
          );
        }
    // ======= ======= INIT ADD BENEFICIARIOS LISTA ======= =======
        initAddBeneficiarioLista(modalScope: TemplateRef<any>) {
          this.initBeneficiariosListModel();
        
          this.modalActionBeneficiarioLista = "add";
          this.modalTitleBeneficiarioLista = this.getModalTitleBeneficiarioLista("add");

          this.id_ubica_geo_depto = this.beneficiariosSelected.id_ubica_geo_depto;
          this.id_ubica_geo_muni = this.beneficiariosSelected.id_ubica_geo_muni;

          if (this.id_ubica_geo_depto) {
            this.cargarMunicipiosPorDepartamentoLista(this.id_ubica_geo_depto);
            setTimeout(() => {     
              this.id_ubica_geo_muni = this.beneficiariosSelected.id_ubica_geo_muni;       
            }, 500);
          }
          
          this.openModalBeneficiarioLista(modalScope);
        }
    // ======= ======= ADD BENEFICIARIOS LISTA ======= =======
        addBeneficiarioLista() {
          // Verificamos que haya un beneficiario seleccionado
          if (!this.beneficiariosSelected) {
            alert('Error: No hay un beneficiario seleccionado');
            return;
          }
        
          const objBeneficiarioLista = {
            p_id_proy_bene_lista: 0,
            p_id_proy_beneficiario: this.beneficiariosSelected.id_proy_beneficiario,            
            p_num_doc_identidad: this.num_doc_identidad,
            p_nombre: this.nombre,            
            p_es_hombre: this.es_hombre === "true" ? true : (this.es_hombre === "false" ? false : null),
            p_idp_organizacion_tipo: this.idp_organizacion_tipo || null,
            p_idp_organizacion_subtipo: this.idp_organizacion_subtipo || null,
            p_id_ubica_geo_depto: this.id_ubica_geo_depto || null,
            p_id_ubica_geo_muni: this.id_ubica_geo_muni || null,
            p_id_ubica_geo_comu: this.id_ubica_geo_comu || null,
            p_comunidad_no_registrada: this.comunidad_no_registrada || null,
            p_idp_rango_edad: this.idp_rango_edad || null
          };
          this.servListBenef.addListBene(objBeneficiarioLista).subscribe(
            (data) => {
              alert('Participante agregado exitosamente');
              this.beneficiariosListaSelected = null;
              this.getBeneficiariosLista();
              this.countBeneficiarios();
              this.closeModalBeneficiarioLista();
            },
            (error) => {
              alert('Error al guardar beneficiario');
              console.error(error);
            }
          );
        }
    // ======= ======= INIT EDIT BENEFICIARIOS LISTA ======= =======
        initEditBeneficiarioLista(modalScope: TemplateRef<any>){
          this.initBeneficiariosListModel();
          this.modalActionBeneficiarioLista = "edit";
          this.modalTitleBeneficiarioLista = this.getModalTitleBeneficiarioLista("edit");

          this.getParametricasBeneficiariosLista();

          this.id_proy_bene_lista = this.beneficiariosListaSelected.id_proy_bene_lista;
          this.id_proy_beneficiario = this.beneficiariosSelected.id_proy_beneficiario;         
          this.num_doc_identidad = this.beneficiariosListaSelected.num_doc_identidad;
          this.nombre = this.beneficiariosListaSelected.nombre;          
          this.es_hombre = this.beneficiariosListaSelected.es_hombre !== null ? 
                  (this.beneficiariosListaSelected.es_hombre === true ? "true" : "false") : 
                  null;
          this.idp_organizacion_tipo = this.beneficiariosListaSelected.idp_organizacion_tipo ;
          this.idp_organizacion_subtipo = this.beneficiariosListaSelected.idp_organizacion_subtipo ;
          this.id_ubica_geo_depto = this.beneficiariosListaSelected.id_ubica_geo_depto;
          this.id_ubica_geo_muni = this.beneficiariosListaSelected.id_ubica_geo_muni;
          this.id_ubica_geo_comu = this.beneficiariosListaSelected.id_ubica_geo_comu;
          this.comunidad_no_registrada = this.beneficiariosListaSelected.comunidad_no_registrada;
          this.idp_rango_edad = this.beneficiariosListaSelected.idp_rango_edad ;

          if (this.id_ubica_geo_depto) {
            this.cargarMunicipiosPorDepartamentoLista(this.id_ubica_geo_depto);
            setTimeout(() => {     
              this.id_ubica_geo_muni = this.beneficiariosListaSelected.id_ubica_geo_muni;       
            }, 500);
          }

          this.openModalBeneficiarioLista(modalScope);
        }
    // ======= ======= EDIT BENEFICIARIOS LISTA ======= =======
        editBeneficiarioLista(){
          const objBeneficiarioLista = {
            p_id_proy_bene_lista: this.id_proy_bene_lista,
            p_id_proy_beneficiario: this.id_proy_beneficiario,           
            p_num_doc_identidad: this.num_doc_identidad,
            p_nombre: this.nombre,            
            p_es_hombre: this.es_hombre === "true" ? true : (this.es_hombre === "false" ? false : null),
            p_idp_organizacion_tipo: this.idp_organizacion_tipo || null,
            p_idp_organizacion_subtipo: this.idp_organizacion_subtipo || null,
            p_id_ubica_geo_depto: this.id_ubica_geo_depto || null,
            p_id_ubica_geo_muni: this.id_ubica_geo_muni || null,
            p_id_ubica_geo_comu: this.id_ubica_geo_comu || null,
            p_comunidad_no_registrada: this.comunidad_no_registrada || null,
            p_idp_rango_edad: this.idp_rango_edad || null
          };          
          this.servListBenef.editListBene(objBeneficiarioLista).subscribe(
            (data) => {
              alert('Participante editado exitosamente');
              this.beneficiariosListaSelected = null;
              this.getBeneficiariosLista();
              this.countBeneficiarios();
              this.closeModalBeneficiarioLista();
            },
            (error) => {
              alert('Error al editar beneficiario');
              console.error(error);
            }
          );
        }
    // ======= ======= INIT DELETE BENEFICIARIOS LISTA ======= =======
        initDeleteBeneficiarioLista(modalScope: TemplateRef<any>){
          this.initBeneficiariosListModel();

          this.id_proy_bene_lista = this.beneficiariosListaSelected.id_proy_bene_lista;

          this.openModalBeneficiarioLista(modalScope);
        }
    // ======= ======= DELETE BENEFICIARIOS LISTA ======= =======
        deleteBeneficiarioLista(){
          this.servListBenef.deleteListBene(this.beneficiariosListaSelected.id_proy_bene_lista).subscribe(
            (data) => {
              alert('Participante eliminado exitosamente');              
              this.beneficiariosListaSelected = null;
              this.getBeneficiariosLista();
              this.countBeneficiarios();
              this.closeModalBeneficiarioLista();
            },
            (error) => {
              alert('Error al eliminar beneficiario');
              console.error(error);
            }
          );
        }
    // ======= ======= ======= ======= VALIDATION BENEFICIARIOS LISTA ======= ======= ======= =======
        onSubmitBeneficiariosLista(): void{
          // ======= VALIDATION SECTION =======
          let valForm = false;
          this.ValidateNumDocIdentidad();
          this.ValidateNombre();

          valForm = 
            this.valNumDocIdentidad &&
            this.valNombre;

          // ======= ACTION SECTION =======
          if(valForm){
            if (this.modalActionBeneficiarioLista === 'add') {
              this.addBeneficiarioLista();
            } else {
              this.editBeneficiarioLista();
            }
          }
          this.closeModalBeneficiarioLista();          
        }

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
        //id_proyecto: any = '';
        //fecha: any = '';
        id_organizacion: any = '';
        referente: any = '';
        vinculo: any = '';
        idp_convenio: any = '';
        //id_persona_reg: any = '';
        //fecha_hora_reg: any = '';

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
                if (data && data.length > 0 && data[0].dato) {
                    this.aliadosOrganizacion = data[0].dato;
                } else {
                    this.aliadosOrganizacion = [];
                }
            },
            (error) => {
                console.error(error);
                this.aliadosOrganizacion = []; 
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
        //private modalRef: NgbModalRef | null = null;
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
            p_id_organizacion: this.id_organizacion || null,
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
              this.aliadosSelected = null;
              this.closeModalAliado(); 
              this.getAliados();              
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
          p_id_organizacion: this.id_organizacion || null,
          p_referente: this.referente,
          p_vinculo: this.vinculo,
          p_idp_convenio: this.idp_convenio,
          p_id_persona_reg: this.id_persona_reg,
          p_fecha: this.fecha,
          p_fecha_hora_reg: this.getCurrentDateTime()
        };
        this.servAliados.editAliado(objAliado).subscribe(
          (data) => {
            alert('Aliado editado exitosamente');
            this.aliadosSelected = null;
            this.closeModalAliado(); 
            this.getAliados();
          },
          (error) => {
            alert('Error al editar aliado');
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
            alert('Aliado eliminado exitosamente');
            this.aliadosSelected = null;
            this.closeModalAliado();            
            this.getAliados();
          },
          (error) => {
            alert('Error al eliminar aliado');
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
          id_institucion: any = '';
          idInstitucion: number = 1;
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
          this.id_institucion = "";
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
            p_id_institucion: this.idInstitucion,
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