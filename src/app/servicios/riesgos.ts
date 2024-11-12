import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import config from './config';

@Injectable({
  providedIn: 'root'
})
export class ServRiesgos {
  private URL = config.URL;
  
  constructor(private http: HttpClient) {}

  // Obtener todos los riesgos
  getRiesgos(): Observable<any> {
    const params = {
      "procedure_name": "sp_proy_riesgos",
      "body": {
        "params": [
          { "name": "p_accion", "value": "C1", "type": "string" },
          { "name": "p_id_riesgo", "value": null, "type": "int" },
          { "name": "p_id_proyecto", "value": null, "type": "int" }
        ]
      }
    };
    return this.http.post(this.URL, params, { headers: this.getHeaders() });
  }

  // Obtener riesgos por proyecto
  getRiesgosByProyecto(idProyecto: number): Observable<any> {
    const params = {
      "procedure_name": "sp_proy_riesgos",
      "body": {
        "params": [
          { "name": "p_accion", "value": "C2", "type": "string" },
          { "name": "p_id_riesgo", "value": null, "type": "int" },
          { "name": "p_id_proyecto", "value": idProyecto, "type": "int" }
        ]
      }
    };
    return this.http.post(this.URL, params, { headers: this.getHeaders() });
  }

  // Crear nuevo riesgo
  createRiesgo(riesgo: any): Observable<any> {
    const params = {
      "procedure_name": "sp_proy_riesgos",
      "body": {
        "params": [
          { "name": "p_accion", "value": "A1", "type": "string" },
          { "name": "p_id_proyecto", "value": riesgo.id_proyecto, "type": "int" },
          { "name": "p_id_proy_elemen_padre", "value": riesgo.id_proy_elemen_padre, "type": "int" },
          { "name": "p_idp_categoria", "value": riesgo.idp_categoria, "type": "int" },
          { "name": "p_codigo", "value": riesgo.codigo, "type": "string" },
          { "name": "p_fecha", "value": riesgo.fecha, "type": "string" },
          { "name": "p_riesgo", "value": riesgo.riesgo, "type": "string" },
          { "name": "p_descripcion", "value": riesgo.descripcion, "type": "string" },
          { "name": "p_vinculados", "value": riesgo.vinculados, "type": "string" },
          { "name": "p_idp_identificacion", "value": riesgo.idp_identificacion, "type": "int" },
          { "name": "p_impacto", "value": riesgo.impacto, "type": "string" },
          { "name": "p_probabilidad", "value": riesgo.probabilidad, "type": "string" },
          { "name": "p_nivel", "value": riesgo.nivel, "type": "string" },
          { "name": "p_idp_ocurrencia", "value": riesgo.idp_ocurrencia, "type": "int" },
          { "name": "p_medidas", "value": riesgo.medidas, "type": "string" },
          { "name": "p_idp_efectividad", "value": riesgo.idp_efectividad, "type": "int" },
          { "name": "p_comentarios", "value": riesgo.comentarios, "type": "string" },
          { "name": "p_id_persona_reg", "value": riesgo.id_persona_reg, "type": "int" }
        ]
      }
    };
    return this.http.post(this.URL, params, { headers: this.getHeaders() });
  }

  // Actualizar riesgo existente
  updateRiesgo(riesgo: any): Observable<any> {
    const params = {
      "procedure_name": "sp_proy_riesgos",
      "body": {
        "params": [
          { "name": "p_accion", "value": "M1", "type": "string" },
          { "name": "p_id_riesgo", "value": riesgo.id_riesgo, "type": "int" },
          { "name": "p_id_proyecto", "value": riesgo.id_proyecto, "type": "int" },
          { "name": "p_id_proy_elemen_padre", "value": riesgo.id_proy_elemen_padre, "type": "int" },
          { "name": "p_idp_categoria", "value": riesgo.idp_categoria, "type": "int" },
          { "name": "p_codigo", "value": riesgo.codigo, "type": "string" },
          { "name": "p_fecha", "value": riesgo.fecha, "type": "string" },
          { "name": "p_riesgo", "value": riesgo.riesgo, "type": "string" },
          { "name": "p_descripcion", "value": riesgo.descripcion, "type": "string" },
          { "name": "p_vinculados", "value": riesgo.vinculados, "type": "string" },
          { "name": "p_idp_identificacion", "value": riesgo.idp_identificacion, "type": "int" },
          { "name": "p_impacto", "value": riesgo.impacto, "type": "string" },
          { "name": "p_probabilidad", "value": riesgo.probabilidad, "type": "string" },
          { "name": "p_nivel", "value": riesgo.nivel, "type": "string" },
          { "name": "p_idp_ocurrencia", "value": riesgo.idp_ocurrencia, "type": "int" },
          { "name": "p_medidas", "value": riesgo.medidas, "type": "string" },
          { "name": "p_idp_efectividad", "value": riesgo.idp_efectividad, "type": "int" },
          { "name": "p_comentarios", "value": riesgo.comentarios, "type": "string" }
        ]
      }
    };
    return this.http.post(this.URL, params, { headers: this.getHeaders() });
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'ip': window.location.hostname || '127.0.0.1'
    });
  }
}