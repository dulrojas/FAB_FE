import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import config from './config';

@Injectable({
  providedIn: 'root'
})
export class PlanifEstrategicaService {
  private URL = config.URL;

  constructor(private http: HttpClient) {}

    // ======= Consultar todos los elementos =======
    getAllPlanifElements(): Observable<any> {
      const params = {
        "procedure_name": "sp_planif_estrategica",
        "body": {
          "params": [
            { "name": "p_accion", "value": "C1", "type": "string" },
            { "name": "p_id_proy_elemento", "value": null, "type": "int" },
            { "name": "p_id_proyecto", "value": null, "type": "int" },
            { "name": "p_id_meto_elemento", "value": null, "type": "int" },
            { "name": "p_id_proy_elem_padre", "value": null, "type": "int" },
            { "name": "p_codigo", "value": null, "type": "string" },
            { "name": "p_elemento", "value": null, "type": "string" },
            { "name": "p_descripcion", "value": null, "type": "string" },
            { "name": "p_comentario", "value": null, "type": "string" },
            { "name": "p_nivel", "value": null, "type": "int" },
            { "name": "p_orden", "value": null, "type": "int" },
            { "name": "p_idp_estado", "value": null, "type": "int" },
            { "name": "p_peso", "value": null, "type": "numeric" }
          ]
        }
      };

      const headers = new HttpHeaders({
        'ip': "127.0.0.1"
      });

      return this.http.post<any>(this.URL, params, { headers });
    }

    // ======= Consultar elementos por ID =======
    getPlanifElementsByProject(idProy: any): Observable<any> {
      const params = {
        "procedure_name": "sp_planif_estrategica",
        "body": {
          "params": [
            { "name": "p_accion", "value": "C2", "type": "string" },
            { "name": "p_id_proy_elemento", "value": idProy, "type": "int" },
            { "name": "p_id_proyecto", "value": null, "type": "int" },
            { "name": "p_id_meto_elemento", "value": null, "type": "int" },
            { "name": "p_id_proy_elem_padre", "value": null, "type": "int" },
            { "name": "p_codigo", "value": null, "type": "string" },
            { "name": "p_elemento", "value": null, "type": "string" },
            { "name": "p_descripcion", "value": null, "type": "string" },
            { "name": "p_comentario", "value": null, "type": "string" },
            { "name": "p_nivel", "value": null, "type": "int" },
            { "name": "p_orden", "value": null, "type": "int" },
            { "name": "p_idp_estado", "value": null, "type": "int" },
            { "name": "p_peso", "value": null, "type": "numeric" }
          ]
        }
      };

      const ip = sessionStorage.getItem('ip') || '';
      const headers = new HttpHeaders({
        'ip': "127.0.0.1"
      });

      return this.http.post<any>(this.URL, params, { headers });
    }

// ======= Consultar indicadores de avance =======
getIndicadoresAvance(idProyecto: any): Observable<any> {
  const params = {
    "procedure_name": "sp_planif_estrategica",
    "body": {
      "params": [
        { "name": "p_accion", "value": "C5", "type": "string" },
        { "name": "p_id_proyecto", "value": idProyecto, "type": "int" },
        { "name": "p_id_indicador_avance", "value": null, "type": "int" },
        { "name": "p_fecha", "value": null, "type": "date" },
        { "name": "p_valor", "value": null, "type": "numeric" }
      ]
    }
  };

  const headers = new HttpHeaders({
    'ip': "127.0.0.1"
  });

  return this.http.post<any>(this.URL, params, { headers });
}


