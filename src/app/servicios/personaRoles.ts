import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import config from './config';

@Injectable({
  providedIn: 'root'
})
export class servPersonaRoles {
  private URL = config.URL;

  constructor(private http: HttpClient) {}

  // ======= ======= ======= GET PERSONA PROYECTOS ======= ======= =======
  getPersonaRoles(): Observable<any> {
    const params = {
      "procedure_name": "sp_persona_proyecto",
      "body": {
        "params": [
          {"name": "p_accion","value": "C2","type": "string"},
          {"name": "p_id_persona_proyecto","value": null,"type": "int"},
          {"name": "p_id_persona","value": null,"type": "int"},
          {"name": "p_id_institucion","value": null,"type": "int"},
          {"name": "p_id_proyecto","value": null,"type": "int"},
          {"name": "p_rol","value": null,"type": "string"},
          {"name": "p_id_persona_reg","value": null,"type": "int"}
        ]
      }
    };

    const ip = sessionStorage.getItem('ip') || '';
    const headers = new HttpHeaders({
      'ip': "127.0.0.1"
    });

    return this.http.post<any>(this.URL, params, { headers });
  }
  // ======= ======= ======= ======= ======= ======= =======
  // ======= ======= ======= GET PERSONA PROYECTOS ======= ======= =======
  getPersonaRolesByIdProyect(idProy: any): Observable<any> {
    const params = {
      "procedure_name": "sp_persona_proyecto",
      "body": {
        "params": [
          {"name": "p_accion","value": "C3","type": "string"},
          {"name": "p_id_persona_proyecto","value": null,"type": "int"},
          {"name": "p_id_persona","value": null,"type": "int"},
          {"name": "p_id_institucion","value": null,"type": "int"},
          {"name": "p_id_proyecto","value": idProy,"type": "int"},
          {"name": "p_rol","value": null,"type": "string"},
          {"name": "p_id_persona_reg","value": null,"type": "int"}
        ]
      }
    };

    const ip = sessionStorage.getItem('ip') || '';
    const headers = new HttpHeaders({
      'ip': "127.0.0.1"
    });

    return this.http.post<any>(this.URL, params, { headers });
  }
  // ======= ======= ======= ======= ======= ======= =======
  // ======= ======= ======= GET PERSONA PROYECTOS ======= ======= =======
  getPersonaRolesByIdPersona(idPersona: any): Observable<any> {
    const params = {
      "procedure_name": "sp_persona_proyecto",
      "body": {
        "params": [
          {"name": "p_accion","value": "C5","type": "string"},
          {"name": "p_id_persona_proyecto","value": null,"type": "int"},
          {"name": "p_id_persona","value": idPersona,"type": "int"},
          {"name": "p_id_institucion","value": null,"type": "int"},
          {"name": "p_id_proyecto","value": null,"type": "int"},
          {"name": "p_rol","value": null,"type": "string"},
          {"name": "p_id_persona_reg","value": null,"type": "int"}
        ]
      }
    };

    const ip = sessionStorage.getItem('ip') || '';
    const headers = new HttpHeaders({
      'ip': "127.0.0.1"
    });

    return this.http.post<any>(this.URL, params, { headers });
  }
  // ======= ======= ======= ======= ======= ======= =======
  // ======= ======= ======= GET PERSONA PROYECTOS ======= ======= =======
  getPersonaRolesActivos(): Observable<any> {
    const params = {
      "procedure_name": "sp_persona_proyecto",
      "body": {
        "params": [
          {"name": "p_accion","value": "C6","type": "string"},
          {"name": "p_id_persona_proyecto","value": null,"type": "int"},
          {"name": "p_id_persona","value": null,"type": "int"},
          {"name": "p_id_institucion","value": null,"type": "int"},
          {"name": "p_id_proyecto","value": null,"type": "int"},
          {"name": "p_rol","value": null,"type": "string"},
          {"name": "p_id_persona_reg","value": null,"type": "int"}
        ]
      }
    };

    const ip = sessionStorage.getItem('ip') || '';
    const headers = new HttpHeaders({
      'ip': "127.0.0.1"
    });

    return this.http.post<any>(this.URL, params, { headers });
  }
  // ======= ======= ======= ======= ======= ======= =======
  // ======= ======= ======= ADD PERSONAS ======= ======= =======
  addPersonaRol(obj: any): Observable<any> {
    const params = {
      "procedure_name": "sp_persona_proyecto",
      "body": {
        "params": [
          {"name": "p_accion","value": "A1","type": "string"},
          {"name": "p_id_persona_proyecto","value": null,"type": "int"},
          {"name": "p_id_persona","value": obj.p_id_persona,"type": "int"},
          {"name": "p_id_institucion","value": obj.p_id_institucion,"type": "int"},
          {"name": "p_id_proyecto","value": obj.p_id_proyecto,"type": "int"},
          {"name": "p_rol","value": obj.p_rol,"type": "string"},
          {"name": "p_id_persona_reg","value": obj.p_id_persona_reg,"type": "int"}
        ]
      }
    };

    const ip = sessionStorage.getItem('ip') || '';
    const headers = new HttpHeaders({
      'ip': "127.0.0.1"
    });

    return this.http.post<any>(this.URL, params, { headers });
  }
  // ======= ======= ======= ======= ======= ======= =======
  // ======= ======= ======= ADD PERSONAS ======= ======= =======
  editPersonaRol(obj: any): Observable<any> {
    const params = {
      "procedure_name": "sp_persona_proyecto",
      "body": {
        "params": [
          {"name": "p_accion","value": "M1","type": "string"},
          {"name": "p_id_persona_proyecto","value": obj.p_id_persona_proyecto,"type": "int"},
          {"name": "p_id_persona","value": obj.p_id_persona,"type": "int"},
          {"name": "p_id_institucion","value": obj.p_id_institucion,"type": "int"},
          {"name": "p_id_proyecto","value": obj.p_id_proyecto,"type": "int"},
          {"name": "p_rol","value": obj.p_rol,"type": "string"},
          {"name": "p_id_persona_reg","value": obj.p_id_persona_reg,"type": "int"}
        ]
      }
    };

    const ip = sessionStorage.getItem('ip') || '';
    const headers = new HttpHeaders({
      'ip': "127.0.0.1"
    });

    return this.http.post<any>(this.URL, params, { headers });
  }
  // ======= ======= ======= ======= ======= ======= =======
}
