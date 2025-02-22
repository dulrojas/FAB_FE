import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import config from './config';

@Injectable({
  providedIn: 'root',
})
export class servInstCategorias{

  private URL = config.URL;
  constructor(private http: HttpClient) {}

  // ======= ======= ======= ======= ======= ======= ========== =======
  //        GET CATEGORIA -- LLAMA A TODA LA TABLA INST_CATEGORIAS 
  // ======= ======= ======= ======= ======= ======= ========== =======
    getAllCategorias(): Observable<any> {
      const params =    {
        "procedure_name": "sp_inst_categorias",
        "body": {
          "params": [
            { "name": "p_accion", "value": "C1", "type": "string" },
            { "name": "p_id_inst_categoria", "value": null, "type": "int" },
            { "name": "p_id_institucion", "value": null, "type": "int" },
            { "name": "p_nombre", "value": null, "type": "string" },
            { "name": "p_idp_tipo_categoria", "value": null, "type": "int" },
            { "name": "p_id_inst_categoria_padre", "value": null, "type": "int" },
            { "name": "p_codigo", "value": null, "type": "string" },
            { "name": "p_nivel", "value": null, "type": "int" },
            { "name": "p_orden", "value": null, "type": "int" },
            { "name": "p_idp_estado", "value": null, "type": "string" }
          ]
        }
      };

      const ip = localStorage.getItem('ip') || '127.0.0.1';
      const headers = new HttpHeaders({
        'ip': ip
      });
  
      return this.http.post<any>(this.URL, params, { headers });
    }
  // ======= ======= ======= ======= ======= ======= ======= ======= =======
  // ======= =======  GET INST_CATEGORIAS POR ID  ======= =======
  // ======= ======= ======= ======= ======= ======= ======= ======= =======
  getCategoriaById(idProy: any): Observable<any> {
    const params =    {
      "procedure_name": "sp_inst_categorias",
      "body": {
        "params": [
          { "name": "p_accion", "value": "C2", "type": "string" },
          { "name": "p_id_inst_categoria", "value": null, "type": "int" },
          { "name": "p_id_institucion", "value": null, "type": "int" },
          { "name": "p_nombre", "value": null, "type": "string" },
          { "name": "p_idp_tipo_categoria", "value": null, "type": "int" },
          { "name": "p_id_inst_categoria_padre", "value": null, "type": "int" },
          { "name": "p_codigo", "value": null, "type": "string" },
          { "name": "p_nivel", "value": idProy, "type": "int" },
          { "name": "p_orden", "value": null, "type": "int" },
          { "name": "p_idp_estado", "value": null, "type": "string" }
        ]
      }
    };

    const ip = localStorage.getItem('ip') || '127.0.0.1';
    const headers = new HttpHeaders({
      'ip': ip
    });
  
    return this.http.post<any>(this.URL, params, { headers });
  }
  // ======= ======= ======= ======= ======= ======= ======= ======= =======
  //        GET INST_CATEGORIAS POR NIVEL Y CATEGORÍA PADRE (C3)
  // ======= ======= ======= ======= ======= ======= ======= ======= =======
  getCategoriasByNivelYPadre(nivel: number, idPadre: number): Observable<any> {
    const params = {
      "procedure_name": "sp_inst_categorias",
      "body": {
        "params": [
          { "name": "p_accion", "value": "C3", "type": "string" },
          { "name": "p_id_inst_categoria", "value": null, "type": "int" },
          { "name": "p_id_institucion", "value": null, "type": "int" },
          { "name": "p_nombre", "value": null, "type": "string" },
          { "name": "p_idp_tipo_categoria", "value": null, "type": "int" },
          { "name": "p_id_inst_categoria_padre", "value": idPadre, "type": "int" },
          { "name": "p_codigo", "value": null, "type": "string" },
          { "name": "p_nivel", "value": nivel, "type": "int" },
          { "name": "p_orden", "value": null, "type": "int" },
          { "name": "p_idp_estado", "value": null, "type": "string" }
        ]
      }
    };

    const ip = localStorage.getItem('ip') || '127.0.0.1';
    const headers = new HttpHeaders({
      'ip': ip
    });
  
    return this.http.post<any>(this.URL, params, { headers });
  }
}