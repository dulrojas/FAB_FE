import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import config from './config';

@Injectable({
  providedIn: 'root'
})
export class servRiesgos {
  private URL = config.URL;

  constructor(private http: HttpClient) {}

  // ======= ======= ======= ======= ======= ======= =======
  // ======= ======= ======= GET RIESGOS ======= ======= =======
  // ======= ======= ======= ======= ======= ======= =======
    getRiesgos(): Observable<any> {
      const params = {
        "procedure_name": "sp_riesgos",
        "body": {
          "params": [
            { "name": "p_accion", "value": "C1", "type": "string" },
            { "name": "p_id_riesgo", "value": null, "type": "int" },
            { "name": "p_id_proyecto", "value": null, "type": "int" },
            { "name": "p_id_proy_elemen_padre", "value": null, "type": "int" },
            { "name": "p_idp_categoria", "value": null, "type": "string" },
            { "name": "p_codigo", "value": null, "type": "string" },
            { "name": "p_fecha", "value": null, "type": "string" },
            { "name": "p_riesgo", "value": null, "type": "string" },
            { "name": "p_descripcion", "value": null, "type": "string" },                
            { "name": "p_vinculados", "value": null, "type": "string" },
            { "name": "p_idp_identificacion", "value": null, "type": "int" },
            { "name": "p_impacto", "value": null, "type": "string" },
            { "name": "p_probabilidad", "value": null, "type": "string" },
            { "name": "p_nivel", "value": null, "type": "string" },
            { "name": "p_idp_ocurrencia", "value": null, "type": "int" },
            { "name": "p_idp_medidas", "value": null, "type": "string" },
            { "name": "p_medidas", "value": null, "type": "string" },
            { "name": "p_idp_efectividad", "value": null, "type": "int" },
            { "name": "p_comentarios", "value": null, "type": "string" },
            { "name": "p_fecha_hora_reg", "value": null, "type": "string" },
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
  // ======= ======= ======= GET RIESGOS POR ID ======= ======= =======
  // ======= ======= ======= ======= ======= ======= =======
    getRiesgosByIdProy(idProy: any): Observable<any> {
      const params = {
        "procedure_name": "sp_riesgos",
        "body": {
          "params": [
            { "name": "p_accion", "value": "C2", "type": "string" },
            { "name": "p_id_riesgo", "value": null, "type": "int" },
            { "name": "p_id_proyecto", "value": idProy, "type": "int" },
            { "name": "p_id_proy_elemen_padre", "value": null, "type": "int" },
            { "name": "p_idp_categoria", "value": null, "type": "string" },
            { "name": "p_codigo", "value": null, "type": "string" },
            { "name": "p_fecha", "value": null, "type": "string" },
            { "name": "p_riesgo", "value": null, "type": "string" },
            { "name": "p_descripcion", "value": null, "type": "string" },                
            { "name": "p_vinculados", "value": null, "type": "string" },
            { "name": "p_idp_identificacion", "value": null, "type": "int" },
            { "name": "p_impacto", "value": null, "type": "string" },
            { "name": "p_probabilidad", "value": null, "type": "string" },
            { "name": "p_nivel", "value": null, "type": "string" },
            { "name": "p_idp_ocurrencia", "value": null, "type": "int" },
            { "name": "p_idp_medidas", "value": null, "type": "string" },
            { "name": "p_medidas", "value": null, "type": "string" },
            { "name": "p_idp_efectividad", "value": null, "type": "int" },
            { "name": "p_comentarios", "value": null, "type": "string" },
            { "name": "p_fecha_hora_reg", "value": null, "type": "string" },
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
  // ======= ======= ======= ADD RIESGOS ======= ======= =======
  // ======= ======= ======= ======= ======= ======= =======
    addRiesgo(obj: any): Observable<any> {
      const params = {
        "procedure_name": "sp_riesgos",
        "body": {
            "params": [

                { "name": "p_accion", "value": "A1", "type": "string" },
                { "name": "p_id_riesgo", "value": null, "type": "int" },
                { "name": "p_id_proyecto", "value": obj.p_id_proyecto, "type": "int" },
                { "name": "p_id_proy_elemen_padre", "value": obj.p_id_proy_elemen_padre, "type": "int" },
                { "name": "p_idp_categoria", "value": obj.p_idp_categoria, "type": "int" },
                { "name": "p_codigo", "value": obj.p_codigo, "type": "string" },
                { "name": "p_fecha", "value":obj.p_fecha, "type": "string" },
                { "name": "p_riesgo", "value":  obj.p_riesgo, "type": "string" },
                { "name": "p_descripcion", "value":  obj.p_descripcion, "type": "string" },
                { "name": "p_vinculados", "value": obj.p_vinculados, "type": "string" },
                { "name": "p_idp_identificacion", "value": obj.p_idp_identificacion, "type": "int" },
                { "name": "p_impacto", "value": obj.p_impacto, "type": "int" },
                { "name": "p_probabilidad", "value": obj.p_probabilidad, "type": "int" },
                { "name": "p_nivel", "value": obj.p_nivel, "type": "int" },
                { "name": "p_idp_ocurrencia", "value":  obj.p_idp_ocurrencia, "type": "int" },
                { "name": "p_idp_medidas", "value": obj.p_idp_medidas, "type": "int" },
                { "name": "p_medidas", "value":  obj.p_medidas, "type": "string" },
                { "name": "p_idp_efectividad", "value": obj.p_idp_efectividad, "type": "int" },
                { "name": "p_comentarios", "value": obj.p_comentarios, "type": "string" },
                { "name": "p_fecha_hora_reg", "value": null, "type": "string" },
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
  // ======= ======= ======= EDIT RIESGO ======= ======= =======
  // ======= ======= ======= ======= ======= ======= =======
    editRiesgo(obj: any): Observable<any> {
      const params = {
        "procedure_name": "sp_riesgos",
        "body": {
          "params": [
            { "name": "p_accion", "value": "M1", "type": "string" },
            { "name": "p_id_riesgo", "value": obj.p_id_riesgo, "type": "int" },
            { "name": "p_id_proyecto", "value": obj.p_id_proyecto, "type": "int" },
            { "name": "p_id_proy_elemen_padre", "value": obj.p_id_proy_elemen_padre, "type": "int" },
            { "name": "p_idp_categoria", "value": obj.p_idp_categoria, "type": "string" },
            { "name": "p_codigo", "value": obj.p_codigo, "type": "string" },
            { "name": "p_fecha", "value": obj.p_fecha, "type": "string" },
            { "name": "p_riesgo", "value": obj.p_riesgo, "type": "string" },
            { "name": "p_descripcion", "value": obj.p_descripcion, "type": "string" },
            { "name": "p_vinculados", "value": obj.p_vinculados, "type": "string" },
            { "name": "p_idp_identificacion", "value": obj.p_idp_identificacion, "type": "int" },
            { "name": "p_impacto", "value": obj.p_impacto, "type": "int" },
            { "name": "p_probabilidad", "value": obj.p_probabilidad, "type": "int" },
            { "name": "p_nivel", "value": obj.p_nivel, "type": "int" },
            { "name": "p_idp_ocurrencia", "value": obj.p_idp_ocurrencia, "type": "int" },
            { "name": "p_idp_medidas", "value": obj.p_idp_medidas, "type": "int" },
            { "name": "p_medidas", "value": obj.p_medidas, "type": "string" },
            { "name": "p_idp_efectividad", "value": obj.p_idp_efectividad, "type": "int" },
            { "name": "p_comentarios", "value": obj.p_comentarios, "type": "string" },
            { "name": "p_fecha_hora_reg", "value": obj.p_fecha_hora_reg, "type": "string" },
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
  // ======= ======= ======= DELETE RIESGO ======= ======= =======
  // ======= ======= ======= ======= ======= ======= =======
    deleteRiesgo(idRiesgo: number, idPersonaReg: number): Observable<any> {
      const params = {
          "procedure_name": "sp_riesgos",
          "body": {
              "params": [
                  { "name": "p_accion", "value": "D1", "type": "string" },
                  { "name": "p_id_riesgo", "value": idRiesgo, "type": "int" },
                  { "name": "p_id_proyecto", "value": null, "type": "int" },
                  { "name": "p_id_proy_elemen_padre", "value": null, "type": "int" },
                  { "name": "p_idp_categoria", "value": null, "type": "string" },
                  { "name": "p_codigo", "value": null, "type": "string" },
                  { "name": "p_fecha", "value": null, "type": "string" },
                  { "name": "p_riesgo", "value": null, "type": "string" },
                  { "name": "p_descripcion", "value": null, "type": "string" },                
                  { "name": "p_vinculados", "value": null, "type": "string" },
                  { "name": "p_idp_identificacion", "value": null, "type": "int" },
                  { "name": "p_impacto", "value": null, "type": "string" },
                  { "name": "p_probabilidad", "value": null, "type": "string" },
                  { "name": "p_nivel", "value": null, "type": "string" },
                  { "name": "p_idp_ocurrencia", "value": null, "type": "int" },
                  { "name": "p_idp_medidas", "value": null, "type": "string" },
                  { "name": "p_medidas", "value": null, "type": "string" },
                  { "name": "p_idp_efectividad", "value": null, "type": "int" },
                  { "name": "p_comentarios", "value": null, "type": "string" },
                  { "name": "p_fecha_hora_reg", "value": null, "type": "string" },
                  { "name": "p_id_persona_reg", "value": idPersonaReg, "type": "int" }
              ]
          }
      };
      const ip = sessionStorage.getItem('ip') || '';
      const headers = new HttpHeaders({
        'ip': "127.0.0.1"
      });
      return this.http.post<any>(this.URL, params, { headers });
    }

}