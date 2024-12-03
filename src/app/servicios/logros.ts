import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import config from './config';

@Injectable({
  providedIn: 'root'
})
export class servLogros{
  private URL = config.URL;

  constructor(private http: HttpClient) {}

  // ======= ======= ======= GET APRENDIZAJES ======= ======= =======
  getLogrosByIdProy(idProy: any): Observable<any> {
    const params = {
      "procedure_name": "sp_logro",
      "body": {
        "params": [
          { "name": "p_accion", "value": "C2", "type": "string" },
          { "name": "p_id_proy_logro", "value": null, "type": "int" },
          { "name": "p_id_proyecto", "value": idProy, "type": "int" },
          { "name": "p_logro", "value": null, "type": "string" },
          { "name": "p_descripcion", "value": null, "type": "string" },
          { "name": "p_rut_imagen", "value": null, "type": "string" },
          { "name": "p_fecha_hora", "value": null, "type": "string" },
          { "name": "p_id_persona_reg", "value": null, "type": "int" },
          { "name": "p_id_proy_elemento", "value": null, "type": "int" },
          { "name": "p_fecha_logro", "value": null, "type": "string" }
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
  // ======= ======= ======= ADD PERSONA ======= ======= =======
  addLogro(obj: any): Observable<any> {
    const params = {
      "procedure_name": "sp_logro",
      "body": {
        "params": [
          { "name": "p_accion", "value": "A1", "type": "string" },
          { "name": "p_id_proy_logro", "value": null, "type": "int" },
          { "name": "p_id_proyecto", "value": obj.p_id_proyecto, "type": "int" },
          { "name": "p_logro", "value": obj.p_logro, "type": "string" },
          { "name": "p_descripcion", "value": obj.p_descripcion, "type": "string" },
          { "name": "p_rut_imagen", "value": obj.p_ruta_imagen, "type": "string" },
          { "name": "p_fecha_hora", "value": null, "type": "string" },
          { "name": "p_id_persona_reg", "value": obj.p_id_persona_reg, "type": "int" },
          { "name": "p_id_proy_elemento", "value": obj.p_id_proy_elemento, "type": "int" },
          { "name": "p_fecha_logro", "value": obj.p_fecha_logro, "type": "string" }
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
  // ======= ======= ======= EDIT PERSONA ======= ======= =======
  editLogro(obj: any): Observable<any> {
    const params = {
      "procedure_name": "sp_logro",
      "body": {
        "params": [
          { "name": "p_accion", "value": "M1", "type": "string" },
          { "name": "p_id_proy_logro", "value": obj.p_id_proy_logro, "type": "int" },
          { "name": "p_id_proyecto", "value": obj.p_id_proyecto, "type": "int" },
          { "name": "p_logro", "value": obj.p_logro, "type": "string" },
          { "name": "p_descripcion", "value": obj.p_descripcion, "type": "string" },
          { "name": "p_rut_imagen", "value": obj.p_rut_imagen, "type": "string" },
          { "name": "p_fecha_hora", "value": obj.p_fecha_hora, "type": "string" },
          { "name": "p_id_persona_reg", "value": obj.p_id_persona_reg, "type": "int" },
          { "name": "p_id_proy_elemento", "value": obj.p_id_proy_elemento, "type": "int" },
          { "name": "p_fecha_logro", "value": obj.p_fecha_logro, "type": "string" }
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
  // ======= ======= ======= DELTE LOGRO ======= ======= =======
  deleteLogro(idLogro: any): Observable<any> {
    const params = {
      "procedure_name": "sp_logro",
      "body": {
        "params": [
          { "name": "p_accion", "value": "D1", "type": "string" },
          { "name": "p_id_proy_logro", "value": idLogro, "type": "int" },
          { "name": "p_id_proyecto", "value": null, "type": "int" },
          { "name": "p_logro", "value": null, "type": "string" },
          { "name": "p_descripcion", "value": null, "type": "string" },
          { "name": "p_rut_imagen", "value": null, "type": "string" },
          { "name": "p_fecha_hora", "value": null, "type": "string" },
          { "name": "p_id_persona_reg", "value": null, "type": "int" },
          { "name": "p_id_proy_elemento", "value": null, "type": "int" },
          { "name": "p_fecha_logro", "value": null, "type": "string" }
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
}
