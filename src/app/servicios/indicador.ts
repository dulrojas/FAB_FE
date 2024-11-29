import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import config from './config';

@Injectable({
  providedIn: 'root'
})
export class servIndicador {
  private URL = config.URL;

  constructor(private http: HttpClient) {}

  // ======= ======= ======= Insertar Indicador ======= ======= =======
  insertarIndicador(indicador: any): Observable<any> {
    const params = {
      "procedure_name": "sp_indicador",
      "body": {
        "params": [
          {"name": "p_accion", "value": "A1", "type": "string"},
          {"name": "p_id_proy_indicador", "value": null, "type": "int"},
          {"name": "p_id_proyecto", "value": indicador.id_proyecto, "type": "int"},
          {"name": "p_id_proy_elem_padre", "value": indicador.id_proy_elem_padre, "type": "int"},
          {"name": "p_codigo", "value": indicador.codigo, "type": "string"},
          {"name": "p_indicador", "value": indicador.indicador, "type": "string"},
          {"name": "p_descripcion", "value": indicador.descripcion, "type": "string"},
          {"name": "p_comentario", "value": indicador.comentario, "type": "string"},
          {"name": "p_orden", "value": indicador.orden, "type": "int"},
          {"name": "p_linea_base", "value": indicador.linea_base, "type": "string"},
          {"name": "p_medida", "value": indicador.medida, "type": "string"},
          {"name": "p_meta_final", "value": indicador.meta_final, "type": "string"},
          {"name": "p_medio_verifica", "value": indicador.medio_verifica, "type": "string"},
          {"name": "p_id_estado", "value": indicador.id_estado, "type": "int"},
          {"name": "p_id_inst_categoria_1", "value": indicador.id_inst_categoria_1, "type": "int"},
          {"name": "p_id_inst_categoria_2", "value": indicador.id_inst_categoria_2, "type": "int"},
          {"name": "p_id_inst_categoria_3", "value": indicador.id_inst_categoria_3, "type": "int"}
        ]
      }
    };

    const headers = new HttpHeaders({
      'ip': "127.0.0.1"
    });

    return this.http.post<any>(this.URL, params, { headers });
  }

  // ======= ======= ======= Modificar Indicador ======= ======= =======
  modificarIndicador(indicador: any): Observable<any> {
    const params = {
      "procedure_name": "sp_indicador",
      "body": {
        "params": [
          {"name": "p_accion", "value": "M1", "type": "string"},
          {"name": "p_id_proy_indicador", "value": indicador.id_proy_indicador, "type": "int"},
          {"name": "p_id_proyecto", "value": indicador.id_proyecto, "type": "int"},
          {"name": "p_id_proy_elem_padre", "value": indicador.id_proy_elem_padre, "type": "int"},
          {"name": "p_codigo", "value": indicador.codigo, "type": "string"},
          {"name": "p_indicador", "value": indicador.indicador, "type": "string"},
          {"name": "p_descripcion", "value": indicador.descripcion, "type": "string"},
          {"name": "p_comentario", "value": indicador.comentario, "type": "string"},
          {"name": "p_orden", "value": indicador.orden, "type": "int"},
          {"name": "p_linea_base", "value": indicador.linea_base, "type": "string"},
          {"name": "p_medida", "value": indicador.medida, "type": "string"},
          {"name": "p_meta_final", "value": indicador.meta_final, "type": "string"},
          {"name": "p_medio_verifica", "value": indicador.medio_verifica, "type": "string"},
          {"name": "p_id_estado", "value": indicador.id_estado, "type": "int"},
          {"name": "p_id_inst_categoria_1", "value": indicador.id_inst_categoria_1, "type": "int"},
          {"name": "p_id_inst_categoria_2", "value": indicador.id_inst_categoria_2, "type": "int"},
          {"name": "p_id_inst_categoria_3", "value": indicador.id_inst_categoria_3, "type": "int"}
        ]
      }
    };

    const headers = new HttpHeaders({
      'ip': "127.0.0.1"
    });

    return this.http.post<any>(this.URL, params, { headers });
  }

  // ======= ======= ======= Obtener Todos los Indicadores ======= ======= =======
  getAllIndicadores(): Observable<any> {
    const params = {
      "procedure_name": "sp_indicador",
      "body": {
        "params": [
          {"name": "p_accion", "value": "C1", "type": "string"}
        ]
      }
    };

    const headers = new HttpHeaders({
      'ip': "127.0.0.1"
    });

    return this.http.post<any>(this.URL, params, { headers });
  }

  // ======= ======= ======= Obtener Indicadores por Proyecto ======= ======= =======
  getIndicadoresByProyecto(idProyecto: number): Observable<any> {
    const params = {
      "procedure_name": "sp_indicador",
      "body": {
        "params": [
          {"name": "p_accion", "value": "C2", "type": "string"},
          {"name": "p_id_proyecto", "value": idProyecto, "type": "int"}
        ]
      }
    };

    const headers = new HttpHeaders({
      'ip': "127.0.0.1"
    });

    return this.http.post<any>(this.URL, params, { headers });
  }

  // ======= ======= ======= Obtener Indicador por ID ======= ======= =======
  getIndicadorById(idIndicador: number): Observable<any> {
    const params = {
      "procedure_name": "sp_indicador",
      "body": {
        "params": [
          {"name": "p_accion", "value": "C3", "type": "string"},
          {"name": "p_id_proy_indicador", "value": idIndicador, "type": "int"}
        ]
      }
    };

    const headers = new HttpHeaders({
      'ip': "127.0.0.1"
    });

    return this.http.post<any>(this.URL, params, { headers });
  }
  // ======= ======= ======= Obtener Indicador por LiBase ======= ======= =======
  getIndicadorByLiBase(linea_base: string): Observable<any> {
    const params = {
      "procedure_name": "sp_indicador",
      "body": {
        "params": [
          {"name": "p_accion", "value": "C3", "type": "string"},
          {"name": "p_linea_base", "value":linea_base , "type": "string"}
        ]
      }
    };

    const headers = new HttpHeaders({
      'ip': "127.0.0.1"
    });

    return this.http.post<any>(this.URL, params, { headers });
  }
}