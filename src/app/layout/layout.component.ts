import { Component, OnInit } from '@angular/core';

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

    constructor() {}

    ngOnInit(){
        this.fullUserName = localStorage.getItem("fullUserName");
        this.proyectos = JSON.parse(localStorage.getItem("projects"));
        this.currentIdProy = parseInt(localStorage.getItem("currentIdProy"));
        this.currentIdProy = (this.currentIdProy)?(this.currentIdProy):(this.proyectos[0].id_proyecto);
    }

    updateCurrentIdProy(newValue: any){
        this.currentIdProy = newValue;
    }

    receiveCollapsed($event) {
        this.collapedSideBar = $event;
    }
}
