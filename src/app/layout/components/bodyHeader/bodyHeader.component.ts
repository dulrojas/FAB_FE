import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-bodyHeader',
    templateUrl: './bodyHeader.component.html'
})
export class BodyHeaderComponent implements OnInit {
    public pushRightClass: string;

    constructor(private translate: TranslateService, public router: Router) {
        this.router.events.subscribe((val) => {
            if (val instanceof NavigationEnd && window.innerWidth <= 992 && this.isToggled()) {
                this.toggleSidebar();
            }
        });
    }

    fullUserName: any = null;
    proyectos: any = null;
    currentIdProy: any = null;


    ngOnInit() {
        this.pushRightClass = 'push-right';

        this.fullUserName = localStorage.getItem("userFullName");
        this.proyectos = JSON.parse(localStorage.getItem("projects"));
        this.currentIdProy = parseInt(localStorage.getItem("currentIdProy"));
        this.currentIdProy = (this.currentIdProy)?(this.currentIdProy):(this.proyectos[0].id_proyecto);
    }

    @Output() selectionChange = new EventEmitter<string>();
    onSelectionChange() {
        this.selectionChange.emit(this.currentIdProy);
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

    changeLang(language: string) {
        this.translate.use(language);
    }
}
