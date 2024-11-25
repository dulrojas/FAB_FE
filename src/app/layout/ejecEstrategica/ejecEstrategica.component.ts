import { Component, OnInit, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { servicios } from "../../servicios/servicios";
import { servEjecEstrategica } from '../../servicios/ejecEstrategica';
import { EjecEstrategicaModule } from './ejecEstrategica.module';
import { element } from 'protractor';
import { servAprendizaje } from '../../servicios/aprendizajes';


@Component({
  selector: 'app-ejec-estrategica',
  templateUrl: './ejecEstrategica.component.html',
  styleUrls: ['../../../styles/styles.scss'],
  animations: [routerTransition()]
})

export class EjecEstrategicaComponent implements OnInit {
  // ======= ======= VARIABLES SECTION ======= =======
  ejecEstrategica: any[] = [];
    mainPage = 1;
    mainPageSize = 10;
    totalLength = 0;

  constructor(
     private modalService: NgbModal,
      private servicios: servicios,
      private servEjecEstrategica: servEjecEstrategica,
      private cdr: ChangeDetectorRef
  ) {}

  idProyecto: any = 1;
    headerDataNro01: any = 0;
    headerDataNro02: any = 0;
    headerDataNro03: any = 0;
    headerDataNro04: any = 0;

  // ======= ======= NGMODEL VARIABLES SECTION ======= =======
  modalAccion: any = '';

  codigo: any = '';
  elemento: any = '';







  ngOnInit(): void {
    
  }

  // ======= ======= OPEN MODALS FUN ======= =======
  ejecEstrategicaSelected: any = null;
  openModal(content: TemplateRef<any>) {
    this.modalService.open(content, { size: 'xl' });
  }
  get ejecEstrategicaTable() {
    const start = (this.mainPage - 1) * this.mainPageSize;
    return this.ejecEstrategica.slice(start, start + this.mainPageSize);
  }

   // ======= ======= CHECKBOX CHANGED ======= =======
   checkboxChanged(ejecEstrategicaSel: any) {
    this.ejecEstrategica.forEach(ejecEstrategica =>{
      if(ejecEstrategicaSel.id_proy_aprende == ejecEstrategica.id_proy_aprende){
        if(ejecEstrategicaSel.selected){
          this.ejecEstrategicaSelected =ejecEstrategicaSel;
        }
        else{
          this.ejecEstrategicaSelected = null;
        }
      }
      else{
        ejecEstrategica.selected = false;
      }
    });
  }

  initReportEjecEstrategica(modalScope: TemplateRef<any>){
      this.modalAccion = 'reportEjecEstrategica';
      this.openModal(modalScope);
    }


}
