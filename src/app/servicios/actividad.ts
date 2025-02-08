import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import config from './config';

@Injectable({
  providedIn: 'root'
})
export class servActividad {
  private URL = config.URL;

  constructor(private http: HttpClient) {}

  // ======= ======= ======= GET ACTIVIDADES ======= ======= =======
  getActividadesByIdProy(idProy: any): Observable<any> {
    const params = {
      "procedure_name": "sp_proy_actividad",
      "body": {
        "params": [
          { "name": "p_accion", "value": "C3", "type": "string" },
          { "name": "p_id_proy_actividad", "value": null, "type": "int" },
          { "name": "p_id_proyecto", "value": idProy, "type": "int" },
          { "name": "p_id_proy_elemento_padre", "value": null, "type": "int" },
          { "name": "p_codigo", "value": null, "type": "string" },
          { "name": "p_actividad", "value": null, "type": "string" },
          { "name": "p_descripcion", "value": null, "type": "string" },
          { "name": "p_orden", "value": null, "type": "int" },
          { "name": "p_id_proy_acti_repro", "value": null, "type": "int" },
          { "name": "p_presupuesto", "value": null, "type": "int" },    
          { "name": "p_fecha_inicio", "value": null, "type": "string" },
          { "name": "p_fecha_fin", "value": null, "type": "string" },
          { "name": "p_resultado", "value": null, "type": "string" },
          { "name": "p_idp_actividad_estado", "value": null, "type": "int" },
          { "name": "p_id_persona_reg", "value": null, "type": "int" }
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
  // ======= ======= ======= ADD ACTIVIDADES ======= ======= =======
  addActividad(obj: any): Observable<any> {
    const params = {
      "procedure_name": "sp_proy_actividad",
      "body": {
        "params": [
          { "name": "p_accion", "value": "A1", "type": "string" },
          { "name": "p_id_proy_actividad", "value": null, "type": "int" },
          { "name": "p_id_proyecto", "value": obj.p_id_proyecto, "type": "int" },
          { "name": "p_id_proy_elemento_padre", "value": obj.p_id_proy_elemento_padre, "type": "int" },
          { "name": "p_codigo", "value": obj.p_codigo, "type": "string" },
          { "name": "p_actividad", "value": obj.p_actividad, "type": "string" },
          { "name": "p_descripcion", "value": obj.p_descripcion, "type": "string" },
          { "name": "p_orden", "value": obj.p_orden, "type": "int" },
          { "name": "p_id_proy_acti_repro", "value": obj.p_id_proy_acti_repro, "type": "int" },
          { "name": "p_presupuesto", "value": obj.p_presupuesto, "type": "int" },    
          { "name": "p_fecha_inicio", "value": obj.p_fecha_inicio, "type": "string" },
          { "name": "p_fecha_fin", "value": obj.p_fecha_fin, "type": "string" },
          { "name": "p_resultado", "value": obj.p_resultado, "type": "string" },
          { "name": "p_idp_actividad_estado", "value": obj.p_idp_actividad_estado, "type": "int" },
          { "name": "p_id_persona_reg", "value": obj.p_id_persona_reg, "type": "int" }
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
  // ======= ======= ======= GET ACTIVIDADES ======= ======= =======
  editActividad(obj: any): Observable<any> {
    const params = {
      "procedure_name": "sp_proy_actividad",
      "body": {
        "params": [
          { "name": "p_accion", "value": "M1", "type": "string" },
          { "name": "p_id_proy_actividad", "value": obj.p_id_proy_actividad, "type": "int" },
          { "name": "p_id_proyecto", "value": obj.p_id_proyecto, "type": "int" },
          { "name": "p_id_proy_elemento_padre", "value": obj.p_id_proy_elemento_padre, "type": "int" },
          { "name": "p_codigo", "value": obj.p_codigo, "type": "string" },
          { "name": "p_actividad", "value": obj.p_actividad, "type": "string" },
          { "name": "p_descripcion", "value": obj.p_descripcion, "type": "string" },
          { "name": "p_orden", "value": obj.p_orden, "type": "int" },
          { "name": "p_id_proy_acti_repro", "value": obj.p_id_proy_acti_repro, "type": "int" },
          { "name": "p_presupuesto", "value": obj.p_presupuesto, "type": "int" },    
          { "name": "p_fecha_inicio", "value": obj.p_fecha_inicio, "type": "string" },
          { "name": "p_fecha_fin", "value": obj.p_fecha_fin, "type": "string" },
          { "name": "p_resultado", "value": obj.p_resultado, "type": "string" },
          { "name": "p_idp_actividad_estado", "value": obj.p_idp_actividad_estado, "type": "int" },
          { "name": "p_id_persona_reg", "value": obj.p_id_persona_reg, "type": "int" }
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
  // ======= ======= ======= GET ACTIVIDADES ======= ======= =======
  deleteActividad(idAct: any, idPer: any): Observable<any> {
    const params = {
      "procedure_name": "sp_proy_actividad",
      "body": {
        "params": [
          { "name": "p_accion", "value": "D1", "type": "string" },
          { "name": "id_proy_actividad", "value": idAct, "type": "int" },
          { "name": "id_proyecto", "value": null, "type": "int" },
          { "name": "id_proy_elemento_padre", "value": null, "type": "int" },
          { "name": "codigo", "value": null, "type": "string" },
          { "name": "actividad", "value": null, "type": "string" },
          { "name": "descripcion", "value": null, "type": "string" },
          { "name": "orden", "value": null, "type": "int" },
          { "name": "id_proy_acti_repro", "value": null, "type": "int" },
          { "name": "presupuesto", "value": null, "type": "int" },    
          { "name": "fecha_inicio", "value": null, "type": "string" },
          { "name": "fecha_fin", "value": null, "type": "string" },
          { "name": "resultado", "value": null, "type": "string" },
          { "name": "idp_actividad_estado", "value": null, "type": "int" },
          { "name": "p_id_persona_reg", "value": idPer, "type": "int" }
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