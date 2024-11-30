import { Component, OnInit, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { servicios } from "../../servicios/servicios";
import { servEjecEstrategica } from '../../servicios/ejecEstrategica';
import { EjecEstrategicaModule } from './ejecEstrategica.module';
import { servAprendizaje } from '../../servicios/aprendizajes';
import {servProyectos} from '../../servicios/proyectos';


@Component({
  selector: 'app-ejec-estrategica',
  templateUrl: './ejecEstrategica.component.html',
  styleUrls: ['../../../styles/styles.scss'],
  animations: [routerTransition()]
})

export class EjecEstrategicaComponent implements OnInit {
  // ======= ======= VARIABLES SECTION ======= =======
  ejecEstrategica: any[] = [];
  ejecEstrategicaSelected: any = null;

    mainPage = 1;
    mainPageSize = 10;
    totalLength = 0;

  constructor(
     private modalService: NgbModal,
      private servicios: servicios,
      private servEjecEstrategica: servEjecEstrategica,
      private servApredizaje: servAprendizaje,
      private servProyectos: servProyectos,
      private cdr: ChangeDetectorRef
  ) {}

    idProyecto: any = 1;
    headerDataNro01: any = 0;
    headerDataNro02: any = 0;
    headerDataNro03: any = 0;
    headerDataNro04: any = 0;

  // ======= ======= NGMODEL VARIABLES SECTION ======= =======
  modalAccion: any = '';

  // Indicator attributes
  id_proyecto_indicador: any = '';
  codigo: string = '';
  indicador: string = '';
  descripcion: string = '';
  comentario: string = '';
  linea_base: any = null;
  medida: string = '';
  meta_final: any = null;
  medio_verifica: string = '';
  id_estado: any = null;
  id_inst_categoria_1: any = null;
  id_inst_categoria_2: any = null;
  id_inst_categoria_3: any = null;

  componentes: any[] = [];
  riesgoCategoria: any[] = [];
  ejecESubtipo: any[] = [];
  ejecETipo: any[] = [];

  ngOnInit(): void {
    this.getParametricas()
    this.getEjecEstrategica();
  }

  // ======= ======= GET PARAMETRICAS ======= =======
  getParametricas(){
    // ======= GET METO ELEMENTOS =======
    this.servApredizaje.getMetoElementos(this.idProyecto).subscribe(
      (data) => {
        this.componentes = data[0].dato;
      },
      (error) => {
        console.error(error);
      }
    );

    this.servicios.getParametricaByIdTipo(14).subscribe(
      (data) => {
        console.log('Datos de categoría:', data);
        this.riesgoCategoria = Array.isArray(data[0]?.dato) ? data[0]?.dato : [];
      },
      (error) => {
        console.error('Error al cargar categorías:', error);
      }
    );

    this.servicios.getParametricaByIdTipo(13).subscribe(
      (data) => {
        console.log('Datos de categoría:', data);
        this.ejecESubtipo = Array.isArray(data[0]?.dato) ? data[0]?.dato : [];
      },
      (error) => {
        console.error('Error al cargar categorías:', error);
      }
    );
    this.servicios.getParametricaByIdTipo(13).subscribe(
      (data) => {
        console.log('Datos de categoría:', data);
        this.ejecETipo = Array.isArray(data[0]?.dato) ? data[0]?.dato : [];
      },
      (error) => {
        console.error('Error al cargar categorías:', error);
      }
    );
  }

  

  getEjecEstrategica(){
    this.servProyectos.getProyectos().subscribe(
      (data) => {
        // Store full dataset
        this.ejecEstrategica = data[0].dato;
        // Set total length to full dataset
        this.totalLength = this.ejecEstrategica.length;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getDescripcionSubtipo(idRegistro: any, paramList: any): string{
    const subtipo = paramList.find(elem => elem.id_subtipo == idRegistro);
    return subtipo ? subtipo.descripcion_subtipo : 'Null';
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

  // ======= ======= OPEN MODALS FUN ======= =======
  openModal(content: TemplateRef<any>) {
    this.modalService.open(content, { size: 'xl' });
  }
  get ejecEstrategicaTable() {
    const start = (this.mainPage - 1) * this.mainPageSize;
      return this.ejecEstrategica.slice(start, start + this.mainPageSize);
  }

  checkboxChanged(ejecEstrategicaSel: any) {
    // Deselect all first
    this.ejecEstrategica.forEach(item => {
      item.selected = false;
    });

    // Select the current item
    ejecEstrategicaSel.selected = true;
    this.ejecEstrategicaSelected = ejecEstrategicaSel;
  }

  

  initReportEjecEstrategica(modalScope: TemplateRef<any>) {
    if (this.ejecEstrategicaSelected) {
      this.modalAccion = 'reportEjecEstrategica';
      this.openModal(modalScope);
    }
  }

  counterheaderData() {
    // Implement the logic for counterheaderData here
    // For example, you can update the header data variables based on ejecEstrategica
    this.headerDataNro01 = this.ejecEstrategica.length;
    this.headerDataNro02 = this.ejecEstrategica.filter(item => item.someCondition).length;
    this.headerDataNro03 = this.ejecEstrategica.reduce((sum, item) => sum + item.someValue, 0);
    this.headerDataNro04 = this.ejecEstrategica.reduce((sum, item) => sum + item.anotherValue, 0);
  }


}
