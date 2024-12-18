import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { servicios } from "../../../servicios/servicios";

import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-bodyHeader',
    templateUrl: './bodyHeader.component.html'
})
export class BodyHeaderComponent implements OnInit {
    public pushRightClass: string;

    constructor(
        public router: Router,
        private servicios: servicios
    ){
        this.router.events.subscribe((val) => {
            if (val instanceof NavigationEnd && window.innerWidth <= 992 && this.isToggled()) {
                this.toggleSidebar();
            }
        });
    }

    defaultImageSrc: any = environment.defaultImageSrc;

    userImg: any = null;
    fullUserName: any = null;
    proyectos: any = null;
    currentIdProy: any = null;
    projectImg: any = null;
    currentPerProRol: any = null;

    ngOnInit() {
        this.pushRightClass = 'push-right';

        this.projectImg = `${environment.assetsPath}images/exam2.jpg`;
        
        this.userImg = null;
        this.downloadFile(localStorage.getItem("currentIdPer"));

        this.fullUserName = localStorage.getItem("userFullName");
        this.proyectos = JSON.parse(localStorage.getItem("projects"));
        this.currentIdProy = parseInt(localStorage.getItem("currentIdProy"));
        this.currentIdProy = (this.currentIdProy)?(this.currentIdProy):(this.proyectos[0].id_proyecto);
        this.currentPerProRol = localStorage.getItem("currentPerProRol");
    }

    @Output() selectionChange = new EventEmitter<any>();
    onSelectionChange() {
        this.selectionChange.emit(this.currentIdProy);
        let currentProy = this.proyectos.find( proyecto => proyecto.id_proyecto == this.currentIdProy);
        let currentPerProRol = (currentProy.rol)?(currentProy.rol):("Sin rol");
        localStorage.setItem('currentPerProRol', (currentPerProRol).toString());
        this.currentPerProRol = currentPerProRol;
    }

    isToggled(): boolean {
        const dom: Element = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
    }

    toggleSidebar() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
    }

    rltAndLtr() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle('rtl');
    }

    onLoggedout() {
        localStorage.removeItem('isLoggedin');
    }

    
    // ======= ======= DOWNLOAD IMAGE FUN ======= =======
    downloadFile(idRegistro: any){
        this.servicios.downloadFile("persona", "ruta_foto", "id_persona", idRegistro).subscribe(
          (response: Blob) => {
            if (response instanceof Blob) {
              const url = window.URL.createObjectURL(response);
              this.userImg = url;
            } 
            else {
              //console.warn('La respuesta no es un Blob:', response);
              this.userImg = null; 
            }
          },
          (error) => {
            if (error.status === 404) {
              //console.warn('No se encontró imagen para el registro:', idRegistro);
              this.userImg = null;
            } else {
              //console.error('Error al descargar la imagen:', error);
            }
          }
        );
      }
    // ======= ======= ======= ======= =======
}
