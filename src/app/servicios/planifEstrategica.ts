import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import config from './config';

@Injectable({
  providedIn: 'root'
})
export class servPlanifEstrategica {
  private URL = config.URL;

  constructor(private http: HttpClient) {}
  // Obtener todos los elementos de planificación estratégica
  getPlanifEstrategica(): Observable<any> {
    const params = { 
      "procedure_name": "sp_proy_elementos", 
      "body": {
        "params": [
          {"name": "p_accion", "value": "C1", "type": "varchar"},
          {"name": "p_id_proy_elemento", "value": null, "type": "int4"},
          {"name": "p_id_proyecto", "value": null, "type": "int4"},
          {"name": "p_id_meto_elemento", "value": null, "type": "int4"},
          {"name": "p_id_proy_elem_padre", "value": null, "type": "int4"},
          {"name": "p_codigo", "value": null, "type": "varchar"},
          {"name": "p_elemento", "value": null, "type": "varchar"},
          {"name": "p_descripcion", "value": null, "type": "varchar"},
          {"name": "p_comentario", "value": null, "type": "varchar"},
          {"name": "p_nivel", "value": null, "type": "int4"},
          {"name": "p_orden", "value": null, "type": "int4"},
          {"name": "p_id_estado", "value": null, "type": "int4"},
          {"name": "p_peso", "value": null, "type": "numeric"}
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