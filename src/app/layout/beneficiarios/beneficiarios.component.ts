import { Component, OnInit, TemplateRef, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ProyectoService } from '../../services/proyectoData.service';

import { servicios } from "../../servicios/servicios";
//Beneficiarios
import { servBeneficiarios } from "../../servicios/beneficiarios";
import { servUbicaGeografica } from "../../servicios/ubicaGeografica";
import { servListBenef } from "../../servicios/beneficiariosLista";
import { servActividad } from "../../servicios/actividad";
//Aliados
import { servAliados } from "../../servicios/aliados";
import { servInstituciones } from "../../servicios/instituciones";
//Organizaciones
import { ServOrganizacion } from "../../servicios/organizaciones";
import { log } from 'console';
import { Notify,Report,Confirm } from 'notiflix';
import { timeout } from 'rxjs';
import { ExcelExportService } from '../../services/excelExport.service';

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
      private servInstituciones: servInstituciones,
    //Organizaciones
      private ServOrganizacion: ServOrganizacion,
      private cdr: ChangeDetectorRef
  ) {}

  // ======= ======= HEADER SECTION ======= =======
      idProyecto: any = parseInt(localStorage.getItem('currentIdProy'));
      idPersonaReg: any = parseInt(localStorage.getItem('currentIdPer'));
      namePersonaReg: any = localStorage.getItem('userFullName');
      currentPerProRol: any = localStorage.getItem('currentPerProRol');
      archivo: File | null = null;

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
      getDescripcionSubtipo(idRegistro: any, paramList: any): string {
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
      getOrganizacionTipo(idRegistro: any, paramList: any): string {
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
      ubica_geo_comu: any = '';

      beneficiarios_persona_registro: any = "";
      beneficiarios_fecha_registro: any = "";
  // ======= ======= LLAMADOS A SELECCIONADORES PARA NODAL BENEFICIARIOS ======= =======
      beneficiariosTipoEvento: any[] = [];
      beneficiariosUbicaDepto: any[] = [];
      beneficiariosUbicaMuni: any[] = [];
      beneficiariosUbicaComu: any[] = [];
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
    getParametricasBeneficiarios(): void {
      // ======= GET TIPO EVENTO =======
      this.servicios.getParametricaByIdTipo(25).subscribe(
        (data) => {
          //this.beneficiariosTipoEvento = data[0].dato;
          this.beneficiariosTipoEvento = data[0].dato.filter(evento => evento.id_estado === 1);
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
          if (data[0].dato != null) {
            this.beneficiariosActividades = data[0].dato;
          }
          else {
            this.beneficiariosActividades = [];
          }
        },
        (error) => {
          console.error(error);
          this.beneficiariosActividades = [];
        }
      );
    }
  // ======= ======= GET MUNICIPIO ======= =======
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
  // ======= ======= GET COMUNIDAD ======= =======
    cargarComunidadPorMunicipio(idMunicipio: any) {
      if (idMunicipio) {
        this.servUbicaGeografica.getUbiComunidad(idMunicipio).subscribe(
          (data) => {
            this.beneficiariosUbicaComu = data[0].dato;
          },
          (error) => {
            console.error(error);
            this.beneficiariosUbicaComu = [];
          }
        );
      } else {
        this.beneficiariosUbicaComu = [];
      }
      this.id_ubica_geo_comu = null;
    }
  // ======= ======= VALDIATE FUNCTIONS SECTION ======= =======
      valtipoEvento: any = true;
      ValidateTipoEvento() {
        this.valtipoEvento = true;
        if (!this.idp_tipo_evento) {
          this.valtipoEvento = false;
        }
      }
      valFecha: any = true;
      ValidateFecha() {
        this.valFecha = true;
        if (!this.fecha) {
          this.valFecha = false;
        }
      }
      valTituloEvento: any = true;
      ValidateTituloEvento() {
        this.valTituloEvento = true;
        if (!this.titulo_evento || this.titulo_evento.trim().length === 0  || this.titulo_evento.trim().length > 50) {
          this.valTituloEvento = false;
        }
      }
      valDepartamento: any = true;
      ValidateDepartamento() {
        this.valDepartamento = true;
        if (!this.id_ubica_geo_depto) {
          this.valDepartamento = false;
        }
      }
      valMunicipio: any = true;
      ValidateMunicipio() {
        this.valMunicipio = true;
        if (!this.id_ubica_geo_muni) {
          this.valMunicipio = false;
        }
      }
      valComunidad: any = true;
      ValidateComunidad() {
        this.valComunidad = true;
        if (!this.id_ubica_geo_comu) {
          this.valComunidad = false;
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
          this.cdr.detectChanges();
        }
      }
  // ======= ======= GET BENEFICIARIOS ======= =======
      getModalTitleBeneficiario(modalActionBeneficiario: any) {
        this.modalTitleBeneficiario = (modalActionBeneficiario == "add") ? ("Añadir Evento Para Beneficiario") : this.modalTitleBeneficiario;
        this.modalTitleBeneficiario = (modalActionBeneficiario == "edit") ? ("Editar Evento Para Beneficiario") : this.modalTitleBeneficiario;
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
          if (beneficiarioSel.id_proy_beneficiario == beneficiario.id_proy_beneficiario) {
            if (beneficiarioSel.selected) {
              this.beneficiariosSelected = beneficiarioSel;
            }
            else {
              this.beneficiariosSelected = null;
            }
          }
          else {
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
      uploadFile(file: any, nombreTabla: any, campoTabla: any, idEnTabla: any, fileName: any, idRegistro: any) {
        this.servicios.uploadFile(file, nombreTabla, campoTabla, idEnTabla, fileName, idRegistro).subscribe(
          (response) => {
            console.log('Archivo subido:', response);
            Notify.success('Archivo subido exitosamente.');
            this.getBeneficiarios();
          },
          (error) => {
            console.error('Error al subir el archivo:', error);
          }
        );
      }
  // ======= ======= DOWNLOAD IMAGE FUN ======= =======
      downloadFile(nombreTabla: any, campoTabla: any, idEnTabla: any, idRegistro: any) {
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
          Notify.warning('No hay documento disponible para descargar');
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
              Notify.warning('No se pudo descargar el documento');
            }
          })
          .catch(error => {
            console.error('Error al descargar el documento:', error);
            Notify.failure('Error al descargar el documento');
          });
      }
  // ======= ======= INIT BENEFICIARIOS MODEL ======= =======
      initBeneficiariosModel() {
        this.modalTitleBeneficiario = '';

        this.id_proy_beneficiario = 0;
        this.id_proyecto = '';
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
        this.ubica_geo_comu = '';

        this.beneficiarios_persona_registro = this.namePersonaReg;
        this.beneficiarios_fecha_registro = "";

        this.selectedFileBeneficiario = null;
        this.fileNameBeneficiario = '';

        this.valtipoEvento = true;
        this.valFecha = true;
        this.valTituloEvento = true;
        this.valDepartamento = true;
        this.valMunicipio = true;
        this.valComunidad = true;
      }
  // ======= ======= GET BENEFICIARIOS ======= =======
      getBeneficiarios() {
        this.servBeneficiarios.getBeneficiariosByIdProy(this.idProyecto).subscribe(
          (data) => {
            this.beneficiarios = (data[0].dato) ? (data[0].dato) : ([]);
            this.totalLengthBeneficiarios = this.beneficiarios.length;
            this.countHeaderData();
            this.cdr.detectChanges();
          },
          (error) => {
            console.error(error);
          }
        );
      }
      isEditingBeneficiario: any = false;
  // ======= ======= INIT ADD BENEFICIARIOS ======= =======
      initAddBeneficiario(modalScope: TemplateRef<any>) {
        this.initBeneficiariosModel();

        this.beneficiarios_fecha_registro = this.getCurrentDateTime();

        this.modalActionBeneficiario = "add";
        this.modalTitleBeneficiario = this.getModalTitleBeneficiario("add");

        this.isEditingBeneficiario = false;

        this.mujeres = 0;
        this.hombres = 0;
        this.beneficiariosUbicaMuni = [];
        this.beneficiariosUbicaComu = [];

        this.openModalBeneficiario(modalScope);
      }
  // ======= ======= ADD BENEFICIARIOS ======= =======
      addBeneficiario() {
        const objBeneficiario = {
          p_id_proy_beneficiario: 0,
          p_id_proyecto: parseInt(this.idProyecto,10),
          p_mujeres: this.mujeres || 0,
          p_hombres: this.hombres || 0,
          p_titulo_evento: this.titulo_evento,
          p_evento_detalle: this.evento_detalle,
          p_id_ubica_geo_depto: this.id_ubica_geo_depto,
          p_id_ubica_geo_muni: this.id_ubica_geo_muni,
          p_id_ubica_geo_comu: this.id_ubica_geo_comu,
          p_id_proy_actividad: this.id_proy_actividad || null,
          p_idp_tipo_evento: this.idp_tipo_evento,
          p_ruta_documento: null,
          p_id_persona_reg: parseInt(this.idPersonaReg, 10),
          p_fecha: this.fecha,
          p_fecha_hora_reg: null
        };

        this.servBeneficiarios.addBeneficiario(objBeneficiario).subscribe(
          (data) => {
            Notify.success('Evento Para Beneficiario agregado exitosamente.');
            this.beneficiariosSelected = null;
            this.getBeneficiarios();
            this.closeModalBeneficiario();
          },
          (error) => {        
            Notify.failure('Error al guardar Evento Para Beneficiario');
            console.error(error);
          }
        );
      }
  // ======= ======= INIT EDIT BENEFICIARIOS ======= =======
      initEditBeneficiario(modalScope: TemplateRef<any>) {
        this.initBeneficiariosModel();
        this.modalActionBeneficiario = "edit";
        this.modalTitleBeneficiario = this.getModalTitleBeneficiario("edit");
        this.isEditingBeneficiario = true;

        this.id_proy_beneficiario = this.beneficiariosSelected.id_proy_beneficiario;
        this.id_proyecto = this.beneficiariosSelected.id_proyecto;

        if (this.id_proy_beneficiario) {
          this.servListBenef.getListBeneByIdProyBene(this.id_proy_beneficiario).subscribe(
            (data) => {
              if (data && data[0] && data[0].dato) {
                this.beneficiariosLista = data[0].dato;
              } else {
                this.beneficiariosLista = [];
              }
              this.totalLengthBeneficiariosLista = this.beneficiariosLista.length;

              // Contar beneficiarios después de obtener la lista
              this.countBeneficiarios();

              // Asignar valores después de contar
              this.mujeres = this.mujeresCount;
              this.hombres = this.hombresCount;
            },
            (error) => {
              console.error('Error al cargar lista de beneficiarios:', error);
              this.beneficiariosLista = [];
              this.totalLengthBeneficiariosLista = 0;
              this.countBeneficiarios();
              this.mujeres = 0;
              this.hombres = 0;
            }
          );
        }
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
        this.ubica_geo_comu = this.beneficiariosSelected.ubica_geo_comu;

        const idMunicipio = this.beneficiariosSelected.id_ubica_geo_muni;
        const idComunidad = this.beneficiariosSelected.id_ubica_geo_comu;

        if (this.id_ubica_geo_depto) {
          this.servUbicaGeografica.getUbiMunicipios(this.id_ubica_geo_depto).subscribe(
            (data) => {
              this.beneficiariosUbicaMuni = data[0].dato;
              this.id_ubica_geo_muni = idMunicipio;
              if (idMunicipio) {
                this.servUbicaGeografica.getUbiComunidad(idMunicipio).subscribe(
                  (data) => {
                    this.beneficiariosUbicaComu = data[0].dato;
                    this.id_ubica_geo_comu = idComunidad;
                  },
                  (error) => {
                    console.error(error);
                    this.beneficiariosUbicaComu = [];
                  }
                );
              }
            },
            (error) => {
              console.error(error);
              this.beneficiariosUbicaMuni = [];
            }
          );
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
          p_id_ubica_geo_depto: this.id_ubica_geo_depto,
          p_id_ubica_geo_muni: this.id_ubica_geo_muni,
          p_id_ubica_geo_comu: this.id_ubica_geo_comu,
          p_id_proy_actividad: this.id_proy_actividad || null,
          p_idp_tipo_evento: this.idp_tipo_evento,
          p_ruta_documento: this.ruta_documento || null,
          p_id_persona_reg: this.id_persona_reg,
          p_fecha: this.fecha,
          p_fecha_hora_reg: this.getCurrentDateTime()
        };

        this.servBeneficiarios.editBeneficiario(objBeneficiario).subscribe(
          (data) => {

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
              this.getBeneficiarios();
              this.closeModalBeneficiario();
            }

            Notify.success('Evento Para Beneficiario editado exitosamente');
            this.beneficiariosSelected = null;
            this.getBeneficiarios();
            this.closeModalBeneficiario();
          },
          (error) => {
            Notify.failure('Error al editar Evento Para Beneficiario');
            console.error(error);
          }          
        );
      }
  // ======= ======= INIT DELETE BENEFICIARIOS ======= =======
      initDeleteBeneficiario(modalScope: TemplateRef<any>) {
        this.initBeneficiariosModel();

        this.id_proy_beneficiario = this.beneficiariosSelected.id_proy_beneficiario;

        this.openModalBeneficiario(modalScope);
      }
  // ======= ======= DELETE BENEFICIARIOS ======= =======
      deleteBeneficiario() {
        this.servBeneficiarios.deleteBeneficiario(this.beneficiariosSelected.id_proy_beneficiario, this.idPersonaReg).subscribe(
          (data) => {
            Notify.success('Beneficiario eliminado exitosamente');
            this.closeModalBeneficiario();
            this.beneficiariosSelected = null;
            this.getBeneficiarios();
          },
          (error) => {
            console.error(error);
      
            if (error.status === 409) {
              Notify.failure('No se puede eliminar el beneficiario porque está vinculado a otros datos.');
            } else if (error.status === 404) {
              Notify.failure('Beneficiario no encontrado, es posible que ya haya sido eliminado.');
            } else if (error.status === 500) {
              Notify.failure('No se puede eliminar el beneficiario porque está vinculado a otros datos.');
            } else {
              Notify.failure(error.error?.message || 'Error desconocido al eliminar el beneficiario.');
            }
          }
        );
      }
  // ======= ======= ======= ======= VALIDATION BENEFICIARIOS ======= ======= ======= =======
      onSubmitBeneficiario(): void {
        // ======= VALIDATION SECTION =======
        let valForm = false;    
        this.ValidateTipoEvento();
        this.ValidateFecha();
        this.ValidateTituloEvento();
        this.ValidateDepartamento();
        this.ValidateMunicipio();
        this.ValidateComunidad();

        valForm =
          this.valtipoEvento &&
          this.valFecha &&
          this.valTituloEvento &&
          this.valDepartamento &&
          this.valMunicipio &&
          this.valComunidad;

        // ======= ACTION SECTION =======
        if (valForm) {
          if (this.modalActionBeneficiario === 'add') {
            this.addBeneficiario();
          } else {
            this.editBeneficiario();
          }
          this.closeModalBeneficiario();
        }
      }
    // ======= ======= DOWNLOAD EXCEL ======= ======= 
        downloadExcel() {
          const columnas = [ 
            'tipo_evento', 
            'fecha',
            'departamento',
            'municipio',
            'comunidad',        
            'titulo_evento',
            'evento_detalle',          
            'mujeres',
            'hombres',
            'total', 
            'actividad'        
          ]; 
          
          const today = new Date();
          const formattedDate = today.toLocaleDateString('es-ES').replace(/\//g, '_');
          
          // Crear una copia con el total calculado para cada beneficiario
          let beneficiariosObj = this.beneficiarios.map(beneficiario => {
            return {
              ...beneficiario,
              total: (beneficiario.mujeres || 0) + (beneficiario.hombres || 0)
            };
          });
          
          ExcelExportService.exportToExcel(
            beneficiariosObj,
            'Reporte_Beneficiarios_' + formattedDate,
            columnas      
          );
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

  mujeresCount: any = '';
  hombresCount: any = '';
  totalCount: any = '';

  // ======= ======= LLAMADOS A SELECCIONADORES PARA NODAL BENEFICIARIOS LISTA ======= =======
  beneficiariosListaOrganizacionTipo: any[] = [];
  beneficiariosListaOrganizacionSubTipo: any[] = [];
  beneficiariosListaOrganizacionSubTipoFilter: any[] = [];
  beneficiariosListaUbicaDepto: any[] = [];
  beneficiariosListaUbicaMuni: any[] = [];
  beneficiariosListaUbicaComu: any[] = [];
  beneficiariosListaRangoEdad: any[] = [];
  // ======= ======= GET PARAMETRICAS BENEFICIARIOS LISTA ======= =======
  getParametricasBeneficiariosLista(): void {
    // ======= GET ORGANIZACION TIPO =======
    this.servicios.getParametricaByIdTipo(18).subscribe(
      (data) => {
        //this.beneficiariosListaOrganizacionTipo = data[0].dato;
        this.beneficiariosListaOrganizacionTipo = data[0].dato.filter(item => item.id_estado === 1);
      },
      (error) => {
        console.error(error);
      }
    );
    // ======= GET ORGANIZACION SUBTIPO =======
    this.servicios.getParametricaByIdTipo(26).subscribe(
      (data) => {
        //this.beneficiariosListaOrganizacionSubTipo = data[0].dato;
        this.beneficiariosListaOrganizacionSubTipo = data[0].dato.filter(item => item.id_estado === 1);
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
        //this.beneficiariosListaRangoEdad = data[0].dato;
        this.beneficiariosListaRangoEdad = data[0].dato.filter(rangoEdad => rangoEdad.id_estado === 1);
      },
      (error) => {
        console.error(error);
      }
    );
  }
  // ======= GET ORGANIZACION SUBTIPO =======
  getDescripcionOrganizacionSubtipo(idRegistro: any, paramList: any): string {
    const subtipo = paramList.find(elem => elem.id_padre.id_subtipo == idRegistro);
    return subtipo ? subtipo.descripcion_subtipo : '';
  }

  cargarOrganizacionSubTipoPorTipo(idTipo: any) {
    this.beneficiariosListaOrganizacionSubTipoFilter = this.beneficiariosListaOrganizacionSubTipo.filter(subtipo => subtipo.id_padre == idTipo);
    this.idp_organizacion_subtipo = null;
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
  // ======= ======= GET COMUNIDAD ======= =======
  cargarComunidadPorMunicipioLista(idMunicipioLista: any) {
    if (idMunicipioLista) {
      this.servUbicaGeografica.getUbiComunidad(idMunicipioLista).subscribe(
        (data) => {
          this.beneficiariosListaUbicaComu = data[0].dato;
        },
        (error) => {
          console.error(error);
          this.beneficiariosListaUbicaComu = [];
        }
      );
    } else {
      this.beneficiariosListaUbicaComu = [];
    }
    this.id_ubica_geo_comu = null;
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
      this.beneficiariosListaSelected = null;
    } else {
      Notify.warning('Primero debe seleccionar un beneficiario');
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
      ValidateNumDocIdentidad() {
        this.valNumDocIdentidad = true;
        if (!this.num_doc_identidad || this.num_doc_identidad.length > 10) {
          this.valNumDocIdentidad = false;
          return;
        }
        // Validar que solo sean números
        if (!/^\d+$/.test(this.num_doc_identidad)) {
          this.valNumDocIdentidad = false;
        }
      }
      valNombre: any = true;
      ValidateNombre() {
        this.valNombre = true;
        if ((!this.nombre) || (this.nombre.length > 100)) {
          this.valNombre = false;
        }
      }
      valSexo: any = true;
      ValidateSexo() {
        this.valSexo = true;
        if (!this.es_hombre) {
          this.valSexo = false;
        }
      }
      valOrganizacionTipo: any = true;
      ValidateOrganizacionTipo() {
        this.valOrganizacionTipo = true;
        if (!this.idp_organizacion_tipo) {
          this.valOrganizacionTipo = false;
        }
      }
      valDeptoLista: any = true;
      ValidateDeptoLista() {
        this.valDeptoLista = true;
        if (!this.id_ubica_geo_depto) {
          this.valDeptoLista = false;
        }
      }
      valMuniLista: any = true;
      ValidateMuniLista() {
        this.valMuniLista = true;
        if (!this.id_ubica_geo_muni) {
          this.valMuniLista = false;
        }
      }
      valComuLista: any = true;
      ValidateComuLista() {
        this.valComuLista = true;
        if (!this.id_ubica_geo_comu) {
          this.valComuLista = false;
        }
      }
      valRangoEdad: any = true;
      ValidateRangoEdad() {
        this.valRangoEdad = true;
        if (!this.idp_rango_edad) {
          this.valRangoEdad = false;
        }
      }
  // Función para verificar si un número de documento ya existe
  verificarDocumentoExistente(numDoc: any, idActual: any = null): boolean {
    if (!numDoc) return false;
    // Filtramos la lista para encontrar coincidencias, excluyendo el ID actual en caso de edición
    const documentoExistente = this.beneficiariosLista.find(bene =>
      bene.num_doc_identidad === numDoc &&
      bene.id_proy_bene_lista !== idActual
    );
    return !!documentoExistente;
  }
  // Función para marcar documentos duplicados en la lista
  marcarDocumentosDuplicados() {
    // Crear un mapa para contar las ocurrencias de cada número de documento
    const conteoDocumentos = new Map();
    // Primero contar las ocurrencias
    this.beneficiariosLista.forEach(bene => {
      if (bene.num_doc_identidad) {
        const count = conteoDocumentos.get(bene.num_doc_identidad) || 0;
        conteoDocumentos.set(bene.num_doc_identidad, count + 1);
      }
    });
    // Luego marcar los duplicados
    this.beneficiariosLista.forEach(bene => {
      if (bene.num_doc_identidad && conteoDocumentos.get(bene.num_doc_identidad) > 1) {
        bene.documentoDuplicado = true;
      } else {
        bene.documentoDuplicado = false;
      }
    });
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
      if (beneficiarioListaSel.id_proy_bene_lista == beneficiarioLista.id_proy_bene_lista) {
        if (beneficiarioListaSel.selected) {
          this.beneficiariosListaSelected = beneficiarioListaSel;
        }
        else {
          this.beneficiariosListaSelected = null;
        }
      }
      else {
        beneficiarioLista.selected = false;
      }
    });
  }
  // ======= ======= INIT BENEFICIARIOS LISTA MODEL ======= =======
  initBeneficiariosListModel() {
    this.modalTitleBeneficiarioLista = "";

    this.id_proy_bene_lista = 0;
    this.id_proy_beneficiario = '';
    this.num_doc_identidad = '';
    this.nombre = '';
    this.es_hombre = '';
    this.idp_organizacion_tipo = '';
    this.idp_organizacion_subtipo = '';
    this.id_ubica_geo_depto = null;
    this.id_ubica_geo_muni = null;
    this.id_ubica_geo_comu = null;
    this.comunidad_no_registrada = '';
    this.idp_rango_edad = '';

    this.tipo_actor = '';
    this.institucion_comunidad = '';
    this.rango_edad = '';

    this.valNumDocIdentidad = true;
    this.valNombre = true;
    this.valSexo = true;
    this.valOrganizacionTipo = true;
    this.valDeptoLista = true;
    this.valMuniLista = true;
    this.valComuLista = true;
    this.valRangoEdad = true;
  }
  // ======= ======= GET BENEFICIARIOS LISTA ======= =======
  getBeneficiariosLista() {
    if (!this.beneficiariosSelected || !this.beneficiariosSelected.id_proy_beneficiario) {
      this.beneficiariosLista = [];
      this.totalLengthBeneficiariosLista = 0;
      this.countBeneficiarios();
      return;
    }
    const idBeneficiario = this.beneficiariosSelected.id_proy_beneficiario;

    this.servListBenef.getListBeneByIdProyBene(idBeneficiario).subscribe(
      (data) => {
        if (data && data[0] && data[0].dato) {
          this.beneficiariosLista = data[0].dato;
          this.marcarDocumentosDuplicados();
        } else {
          this.beneficiariosLista = [];
        }
        this.totalLengthBeneficiariosLista = this.beneficiariosLista.length;
        this.countBeneficiarios();
        this.mujeres = this.mujeresCount;
        this.hombres = this.hombresCount;
      },
      (error) => {
        console.error('Error al cargar lista de beneficiarios:', error);
        this.beneficiariosLista = [];
        this.totalLengthBeneficiariosLista = 0;
        this.countBeneficiarios();
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
    this.id_ubica_geo_comu = this.beneficiariosSelected.id_ubica_geo_comu;

    const idMunicipio = this.beneficiariosSelected.id_ubica_geo_muni;
    const idComunidad = this.beneficiariosSelected.id_ubica_geo_comu;

    if (this.id_ubica_geo_depto) {
      this.servUbicaGeografica.getUbiMunicipios(this.id_ubica_geo_depto).subscribe(
        (data) => {
          this.beneficiariosListaUbicaMuni = data[0].dato;
          // Después de cargar los municipios, establecemos el valor del municipio
          this.id_ubica_geo_muni = idMunicipio;

          // Luego cargamos las comunidades si hay un municipio seleccionado
          if (idMunicipio) {
            this.servUbicaGeografica.getUbiComunidad(idMunicipio).subscribe(
              (data) => {
                this.beneficiariosListaUbicaComu = data[0].dato;
                // Después de cargar las comunidades, establecemos el valor de la comunidad
                this.id_ubica_geo_comu = idComunidad;
              },
              (error) => {
                console.error(error);
                this.beneficiariosListaUbicaComu = [];
              }
            );
          }
        },
        (error) => {
          console.error(error);
          this.beneficiariosListaUbicaMuni = [];
        }
      );
    }

    this.openModalBeneficiarioLista(modalScope);
  }
  // ======= ======= ADD BENEFICIARIOS LISTA ======= =======
  addBeneficiarioLista() {
    // Verificamos que haya un beneficiario seleccionado
    if (!this.beneficiariosSelected) {
      Notify.warning('No hay un beneficiario seleccionado');
      return;
    }
    // Verificar si el documento ya existe
    if (this.verificarDocumentoExistente(this.num_doc_identidad)) {
      Notify.warning('Ya existe un participante con este número de documento de identidad');
      return;
    }

    const objBeneficiarioLista = {
      p_id_proy_bene_lista: 0,
      p_id_proy_beneficiario: this.beneficiariosSelected.id_proy_beneficiario,
      p_num_doc_identidad: this.num_doc_identidad,
      p_nombre: this.nombre,
      p_es_hombre: this.es_hombre === "true" ? true : (this.es_hombre === "false" ? false : null),
      p_idp_organizacion_tipo: this.idp_organizacion_tipo,
      p_idp_organizacion_subtipo: this.idp_organizacion_subtipo || null,
      p_id_ubica_geo_depto: this.id_ubica_geo_depto,
      p_id_ubica_geo_muni: this.id_ubica_geo_muni,
      p_id_ubica_geo_comu: this.id_ubica_geo_comu || null,
      p_comunidad_no_registrada: this.comunidad_no_registrada || null,
      p_idp_rango_edad: this.idp_rango_edad 
    };
    this.servListBenef.addListBene(objBeneficiarioLista).subscribe(
      (data) => {
        Notify.success('Participante agregado exitosamente');
        this.beneficiariosListaSelected = null;
        this.getBeneficiariosLista();     
        this.closeModalBeneficiarioLista();
        this.initEditBeneficiario(this.id_proy_beneficiario);
      },
      (error) => {
        Notify.failure('Error al guardar participante');
        console.error(error);
      }
    );
  }
  // ======= ======= INIT EDIT BENEFICIARIOS LISTA ======= =======
  initEditBeneficiarioLista(modalScope: TemplateRef<any>) {
    this.initBeneficiariosListModel();
    this.modalActionBeneficiarioLista = "edit";
    this.modalTitleBeneficiarioLista = this.getModalTitleBeneficiarioLista("edit");

    this.getParametricasBeneficiariosLista();

    this.id_proy_bene_lista = this.beneficiariosListaSelected.id_proy_bene_lista;
    this.id_proy_beneficiario = this.beneficiariosSelected.id_proy_beneficiario;
    this.num_doc_identidad = this.beneficiariosListaSelected.num_doc_identidad;
    this.nombre = this.beneficiariosListaSelected.nombre;
    if (this.beneficiariosListaSelected.es_hombre === true) {
      this.es_hombre = "true";
    } else if (this.beneficiariosListaSelected.es_hombre === false) {
      this.es_hombre = "false";
    }
    this.id_ubica_geo_depto = this.beneficiariosListaSelected.id_ubica_geo_depto;
    this.id_ubica_geo_muni = this.beneficiariosListaSelected.id_ubica_geo_muni;
    this.id_ubica_geo_comu = this.beneficiariosListaSelected.id_ubica_geo_comu;
    this.comunidad_no_registrada = this.beneficiariosListaSelected.comunidad_no_registrada;
    this.idp_rango_edad = this.beneficiariosListaSelected.idp_rango_edad;

    this.idp_organizacion_tipo = this.beneficiariosListaSelected.idp_organizacion_tipo;
    this.cargarOrganizacionSubTipoPorTipo(this.idp_organizacion_tipo);
    this.idp_organizacion_subtipo = this.beneficiariosListaSelected.idp_organizacion_subtipo;

    const idMunicipio = this.beneficiariosListaSelected.id_ubica_geo_muni;
    const idComunidad = this.beneficiariosListaSelected.id_ubica_geo_comu;

    if (this.id_ubica_geo_depto) {
      this.servUbicaGeografica.getUbiMunicipios(this.id_ubica_geo_depto).subscribe(
        (data) => {
          this.beneficiariosListaUbicaMuni = data[0].dato;
          // Después de cargar los municipios, establecemos el valor del municipio
          this.id_ubica_geo_muni = idMunicipio;

          // Luego cargamos las comunidades si hay un municipio seleccionado
          if (idMunicipio) {
            this.servUbicaGeografica.getUbiComunidad(idMunicipio).subscribe(
              (data) => {
                this.beneficiariosListaUbicaComu = data[0].dato;
                // Después de cargar las comunidades, establecemos el valor de la comunidad
                this.id_ubica_geo_comu = idComunidad;
              },
              (error) => {
                console.error(error);
                this.beneficiariosListaUbicaComu = [];
              }
            );
          }
        },
        (error) => {
          console.error(error);
          this.beneficiariosListaUbicaMuni = [];
        }
      );
    }

    this.openModalBeneficiarioLista(modalScope);
  }
  // ======= ======= EDIT BENEFICIARIOS LISTA ======= =======
  editBeneficiarioLista() {
    // Verificar si el documento ya existe (excluyendo el registro actual)
    if (this.verificarDocumentoExistente(this.num_doc_identidad, this.id_proy_bene_lista)) {
      Notify.warning('Ya existe un participante con este número de documento de identidad');
      return;
    }
    const objBeneficiarioLista = {
      p_id_proy_bene_lista: this.id_proy_bene_lista,
      p_id_proy_beneficiario: this.id_proy_beneficiario,
      p_num_doc_identidad: this.num_doc_identidad,
      p_nombre: this.nombre,
      p_es_hombre: this.es_hombre === "true" ? true : (this.es_hombre === "false" ? false : null),
      p_idp_organizacion_tipo: this.idp_organizacion_tipo,
      p_idp_organizacion_subtipo: this.idp_organizacion_subtipo || null,
      p_id_ubica_geo_depto: this.id_ubica_geo_depto,
      p_id_ubica_geo_muni: this.id_ubica_geo_muni,
      p_id_ubica_geo_comu: this.id_ubica_geo_comu || null,
      p_comunidad_no_registrada: this.comunidad_no_registrada || null,
      p_idp_rango_edad: this.idp_rango_edad
    };
    this.servListBenef.editListBene(objBeneficiarioLista).subscribe(
      (data) => {
        Notify.success('Participante editado exitosamente');
        this.beneficiariosListaSelected = null;
        this.getBeneficiariosLista();
        this.closeModalBeneficiarioLista();
        this.initEditBeneficiario(this.id_proy_beneficiario);       
      },
      (error) => {
        Notify.failure('Error al editar beneficiario');
        console.error(error);
      }
    );
  }
  // ======= ======= INIT DELETE BENEFICIARIOS LISTA ======= =======
  initDeleteBeneficiarioLista(modalScope: TemplateRef<any>) {
    Confirm.show(
      'Eliminar Participante',
      '¿Está seguro de querer eliminar el Participante?',
      'Eliminar',
      'Cerrar',
      () => {
        this.servListBenef.deleteListBene(this.beneficiariosListaSelected.id_proy_bene_lista).subscribe(
          (data) => {
            Notify.success('Participante eliminado exitosamente');
            this.beneficiariosListaSelected = null;
            this.getBeneficiariosLista();
          },
          (error) => {
            Notify.failure('Error al eliminar participante');
            console.error(error);
          }
        );
      },
      () => { },{},);
     /*this.initBeneficiariosListModel();
     this.id_proy_bene_lista = this.beneficiariosListaSelected.id_proy_bene_lista;
     this.openModalBeneficiarioLista(modalScope);*/
  }
  // ======= ======= DELETE BENEFICIARIOS LISTA ======= =======
  deleteBeneficiarioLista() {
    this.servListBenef.deleteListBene(this.beneficiariosListaSelected.id_proy_bene_lista).subscribe(
      (data) => {
        Notify.success('Participante eliminado exitosamente');
        this.beneficiariosListaSelected = null;
        this.getBeneficiariosLista();
        //this.closeModalBeneficiarioLista();
        //this.initEditBeneficiario(this.id_proy_beneficiario);
      },
      (error) => {        
        Notify.failure('Error al eliminar participante');        
        console.error(error);
      }
    );
  }
  // ======= ======= ======= ======= VALIDATION BENEFICIARIOS LISTA ======= ======= ======= =======
  onSubmitBeneficiariosLista(): void {
    // ======= VALIDATION SECTION =======
    let valForm = false;
    this.ValidateNumDocIdentidad();
    this.ValidateNombre();
    this.ValidateSexo();
    this.ValidateOrganizacionTipo();
    this.ValidateDeptoLista();
    this.ValidateMuniLista();
    this.ValidateComuLista();
    this.ValidateRangoEdad();

    valForm =
      this.valNumDocIdentidad &&
      this.valNombre && 
      this.valSexo &&
      this.valOrganizacionTipo &&
      this.valDeptoLista &&
      this.valMuniLista &&
      this.valComuLista &&
      this.valRangoEdad;

    // ======= ACTION SECTION =======
    if (valForm) {
      if (this.modalActionBeneficiarioLista === 'add') {
        this.addBeneficiarioLista();
      } else {
        this.editBeneficiarioLista();
      }
    }
    //this.closeModalBeneficiarioLista();
  }
  // ======= ======= ======= ======= ======= ======= ======= ======= ======= ======= =======    
  // ======= ======= GET LISTA DE BENEFICIARIOS POR PROYECTO LLAMADO DESDE BENEFICIARIOS ======= ======= 
  // ======= ======= ======= ======= ======= ======= ======= ======= ======= ======= =======    
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

  importarBeneficiariosDesdeProyecto(idProyectoOrigen: number) {
    if (this.beneficiariosListaProyectoSelected.length === 0) {      
      Notify.warning('Debe seleccionar al menos un beneficiario para importar.');
      return;
    }

    const beneficiariosAImportar = this.beneficiariosListaProyectoSelected.map((beneficiario) => ({
      p_id_proy_bene_lista: 0,
      p_id_proy_beneficiario: this.id_proy_beneficiario,
      p_num_doc_identidad: beneficiario.num_doc_identidad,
      p_nombre: beneficiario.nombre || null,
      p_es_hombre: beneficiario.genero === "M",
      p_idp_organizacion_tipo: beneficiario.idp_organizacion_tipo || null,
      p_idp_organizacion_subtipo: beneficiario.idp_organizacion_subtipo || null,
      p_id_ubica_geo_depto: beneficiario.id_ubica_geo_depto || null,
      p_id_ubica_geo_muni: beneficiario.id_ubica_geo_muni || null,
      p_id_ubica_geo_comu: beneficiario.id_ubica_geo_comu || null,
      p_comunidad_no_registrada: beneficiario.comunidad_no_registrada || null,
      p_idp_rango_edad: beneficiario.idp_rango_edad || null
    }));

    let errores = 0;

    beneficiariosAImportar.forEach((nuevoBeneficiario) => {
      this.servListBenef.addListBene(nuevoBeneficiario).subscribe( 
        () => (`Beneficiario importado: ${nuevoBeneficiario.p_nombre}`),       
        (error) => {
          console.error(`Error al importar ${nuevoBeneficiario.p_nombre}`, error);
          errores++;
        }
      );
    });

    setTimeout(() => {
      if (errores > 0) { 
        Notify.warning(`Importación finalizada con ${errores} errores.`);      
      } else {        
        Notify.success('Importación completada exitosamente con éxito.');
        this.getBeneficiariosListaPorProyecto();
        this.getBeneficiariosLista();
      }
      this.getBeneficiariosListaPorProyecto();
      this.getBeneficiariosLista(); 
      this.beneficiariosListaProyectoSelected = []; 
      this.closeModalBeneficiarioListaProyecto(); 
    }, 500); 
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
  // ======= ======= IMPORT BENEFICIARIOS LISTA PROYECTO ======= =======
  onFileSelected(event: Event) {
    //console.log("onFileSelected");

    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.archivo = file; // Asignar el archivo solo si es válido
      //console.log(this.archivo.name);
      this.importExcelBeneficiario(this.id_proy_beneficiario);
      //Notify.success('Archivo seleccionado correctamente.');
      input.value = ''; // Restablecer el input
      // this.descripcion = this.archivo.name;
      // console.log(this.descripcion);
    } else {
      this.archivo = null; // Asegurarse de que sea null si no es válido
      Notify.failure('Solo se permiten archivos Excel (.xlsx, .xls)');
      input.value = ''; // Restablecer el input
    }
  }
  // ======= ======= IMPORT BENEFICIARIOS LISTA EXCEL ======= =======
  importExcelBeneficiario(id_proy_beneficiario) {
    //console.log("id_proy_beneficiario:", id_proy_beneficiario);
    //console.log(this.archivo);

    this.servBeneficiarios.importarData(this.archivo, id_proy_beneficiario).subscribe(
      (data) => {
        //console.log(data);
        if(data.res=="ERROR"){
          Report.warning(
            'Problemas con la importación',
            ' '+data.message,
            'aceptar'
            );
          return;
        }
        else{
          this.getBeneficiariosLista();
          Notify.success('Beneficiario(s) importado(s) exitosamente.');
        }
      },
      (error) => {
        console.error("mensaje:", error);       
        Notify.failure('Error al importar Beneficiario(s).');
      }
    );
  }
  // ======= ======= EXPORT BENEFICIARIOS LISTA EXCEL ======= =======
  exportarExcelBeneficiario() {
    this.servBeneficiarios.exportarData(this.id_proy_beneficiario).subscribe({
      next: (response: Blob) => {
        // Crear un enlace temporal para la descarga
        const link = document.createElement('a');
        const objectUrl = URL.createObjectURL(response);
        link.href = objectUrl;
        link.download = "exportarBeneficiario.xlsx";
        link.click();
        Notify.success('Lista de Participantes exportados exitosamente.');
        // Liberar memoria
        URL.revokeObjectURL(objectUrl);
      },
      error: (error) => {
        Notify.failure('Error al exportar la lista de participantes.');        
        console.error('Error al descargar el Excel:', error);
      }
    });
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
  getParametricasAliados(): void {
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
        //this.aliadosConvenio = data[0].dato;
        this.aliadosConvenio = data[0].dato.filter(item => item.id_estado === 1);
      },
      (error) => {
        console.error(error);
      }
    );
  }
  // ======= ======= VALDIATE FUNCTIONS SECTION ======= =======
  valFechaAliado: any = true;
  ValidateFechaAliado() {
    this.valFechaAliado = true;
    if (!this.fecha) {
      this.valFechaAliado = false;
    }
  }
  valReferente: any = true;
  ValidateReferente() {
    this.valReferente = true;
    if ((!this.referente) || (this.referente.length > 100)) {
      this.valReferente = false;
    }
  }
  valVinculo: any = true;
  ValidateVinculo() {
    this.valVinculo = true;
    if ((!this.vinculo) || (this.vinculo.length > 255)) {
      this.valVinculo = false;
    }
  }
  valConvenio: any = true;
  ValidateConvenio() {
    this.valConvenio = true;
    if (!this.idp_convenio) {
      this.valConvenio = false;
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
    this.aliados.forEach(aliado => {
      if (aliadoSel.id_proy_aliado == aliado.id_proy_aliado) {
        if (aliadoSel.selected) {
          this.aliadosSelected = aliadoSel;
        }
        else {
          this.aliadosSelected = null;
        }
      }
      else {
        aliado.selected = false;
      }
    });
  }
  // ======= ======= INIT ALIADOS MODEL ======= =======
  initAliadosModel() {
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

    this.valFechaAliado = true;
    this.valReferente = true;
    this.valVinculo = true;
    this.valConvenio = true;
  }
  // ======= ======= GET ALIADOS ======= =======
  getAliados() {
    this.servAliados.getAliadosByIdProy(this.idProyecto).subscribe(
      (data) => {
        this.aliados = (data[0].dato) ? (data[0].dato) : ([]);
        this.totalLengthAliados = this.aliados.length;
        this.countHeaderData();
      },
      (error) => {
        console.error(error);
      }
    );
  }
  // ======= ======= INIT ADD ALIADOS ======= =======
  initAddAliado(modalScope: TemplateRef<any>) {
    this.initAliadosModel();

    this.aliados_fecha_registro = this.getCurrentDateTime();

    this.modalActionAliado = "add";
    this.modalTitleAliado = this.getModalTitleAliado("add");

    this.openModalAliado(modalScope);
  }
  // ======= ======= ADD ALIADOS ======= =======
  addAliado() {
    const objAliado = {
      p_id_proy_aliado: 0,
      p_id_proyecto: this.idProyecto,
      p_id_organizacion: this.id_organizacion || null,
      p_referente: this.referente,
      p_vinculo: this.vinculo,
      p_idp_convenio: this.idp_convenio,
      p_id_persona_reg: parseInt(this.idPersonaReg, 10),
      p_fecha: this.fecha,
      p_fecha_hora_reg: null
    };
    this.servAliados.addAliado(objAliado).subscribe(
      (data) => {        
        Notify.success('Aliado agregado exitosamente');
        this.aliadosSelected = null;
        this.closeModalAliado();
        this.getAliados();
      },
      (error) => {       
        Notify.failure('Error al guardar aliado');
        console.error(error);
      }
    );
  }
  // ======= ======= INIT EDIT ALIADOS ======= =======
  initEditAliado(modalScope: TemplateRef<any>) {
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
  editAliado() {
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
        Notify.success('Aliado editado exitosamente');
        this.aliadosSelected = null;
        this.closeModalAliado();
        this.getAliados();
      },
      (error) => {       
        Notify.failure('Error al editar aliado');
        console.error(error);
      }
    );
  }
  // ======= ======= INIT DELETE ALIADOS ======= =======
  initDeleteAliado(modalScope: TemplateRef<any>) {
    this.initAliadosModel();

    this.id_proy_aliado = this.aliadosSelected.id_proy_aliado;

    this.openModalAliado(modalScope);
  }
  // ======= ======= DELETE ALIADOS ======= =======
  deleteAliado() {
    this.servAliados.deleteAliado(this.aliadosSelected.id_proy_aliado, this.idPersonaReg).subscribe(
      (data) => {
        Notify.success('Aliado eliminado exitosamente');
        this.aliadosSelected = null;
        this.closeModalAliado();
        this.getAliados();
      },
      (error) => {
        Notify.failure('Error al eliminar aliado');
        console.error(error);
      }
    );
  }
  // ======= ======= ======= ======= VALIDATION ALIADOS ======= ======= ======= =======
  onSubmitAliados(): void {
    // ======= VALIDATION SECTION =======
    let valForm = false;
    this.ValidateFechaAliado();
    this.ValidateReferente();
    this.ValidateVinculo();
    this.ValidateConvenio();

    valForm =
      this.valFechaAliado &&
      this.valReferente &&
      this.valVinculo &&
      this.valConvenio;

    // ======= ACTION SECTION =======
    if (valForm) {
      if (this.modalActionAliado === 'add') {
        this.addAliado();
      } else {
        this.editAliado();
      }
      this.closeModalAliado();
    }
  }
  downloadExcelAliados() {
    const columnas = [ 
      'fecha',
      'nombre_organizacion',
      'referente',
      'vinculo',
      'convenio'     
    ]; 
    const today = new Date();
    const formattedDate = today.toLocaleDateString('es-ES').replace(/\//g, '_');
    let aliadosObj = [...this.aliados];
    ExcelExportService.exportToExcel(
     aliadosObj,
      'Reporte_Aliados_' + formattedDate,
      columnas      
    )
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
  getParametricasOrganizaciones(): void {
    // ======= GET TIPO ORGANIZACION =======
    this.servicios.getParametricaByIdTipo(18).subscribe(
      (data) => {
        //this.orgTipoOrganizacion = data[0].dato;
        this.orgTipoOrganizacion = data[0].dato.filter(item => item.id_estado === 1);
      },
      (error) => {
        console.error(error);
      }
    );
  }
  // ======= ======= VALDIATE FUNCTIONS SECTION ======= =======
  valTipoOrganizacion: any = true;
  ValidateTipoOrganizacion() {
    this.valTipoOrganizacion = true;
    if (!this.idp_tipo_organizacion) {
      this.valTipoOrganizacion = false;
    }
  }
  valOrganizacion: any = true;
  ValidateOrganizacion() {
    this.valOrganizacion = true;
    if ((!this.organizacion) || (this.organizacion.length > 100)) {
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
  initOrganizacionModel() {

    this.id_organizacion = 0;
    this.id_institucion = "";
    this.id_proyecto = "";
    this.idp_tipo_organizacion = '';
    this.organizacion = '';

    this.valTipoOrganizacion = true;
    this.valOrganizacion = true;
  }
  // ======= ======= GET ORGANIZACIONES ======= =======
  getOrganizaciones() {
    this.ServOrganizacion.getOrganizacionByIdProy(this.idProyecto).subscribe(
      (data) => {
        this.organizaciones = (data[0].dato) ? (data[0].dato) : ([]);
      },
      (error) => {
        console.error(error);
      }
    );
  }
  // ======= ======= INIT ADD ORGANIZACIONES ======= =======
  initAddOrganizacion(modalScope: TemplateRef<any>) {
    this.initOrganizacionModel();

    this.modalActionOrganizacion = "add";

    this.openModalOrg(modalScope);
  }
  // ======= ======= ADD ORGANIZACIONES ======= =======
  addOrganizacion() {
    const objOrganizacion = {
      p_id_organizacion: 0,
      p_id_institucion: this.idInstitucion,
      p_id_proyecto: this.idProyecto,
      p_idp_tipo_organizacion: this.idp_tipo_organizacion,
      p_organizacion: this.organizacion,
    };
    this.ServOrganizacion.addOrganizacion(objOrganizacion).subscribe(
      (data) => {
        Notify.success('Organización agregada exitosamente');
        this.getOrganizaciones();
        this.getParametricasAliados();
        this.getParametricasBeneficiarios();
        this.closeModalOrg();
      },
      (error) => {
        console.error(error);
        Notify.failure('Error al guardar la organización');
      }
    );
  }
  // ======= ======= ======= ======= VALIDATION ORGANIZACIONES ======= ======= ======= ======= 
  onSubmitOrganizaciones(): void {
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
      if (beneficiario.id_ubica_geo_comu && typeof beneficiario.id_ubica_geo_comu === 'number') {
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