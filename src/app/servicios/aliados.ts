import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import config from './config';

@Injectable({
  providedIn: 'root',
})

export class servAliados{

  private URL = config.URL;
  constructor(private http: HttpClient) {}

  // ======= ======= ======= ======= ======= ======= =======
  // ======= =======       GET ALIADOS       ======= =======
  // ======= ======= ======= ======= ======= ======= =======
  getAliados(): Observable<any> {
    const params = {
        "procedure_name": "sp_aliados",
        "body": {
          "params": [
            { "name": "p_accion", "value": "C1", "type": "string" },
            { "name": "p_id_proy_aliado", "value":null, "type": "int" },
            { "name": "p_id_proyecto", "value":null, "type": "int" },
            { "name": "fecha", "value":null, "type": "string" },
            { "name": "p_id_organizacion", "value":null, "type": "int" },
            { "name": "p_referente", "value":null, "type": "string" },
            { "name": "p_vinculo", "value":null, "type": "string" },
            { "name": "p_idp_convenio", "value":null, "type": "string" },
            { "name": "p_id_persona_reg", "value":null, "type": "int" },
            { "name": "p_fecha_hora_reg", "value":null, "type": "string" }
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
  // ======= ===== GET ALIADOS POR ID PROYECTO ===== =======
  // ======= ======= ======= ======= ======= ======= =======
    getAliadosByIdProy(idProy: any): Observable<any> {
      const params =  {
        "procedure_name": "sp_aliados",
        "body": {
          "params": [
            { "name": "p_accion", "value": "C2", "type": "string" },
            { "name": "p_id_proy_aliado", "value":null, "type": "int" },
            { "name": "p_id_proyecto", "value":idProy, "type": "int" },
            { "name": "p_fecha", "value":  null, "type": "string" },
            { "name": "p_id_organizacion", "value":  null, "type": "int" },
            { "name": "p_referente", "value": null, "type": "string" },
            { "name": "p_vinculo", "value":  null, "type": "string" },
            { "name": "p_idp_convenio", "value": null, "type": "string" },
            { "name": "p_id_persona_reg", "value":  null, "type": "int" },
            { "name": "p_fecha_hora_reg", "value": null, "type": "string" }            
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
  // ======= =======        ADD ALIADO       ======= =======
  // ======= ======= ======= ======= ======= ======= =======
      addAliado(obj: any): Observable<any> {        
        const params = {
            "procedure_name": "sp_aliados",
            "body": {
              "params": [
                { "name": "p_accion", "value": "A1", "type": "string" },
                { "name": "p_id_proy_aliado", "value": null, "type": "int" },
                { "name": "p_id_proyecto", "value": obj.p_id_proyecto, "type": "int" },            
                { "name": "p_id_organizacion", "value": obj.p_id_organizacion, "type": "int" },
                { "name": "p_referente", "value": obj.p_referente, "type": "string" },
                { "name": "p_vinculo", "value": obj.p_vinculo, "type": "string" },
                { "name": "p_idp_convenio", "value": obj.p_idp_convenio, "type": "int" },
                { "name": "p_id_persona_reg", "value": obj.p_id_persona_reg, "type": "int" },
                { "name": "p_fecha", "value": obj.p_fecha, "type": "string"},
                { "name": "p_fecha_hora_reg", "value": null, "type": "string"}           
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
  // ======= =======       EDIT ALIADO       ======= =======
  // ======= ======= ======= ======= ======= ======= =======
      editAliado(obj: any): Observable<any> {
        const params =          
        {
            "procedure_name": "sp_aliados",
            "body": {
              "params": [
                { "name": "p_accion", "value": "M1", "type": "string" },
                { "name": "p_id_proy_aliado", "value": obj.p_id_proy_aliado, "type": "int" },
                { "name": "p_id_proyecto", "value": obj.p_id_proyecto, "type": "int" },
                { "name": "p_id_organizacion", "value": obj.p_id_organizacion, "type": "int" },
                { "name": "p_referente", "value": obj.p_referente, "type": "string" },
                { "name": "p_vinculo", "value": obj.p_vinculo, "type": "string" },
                { "name": "p_idp_convenio", "value": obj.p_idp_convenio, "type": "int" },
                { "name": "p_id_persona_reg", "value": obj.p_id_persona_reg, "type": "int" },
                { "name": "p_fecha", "value": obj.p_fecha, "type": "string" },
                { "name": "p_fecha_hora_reg", "value": obj.p_fecha_hora_reg, "type": "string" }            
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
  // ======= =======      DELETE ALIADO      ======= =======
  // ======= ======= ======= ======= ======= ======= =======
      deleteAliado(idAliado: number): Observable<any> {
        const params = {
            "procedure_name": "sp_aliados",
            "body": {
              "params": [
                { "name": "p_accion", "value": "D1", "type": "string" },
                { "name": "p_id_proy_aliado", "value": idAliado, "type": "int" },
                { "name": "p_id_proyecto", "value": null, "type": "int" },
                { "name": "p_id_organizacion", "value": null, "type": "int" },
                { "name": "p_referente", "value": null, "type": "string" },
                { "name": "p_vinculo", "value": null, "type": "string" },
                { "name": "p_idp_convenio", "value": null, "type": "int" },
                { "name": "p_id_persona_reg", "value": null, "type": "int" },
                { "name": "p_fecha", "value": null, "type": "string" },
                { "name": "p_fecha_hora_reg", "value": null, "type": "string" }
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