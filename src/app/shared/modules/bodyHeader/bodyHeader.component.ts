import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { servicios } from "../../../servicios/servicios";

import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-bodyHeader',
  templateUrl: './bodyHeader.component.html',
  styleUrls: ['../../../../styles/styles.scss']
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

    this.fullUserName = localStorage.getItem("userFullName");
    this.proyectos = JSON.parse(localStorage.getItem("projects"));
    this.currentIdProy = parseInt(localStorage.getItem("currentIdProy"));
    this.currentIdProy = (this.currentIdProy)?(this.currentIdProy):(this.proyectos[0].id_proyecto);
    this.currentPerProRol = localStorage.getItem("currentPerProRol");

    this.projectImg = null;
    this.getProjectImg();
    
    this.userImg = null;
    this.getUserImg();
  }

  // ======= ======= ======= GETING USER IMAGE ======= ======= ======
  async getUserImg(){
    try {
      this.userImg = await this.downloadFile("persona", "ruta_foto", "id_persona", localStorage.getItem("currentIdPer"));
    } 
    catch (error) {
      this.userImg = null;
      console.error('Error en getIconos:', error);
    }
  }
  // ======= ======= ======= ======= ======= ======= ======
  // ======= ======= ======= GETING PROJECT IMAGE ======= ======= ======
  async getProjectImg(){
    try {
      this.projectImg = await this.downloadFile("proyecto", "ruta_imagen", "id_proyecto", this.currentIdProy);
    } 
    catch (error) {
      this.projectImg = null;
      console.error('Error en getIconos:', error);
    }
  }
  // ======= ======= ======= ======= ======= ======= ======

  @Output() selectionChange = new EventEmitter<any>();
  onSelectionChange() {
    this.selectionChange.emit(this.currentIdProy);
    let currentProy = this.proyectos.find( proyecto => proyecto.id_proyecto == this.currentIdProy);
    let currentPerProRol = (currentProy.rol)?(currentProy.rol):("Sin rol");
    localStorage.setItem('currentPerProRol', (currentPerProRol).toString());
    this.currentPerProRol = currentPerProRol;

    this.projectImg = null;
    this.getProjectImg();
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
