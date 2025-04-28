import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import config from './config';

@Injectable({
  providedIn: 'root'
})
export class ServOrganizacion {

  private URL = config.URL;
  constructor(private http: HttpClient) {}

  // ======= ======= ======= ======= ======= ======= =======
  // ======= =======    GET ORGANIZACIÓN     ======= =======
  // ======= ======= ======= ======= ======= ======= =======
      getOrganizaciones(): Observable<any> {
        const params = {
            "procedure_name": "sp_organizaciones",
            "body": {
              "params": [
                { "name": "p_accion", "value": "C1", "type": "string" },
                { "name": "p_id_organizacion", "value": null, "type": "int" },
                { "name": "p_id_institucion", "value": null, "type": "int" },
                { "name": "p_id_proyecto", "value": null, "type": "int" },                
                { "name": "p_idp_tipo_organizacion", "value": null, "type": "int" },
                { "name": "p_organizacion", "value": null, "type": "string" }
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
  // ======= = GET ORGANIZACIONES POR ID PROYECTO  = =======
  // ======= ======= ======= ======= ======= ======= =======
      getOrganizacionByIdProy( idProy: any):Observable<any>{
        const params =  {
          "procedure_name": "sp_organizaciones",
          "body": {
            "params": [
              { "name": "p_accion", "value": "C2", "type": "string" },
              { "name": "p_id_organizacion", "value": null, "type": "int" },              
              { "name": "p_id_proyecto", "value": idProy, "type": "int" },
              { "name": "p_id_institucion" , "value": null, "type": "int"},              
              { "name": "p_idp_tipo_organizacion", "value": null, "type": "int" },
              { "name": "p_organizacion", "value": null, "type": "string" }
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
  // ======= = GET ORGANIZACIONES POR ID ORGANIZACION  = =======
  // ======= ======= ======= ======= ======= ======= =======
      getOrganizacionById(idProy: any, idTipo: any): Observable<any> {
        const params =  {
          "procedure_name": "sp_organizaciones",
          "body": {
            "params": [
              { "name": "p_accion", "value": "C3", "type": "string" },
              { "name": "p_id_organizacion", "value": null, "type": "int" },
              { "name": "p_id_proyecto", "value": idProy, "type": "int" },  
              { "name": "p_id_institucion" , "value": null, "type": "int"},                          
              { "name": "p_idp_tipo_organizacion", "value": idTipo, "type": "int" },
              { "name": "p_organizacion", "value": null, "type": "string" }
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
  // ======= =======     ADD ORGANIZACION    ======= =======
  // ======= ======= ======= ======= ======= ======= =======
      addOrganizacion(obj:any){
        const params =  {
          "procedure_name": "sp_organizaciones",
          "body": {
            "params": [
              { "name": "p_accion", "value": "A1", "type": "string" },
              { "name": "p_id_organizacion", "value": null, "type": "int" },
              { "name": "p_id_proyecto", "value": obj.p_id_proyecto, "type": "int" },
              { "name": "p_id_institucion" , "value": obj.p_id_institucion, "type": "int"},              
              { "name": "p_idp_tipo_organizacion", "value": obj.p_idp_tipo_organizacion, "type": "int" },
              { "name": "p_organizacion", "value": obj.p_organizacion, "type": "string" }
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
      editOrganizacion(obj:any){
        const params =  {
          "procedure_name": "sp_organizaciones",
          "body": {
            "params": [
              { "name": "p_accion", "value": "M1", "type": "string" },
              { "name": "p_id_organizacion", "value": obj.p_id_organizacion, "type": "int" },
              { "name": "p_id_proyecto", "value": obj.p_id_proyecto, "type": "int" }, 
              { "name": "p_id_institucion" , "value": obj.p_id_institucion, "type": "int"},                           
              { "name": "p_idp_tipo_organizacion", "value": obj.p_idp_tipo_organizacion, "type": "int" },
              { "name": "p_organizacion", "value": obj.p_organizacion, "type": "string" }
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
  // ======= =======   DELETE ORGANIZACION   ======= =======
  // ======= ======= ======= ======= ======= ======= =======
      deleteOrganizacion(idOrganizacion: number): Observable<any> {
        const params =  {
          "procedure_name": "sp_organizaciones",
          "body": {
            "params": [
              { "name": "p_accion", "value": "B1", "type": "string" },
              { "name": "p_id_organizacion", "value": idOrganizacion, "type": "int" },
              { "name": "p_id_proyecto", "value": null, "type": "int" }, 
              { "name": "p_id_institucion" , "value": null, "type": "int"},
              { "name": "p_idp_tipo_organizacion", "value": null, "type": "int" },
              { "name": "p_organizacion", "value": null, "type": "string" }
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