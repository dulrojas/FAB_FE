import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
    isActive: boolean;
    collapsed: boolean;
    showMenu: string;
    pushRightClass: string;
    logoImg: any;

    @Input() currentProyName!: any;
    @Input() currentPerProRol!: any;

    @Output() collapsedEvent = new EventEmitter<boolean>();

    constructor(public router: Router) {
        this.router.events.subscribe((val) => {
            if (val instanceof NavigationEnd && window.innerWidth <= 992 && this.isToggled()) {
                this.toggleSidebar();
            }
        });
    }

    ngOnInit() {
        this.isActive = false;
        this.collapsed = false;
        this.showMenu = '';
        this.pushRightClass = 'push-right';
        this.logoImg = (!this.collapsed)?(`${environment.assetsPath}images/FANFullLogo.png`):(`${environment.assetsPath}images/FANLogo.png`);
    }

    eventCalled() {
        this.isActive = !this.isActive;
    }

    addExpandClass(element: any) {
        if (element === this.showMenu) {
            this.showMenu = '0';
        } else {
            this.showMenu = element;
        }
    }

    toggleCollapsed() {
        this.collapsed = !this.collapsed;
        this.collapsedEvent.emit(this.collapsed);
        this.logoImg = (!this.collapsed)?(`${environment.assetsPath}images/FANFullLogo.png`):(`${environment.assetsPath}images/FANLogo.png`);
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
        localStorage.clear();
    }

    getRolMenu(){
        if( (this.currentPerProRol.includes("ADM"))||(this.currentPerProRol.includes("CON")) ){
            return true;
        }
        else{
            return false;
        }
    }
}
