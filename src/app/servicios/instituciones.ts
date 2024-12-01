import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import config from './config';

@Injectable({
  providedIn: 'root'
})
export class servInstituciones{
  private URL = config.URL;

  constructor(private http: HttpClient) {}

  // ======= ======= ======= GET PERSONAS ======= ======= =======
  getInstituciones(): Observable<any> {
    const params = {
      "procedure_name": "sp_instituciones",
      "body": {
        "params": [
          {"name": "p_accion","value": "C1","type": "string"},
          {"name": "p_id_institucion","value": null,"type": "int"},
          {"name": "p_institucion","value": null,"type": "string"},
          {"name": "p_id_persona_resp","value": null,"type": "int"},
          {"name": "p_id_persona_autoriza","value": null,"type": "int"},
          {"name": "p_idp_tipo_inst","value": null,"type": "int"},
          {"name": "p_idp_estado","value": null,"type": "int"},
          {"name": "p_sigla","value": null,"type": "string"},
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


  private getHeaders(): HttpHeaders {
    const ip = sessionStorage.getItem('ip') || '127.0.0.1';
    return new HttpHeaders({
      ip,
    });
  }

  // ======= A1: Agregar una nueva institución =======
  addInstitucion(institucion: any): Observable<any> {
    const params =    {
      "procedure_name": "sp_instituciones",
      "body": {
        "params": [
          { "name": "p_accion", "value": "A1", "type": "string" },
          { "name": "p_id_institucion", "value": null, "type": "int" },
          { "name": "p_institucion", "value": institucion.institucion, "type": "string" },
          { "name": "p_id_persona_resp", "value": institucion.id_persona_resp, "type": "int" },
          { "name": "p_id_persona_autoriza", "value": institucion.id_persona_autoriza, "type": "int" },
          { "name": "p_idp_tipo_inst", "value": institucion.idp_tipo_inst, "type": "int" },
          { "name": "p_idp_estado", "value": institucion.idp_estado, "type": "int" },
          { "name": "p_sigla", "value": institucion.sigla, "type": "string" }
        ]
      }
    };

    return this.http.post<any>(this.URL, params, { headers: this.getHeaders() });
  }

  // ======= M1: Modificar una institución =======
  updateInstitucion(institucion: any): Observable<any> {
    const params =    {
      "procedure_name": "sp_instituciones",
      "body": {
        "params": [
          { "name": "p_accion", "value": "M1", "type": "string" },
          { "name": "p_id_institucion", "value": institucion.id_institucion, "type": "int" },
          { "name": "p_institucion", "value": institucion.institucion, "type": "string" },
          { "name": "p_id_persona_resp", "value": institucion.id_persona_resp, "type": "int" },
          { "name": "p_id_persona_autoriza", "value": institucion.id_persona_autoriza, "type": "int" },
          { "name": "p_idp_tipo_inst", "value": institucion.idp_tipo_inst, "type": "int" },
          { "name": "p_idp_estado", "value": institucion.idp_estado, "type": "int" },
          { "name": "p_sigla", "value": institucion.sigla, "type": "string" }
        ]
      }
    };

    return this.http.post<any>(this.URL, params, { headers: this.getHeaders() });
  }

  // ======= C1: Consultar todas las instituciones =======
  getAllInstituciones(): Observable<any> {
    const params =     {
      "procedure_name": "sp_instituciones",
      "body": {
        "params": [
          { "name": "p_accion", "value": "C1", "type": "string" }
        ]
      }
    };

    return this.http.post<any>(this.URL, params, { headers: this.getHeaders() });
  }

  // ======= C2: Consultar una institución específica =======
  getInstitucionById(idInstitucion: number): Observable<any> {
    const params =     {
      "procedure_name": "sp_instituciones",
      "body": {
        "params": [
          { "name": "p_accion", "value": "C2", "type": "string" },
          { "name": "p_id_institucion", "value": idInstitucion, "type": "int" }
        ]
      }
    };

    return this.http.post<any>(this.URL, params, { headers: this.getHeaders() });
  }

  // ======= D1: Eliminar una institución =======
  deleteInstitucion(idInstitucion: number): Observable<any> {
    const params = {
        "procedure_name": "sp_instituciones",
        "body": {
          "params": [
            { "name": "p_accion", "value": "D1", "type": "string" },
            { "name": "p_id_institucion", "value": idInstitucion, "type": "int" }
          ]
        }
      };

    return this.http.post<any>(this.URL, params, { headers: this.getHeaders() });
  }
}