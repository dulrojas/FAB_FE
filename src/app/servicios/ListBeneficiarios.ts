import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import config from './config';

@Injectable({
  providedIn: 'root'
})
export class servListBenef{
  private URL = config.URL;

  constructor(private http: HttpClient) {}
  // ======= ======= ======= ======= ======= ======= =======
  // ======= =======GET LISTA DE BENEFICIARIOS ======= =======
  // ======= ======= ======= ======= ======= ======= =======
  getListBene(): Observable<any> {
    const params =  {
        "procedure_name": "sp_proy_bene_lista",
        "body": {
            "params": [
                {"name": "p_accion","value": "C1","type": "string"},
                {"name": "p_id_proy_bene_lista","value": null,"type": "int"},
                {"name": "p_id_proy_beneficiario","value": null,"type": "int"},
                {"name": "comunidad","value": null,"type": "string"},
                {"name": "num_doc_identidad","value": null,"type": "string"},
                {"name": "nombre","value": null,"type": "string"},
                {"name": "idp_rango_edad","value": null,"type": "int"},
                {"name": "es_hombre","value": null,"type": "boolean"}
            ]
        }
    };

    const ip = sessionStorage.getItem('ip') || '';
    const headers = new HttpHeaders({
      'ip': "127.0.0.1"
    });

    return this.http.post<any>(this.URL, params, { headers });
  }
  // ======= ======= ======= ======= ======= ======= ======= ======= ======= =======
  // ======= ======= ======= GET LISTA DE BENEFICIARIOS POR ID ======= ======= =======
  // ======= ======= ======= ======= ======= ======= ======= ======= ======= =======
  getListBeneByIdProy(idProy: any): Observable<any> {
    const params =  {
        "procedure_name": "sp_proy_bene_lista",
        "body": {
            "params": [
                {"name": "p_accion","value": "C2","type": "string"},
                {"name": "p_id_proy_bene_lista","value": null,"type": "int"},
                {"name": "p_id_proy_beneficiario","value":idProy,"type": "int"},
                {"name": "comunidad","value": null,"type": "string"},
                {"name": "num_doc_identidad","value": null,"type": "string"},
                {"name": "nombre","value": null,"type": "string"},
                {"name": "idp_rango_edad","value": null,"type": "int"},
                {"name": "es_hombre","value": null,"type": "boolean"}
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
  // ======= ======= ======= ADD LISTA DE BENEFICIARIOS ======= ======= =======
  // ======= ======= ======= ======= ======= ======= =======
  addListBene(obj: any): Observable<any> {
    const params = {
      "procedure_name": "sp_proy_bene_lista",
      "body": {
        "params": [
          { "name": "p_accion", "value": "A1", "type": "string" },
          { "name": "p_id_proy_bene_lista", "value": null, "type": "int" },
          { "name": "p_id_proy_beneficiario", "value": obj.id_proy_beneficiario, "type": "int" },
          { "name": "p_comunidad", "value": obj.comunidad, "type": "string" },
          { "name": "p_num_doc_identidad", "value": obj.num_doc_identidad, "type": "string" },
          { "name": "p_nombre", "value": obj.nombre, "type": "string" },
          { "name": "p_idp_rango_edad", "value": obj.idp_rango_edad, "type": "int" },
          { "name": "p_es_hombre", "value": obj.es_hombre, "type": "boolean" }
        ]
      }
    };
    const ip = sessionStorage.getItem('ip') || '';
    const headers = new HttpHeaders({
      'ip': "127.0.0.1"
    });

  return this.http.post<any>(this.URL, params, { headers });
  }

  // ======= ======= ======= ======= ======= ======= ======= ======= ======= =======
  // ======= ======= ======= EDIT LISTA DE BENEFICIARIOS ======= ======= =======
  // ======= ======= ======= ======= ======= ======= ======= ======= ======= =======
  editListBene(obj: any): Observable<any> {
      const params = {
        "procedure_name": "sp_proy_bene_lista",
        "body": {
          "params": [
            { "name": "p_accion", "value": "M1", "type": "string" },
            { "name": "p_id_proy_bene_lista", "value": obj.id_proy_bene_lista, "type": "int" },
            { "name": "p_id_proy_beneficiario", "value": obj.id_proy_beneficiario, "type": "int" },
            { "name": "p_comunidad", "value": obj.comunidad, "type": "string" },
            { "name": "p_num_doc_identidad", "value": obj.num_doc_identidad, "type": "string" },
            { "name": "p_nombre", "value": obj.nombre, "type": "string" },
            { "name": "p_idp_rango_edad", "value": obj.idp_rango_edad, "type": "int" },
            { "name": "p_es_hombre", "value": obj.es_hombre, "type": "boolean" }
          ]
        }
      };
      const ip = sessionStorage.getItem('ip') || '';
      const headers = new HttpHeaders({
        'ip': "127.0.0.1"
      });
    
      return this.http.post<any>(this.URL, params, { headers });
    }

  // ======= ======= ======= ======= ======= ======= ======= ======= ======= =======
  // ======= ======= ======= DELETE LISTA DE BENEFICIARIOS ======= ======= =======
  // ======= ======= ======= ======= ======= ======= ======= ======= ======= =======
  deleteListBene(idProyBeneLista: number): Observable<any> {
    const params = {
      "procedure_name": "sp_proy_bene_lista",
      "body": {
        "params": [
          { "name": "p_accion", "value": "D1", "type": "string" },
          { "name": "p_id_proy_bene_lista", "value": idProyBeneLista, "type": "int" },
          { "name": "p_id_proy_beneficiario", "value": null, "type": "int" },
          { "name": "p_comunidad", "value": null, "type": "string" },
          { "name": "p_num_doc_identidad", "value": null, "type": "string" },
          { "name": "p_nombre", "value": null, "type": "string" },
          { "name": "p_idp_rango_edad", "value": null, "type": "int" },
          { "name": "p_es_hombre", "value": null, "type": "boolean" }
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