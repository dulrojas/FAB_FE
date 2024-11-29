import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import config from './config';

@Injectable({
  providedIn: 'root',
})
export class InstCategoriasService {
  private URL = config.URL;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const ip = sessionStorage.getItem('ip') || '127.0.0.1';
    return new HttpHeaders({
      ip,
    });
  }

  // ======= A1: Agregar nueva categoría =======
  addCategoria(categoria: any): Observable<any> {
    const params =     {
      "procedure_name": "sp_inst_categorias",
      "body": {
        "params": [
          { "name": "p_accion", "value": "A1", "type": "string" },
          { "name": "p_id_inst_categoria", "value": null, "type": "int" },
          { "name": "p_id_institucion", "value": categoria.id_institucion, "type": "int" },
          { "name": "p_nombre", "value": categoria.nombre, "type": "string" },
          { "name": "p_idp_tipo_categoria", "value": categoria.idp_tipo_categoria, "type": "int" },
          { "name": "p_id_inst_categoria_padre", "value": categoria.id_inst_categoria_padre, "type": "int" },
          { "name": "p_codigo", "value": categoria.codigo, "type": "string" },
          { "name": "p_nivel", "value": categoria.nivel, "type": "int" },
          { "name": "p_orden", "value": categoria.orden, "type": "int" },
          { "name": "p_idp_estado", "value": categoria.idp_estado, "type": "string" }
        ]
      }
    };

    return this.http.post<any>(this.URL, params, { headers: this.getHeaders() });
  }

  // ======= M1: Modificar categoría existente =======
  updateCategoria(categoria: any): Observable<any> {
    const params =    {
      "procedure_name": "sp_inst_categorias",
      "body": {
        "params": [
          { "name": "p_accion", "value": "M1", "type": "string" },
          { "name": "p_id_inst_categoria", "value": categoria.id_inst_categoria, "type": "int" },
          { "name": "p_id_institucion", "value": categoria.id_institucion, "type": "int" },
          { "name": "p_nombre", "value": categoria.nombre, "type": "string" },
          { "name": "p_idp_tipo_categoria", "value": categoria.idp_tipo_categoria, "type": "int" },
          { "name": "p_id_inst_categoria_padre", "value": categoria.id_inst_categoria_padre, "type": "int" },
          { "name": "p_codigo", "value": categoria.codigo, "type": "string" },
          { "name": "p_nivel", "value": categoria.nivel, "type": "int" },
          { "name": "p_orden", "value": categoria.orden, "type": "int" },
          { "name": "p_idp_estado", "value": categoria.idp_estado, "type": "string" }
        ]
      }
    };

    return this.http.post<any>(this.URL, params, { headers: this.getHeaders() });
  }

  // ======= C1: Consultar todas las categorías =======
  getAllCategorias(): Observable<any> {
    const params =    {
      "procedure_name": "sp_inst_categorias",
      "body": {
        "params": [
          { "name": "p_accion", "value": "C1", "type": "string" }
        ]
      }
    };

    return this.http.post<any>(this.URL, params, { headers: this.getHeaders() });
  }

  // ======= C2: Consultar una categoría específica =======
  getCategoriaById(idCategoria: number): Observable<any> {
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
          { "name": "p_nivel", "value": idCategoria, "type": "int" },
          { "name": "p_orden", "value": null, "type": "int" },
          { "name": "p_idp_estado", "value": null, "type": "string" }
        ]
      }
    };

    return this.http.post<any>(this.URL, params, { headers: this.getHeaders() });
  }

  // ======= D1: Eliminar una categoría =======
  deleteCategoria(idCategoria: number): Observable<any> {
    const params ={
        "procedure_name": "sp_inst_categorias",
        "body": {
          "params": [
            { "name": "p_accion", "value": "D1", "type": "string" },
            { "name": "p_id_inst_categoria", "value": idCategoria, "type": "int" }
          ]
        }
      };

    return this.http.post<any>(this.URL, params, { headers: this.getHeaders() });
  }
}