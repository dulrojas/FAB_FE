import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../router.animations';

import { lastValueFrom } from 'rxjs';

import { servicios } from "../servicios/servicios";
import { servLogin } from "../servicios/login";
import { servProyectos } from "../servicios/proyectos";
import { servPersonaRoles } from "../servicios/personaRoles";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit {
    constructor(
        public router: Router,
        private servicios: servicios,
        private servLogin: servLogin,
        private servProyectos: servProyectos,
        private servPersonaRoles: servPersonaRoles
    ) {}
    
    user: any = null;
    password: any = null;
    
    imageSrc: any = null;

    proyectos: any = null;

    message: any = null;
    messageShow: any = false;

    ngOnInit(){}

    getProjects(){
        this.servProyectos.getProyectos().subscribe(
            (data) => {
                this.proyectos = data[0].dato;
            },
            (error) => {
                console.error(error);
            }
        );
    }

    async onLoggedin() {
        let userData: any = null;
    
        try {
            const authResponse = await lastValueFrom(this.servLogin.authUser(this.user, this.password));
            userData = authResponse[0]?.dato;
    
            if (userData) {
                userData = userData[0];
                delete userData.usuario;
                delete userData.contrasenia;
    
                try {
                    const personaRolesResponse = await lastValueFrom(
                        this.servPersonaRoles.getPersonaRolesByIdPersona(userData.id_persona)
                    );
                    this.proyectos = (personaRolesResponse[0].dato)?(personaRolesResponse[0].dato):([]);
    
                    localStorage.setItem('isLoggedin', 'true');
                    localStorage.setItem('currentIdPer', userData.id_persona.toString());
                    localStorage.setItem(
                        'currentPerProRol', 
                        ((this.proyectos[0].rol)?(this.proyectos[0].rol):("Sin rol")).toString()
                    );
    
                    if (!userData.admi_sistema) {
                        this.proyectos = this.proyectos.filter(
                            (proyecto) => proyecto.id_persona_proyecto !== null
                        );
                    }
    
                    localStorage.setItem('projects', JSON.stringify(this.proyectos));
                    if (this.proyectos.length > 0) {
                        localStorage.setItem('currentIdProy', this.proyectos[0].id_proyecto.toString());
                        localStorage.setItem('currentProyName', this.proyectos[0].proyecto.toString());
                        localStorage.setItem(
                            'currentPerProRol',
                            this.proyectos[0]?.rol || 'Sin rol'
                        );
                    }
    
                    this.router.navigate(['/dashboard']);
                } 
                catch (error) {
                    console.error("Error:", error);
                }
            } 
            else {
                this.message = "Datos de usuario incorrectos.";
                this.messageShow = true;
            }
        } 
        catch (error) {
            console.error("Error User:", error);
        }
    }
}
