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

  // ======= ======= ======= ======= ======= ======= =======
  // GET INDICADOR -- LLAMA A TODA LA TABLA PROY_INDICADOR 
  // ======= ======= ======= ======= ======= ======= =======
      getIndicador(): Observable<any> {
        const params = {
          "procedure_name": "sp_indicador",
          "body": {
            "params": [
              {"name": "p_accion", "value": "C1", "type": "string"},
              {"name": "p_id_proy_indicador", "value": null, "type": "int"},
              {"name": "p_id_proyecto", "value": null, "type": "int"},
              {"name": "p_id_proy_elem_padre", "value": null, "type": "int"},
              {"name": "p_codigo", "value": null, "type": "string"},
              {"name": "p_indicador", "value": null, "type": "string"},
              {"name": "p_descripcion", "value": null, "type": "string"},
              {"name": "p_comentario", "value": null, "type": "string"},
              {"name": "p_orden", "value": null, "type": "int"},
              {"name": "p_linea_base", "value": null, "type": "string"},
              {"name": "p_medida", "value": null, "type": "string"},
              {"name": "p_meta_final", "value": null, "type": "string"},
              {"name": "p_medio_verifica", "value": null, "type": "string"},
              {"name": "p_id_estado", "value": null, "type": "int"},
              {"name": "p_id_inst_categoria_1", "value": null, "type": "int"},
              {"name": "p_id_inst_categoria_2", "value": null, "type": "int"},
              {"name": "p_id_inst_categoria_3", "value": null, "type": "int"}
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
  // ======= =======  GET INDICADOR POR ID  ======= =======
  // ======= ======= ======= ======= ======= ======= =======
      getIndicadorByIdProy(idProy: any): Observable<any> {
        const params = {
          "procedure_name": "sp_indicador",
          "body": {
            "params": [
              {"name": "p_accion", "value": "C2", "type": "string"},
              {"name": "p_id_proy_indicador", "value": null, "type": "int"},
              {"name": "p_id_proyecto", "value": idProy, "type": "int"},
              {"name": "p_id_proy_elem_padre", "value": null, "type": "int"},
              {"name": "p_codigo", "value": null, "type": "string"},
              {"name": "p_indicador", "value": null, "type": "string"},
              {"name": "p_descripcion", "value": null, "type": "string"},
              {"name": "p_comentario", "value": null, "type": "string"},
              {"name": "p_orden", "value": null, "type": "int"},
              {"name": "p_linea_base", "value": null, "type": "string"},
              {"name": "p_medida", "value": null, "type": "string"},
              {"name": "p_meta_final", "value": null, "type": "string"},
              {"name": "p_medio_verifica", "value": null, "type": "string"},
              {"name": "p_id_estado", "value": null, "type": "int"},
              {"name": "p_id_inst_categoria_1", "value": null, "type": "int"},
              {"name": "p_id_inst_categoria_2", "value": null, "type": "int"},
              {"name": "p_id_inst_categoria_3", "value": null, "type": "int"}
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
  // ======= ======= ======= ADD INDICADOR ======= ======= =======
  // ======= ======= ======= ======= ======= ======= =======
      addIndicador(obj: any): Observable<any> {
        const params = {
          "procedure_name": "sp_indicador",
          "body": {
            "params": [
              {"name": "p_accion", "value": "A1", "type": "string"},
              {"name": "p_id_proy_indicador", "value": null, "type": "int"},
              {"name": "p_id_proyecto", "value": obj.id_proyecto, "type": "int"},
              {"name": "p_id_proy_elem_padre", "value": obj.id_proy_elem_padre, "type": "int"},
              {"name": "p_codigo", "value": obj.codigo, "type": "string"},
              {"name": "p_indicador", "value": obj.indicador, "type": "string"},
              {"name": "p_descripcion", "value": obj.descripcion, "type": "string"},
              {"name": "p_comentario", "value": obj.comentario, "type": "string"},
              {"name": "p_orden", "value": obj.orden, "type": "int"},
              {"name": "p_linea_base", "value": obj.linea_base, "type": "string"},
              {"name": "p_medida", "value": obj.medida, "type": "string"},
              {"name": "p_meta_final", "value": obj.meta_final, "type": "string"},
              {"name": "p_medio_verifica", "value": obj.medio_verifica, "type": "string"},
              {"name": "p_id_estado", "value": obj.id_estado, "type": "int"},
              {"name": "p_id_inst_categoria_1", "value": obj.id_inst_categoria_1, "type": "int"},
              {"name": "p_id_inst_categoria_2", "value": obj.id_inst_categoria_2, "type": "int"},
              {"name": "p_id_inst_categoria_3", "value": obj.id_inst_categoria_3, "type": "int"}
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
  // ======= =======  EDIT INDICADOR  ======= =======
  // ======= ======= ======= ======= ======= ======= =======
      editIndicador(obj: any): Observable<any> {
        const params = {
          "procedure_name": "sp_indicador",
          "body": {
            "params": [
              {"name": "p_accion", "value": "M1", "type": "string"},
              {"name": "p_id_proy_indicador", "value": obj.id_proy_indicador, "type": "int"},
              {"name": "p_id_proyecto", "value": obj.id_proyecto, "type": "int"},
              {"name": "p_id_proy_elem_padre", "value": obj.id_proy_elem_padre, "type": "int"},
              {"name": "p_codigo", "value": obj.codigo, "type": "string"},
              {"name": "p_indicador", "value": obj.indicador, "type": "string"},
              {"name": "p_descripcion", "value": obj.descripcion, "type": "string"},
              {"name": "p_comentario", "value": obj.comentario, "type": "string"},
              {"name": "p_orden", "value": obj.orden, "type": "int"},
              {"name": "p_linea_base", "value": obj.linea_base, "type": "string"},
              {"name": "p_medida", "value": obj.medida, "type": "string"},
              {"name": "p_meta_final", "value": obj.meta_final, "type": "string"},
              {"name": "p_medio_verifica", "value": obj.medio_verifica, "type": "string"},
              {"name": "p_id_estado", "value": obj.id_estado, "type": "int"},
              {"name": "p_id_inst_categoria_1", "value": obj.id_inst_categoria_1, "type": "int"},
              {"name": "p_id_inst_categoria_2", "value": obj.id_inst_categoria_2, "type": "int"},
              {"name": "p_id_inst_categoria_3", "value": obj.id_inst_categoria_3, "type": "int"}              
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
  // ======= =======  DELETE INDICADOR  ======= =======
  // ======= ======= ======= ======= ======= ======= =======
      deleteIndicador(id: any): Observable<any> {
        const params = {
          "procedure_name": "sp_indicador",
          "body": {
            "params": [
              {"name": "p_accion", "value": "B1", "type": "string"},
              {"name": "p_id_proy_indicador", "value": id, "type": "int"},
              {"name": "p_id_proyecto", "value": null, "type": "int"},
              {"name": "p_id_proy_elem_padre", "value": null, "type": "int"},
              {"name": "p_codigo", "value": null, "type": "string"},
              {"name": "p_indicador", "value": null, "type": "string"},
              {"name": "p_descripcion", "value": null, "type": "string"},
              {"name": "p_comentario", "value": null, "type": "string"},
              {"name": "p_orden", "value": null, "type": "int"},
              {"name": "p_linea_base", "value": null, "type": "string"},
              {"name": "p_medida", "value": null, "type": "string"},
              {"name": "p_meta_final", "value": null, "type": "string"},
              {"name": "p_medio_verifica", "value": null, "type": "string"},
              {"name": "p_id_estado", "value": null, "type": "int"},
              {"name": "p_id_inst_categoria_1", "value": null, "type": "int"},
              {"name": "p_id_inst_categoria_2", "value": null, "type": "int"},
              {"name": "p_id_inst_categoria_3", "value": null, "type": "int"}
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