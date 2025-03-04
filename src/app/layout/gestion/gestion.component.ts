import { Component, OnInit, EventEmitter, Output, ViewChild, TemplateRef } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { ProyectoService } from '../../services/proyectoData.service';
import { servicios } from "../../servicios/servicios";

@Component({
    selector: 'app-gestion',
    templateUrl: './gestion.component.html',
    styleUrls: ['../../../styles/styles.scss'],
    animations: [routerTransition()]
})
export class GestionComponent implements OnInit {
    // ======= ======= VARIABLES SECTION ======= =======
    constructor(
      private modalService: NgbModal,
      private proyectoService: ProyectoService,
      private servicios: servicios
    ){}
    // ======= ======= ======= ======= =======
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
    }

    headerDataNro01: any = 0;
    headerDataNro02: any = 0;
    headerDataNro03: any = 0;
    headerDataNro04: any = 0;
    // ======= ======= ======= ======= =======
    // ======= ======= NGMODEL VARIABLES SECTION ======= =======
    gestionActual: string = "";
    initGestionActual: string = "";
    gestionesList: any = [];

    @ViewChild('waitMessageModal', { static: true }) waitMessageModal!: TemplateRef<any>;
    // ======= ======= ======= ======= =======
    // ======= ======= FUNCIONS SECTION ======= =======
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
    // ======= ======= INIT VIEW FUN ======= =======
    ngOnInit(): void{
      this.getGestion();
    }
    // ======= ======= ======= ======= =======
    // ======= ======= GET GESTION ======= =======
    getGestion(){
      this.servicios.getGestion().subscribe(
        (data)=>{
          this.gestionActual = (data[0].dato)?(data[0].dato[0].gestion_actual):("");
          this.initGestionActual = (data[0].dato)?(data[0].dato[0].gestion_actual):("");
          const currentYear = new Date().getFullYear();
          this.gestionesList = Array.from({ length: 6 }, (_, i) => (currentYear + 1 - i).toString());
        },
        (error)=>{

        }
      );
    }
    // ======= ======= ======= ======= =======
    // ======= ======= INIT EDIT GESTION ======= =======
    initEditGestion(modalScope: TemplateRef<any>){
      this.openModal(modalScope);
    }
    // ======= ======= ======= ======= =======
    // ======= ======= EDIT GESTION ======= =======
    editGestion(){
      this.servicios.editGestion(this.gestionActual, this.idPersonaReg).subscribe(
        (data)=>{
          //console.log(data[0].dato);
          this.closeModal();
        },
        (error)=>{

        }
      );
    }
    // ======= ======= ======= ======= =======
}
