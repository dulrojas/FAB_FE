import { Component, OnInit, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { servicios } from "../../servicios/servicios";
import { servProyectos } from "../../servicios/proyectos";
import { servUbicaGeografica } from "../../servicios/ubicaGeografica";

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
      private servicios: servicios,
      private servProyectos: servProyectos,
      private servUbicaGeografica: servUbicaGeografica
    ){}
    idProyecto: any = 1;
    idPersonaReg: any = 1;

    headerDataNro01: any = 0;
    headerDataNro02: any = 0;
    headerDataNro03: any = 0;
    headerDataNro04: any = 0;
    // ======= ======= NGMODEL VARIABLES SECTION ======= =======
    modalAction: any = "";
    modalTitle: any = "";

    proyectoScope: any = {};
    proyectoScopeAux: any = {};

    person_resp: any = "";
    realFinalDate: any = "";
    currentDateGap: any = 0;
    finalDateGap: any = 0;

    unidades: any[] = [];
    periodos: any[] = [];

    ubicaciones: any[] = [];
    ubicacionesB: any[] = [];
    ubicacionesBAux: any[] = [];

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
          resultado.push(mapa.get(item.id_ubica_geo)!);
        }
      });
    
      return resultado;
    }
    
    getUbiBranch(ubiList: any[], branch: any): any[] {
      return ubiList.filter(ubi => ubi.rama == branch);
    }

    getGroupedData() {
      const grouped: { [key: string]: any[] } = {};
      
      console.log(this.ubicacionesB);
      this.ubicacionesB.forEach((item) => {
        console.log("In");
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
        if (!this.ubicacionesBAux.some((ubi) => ubi.id_ubica_geo === item.id_ubica_geo)) {
          this.ubicacionesBAux.push(item);
        }
      } 
      else {
        this.ubicacionesBAux = this.ubicacionesBAux.filter(
          (ubi) => ubi.id_ubica_geo !== item.id_ubica_geo
        );
      }
    }
    
    // ======= ======= INIT VIEW FUN ======= =======
    ngOnInit(): void{
      this.getParametricas();
      this.getInformacionProyecto();

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
      // ======= GET UBICACIONES =======
      this.servUbicaGeografica.getUbicaGeografica().subscribe(
        (data) => {
          this.ubicaciones = data[0].dato;
          this.ubicacionesB = [
            ...this.getUbiBranch(this.ubicaciones, 2), 
            ...this.getUbiBranch(this.ubicaciones, 3), 
            ...this.getUbiBranch(this.ubicaciones, 4), 
            ...this.getUbiBranch(this.ubicaciones, 5)
          ];
          this.getGroupedData();
          this.ubicaciones = this.buildUbicacionesFamily(this.ubicaciones);
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
    }
    // ======= ======= ======= ======= =======
    // ======= ======= OPEN MODALS FUN ======= =======
    openModal(content: TemplateRef<any>) {
      this.modalService.open(content, { size: 'xl' });
    }
    // ======= ======= ======= ======= =======
    // ======= ======= GET MODAL TITLE FUN ======= =======
    getModalTitle(modalAction: any){
      this.modalTitle = (modalAction == "add")?("Añadir Logro"):(this.modalTitle);
      this.modalTitle = (modalAction == "edit")?("Editar Logro"):(this.modalTitle);
      return this.modalTitle;
    }
    // ======= ======= ======= ======= =======
    // ======= ======= INIT PERSONA ROLES NGMODEL ======= =======
    initInformacionProyectoModel(){
      this.modalTitle = "";
    }
    // ======= ======= ======= ======= =======
    // ======= ======= COUNT HEADER DATA FUCTION ======= =======
    countHeaderData(){
      this.headerDataNro01 = this.informacionProyecto.length;

      this.headerDataNro03 = this.finalDateGap - this.currentDateGap;
      
      this.informacionProyecto.forEach(logro =>{
        if(logro.admi_sistema){
          this.headerDataNro02 += 1
        }
        this.headerDataNro04 += 1;
      });
    }
    // ======= ======= ======= ======= =======
    // ======= ======= GET PERSONAS ======= =======
    getInformacionProyecto(){
      this.servProyectos.getInfoProyectoByIdPro(this.idProyecto).subscribe(
        (data) => {
          this.proyectoScope = data[0].dato[0];
          this.proyectoScopeAux = this.proyectoScope;

          this.person_resp = this.proyectoScope.nombres +" "+ this.proyectoScope.apellido_1 +" "+ this.proyectoScope.apellido_2;

          this.getProyectDateGaps();

          this.countHeaderData();
        },
        (error) => {
          console.error(error);
        }
      );
    }
    // ======= ======= ======= ======= =======
    // ======= ======= INIT ADD PERSONA ROLES ======= =======
    initAddInformacionProyecto(modalScope: TemplateRef<any>){
      this.initInformacionProyectoModel();

      this.modalAction = "add";
      this.modalTitle = this.getModalTitle("add");

      this.openModal(modalScope);
    }
    // ======= ======= ======= ======= =======
    // ======= ======= EDIT APRENDIZAJE ======= =======
    addInformacionProyecto(){
      const objLogro = {
        p_id_proy_aprende: 0,
      };
    }
    // ======= ======= ======= ======= =======
    // ======= ======= INIT EDIT PERSONA ROLES ======= =======
    initEditInformacionProyecto(modalScope: TemplateRef<any>){
      this.initInformacionProyectoModel();

      this.modalAction = "edit";
      this.modalTitle = this.getModalTitle("edit");


      this.openModal(modalScope);
    }
    // ======= ======= ======= ======= =======
    // ======= ======= EDIT APRENDIZAJE ======= =======
    editInformacionProyecto(){
      const objApredizaje = {
        p_id_proy_aprende: 0,
        p_id_proyecto: parseInt(this.idProyecto,10),
        p_fecha_hora_reg: null
      };

    }
    // ======= ======= ======= ======= =======
    // ======= ======= INIT DELETE PERSONA ROLES ======= =======
    initDeleteInformacionProyecto(){
      
    }
    // ======= ======= ======= ======= =======
    // ======= ======= SUBMIT FORM ======= =======
    onSubmit(): void {
      if(this.modalAction == "add"){
        this.addInformacionProyecto();
      }
      else{
        //this.editInformacionProyecto();
      }
    }
    // ======= ======= ======= ======= =======
}
