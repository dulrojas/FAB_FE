import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import config from './config';

@Injectable({
  providedIn: 'root'
})
export class ElementosService {
  private URL = config.URL;

  constructor(private http: HttpClient) {}
// Añadir elementos
addElemento(elemento: any): Observable<any> {
  const params =  {
      "procedure_name": "sp_proy_elementos",
      "body": {
        "params": [        
          { "name": "p_accion", "value": "A1", "type": "string" },
          { "name": "p_id_proy_elemento", "value": null, "type": "int" },
          { "name": "p_id_proyecto", "value": elemento.id_proyecto || null, "type": "int" },
          { "name": "p_id_meto_elemento", "value": elemento.id_meto_elemento || null, "type": "int" },
          { "name": "p_id_proy_elem_padre", "value": elemento.id_proy_elem_padre || null, "type": "int" },
          { "name": "p_codigo", "value": elemento.codigo || null, "type": "string" },
          { "name": "p_elemento", "value": elemento.elemento || null, "type": "string" },
          { "name": "p_descripcion", "value": elemento.descripcion || null, "type": "string" },
          { "name": "p_comentario", "value": elemento.comentario || null, "type": "string" },
          { "name": "p_nivel", "value": elemento.nivel || null, "type": "int" },
          { "name": "p_orden", "value": elemento.orden || null, "type": "int" },
          { "name": "p_idp_estado", "value": elemento.idp_estado || null, "type": "int" },
          { "name": "p_peso", "value": elemento.peso || null, "type": "int" },
          { "name": "p_id_persona_reg", "value":  elemento.p_id_persona_reg, "type": "int" }
        ]
      }
    };
  
    const headers = new HttpHeaders({
      'ip': "127.0.0.1"
    });
  
    return this.http.post<any>(this.URL, params, { headers });
  }

