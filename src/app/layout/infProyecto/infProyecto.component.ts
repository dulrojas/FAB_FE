import { Component, OnInit, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { ProyectoService } from '../../services/proyectoData.service';
import { servicios } from "../../servicios/servicios";
import { servProyectos } from "../../servicios/proyectos";
import { servInstituciones } from "../../servicios/instituciones";
import { servProyObjetivos } from "../../servicios/proyObjetivos";
import { servInstObjetivos } from "../../servicios/instObjetivos";
import { servObligaciones } from "../../servicios/obligaciones";
import { servFinanciadores } from "../../servicios/financiadores";
import { servUbicaGeografica } from "../../servicios/ubicaGeografica";
import { servProyAlcanceGeo } from "../../servicios/proyAlcanceGeo";
import { servPersonaRoles } from "../../servicios/personaRoles";
import { environment } from '../../../environments/environment';

import { forkJoin, concatMap, of } from 'rxjs';

@Component({
    selector: 'app-infProyecto',
    templateUrl: './infProyecto.component.html',
    styleUrls: ['../../../styles/styles.scss'],
    animations: [routerTransition()]
})
export class InfProyectoComponent implements OnInit {
    // ======= ======= VARIABLES SECTION ======= =======
    informacionProyecto: any[] = [];
    constructor(
      private modalService: NgbModal,
      private proyectoService: ProyectoService,
      private servicios: servicios,
      private servProyectos: servProyectos,
      private servInstituciones: servInstituciones,
      private servProyObjetivos: servProyObjetivos,
      private servInstObjetivos: servInstObjetivos,
      private servObligaciones: servObligaciones,
      private servPersonaRoles: servPersonaRoles,
      private servFinanciadores: servFinanciadores,
      private servUbicaGeografica: servUbicaGeografica,
      private servProyAlcanceGeo: servProyAlcanceGeo
    ){}
    // ======= ======= HEADER SECTION ======= =======
    idProyecto: any = parseInt(localStorage.getItem('currentIdProy'));
    idPersonaReg: any = parseInt(localStorage.getItem('currentIdPer'));
    namePersonaReg: any = localStorage.getItem('userFullName');
    onChildSelectionChange(selectedId: any) {
      this.idProyecto = selectedId;
      localStorage.setItem('currentIdProy', (this.idProyecto).toString());
      this.proyectoService.seleccionarProyecto(this.idProyecto);
      this.getParametricas();
      this.getInformacionProyecto();
      this.getInstObjetivos();
      this.getProyObjetivos();
      this.getFinanciadores();
      this.getUbicaGeografica();
      this.getObligaciones();
    }

    headerDataNro01: any = 0;
    headerDataNro02: any = 0;
    headerDataNro03: any = 0;
    headerDataNro04: any = 0;
    // ======= ======= ======= ======= =======
    // ======= ======= NGMODEL VARIABLES SECTION ======= =======
    modalAction: any = "";
    modalTitle: any = "";

    proyectoScope: any = {};

    editMode: any = false;

    person_resp: any = "";
    realFinalDate: any = "";
    currentDateGap: any = 0;
    finalDateGap: any = 0;

    personasProyecto: any[] = [];
    unidades: any[] = [];
    instituciones: any[] = [];
    periodos: any[] = [];
    tipoFinanciadores: any[] = [];
    estadosEntrega: any[] = [];

    instObjetivos: any[] = [];
    proyObjetivos: any[] = [];
    
    objetivosFAN: any[];
    objetivosODS: any[];

    defaultImageSrc: any = environment.defaultImageSrc;

    // ======= ======= INIT VIEW FUN ======= =======
    ngOnInit(): void{
      this.getParametricas();
      this.getInformacionProyecto();
      this.getInstObjetivos();
      this.getProyObjetivos();
      this.getFinanciadores();
      this.getUbicaGeografica();
      this.getObligaciones();
    }
    // ======= ======= ======= ======= =======
    // ====== GET DATE GAPS ======
    getCurrentDateDaysGap(iniDate: any){
      iniDate = (new Date(iniDate)).getTime();
      return (Math.floor((new Date().getTime()-iniDate)/(1000*3600*24)));
    }
    getDateDaysGap(iniDate: any, endDate: any){
      iniDate = new Date(iniDate).getTime();
      endDate = new Date(endDate).getTime();
      return (Math.floor((endDate-iniDate)/(1000*3600*24))+1);
    }
    getProyectDateGaps(){          
      this.realFinalDate = this.proyectoScope.fecha_fin;
      this.realFinalDate = (this.proyectoScope.fecha_fin_ampliada)?(this.proyectoScope.fecha_fin_ampliada):(this.realFinalDate);
      this.realFinalDate = (this.proyectoScope.fecha_fin_real)?(this.proyectoScope.fecha_fin_real):(this.realFinalDate);

      this.currentDateGap = this.getCurrentDateDaysGap(this.proyectoScope.fecha_inicio);
      this.finalDateGap = this.getDateDaysGap(this.proyectoScope.fecha_inicio, this.realFinalDate);

      this.currentDateGap = (this.currentDateGap <= this.finalDateGap)?(this.currentDateGap):(this.finalDateGap);
    
      this.countHeaderData();
    }
    // ====== ======= ======
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
      // ======= GET PERSONA ROLES =======
      this.servPersonaRoles.getPersonaRolesByIdProyect(this.idProyecto).subscribe(
        (data) => {
          this.personasProyecto = data[0].dato;
        },
        (error) => {
          console.error(error);
        }
      );
      // ======= ======= =======
      // ======= GET UNIDADES =======
      this.servicios.getUnidades().subscribe(
        (data) => {
          this.unidades = data[0].dato;
        },
        (error) => {
          console.error(error);
        }
      );
      // ======= ======= =======
      // ======= GET INSTITUCIONES =======
      this.servInstituciones.getInstituciones().subscribe(
        (data) => {
          this.instituciones = data[0].dato;
        },
        (error) => {
          console.error(error);
        }
      );
      // ======= ======= =======
      // ======= GET FINAN TIPO =======
      this.servicios.getParametricaByIdTipo(9).subscribe(
        (data) => {
          this.tipoFinanciadores = data[0].dato;
        },
        (error) => {
          console.error(error);
        }
      );
      // ======= ======= =======
      // ======= GET PERIODOS =======
      this.servicios.getParametricaByIdTipo(10).subscribe(
        (data) => {
          this.periodos = data[0].dato;
        },
        (error) => {
          console.error(error);
        }
      );
      // ======= ======= =======
      // ======= GET ESTADOS ENTREGA =======
      this.servicios.getParametricaByIdTipo(8).subscribe(
        (data) => {
          this.estadosEntrega = data[0].dato;
        },
        (error) => {
          console.error(error);
        }
      );
      // ======= ======= =======
    }
    // ======= ======= ======= ======= =======
    // ======= GET UBICACIONES =======
    getUbicaGeografica(){
      this.servUbicaGeografica.getUbicaGeografica().subscribe(
        (data) => {
          this.ubicaciones = data[0].dato;

          // ======= GET PROY ALCANCE =======
          this.servProyAlcanceGeo.getProyAlcanceGeoByIdProy(this.idProyecto).subscribe(
            (data) => {
              this.ubicacionesSel = (data[0].dato)?(data[0].dato):([]);

              // === GETTING SELECTED UBICACIONES SEL ===
              let ubicacionesSelAux: any = [];
              this.ubicacionesSel.forEach((ubicacionSel) => {
                let match = this.ubicaciones.find(
                  (ubicacion) => ubicacion.id_ubica_geo == ubicacionSel.id_ubica_geo
                );
                if (match) {
                  match.selected = true;
                  ubicacionesSelAux.push(match);
                  // === COUNT UBI HEADER DATA ===
                  this.contarMunicipiosYComunidades(match.id_ubica_geo);

                  if (match.idp_tipo_ubica_geo === "Municipios") {
                    this.headerDataNro01 += 1;
                  }
                  if (match.idp_tipo_ubica_geo === "Comunidades") {
                    this.headerDataNro01 += 2;
                  }
                  // === === ===
                }
              });
              this.ubicacionesSel = ubicacionesSelAux;

              // === UBICACIONES BRANCHS ===
              this.ubicacionesB = [
                ...this.getUbiBranch(this.ubicaciones, 2), 
                ...this.getUbiBranch(this.ubicaciones, 3), 
                ...this.getUbiBranch(this.ubicaciones, 4), 
                ...this.getUbiBranch(this.ubicaciones, 5)
              ];
              // === FILTER UBICACIONES SEL ===
              this.ubicacionesSel = this.ubicacionesSel.filter(
                (ubicacionSel) =>
                  !this.ubicacionesB.some(
                    (ubicacionB) => ubicacionSel.id_ubica_geo == ubicacionB.id_ubica_geo
                  )
              );
              // === BUILD UBICACIONES BRANCHS ===
              this.getGroupedData();

              // === BUILD COMPONENT UBICA GEO DATA ===
              this.ubicaciones = this.buildUbicacionesFamily(this.ubicaciones);
            },
            (error) => {
              console.error(error);
            }
          );
          // ======= ======= =======
        },
        (error) => {
          console.error(error);
        }
      );
    }
    // ======= ======= =======
    // ======= ======= GET INST OBJETIVOS ======= =======
    async getInstObjetivos(){
      try{
        const data: any = await new Promise((resolve, reject) => {
          this.servInstObjetivos.getInstObjetivos().subscribe(
            (response) => resolve(response),
            (error) => reject(error)
          );
        });
    
        this.instObjetivos = data[0].dato;
    
        for (const objetivo of this.instObjetivos) {
          objetivo.imagen_src = await this.downloadFile("inst_objetivos", "objetivo_imagen", "id_inst_objetivos", objetivo.id_inst_objetivos);
        }

        // ======= GET OBJETIVOS =======
        this.servProyObjetivos.getProyObjetivosByIdProy(this.idProyecto).subscribe(
          (data) => {
            this.proyObjetivos = (data[0].dato)?(data[0].dato):([]);
            this.instObjetivos.forEach((instObjetivo)=>{
              let proyObjetivoRes = this.proyObjetivos.find(
                (proyObjetivo) => proyObjetivo.id_inst_objetivos == instObjetivo.id_inst_objetivos
              );
              if(proyObjetivoRes){
                instObjetivo.selected = (proyObjetivoRes.idp_valor_objetivo == 1)?(2):(1);
              }
            });

            this.objetivosFAN = this.instObjetivos.filter(objetivo => objetivo.idp_tipo_objetivo === 2);
            this.objetivosODS = this.instObjetivos.filter(objetivo => objetivo.idp_tipo_objetivo === 1);
          },
          (error) => {
            console.error(error);
          }
        );
        // ======= ======= =======
      }
      catch(error){
        console.error('Error en getIconos:', error);
      }
    }
    // ======= ======= ======= ======= =======
    // ======= ======= OPEN MODALS FUN ======= =======
    private modalRefs: NgbModalRef[] = [];
    
    openModal(content: TemplateRef<any>) {
      const modalRef = this.modalService.open(content, { size: 'xl' });
      this.modalRefs.push(modalRef);
    }

    closeModal() {
      if (this.modalRefs.length > 0) {
        const modalRef = this.modalRefs.pop();
        modalRef?.close();
      }
    }
    // ======= ======= ======= ======= =======
    // ======= ======= FUNCTION INFO PROYECTO NGMODEL ======= =======
    enableEditMode(){
      this.editMode = true;
    }
    disableEditMode(){
      this.editMode = false;

      this.getInformacionProyecto();
      this.getInstObjetivos();
      this.getProyObjetivos();
      this.getUbicaGeografica();
    }
    // ======= ======= ======= ======= =======
    // ======= ======= COUNT HEADER DATA FUCTION ======= =======
    countHeaderData(){
      this.headerDataNro03 = this.finalDateGap - this.currentDateGap;

      this.headerDataNro04 = (parseFloat((this.proyectoScope.total_ejecutado.toString()).slice(1))) / (parseFloat(this.proyectoScope.presupuesto_me.toString()));
    }
    // ======= ======= ======= ======= =======
    // ======= ======= GET PROYECTO ======= =======
    getInformacionProyecto(){
      this.servProyectos.getInfoProyectoByIdPro(this.idProyecto).subscribe(
        (data) => {
          this.proyectoScope = data[0].dato[0];

          this.person_resp = this.proyectoScope.nombres +" "+ this.proyectoScope.apellido_1 +" "+ this.proyectoScope.apellido_2;
          this.proyectoScope.presupuesto_me = (this.proyectoScope.presupuesto_me).slice(1);
          this.proyectoScope.presupuesto_mn = (this.proyectoScope.presupuesto_mn).slice(1);
          
          this.getProyectDateGaps();

          this.countHeaderData();
        },
        (error) => {
          console.error(error);
        }
      );
    }
    // ======= ======= ======= ======= =======
    // ======= ======= EDIT PROYECTO ======= =======
    editInfProyecto(){
      // ======= PROJECT SECTION =======
      this.proyectoScope.presupuesto_me = this.parseAmountStrToFloat(this.proyectoScope.presupuesto_me);
      this.proyectoScope.presupuesto_mn = this.parseAmountStrToFloat(this.proyectoScope.presupuesto_mn);

      this.servProyectos.editProyecto(this.proyectoScope).subscribe(
        (data) => {
          // ======= OBJETIVOS SECTION =======
          let allObjetivos: any = [...this.objetivosFAN, ...this.objetivosODS];
          let addRequestsObj = [];

          let deleteRequestObj = this.servProyObjetivos.deleteProyObjetivos(this.proyectoScope.id_proyecto);

          allObjetivos.forEach((objetivo) => {
            if (objetivo.selected) {
              let objetivoObj = {
                p_id_proy_objetivos: null,
                p_id_proyecto: this.idProyecto,
                p_idp_inst_objetivos: objetivo.id_inst_objetivos,
                p_idp_valor_objetivo: (objetivo.selected == 1)?(2):(1)
              };
              addRequestsObj.push(this.servProyObjetivos.addProyObjetivos(objetivoObj));
            }
          });
          // ======= ======= =======
          // ======= ALCANCE GEO SECTION =======
          let ubicacionesBSel = this.ubicacionesB.filter(ubicacion => ubicacion.selected);
          let allAlcanceGeo: any = [...this.ubicacionesSel, ...ubicacionesBSel];
          let addRequestsAlc = [];


          let deleteRequestAlc = this.servProyAlcanceGeo.deleteAlcanceGeo(this.proyectoScope.id_proyecto);

          allAlcanceGeo.forEach((alcance) => {
            let alcanceObj = {
              p_id_proy_alcance: null,
              p_id_proyecto: this.idProyecto,
              p_id_ubica_geo: alcance.id_ubica_geo
            };
            addRequestsAlc.push(this.servProyAlcanceGeo.addProyAlcanceGeo(alcanceObj));
          });
          // ======= ======= =======
          // ======= ON ALL QUERY SECTION =======
          deleteRequestObj.pipe(
            concatMap(() => {
              return forkJoin(addRequestsObj.length > 0 ? addRequestsObj : of(null));
            }),
            concatMap(() => {
              return deleteRequestAlc;
            }),
            concatMap(() => {
              return forkJoin(addRequestsAlc.length > 0 ? addRequestsAlc : of(null));
            })
          ).subscribe(
            (responses) => {
              //console.log('Todas las operaciones se completaron:', responses);
              this.disableEditMode();
            },
            (error) => {
              console.error('Error en la ejecución secuencial:', error);
            }
          );
          // ======= ======= =======
        },
        (error) => {
          console.error('Error en la edición del proyecto:', error);
        }
      );
      // ======= ======= =======
    }
    // ======= ======= ======= ======= =======
    // ======= ======= OBJETIVOS FUNCTIONS ======= =======
    objetivoButtonValue = 0;
    onObjetivoButtonChange(btnValue: any){
      if(btnValue != this.objetivoButtonValue){
        this.objetivoButtonValue = btnValue;
      }
      else{
        this.objetivoButtonValue = 0;
      }
    }
    getObjBttnCSSClass(btnValue: any){
      let classToReturn = "btn-outline-bg-"+btnValue;

      classToReturn = (this.objetivoButtonValue == btnValue)?('btn-outline-bg-'+btnValue+'-selected'):(classToReturn);
      classToReturn = (this.objetivoButtonValue == btnValue)?('btn-outline-bg-'+btnValue+'-selected'):(classToReturn);

      return classToReturn;
    }
    getObjOptCSSClass(objetivo: any){
      let classToReturn = "custom-obj-container";

      classToReturn = (objetivo.selected == 1)?("custom-obj-container-1-selected"):(classToReturn);
      classToReturn = (objetivo.selected == 2)?("custom-obj-container-2-selected"):(classToReturn);

      return classToReturn;
    }
    onObjetivoClick(objetivo: any){
      if(objetivo.selected == this.objetivoButtonValue){
        objetivo.selected = 0;
      }
      else{
        objetivo.selected = this.objetivoButtonValue;
      }
    }
    getProyObjetivos(){
      this.servProyObjetivos.getProyObjetivosByIdProy(this.idProyecto).subscribe(
        (data) => {
          this.proyObjetivos = data[0].dato;
        },
        (error) => {
          console.error(error);
        }
      );
    }
    // ======= ======= ======= ======= =======
    // ======= ======= FINANCIADORES FUNCTIONS ======= =======
    financiadoresPorcentaje: any = 0;

    financiadores: any = [];
    financiadoresSelected: any = null;

    finanCheckboxChanged(financiadorSel: any){
      this.financiadores.forEach(financiador =>{
        if(financiadorSel.id_proy_finan == financiador.id_proy_finan){
          if(financiadorSel.selected){
            this.financiadoresSelected = financiadorSel;
          }
          else{
            this.financiadoresSelected = null;
          }
        }
        else{
          financiador.selected = false;
        }
      });
    }
    getInstitucionName(idScope: any) {
      const institucion = this.instituciones.find(item => item.id_institucion === idScope);
      return ((institucion)?(institucion.institucion):(""));
    }
    
    getTipoFinanParam(idScope: any) {
        const tipoFinan = this.tipoFinanciadores.find(item => item.id_subtipo === idScope);
        return ((tipoFinan)?(tipoFinan.descripcion_subtipo):(""));
    }

    parseAmountStrToFloat(amount: any): number {
      amount = amount.replace(',', '');
      amount = parseFloat(amount);

      return amount;
    }
    parseAmountFloatToStr(amount: any): string {
      amount = amount.toFixed(2);
      amount = amount.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

      return amount;
    }
    onPocentajeChange(){
      if((this.financiadoresPorcentaje+this.financiadores.porcentaje) > 100){
        this.financiadores.porcentaje = 0;
      }
      this.financiadores.monto = (this.parseAmountStrToFloat(this.proyectoScope.presupuesto_mn))*(parseFloat(this.financiadores.porcentaje)/100);
      this.financiadores.monto = this.parseAmountFloatToStr(this.financiadores.monto);
    
      this.ValidatePorcentaje();
    }
    // ======= ======= ======= ======= =======
    // ======= ======= VALIDATE FINANCIADORES ======= =======
    valIdInstitucionFin = true;
    ValidateIdInstitucionFin(){
      this.valIdInstitucionFin = true;
      if (!this.financiadores.id_institucion_fin) {
        this.valIdInstitucionFin = false;
      }
    }

    valPorcentaje = true;
    ValidatePorcentaje(){
      this.valPorcentaje = true;
      if (!this.financiadores.porcentaje) {
        this.valPorcentaje = false;
      }
    }
    
    valIdTipoFinan = true;
    ValidateIdTipoFinan(){
      this.valIdTipoFinan = true;
      if (!this.financiadores.idp_tipo_finan) {
        this.valIdTipoFinan = false;
      }
    }
    
    valOrden = true;
    ValidateOrden(){
      this.valOrden = true;
      if (!this.financiadores.orden) {
        this.valOrden = false;
      }
    }
    // ======= ======= ======= ======= =======
    // ======= ======= INIT FINANCIADORES NGMODEL ======= =======
    initFinanciadoresModel(){
      this.modalTitle = "";

      this.financiadores.id_proy_finan = 0;
      this.financiadores.porcentaje = null;
      this.financiadores.id_proyecto = this.idProyecto;
      this.financiadores.monto = null;
      this.financiadores.id_institucion_fin = "";
      this.financiadores.idp_tipo_finan = "";
      this.financiadores.idp_estado = 1;
      this.financiadores.orden = null;

      this.valIdInstitucionFin = true;
      this.valPorcentaje = true;
      this.valIdTipoFinan = true;
      this.valOrden = true;
    }
    // ======= ======= ======= ======= =======
    // ======= ======= GET FINANCIADORES ======= =======
    getFinanciadores(){
      this.servFinanciadores.getFinanciadores(this.idProyecto).subscribe(
        (data) => {
          this.financiadores = (data[0].dato)?(data[0].dato):([]);
          this.financiadoresPorcentaje = 0;
          this.financiadores.forEach(elem => {
            elem.porcentaje = parseFloat(elem.porcentaje.slice(1));
            elem.monto = elem.monto.slice(1);
            this.financiadoresPorcentaje += elem.porcentaje; 
          });
        },
        (error) => {
          console.error(error);
        }
      );
    }
    // ======= ======= ======= ======= =======
    // ======= ======= INIT ADD FINANCIADORES ======= =======
    initAddFinanciadores(modalScope: TemplateRef<any>){
      this.initFinanciadoresModel();

      this.modalAction = "add";
      this.modalTitle = "Añadir financiador";

      this.openModal(modalScope);
    }
    // ======= ======= ======= ======= =======
    // ======= ======= ADD FINANCIADORES ======= =======
    addFinanciadores(){
      const objPresupuesto = {
        p_id_proy_finan: this.financiadores.id_proy_finan,
        p_porcentaje: this.financiadores.porcentaje,
        p_id_proyecto: this.financiadores.id_proyecto,
        p_monto: this.parseAmountStrToFloat(this.financiadores.monto),
        p_id_institucion_fin: parseInt(this.financiadores.id_institucion_fin),
        p_idp_tipo_finan: parseInt(this.financiadores.idp_tipo_finan),
        p_idp_estado: this.financiadores.idp_estado,
        p_orden: parseInt(this.financiadores.orden)
      };

      this.servFinanciadores.addFinanciador(objPresupuesto).subscribe(
        (data) => {
          this.getFinanciadores();
        },
        (error) => {
          console.error(error);
        }
      );
    }
    // ======= ======= ======= ======= =======
    // ======= ======= INIT ADD FINANCIADORES ======= =======
    initEditFinanciadores(modalScope: TemplateRef<any>){
      this.initFinanciadoresModel();

      this.modalAction = "edit";
      this.modalTitle = "Editar financiador";

      this.financiadores.id_proy_finan = this.financiadoresSelected.id_proy_finan;
      this.financiadores.porcentaje = this.financiadoresSelected.porcentaje;
      this.financiadores.id_proyecto = this.idProyecto;
      this.financiadores.monto = this.financiadoresSelected.monto;
      this.financiadores.id_institucion_fin = this.financiadoresSelected.id_institucion_fin;
      this.financiadores.idp_tipo_finan = this.financiadoresSelected.idp_tipo_finan;
      this.financiadores.idp_estado = this.financiadoresSelected.idp_estado;
      this.financiadores.orden = this.financiadoresSelected.orden;

      this.openModal(modalScope);
    }
    // ======= ======= ======= ======= =======
    // ======= ======= ADD FINANCIADORES ======= =======
    editFinanciadores(){
      const objPresupuesto = {
        p_id_proy_finan: this.financiadores.id_proy_finan,
        p_porcentaje: this.financiadores.porcentaje,
        p_id_proyecto: this.financiadores.id_proyecto,
        p_monto: this.parseAmountStrToFloat(this.financiadores.monto),
        p_id_institucion_fin: parseInt(this.financiadores.id_institucion_fin),
        p_idp_tipo_finan: parseInt(this.financiadores.idp_tipo_finan),
        p_idp_estado: this.financiadores.idp_estado,
        p_orden: parseInt(this.financiadores.orden)
      };

      this.servFinanciadores.editFinanciador(objPresupuesto).subscribe(
        (data) => {
          this.getFinanciadores();
          this.financiadoresSelected = null;
        },
        (error) => {
          console.error(error);
        }
      );
    }
    // ======= ======= ======= ======= =======
    // ======= ======= INIT ADD FINANCIADORES ======= =======
    initDeleteFinanciadores(modalScope: TemplateRef<any>){
      this.initFinanciadoresModel();

      this.financiadores.id_proy_finan = this.financiadoresSelected.id_proy_finan;
      this.financiadores.porcentaje = this.financiadoresSelected.porcentaje;
      this.financiadores.id_proyecto = this.idProyecto;
      this.financiadores.monto = this.financiadoresSelected.monto;
      this.financiadores.id_institucion_fin = this.financiadoresSelected.id_institucion_fin;
      this.financiadores.idp_tipo_finan = this.financiadoresSelected.idp_tipo_finan;
      this.financiadores.idp_estado = 2;
      this.financiadores.orden = this.financiadoresSelected.orden;

      this.openModal(modalScope);
    }
    // ======= ======= ======= ======= =======
    // ======= ======= ADD FINANCIADORES ======= =======
    deleteFinanciadores(){
      const objPresupuesto = {
        p_id_proy_finan: this.financiadores.id_proy_finan,
        p_porcentaje: this.financiadores.porcentaje,
        p_id_proyecto: this.financiadores.id_proyecto,
        p_monto: this.parseAmountStrToFloat(this.financiadores.monto),
        p_id_institucion_fin: parseInt(this.financiadores.id_institucion_fin),
        p_idp_tipo_finan: parseInt(this.financiadores.idp_tipo_finan),
        p_idp_estado: 2,
        p_orden: parseInt(this.financiadores.orden)
      };

      this.servFinanciadores.editFinanciador(objPresupuesto).subscribe(
        (data) => {
          this.closeModal();
          this.getFinanciadores();
          this.financiadoresSelected = null;
        },
        (error) => {
          console.error(error);
        }
      );
    }
    // ======= ======= ======= ======= =======
    // ======= ======= SUBMIT FORM ======= =======
    financiadoresOnSubmit(): void {
      // ======= VALIDATION SECTION =======
      let valForm = false;
      
      this.ValidateIdInstitucionFin();
      this.ValidatePorcentaje();
      this.ValidateIdTipoFinan();
      this.ValidateOrden();
      
      valForm = 
        this.valIdInstitucionFin &&
        this.valPorcentaje &&
        this.valIdTipoFinan &&
        this.valOrden;

      if(valForm){
        if(this.modalAction == "add"){
          this.addFinanciadores();
        }
        else{
          this.editFinanciadores();
        }
        this.closeModal();
      }
    }
    // ======= ======= ======= ======= =======
    // ======= ======= UBICACIONES FUNCTIONS ======= =======
    ubicaciones: any[] = [];
    ubicacionesB: any[] = [];
    ubicacionesSel: any[] = [];

    toggleChildren(item: any) {
      item.isOpen = !item.isOpen;
    }

    buildUbicacionesFamily(lista: any[]): any[] {
      const resultado: any[] = [];
      const mapa = new Map<number, any>();
    
      lista.forEach(item => {
        mapa.set(item.id_ubica_geo, { ...item, childrens: [] });
      });
    
      lista.forEach(item => {
        const padreId = item.id_ubica_geo_padre;
        const rama = item.rama;
    
        if (padreId && mapa.has(padreId)) {
          const padre = mapa.get(padreId);
          if (padre && padre.rama === rama) {
            padre.childrens?.push(mapa.get(item.id_ubica_geo)!);
          }
        } 
        else {
          if(!padreId){
            resultado.push(mapa.get(item.id_ubica_geo)!);
          }
        }
      });
    
      return resultado;
    }
    
    getUbiBranch(ubiList: any[], branch: any): any[] {
      return ubiList.filter(ubi => ubi.rama == branch);
    }

    getGroupedData() {
      const grouped: { [key: string]: any[] } = {};
      
      this.ubicacionesB.forEach((item) => {
        if (!grouped[item.idp_tipo_ubica_geo]) {
          grouped[item.idp_tipo_ubica_geo] = [];
        }
        grouped[item.idp_tipo_ubica_geo].push(item);
      });
    
      this.ubicacionesB = Object.entries(grouped).map(([tipo, items]) => ({
        tipo,
        items,
        rowspan: items.length,
      }));
    }

    ubiInfCheckboxChanged(item: any) {
      if (item.selected) {
        if (!this.ubicacionesB.some((ubi) => ubi.id_ubica_geo === item.id_ubica_geo)) {
          this.ubicacionesB.push(item);
        }
      } 
      else {
        this.ubicacionesB = this.ubicacionesB.filter(
          (ubi) => ubi.id_ubica_geo !== item.id_ubica_geo
        );
      }
    }
    contarMunicipiosYComunidades = (ubicacionPadreId: number): void => {
      const hijosDirectos = this.ubicaciones.filter(
        (ubicacion) => ubicacion.id_ubica_geo_padre === ubicacionPadreId
      );

      hijosDirectos.forEach((hijo) => {
        if (hijo.idp_tipo_ubica_geo === "Municipios") {
          this.headerDataNro01 += 1;
        } 
        else if (hijo.idp_tipo_ubica_geo === "Comunidades") {
          this.headerDataNro02 += 1;
        }
        this.contarMunicipiosYComunidades(hijo.id_ubica_geo);
      });
    };
    // ======= ======= ======= ======= =======
    // ======= ======= INIT ADD UBICA GEO ======= =======
    initUbicaGeo(modalScope: TemplateRef<any>){

      this.modalAction = "add";
      this.modalTitle = "Ubicaciones geograficas";

      this.openModal(modalScope);
    }
    // ======= ======= ======= ======= =======
    // ======= ======= UBICA FAMILY TREE ======= =======
    getSelectedUbicaFamily(ubicaciones: any[]) {
      ubicaciones.forEach((ubicacion) => {
        if (ubicacion.selected) {
          this.ubicacionesSel.push(ubicacion);
        }
        if (ubicacion.childrens) {
          this.getSelectedUbicaFamily(ubicacion.childrens);
        }
      });
    }
    // ======= ======= ======= ======= =======
    // ======= ======= ON SUBMIT UBICA GEO ======= =======
    onUbicaGeoSubmit(){
      this.ubicacionesSel = [];
      this.getSelectedUbicaFamily(this.ubicaciones);
      this.closeModal();
    }
    // ======= ======= ======= ======= =======

    obligaciones: any = [];
    obligacionesSelected: any = null;
    obligacionesModel: any = {};
    // ======= ======= VALIDATE OBLIGACIONES ======= =======
    valObligacion = true;
    ValidateObligacion() {
      this.valObligacion = true;
      if ((!this.obligacionesModel.obligacion)||(this.obligacionesModel.obligacion.length >= 100)) {
        this.valObligacion = false;
      }
    }
    
    valDescripcion = true;
    ValidateDescripcion() {
      this.valDescripcion = true;
      if ((!this.obligacionesModel.descripcion)||(this.obligacionesModel.descripcion.length >= 250)) {
        this.valDescripcion = false;
      }
    }
    
    valFechaObligacion = true;
    ValidateFechaObligacion() {
      this.valFechaObligacion = true;
      if (!this.obligacionesModel.fecha_obligacion) {
        this.valFechaObligacion = false;
      }
    }
    
    valIdInstitucionExige = true;
    ValidateIdInstitucionExige() {
      this.valIdInstitucionExige = true;
      if (!this.obligacionesModel.id_institucion_exige) {
        this.valIdInstitucionExige = false;
      }
    }
    
    valIdpEstadoEntrega = true;
    ValidateIdpEstadoEntrega() {
      this.valIdpEstadoEntrega = true;
      if (!this.obligacionesModel.idp_estado_entrega) {
        this.valIdpEstadoEntrega = false;
      }
    }
    
    valFechaHoraEntrega = true;
    valFechaHoraEntrega2 = true;
    ValidateFechaHoraEntrega() {
      this.valFechaHoraEntrega = true;
      this.valFechaHoraEntrega2 = true;
      if (!this.obligacionesModel.fecha_hora_entrega) {
          this.valFechaHoraEntrega = false;
          return;
      }
      const fechaObligacion = new Date(this.obligacionesModel.fecha_obligacion);
      const fechaHoraEntrega = new Date(this.obligacionesModel.fecha_hora_entrega);

      if (fechaHoraEntrega <= fechaObligacion) {
          this.valFechaHoraEntrega2 = false;
      }
  }
    // ======= ======= ======= ======= =======
    // ======= ======= INIT OBLIGACIONES NGMODEL ======= =======
    obligaCheckboxChanged(obligacionesSel: any){
      this.obligaciones.forEach(obligacion =>{
        if(obligacionesSel.id_proy_obliga == obligacion.id_proy_obliga){
          if(obligacionesSel.selected){
            this.obligacionesSelected = obligacionesSel;
          }
          else{
            this.obligacionesSelected = null;
          }
        }
        else{
          obligacion.selected = false;
        }
      });
    }
    getPersonaName(objPersona: any){
      const nameToReturn = objPersona.nombres+" "+objPersona.apellido_1+((objPersona.apellido_2)?(" "+objPersona.apellido_2):(""));
      return nameToReturn;
    }
    // ======= ======= INIT PERSONA ROLES NGMODEL ======= =======
    initObligacionesModel(){
      this.modalTitle = "";

      this.obligacionesModel.id_proy_obliga = 0;
      this.obligacionesModel.id_proyecto = this.idProyecto;
      this.obligacionesModel.id_inst_obligaciones = 1;
      this.obligacionesModel.obligacion = null;
      this.obligacionesModel.descripcion = null;
      this.obligacionesModel.fecha_obligacion = null;
      this.obligacionesModel.id_institucion_exige = "";
      this.obligacionesModel.idp_estado_entrega = "";
      this.obligacionesModel.fecha_hora_entrega = null;
      this.obligacionesModel.ruta_plantilla = "";
      this.obligacionesModel.ruta_documente = "";
      this.obligacionesModel.persona_entrega = this.namePersonaReg;

      this.valObligacion = true;
      this.valDescripcion = true;
      this.valFechaObligacion = true;
      this.valIdInstitucionExige = true;
      this.valIdpEstadoEntrega = true;
      this.valFechaHoraEntrega = true;
    }
    // ======= ======= ======= ======= =======
    // ======= ======= GET OBLIGACIONES ======= =======
    getObligaciones(){
      this.servObligaciones.getObligaciones(this.idProyecto).subscribe(
        (data) => {
          this.obligaciones = (data[0].dato)?(data[0].dato):([]);

          let currentDate = new Date();

          this.obligaciones.forEach((obligacion) => {

            obligacion.fecha_hora_entrega = (obligacion.fecha_hora_entrega).slice(0,10);

            // ======= PROGRESO SECTION =======
            let fechaObligacion = new Date(obligacion.fecha_obligacion);
            let fechaEntrega = new Date(obligacion.fecha_hora_entrega);

            let currentDateGap = (currentDate.getTime() - fechaObligacion.getTime()) / (1000 * 60 * 60 * 24);
            let datesGap = (fechaEntrega.getTime() - fechaObligacion.getTime()) / (1000 * 60 * 60 * 24);

            obligacion.progreso = Math.round(100*(currentDateGap / datesGap));
            // ======= ======= =======
          });
        },
        (error) => {
          console.error(error);
        }
      );
    }
    // ======= ======= ======= ======= =======
    // ======= ======= INIT ADD OBLIGACIONES ======= =======
    initAddObligaciones(modalScope: TemplateRef<any>){
      this.initObligacionesModel();

      this.modalAction = "add";
      this.modalTitle = "Añadir obligación";

      this.openModal(modalScope);
    }
    // ======= ======= ======= ======= =======
    // ======= ======= ADD OBLIGACIONES ======= =======
    addObligaciones(){
      const objObligacion = {
        p_id_proy_obliga: 0,
        p_id_proyecto: this.idProyecto,
        p_id_inst_obligaciones: parseInt(this.obligacionesModel.id_inst_obligaciones),
        p_obligacion: this.obligacionesModel.obligacion,
        p_descripcion: this.obligacionesModel.descripcion,
        p_fecha_obligacion: this.obligacionesModel.fecha_obligacion,
        p_ruta_plantilla: this.obligacionesModel.ruta_plantilla,
        p_id_institucion_exige: parseInt(this.obligacionesModel.id_institucion_exige),
        p_idp_estado_entrega: parseInt(this.obligacionesModel.idp_estado_entrega),
        p_ruta_documente: this.obligacionesModel.ruta_documente,
        p_fecha_hora_entrega: this.obligacionesModel.fecha_hora_entrega,
        p_id_persona_entrega: parseInt(this.idPersonaReg)
      };
      this.servObligaciones.addObligaciones(objObligacion).subscribe(
        (data) => {
          this.getObligaciones();
        },
        (error) => {
          console.error(error);
        }
      );

    }
    // ======= ======= ======= ======= =======
    // ======= ======= INIT EDIT OBLIGACIONES ======= =======
    initEditObligaciones(modalScope: TemplateRef<any>){
      this.initObligacionesModel();

      this.modalAction = "edit";
      this.modalTitle = "Editar obligación";

      this.obligacionesModel.id_proy_obliga = this.obligacionesSelected.id_proy_obliga;
      this.obligacionesModel.id_proyecto = this.obligacionesSelected.id_proyecto;
      this.obligacionesModel.id_inst_obligaciones = this.obligacionesSelected.id_inst_obligaciones;
      this.obligacionesModel.obligacion = this.obligacionesSelected.obligacion;
      this.obligacionesModel.descripcion = this.obligacionesSelected.descripcion;
      this.obligacionesModel.fecha_obligacion = this.obligacionesSelected.fecha_obligacion;
      this.obligacionesModel.ruta_plantilla = this.obligacionesSelected.ruta_plantilla;
      this.obligacionesModel.id_institucion_exige = this.obligacionesSelected.id_institucion_exige;
      this.obligacionesModel.idp_estado_entrega = this.obligacionesSelected.idp_estado_entrega;
      this.obligacionesModel.ruta_documente = this.obligacionesSelected.ruta_documente;
      this.obligacionesModel.fecha_hora_entrega = this.obligacionesSelected.fecha_hora_entrega;
      this.obligacionesModel.persona_entrega = (
        this.obligacionesSelected.nombres+" "+
        this.obligacionesSelected.apellido_1+" "+
        ((this.obligacionesSelected.apellido_2)?(this.obligacionesSelected.apellido_2):(""))
      );

      this.openModal(modalScope);
    }
    // ======= ======= ======= ======= =======
    // ======= ======= EDIT OBLIGACIONES ======= =======
    editObligaciones(){
      const objObligacion = {
        p_id_proy_obliga: this.obligacionesModel.id_proy_obliga,
        p_id_proyecto: this.idProyecto,
        p_id_inst_obligaciones: parseInt(this.obligacionesModel.id_inst_obligaciones),
        p_obligacion: this.obligacionesModel.obligacion,
        p_descripcion: this.obligacionesModel.descripcion,
        p_fecha_obligacion: this.obligacionesModel.fecha_obligacion,
        p_ruta_plantilla: this.obligacionesModel.ruta_plantilla,
        p_id_institucion_exige: parseInt(this.obligacionesModel.id_institucion_exige),
        p_idp_estado_entrega: parseInt(this.obligacionesModel.idp_estado_entrega),
        p_ruta_documente: this.obligacionesModel.ruta_documente,
        p_fecha_hora_entrega: this.obligacionesModel.fecha_hora_entrega,
        p_id_persona_entrega: parseInt(this.obligacionesModel.idPersonaReg)
      };
      this.servObligaciones.editObligaciones(objObligacion).subscribe(
        (data) => {
          this.getObligaciones();
          this.obligacionesSelected = null;
        },
        (error) => {
          console.error(error);
        }
      );

    }
    // ======= ======= ======= ======= =======
    // ======= ======= INIT DELETE OBLIGACION ======= =======
    initDeleteObligacion(modalScope: TemplateRef<any>){
      this.initObligacionesModel();

      this.obligacionesModel.id_proy_obliga = this.obligacionesSelected.id_proy_obliga;

      this.openModal(modalScope);
    }
    // ======= ======= ======= ======= =======
    // ======= ======= DELETE OBLIGACION ======= =======
    deleteObligacion(){
      this.servObligaciones.deleteObligacion(this.obligacionesModel.id_proy_obliga).subscribe(
        (data) => {
          this.obligacionesSelected = null;
          this.getObligaciones();
          this.closeModal();
        },
        (error) => {
          console.error(error);
        }
      );
    }
    // ======= ======= ======= ======= =======
    // ======= ======= SUBMIT FORM ======= =======
    obligacionesOnSubmit(): void {
      // ======= VALIDATION SECTION =======
      let valForm = false;

      this.ValidateObligacion();
      this.ValidateDescripcion();
      this.ValidateFechaObligacion();
      this.ValidateIdInstitucionExige();
      this.ValidateIdpEstadoEntrega();
      this.ValidateFechaHoraEntrega();

      valForm = 
        this.valObligacion &&
        this.valDescripcion &&
        this.valFechaObligacion &&
        this.valIdInstitucionExige &&
        this.valIdpEstadoEntrega &&
        this.valFechaHoraEntrega &&
        this.valFechaHoraEntrega2;

      // ======= SUBMIT SECTION =======
      if(valForm){
        if(this.modalAction == "add"){
          this.addObligaciones();
        }
        else{
          this.editObligaciones();
        }
        this.closeModal();
      }
    }
    // ======= ======= ======= ======= =======
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
    // ======= ======= ======= ======= =======
}