  // ======= Agregar elemento =======
  addPlanifElement(obj: any): Observable<any> {
    const params = {
      "procedure_name": "sp_planif_estrategica",
      "body": {
        "params": [
          { "name": "p_accion", "value": "A1", "type": "string" },
          { "name": "p_id_proy_elemento", "value": null, "type": "int" },
          { "name": "p_id_proyecto", "value": obj.p_id_proyecto, "type": "int" },
          { "name": "p_id_meto_elemento", "value": obj.p_id_meto_elemento, "type": "int" },
          { "name": "p_id_proy_elem_padre", "value": obj.p_id_proy_elem_padre, "type": "int" },
          { "name": "p_codigo", "value": obj.p_codigo, "type": "string" },
          { "name": "p_elemento", "value": obj.p_elemento, "type": "string" },
          { "name": "p_descripcion", "value": obj.p_descripcion, "type": "string" },
          { "name": "p_comentario", "value": obj.p_comentario, "type": "string" },
          { "name": "p_nivel", "value": obj.p_nivel, "type": "int" },
          { "name": "p_orden", "value": obj.p_orden, "type": "int" },
          { "name": "p_idp_estado", "value": obj.p_idp_estado, "type": "int" },
          { "name": "p_peso", "value": obj.p_peso, "type": "numeric" }
        ]
      }
    };

    const headers = new HttpHeaders({
      'ip': "127.0.0.1"
    });

    return this.http.post<any>(this.URL, params, { headers });
  }

  // ======= Editar elemento  =======
  editPlanifElement(obj: any): Observable<any> {
    const params = {
      "procedure_name": "sp_planif_estrategica",
      "body": {
        "params": [
          { "name": "p_accion", "value": "M1", "type": "string" },
          { "name": "p_id_proy_elemento", "value": obj.p_id_proy_elemento, "type": "int" },
          { "name": "p_id_proyecto", "value": obj.p_id_proyecto, "type": "int" },
          { "name": "p_id_meto_elemento", "value": obj.p_id_meto_elemento, "type": "int" },
          { "name": "p_id_proy_elem_padre", "value": obj.p_id_proy_elem_padre, "type": "int" },
          { "name": "p_codigo", "value": obj.p_codigo, "type": "string" },
          { "name": "p_elemento", "value": obj.p_elemento, "type": "string" },
          { "name": "p_descripcion", "value": obj.p_descripcion, "type": "string" },
          { "name": "p_comentario", "value": obj.p_comentario, "type": "string" },
          { "name": "p_nivel", "value": obj.p_nivel, "type": "int" },
          { "name": "p_orden", "value": obj.p_orden, "type": "int" },
          { "name": "p_idp_estado", "value": obj.p_idp_estado, "type": "int" },
          { "name": "p_peso", "value": obj.p_peso, "type": "numeric" }
        ]
      }
    };

    const headers = new HttpHeaders({
      'ip': "127.0.0.1"
    });

    return this.http.post<any>(this.URL, params, { headers });
  }

  // ======= Eliminar elemento =======
  deletePlanifElement(idPlanifElemento: any): Observable<any> {
    const params = {
      "procedure_name": "sp_planif_estrategica",
      "body": {
        "params": [
          { "name": "p_accion", "value": "D1", "type": "string" },
          { "name": "p_id_proy_elemento", "value": idPlanifElemento, "type": "int" },
          { "name": "p_id_proyecto", "value": null, "type": "int" },
          { "name": "p_id_meto_elemento", "value": null, "type": "int" },
          { "name": "p_id_proy_elem_padre", "value": null, "type": "int" },
          { "name": "p_codigo", "value": null, "type": "string" },
          { "name": "p_elemento", "value": null, "type": "string" },
          { "name": "p_descripcion", "value": null, "type": "string" },
          { "name": "p_comentario", "value": null, "type": "string" },
          { "name": "p_nivel", "value": null, "type": "int" },
          { "name": "p_orden", "value": null, "type": "int" },
          { "name": "p_idp_estado", "value": null, "type": "int" },
          { "name": "p_peso", "value": null, "type": "numeric" }
        ]
      }
    };
  
    const headers = new HttpHeaders({
      'ip': "127.0.0.1"
    });
  
    return this.http.post<any>(this.URL, params, { headers });
  }
}