  // editar elementos
  editElemento(elemento: any): Observable<any> {
    const params =  {
      "procedure_name": "sp_proy_elementos",
      "body": {
        "params": [
          { "name": "p_accion", "value": "M1", "type": "string" },
          { "name": "p_id_proy_elemento", "value": elemento.id_proy_elemento || null, "type": "int" },
          { "name": "p_id_proyecto", "value": elemento.id_proyecto|| null, "type": "int" },
          { "name": "p_id_meto_elemento", "value": elemento.id_meto_elemento || null, "type": "int" },
          { "name": "p_id_proy_elem_padre", "value": elemento.id_proy_elem_padre || null, "type": "int" },
          { "name": "p_codigo", "value": elemento.codigo || null, "type": "string" },
          { "name": "p_elemento", "value": elemento.elemento || null, "type": "string" },
          { "name": "p_descripcion", "value": elemento.descripcion || null, "type": "string" },
          { "name": "p_comentario", "value": elemento.comentario || null, "type": "string" },
          { "name": "p_nivel", "value": elemento.nivel || null, "type": "int" },
          { "name": "p_orden", "value": elemento.orden || null, "type": "int" },
          { "name": "p_idp_estado", "value": elemento.idp_estado || null, "type": "int" },
          { "name": "p_peso", "value": elemento.peso || null, "type": "int" },
          { "name": "p_id_persona_reg", "value":  elemento.p_id_persona_reg, "type": "int" }
        ]
      }
    };
    const headers = new HttpHeaders({
      'ip': "127.0.0.1"
    });
    return this.http.post<any>(this.URL, params, { headers });
  }
  // ======= ======= ======= Obtener Todos los Meto Elementos ======= ======= =======
  getAllElementos(): Observable<any> {
    const params = {
        "procedure_name": "sp_proy_elementos",
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
            { "name": "p_peso", "value": null, "type": "int" },
            { "name": "p_id_persona_reg", "value": null, "type": "int" }
          ]
        }
      };
    const headers = new HttpHeaders({
      'ip': "127.0.0.1"
    });
    return this.http.post<any>(this.URL, params, { headers });
  };

  // ======= ======= ======= Obtener  Elementos por Metodología ======= ======= =======
  getElementosByProyecto(idProyecto: number): Observable<any> {
    const params = {
      "procedure_name": "sp_proy_elementos",
      "body": {
        "params": [
          { "name": "p_accion", "value": "C2", "type": "string" },
          { "name": "p_id_proy_elemento", "value": null, "type": "int" },
          { "name": "p_id_proyecto", "value": idProyecto, "type": "int" },
          { "name": "p_id_meto_elemento", "value": null, "type": "int" },
          { "name": "p_id_proy_elem_padre", "value": null, "type": "int" },
          { "name": "p_codigo", "value": null, "type": "string" },
          { "name": "p_elemento", "value": null, "type": "string" },
          { "name": "p_descripcion", "value": null, "type": "string" },
          { "name": "p_comentario", "value": null, "type": "string" },
          { "name": "p_nivel", "value": null, "type": "int" },
          { "name": "p_orden", "value": null, "type": "int" },
          { "name": "p_idp_estado", "value": null, "type": "int" },
          { "name": "p_peso", "value": null, "type": "int" },
          { "name": "p_id_persona_reg", "value": null, "type": "int" }
        ]
      }
    };
    const headers = new HttpHeaders({
      'ip': "127.0.0.1"
    });
    return this.http.post<any>(this.URL, params, { headers });
  }

  // ======= ======= ======= Obtener Meto Elemento por ID ======= ======= =======
  getElementoById(idMetoElemento: number): Observable<any> {
    const params = {
      "procedure_name": "sp_proy_elementos",
      "body": {
        "params": [
          {"name": "p_accion", "value": "C3", "type": "string"},
          {"name": "p_id_meto_elemento", "value": idMetoElemento, "type": "int"},
          {"name": "p_id_metodologia", "value": null, "type": "int"},
          {"name": "p_nivel", "value": null, "type": "int"},
          {"name": "p_sigla", "value": null, "type": "string"},
          {"name": "p_color", "value": null, "type": "string"}
        ]
      }
    };
    const headers = new HttpHeaders({
      'ip': "127.0.0.1"
    });
    return this.http.post<any>(this.URL, params, { headers });
  }

 // ======= ======= ======= ======= ======= ======= =======
  // ======= ======= ======= GET ELEMENTS WITH METOELE BY PROY ======= ======= =======
  getElementosMetoEleByIdProy(idProy: number): Observable<any> {
    const params = {
      "procedure_name": "sp_proy_elementos",
      "body": {
        "params": [
          { "name": "p_accion", "value": "C5", "type": "string" },
          { "name": "p_id_proy_elemento", "value": null, "type": "int" },
          { "name": "p_id_proyecto", "value": idProy, "type": "int" },
          { "name": "p_id_meto_elemento", "value": null, "type": "int" },
          { "name": "p_id_proy_elem_padre", "value": null, "type": "int" },
          { "name": "p_codigo", "value": null, "type": "string" },
          { "name": "p_elemento", "value": null, "type": "string" },
          { "name": "p_descripcion", "value": null, "type": "string" },
          { "name": "p_comentario", "value": null, "type": "string" },
          { "name": "p_nivel", "value": null, "type": "int" },
          { "name": "p_orden", "value": null, "type": "int" },
          { "name": "p_idp_estado", "value": null, "type": "int" },
          { "name": "p_peso", "value": null, "type": "int" },
          { "name": "p_id_persona_reg", "value": null, "type": "int" }
        ]
      }
    };

    const ip = localStorage.getItem('ip') || '127.0.0.1';
    const headers = new HttpHeaders({
      'ip': ip
    });
    return this.http.post<any>(this.URL, params, { headers });
  }

 // ======= ======= ======= ======= ======= ======= =======
  // ======= ======= ======= GET ELEMENTS WITH METOELE BY PROY ======= ======= =======
  getElementosMetoEleNivel3ByIdProy(idProy: number): Observable<any> {
    const params = {
      "procedure_name": "sp_proy_elementos",
      "body": {
        "params": [
          { "name": "p_accion", "value": "C6", "type": "string" },
          { "name": "p_id_proy_elemento", "value": null, "type": "int" },
          { "name": "p_id_proyecto", "value": idProy, "type": "int" },
          { "name": "p_id_meto_elemento", "value": null, "type": "int" },
          { "name": "p_id_proy_elem_padre", "value": null, "type": "int" },
          { "name": "p_codigo", "value": null, "type": "string" },
          { "name": "p_elemento", "value": null, "type": "string" },
          { "name": "p_descripcion", "value": null, "type": "string" },
          { "name": "p_comentario", "value": null, "type": "string" },
          { "name": "p_nivel", "value": null, "type": "int" },
          { "name": "p_orden", "value": null, "type": "int" },
          { "name": "p_idp_estado", "value": null, "type": "int" },
          { "name": "p_peso", "value": null, "type": "int" },
          { "name": "p_id_persona_reg", "value": null, "type": "int" }
        ]
      }
    };

    const ip = localStorage.getItem('ip') || '127.0.0.1';
    const headers = new HttpHeaders({
      'ip': ip
    });
    return this.http.post<any>(this.URL, params, { headers });
  }

 // ======= ======= ======= ======= ======= ======= =======
  // ======= =======  DELETE ELEMENTO  ======= =======
  deleteElemento(id: any, idPersonaReg: number): Observable<any> {
    const params = {
      "procedure_name": "sp_proy_elementos",
      "body": {
        "params": [
          { "name": "p_accion", "value": "D1", "type": "string" },
          { "name": "p_id_proy_elemento", "value": id, "type": "int" },
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
          { "name": "p_peso", "value": null, "type": "int" },
          { "name": "p_id_persona_reg", "value": idPersonaReg, "type": "int" }
        ]
      }
    };

    const ip = localStorage.getItem('ip') || '127.0.0.1';
    const headers = new HttpHeaders({
      'ip': ip
    });
    return this.http.post<any>(this.URL, params, { headers });
  }
  // ======= ======= ======= ======= ======= ======= =======
}