import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../router.animations';

import { servLogin } from "../servicios/login";
import { servProyectos } from "../servicios/proyectos";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit {
    constructor(
        public router: Router,
        private servLogin: servLogin,
        private servProyectos: servProyectos
    ) {}
    
    user: any = null;
    password: any = null;

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

    onLoggedin(){
        let userData: any = null;

        this.servLogin.authUser(this.user, this.password).subscribe(
            (data) => {
                userData = data[0].dato;

                if(userData){

                    this.servProyectos.getProyectos().subscribe(
                        (data) => {
                            this.proyectos = data[0].dato;

                            userData = userData[0];
                            delete userData.usuario;
                            delete userData.contrasenia;

                            localStorage.setItem('isLoggedin', 'true');
                            localStorage.setItem('currentIdPer', (userData.id_persona).toString());
                            localStorage.setItem('userFullName', userData.nombres+" "+userData.apellido_1+((userData.apellido_2)?(" "+userData.apellido_2):("")));
                            localStorage.setItem('projects', JSON.stringify(this.proyectos));
                            localStorage.setItem('currentIdProy', (this.proyectos[0].id_proyecto).toString());
        
                            this.router.navigate(['/dashboard2']);
                        },
                        (error) => {
                            console.error(error);
                        }
                    );
                }
                else{
                    this.message = "Datos de usuario incorrectos.";
                    this.messageShow = true;
                }
            },
            (error) => {
                console.error(error);
            }
        );


        if(this.user == "123"){
        }

    }
}
