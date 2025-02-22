import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import config from './config';

@Injectable({
  providedIn: 'root'
})
export class servIndicadorAvance {
  
    private URL = config.URL;
    constructor(private http: HttpClient) {}

  // ======= ======= ======= ======= ======= ======= =======
  // GET INDICADOR -- LLAMA A TODA LA TABLA PROY_INDICADOR_AVANCE 
  // ======= ======= ======= ======= ======= ======= =======

  getIndicadoresAvance(): Observable<any> {
    const params = {
      "procedure_name": "sp_indicador_avance",
      "body": {
        "params": [
          { "name": "p_accion", "value": "C1", "type": "string" },
          { "name": "p_id_proy_indica_avance", "value": null, "type": "int" },
          { "name": "p_id_proy_indicador", "value": null, "type": "int" },
          { "name": "p_fecha_reportar", "value": null, "type": "string" },
          { "name": "p_valor_esperado", "value": null, "type": "numeric" },
          { "name": "p_fecha_hora_reporte", "value": null, "type": "string" },
          { "name": "p_id_persona_reporte", "value": null, "type": "int" },
          { "name": "p_valor_reportado", "value": null, "type": "numeric" },
          { "name": "p_comentarios", "value": null, "type": "string" },
          { "name": "p_ruta_evidencia", "value": null, "type": "string" }
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
  // ======= =======  GET INDICADOR_AVANCE POR ID_INDICADOR ======= =======
  // ======= ======= ======= ======= ======= ======= =======
  getIndicadoresAvanceById(idProyIn: any): Observable<any> {
    const params = {
      "procedure_name": "sp_indicador_avance",
      "body": {
        "params": [
          { "name": "p_accion", "value": "C2", "type": "string" },
          { "name": "p_id_proy_indica_avance", "value": null, "type": "int" },
          { "name": "p_id_proy_indicador", "value": idProyIn, "type": "int" },
          { "name": "p_fecha_reportar", "value": null, "type": "string" },
          { "name": "p_valor_esperado", "value": null, "type": "numeric" },
          { "name": "p_fecha_hora_reporte", "value": null, "type": "string" },
          { "name": "p_id_persona_reporte", "value": null, "type": "int" },
          { "name": "p_valor_reportado", "value": null, "type": "numeric" },
          { "name": "p_comentarios", "value": null, "type": "string" },
          { "name": "p_ruta_evidencia", "value": null, "type": "string" }
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
  // ======= ======= ======= ADD INDICADOR_AVANCE ======= ======= =======
  // ======= ======= ======= ======= ======= ======= =======
  addIndicadorAvance(obj: any): Observable<any> {
    const params = {
      "procedure_name": "sp_indicador_avance",
      "body": {
        "params": [
          { "name": "p_accion", "value": "A1", "type": "string" },
          { "name": "p_id_proy_indica_avance", "value": null, "type": "int" },
          { "name": "p_id_proy_indicador", "value": obj.p_id_proy_indicador, "type": "int" },
          { "name": "p_fecha_reportar", "value": obj.p_fecha_reportar, "type": "string" },
          { "name": "p_valor_esperado", "value": obj.p_valor_esperado, "type": "string" },
          { "name": "p_fecha_hora_reporte", "value": obj.p_fecha_hora_reporte, "type": "string" },
          { "name": "p_id_persona_reporte", "value": obj.p_id_persona_reporte, "type": "int" },
          { "name": "p_valor_reportado", "value": obj.p_valor_reportado, "type": "string" },
          { "name": "p_comentarios", "value": obj.p_comentarios, "type": "string" },
          { "name": "p_ruta_evidencia", "value": obj.p_ruta_evidencia, "type": "string" }
        ]
      }
    };
  
    const headers = new HttpHeaders({
      'ip': localStorage.getItem('ip') || '127.0.0.1'
    });
  
    return this.http.post<any>(this.URL, params, { headers });
  }

  // ======= ======= ======= ======= ======= ======= =======
  // ======= =======  EDIT INDICADOR_AVANCE  ======= =======
  // ======= ======= ======= ======= ======= ======= =======
  editIndicadorAvance(obj: any): Observable<any> {
    const params = {
      "procedure_name": "sp_indicador_avance",
      "body": {
        "params": [
          { "name": "p_accion", "value": "M1", "type": "string" },
          { "name": "p_id_proy_indica_avance", "value": obj.p_id_proy_indicador_avance, "type": "int" },
          { "name": "p_id_proy_indicador", "value": obj.p_id_proy_indicador, "type": "int" },
          { "name": "p_fecha_reportar", "value": obj.p_fecha_reportar, "type": "string" },
          { "name": "p_valor_esperado", "value": obj.p_valor_esperado, "type": "string" },
          { "name": "p_fecha_hora_reporte", "value": obj.p_fecha_hora_reporte, "type": "string" },
          { "name": "p_id_persona_reporte", "value": obj.p_id_persona_reporte, "type": "int" },
          { "name": "p_valor_reportado", "value": obj.p_valor_reportado, "type": "string" },
          { "name": "p_comentarios", "value": obj.p_comentarios, "type": "string" },
          { "name": "p_ruta_evidencia", "value": obj.p_ruta_evidencia, "type": "string" }
        ]
      }
    };
    const ip = localStorage.getItem('ip') || '';
        const headers = new HttpHeaders({
          'ip': "127.0.0.1"
        });
      
        return this.http.post<any>(this.URL, params, { headers });
  }

  // ======= ======= ======= ======= ======= ======= =======
  // ======= =======  DELETE INDICADOR_AVANCE  ======= =======
  // ======= ======= ======= ======= ======= ======= =======
  deleteIndicadorAvance(idAvance: number): Observable<any> {
    const params = {
      "procedure_name": "sp_indicador_avance",
      "body": {
        "params": [
          { "name": "p_accion", "value": "D1", "type": "string" },
          { "name": "p_id_proy_indica_avance", "value": idAvance, "type": "int" },
          { "name": "p_id_proy_indicador", "value": null, "type": "int" },
          { "name": "p_fecha_reportar", "value": null, "type": "string" },
          { "name": "p_valor_esperado", "value": null, "type": "numeric" },
          { "name": "p_fecha_hora_reporte", "value": null, "type": "string" },
          { "name": "p_id_persona_reporte", "value": null, "type": "int" },
          { "name": "p_valor_reportado", "value": null, "type": "numeric" },
          { "name": "p_comentarios", "value": null, "type": "string" },
          { "name": "p_ruta_evidencia", "value": null, "type": "string" }
        ]
      }
    };
    const ip = localStorage.getItem('ip') || '';
        const headers = new HttpHeaders({
          'ip': "127.0.0.1"
        });

        return this.http.post<any>(this.URL, params, { headers });
  }

  deleteIndicadorAvanceByIndicador(idAvance: number): Observable<any> {
    const params = {
      "procedure_name": "sp_indicador_avance",
      "body": {
        "params": [
          { "name": "p_accion", "value": "D2", "type": "string" },
          { "name": "p_id_proy_indica_avance", "value": null, "type": "int" },
          { "name": "p_id_proy_indicador", "value": idAvance, "type": "int" },
          { "name": "p_fecha_reportar", "value": null, "type": "string" },
          { "name": "p_valor_esperado", "value": null, "type": "numeric" },
          { "name": "p_fecha_hora_reporte", "value": null, "type": "string" },
          { "name": "p_id_persona_reporte", "value": null, "type": "int" },
          { "name": "p_valor_reportado", "value": null, "type": "numeric" },
          { "name": "p_comentarios", "value": null, "type": "string" },
          { "name": "p_ruta_evidencia", "value": null, "type": "string" }
        ]
      }
    };
    const ip = localStorage.getItem('ip') || '';
        const headers = new HttpHeaders({
          'ip': "127.0.0.1"
        });

        return this.http.post<any>(this.URL, params, { headers });
  }
}