import { Component, OnInit, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { servicios } from "../../servicios/servicios";

@Component({
    selector: 'app-dashboard2',
    templateUrl: './dashboard2.component.html',
    styleUrls: ['../dashboard2/dashboard2.component.scss'],
    animations: [routerTransition()]
    })

export class Dashboard2Component implements OnInit {

    dashboard2: any[] = [];
    dashboard2Selected: any = null;

    constructor(
        private modalService: NgbModal,
        private servicios: servicios,
        private cdr: ChangeDetectorRef
    ) {}

    headerDataNro01: any = 0;
    headerDataNro02: any = 0;
    headerDataNro03: any = 0;
    headerDataNro04: any = 0;

    proyectoScope: any = {};
    currentDateGap: number = 0;
    finalDateGap: number = 0;
    realFinalDate: any = '';

    ngOnInit() {
        
    }

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

    countHeaderData() {
       
      }

}