import { Component, OnInit } from '@angular/core';
import { ProyectoService } from '../services/proyectoData.service';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
    collapedSideBar: boolean;

    fullUserName: any = null;
    proyectos: any = null;
    currentIdProy: any = null;
    currentProyName: any = "Proyecto";
    currentPerProRol: any = "Rol";

    constructor(
      private proyectoService: ProyectoService
    ) {}

    ngOnInit(){
        this.fullUserName = localStorage.getItem("fullUserName");
        this.proyectos = JSON.parse(localStorage.getItem("projects"));
        this.currentIdProy = parseInt(localStorage.getItem("currentIdProy"));
        this.currentIdProy = (this.currentIdProy)?(this.currentIdProy):(this.proyectos[0].id_proyecto);
        this.currentProyName = (localStorage.getItem("currentProyName")).toString();
        this.currentPerProRol = (localStorage.getItem("currentPerProRol")).toString();

        this.proyectoService.proyectoSeleccionado$.subscribe((proyecto) => {
            let currentProy = this.proyectos.find(proy => proy.id_proyecto == proyecto);
            this.currentProyName = currentProy.proyecto;
            this.currentPerProRol = currentProy.rol;
            localStorage.setItem('currentProyName', this.currentProyName);
            localStorage.setItem('currentPerProRol', this.currentPerProRol);
        });
    }

    updateCurrentIdProy(newValue: any){
        this.currentIdProy = newValue;
    }

    receiveCollapsed($event) {
        this.collapedSideBar = $event;
    }
}
