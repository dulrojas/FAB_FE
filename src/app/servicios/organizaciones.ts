import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import config from './config';

@Injectable({
  providedIn: 'root'
})
export class OrganizacionesService {
  private URL = config.URL;

  constructor(private http: HttpClient) {}
// agregar una organizacion 
addOrganizacion(data:any){

  const params =  {
    "procedure_name": "sp_organizaciones",
    "body": {
      "params": [
        { "name": "p_accion", "value": "A1", "type": "string" },
        { "name": "p_id_organizacion", "value": null, "type": "int" },
        { "name": "p_id_proyecto", "value": data.p_id_proyecto, "type": "int" },
        { "name": "p_id_institucion" , "value": data.p_id_institucion, "type": "int"},
        { "name": "p_idp_tipo_organizacion", "value": data.p_idp_tipo_organizacion, "type": "int" },
        { "name": "p_organizacion", "value": data.p_organizacion, "type": "string" }

      ]
    }
  };


  const headers = new HttpHeaders({ 'ip': "127.0.0.1" });
  return this.http.post<any>(this.URL, params, { headers });
}

editOrganizacion(data:any){

  const params =  {
    "procedure_name": "sp_organizaciones",
    "body": {
      "params": [
        { "name": "p_accion", "value": "M1", "type": "string" },
        { "name": "p_id_organizacion", "value": data.p_id_organizacion, "type": "int" },
        { "name": "p_id_proyecto", "value": data.p_id_proyecto, "type": "int" },
        { "name": "p_id_institucion" , "value": data.p_id_institucion, "type": "int"},
        { "name": "p_idp_tipo_organizacion", "value": data.p_idp_tipo_organizacion, "type": "int" },
        { "name": "p_organizacion", "value": data.p_organizacion, "type": "string" }

      ]
    }
  };
  const headers = new HttpHeaders({ 'ip': "127.0.0.1" });
  return this.http.post<any>(this.URL, params, { headers });
}


  // Obtener organización por ID
  getOrganizacionById(idOrganizacion: number): Observable<any> {

    const params =  {
      "procedure_name": "sp_organizaciones",
      "body": {
        "params": [
          { "name": "p_accion", "value": "C2", "type": "string" },
          { "name": "p_id_organizacion", "value": idOrganizacion, "type": "int" },
           { "name": "p_id_proyecto", "value": null, "type": "int" },
          { "name": "p_id_institucion" , "value": null, "type": "int"},
          { "name": "p_idp_tipo_organizacion", "value": null, "type": "int" },
          { "name": "p_organizacion", "value": null, "type": "string" }

        ]
      }
    };
    const headers = new HttpHeaders({ 'ip': "127.0.0.1" });
    return this.http.post<any>(this.URL, params, { headers });
  }

  getOrganizacionByIdProy( idProy: any):Observable<any>{
    const params =  {
      "procedure_name": "sp_organizaciones",
      "body": {
        "params": [
          { "name": "p_accion", "value": "C3", "type": "string" },
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
}