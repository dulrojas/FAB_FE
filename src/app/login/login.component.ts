import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../router.animations';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { lastValueFrom , of} from 'rxjs';

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
        private servPersonaRoles: servPersonaRoles,
        private http: HttpClient
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

    getIP(){
    this.http.get<{ ip: string }>('https://api.ipify.org?format=json')
        .subscribe(
            (data) => {
                console.log('IP:', data.ip)
                return data.ip;
            },
            (error) => {
                console.error('Error obteniendo la IP:', error)
                return "127.0.0.1";
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
    
                localStorage.setItem('isLoggedin', 'true');
                localStorage.setItem('currentIdPer', userData.id_persona.toString());
                localStorage.setItem(
                    'userFullName', 
                    (userData.nombres+" "+userData.apellido_1+((userData.apellido_2)?(" "+userData.apellido_2):("")))
                );
    
                try {
                    const personaRolesResponse = await lastValueFrom(
                        this.servPersonaRoles.getPersonaRolesByIdPersona(userData.id_persona)
                    );
                    this.proyectos = (personaRolesResponse[0].dato)?(personaRolesResponse[0].dato):([]);
    
                    if (userData.admi_sistema){
                        this.proyectos.forEach(proyecto => {
                            proyecto.rol = "ADM";
                        });
                    } 
                    else{
                        // ======= FILTER PROYECTOS WHITOUT ROL =======
                        this.proyectos = this.proyectos.filter(
                            (proyecto) => (proyecto.id_persona_proyecto !== null)
                        );
                        // ======= ======= =======
                        // ======= FILTER PROYECTOS PENDIENTES (4) =======
                        this.proyectos = this.proyectos.filter(
                            (proyecto) => !((proyecto.idp_estado_proy == 4)&&((proyecto.rol == "ESC")||(proyecto.rol == "LEC")))
                        );
                        // ======= ======= =======
                        // ======= FILTER PROYECTOS CONCLUIDOS (2) Y CANCELADOS (3) =======
                        this.proyectos = this.proyectos.filter(
                            (proyecto) => !(((proyecto.idp_estado_proy == 2)||(proyecto.idp_estado_proy == 3))&&(proyecto.rol != "CON"))
                        );
                        // ======= ======= =======
                    }
    
                    if (this.proyectos.length > 0) {
                        localStorage.setItem('projects', JSON.stringify(this.proyectos));

                        localStorage.setItem(
                            'currentIdProy', 
                            this.proyectos[0].id_proyecto.toString()
                        );

                        localStorage.setItem(
                            'currentProyName', 
                            this.proyectos[0].proyecto.toString()
                        );

                        localStorage.setItem(
                            'currentPerProRol',
                            (this.proyectos[0])?(this.proyectos[0].rol):('Sin rol')
                        );

                        this.http.get<{ ip: string }>('https://api.ipify.org?format=json')
                            .pipe(
                                map(data => data.ip),
                                catchError(error => of("127.0.0.1"))
                            )
                            .subscribe(ip => {
                                localStorage.setItem('ip', ip);
                            });

                        this.router.navigate(['/dashboard']);
                    }
                    else{
                        this.messageShow = true;
                        this.message = "Usuario sin proyectos asignados, por favor, comuníquese con un administrador.";
                    }
                } 
                catch (error) {
                    console.error("Error:", error);
                }
            } 
            else {
                this.messageShow = true;
                this.message = "Datos de usuario incorrectos.";
            }
        } 
        catch (error) {
            console.error("Error User:", error);
        }
    }
}
