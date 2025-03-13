import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import config from './config';

@Injectable({
  providedIn: 'root'
})
export class servAprendizaje{
  private URL = config.URL;

  constructor(private http: HttpClient) {}

  // ======= ======= ======= GET APRENDIZAJES ======= ======= =======
  getAprendizajesByIdProy(idProy: any): Observable<any> {
    const params = {
      "procedure_name": "sp_aprendizaje",
      "body": {
        "params": [
          {"name": "p_accion", "value": "C2", "type": "string"},
          {"name": "p_id_proy_aprende", "value": null, "type": "int"},
          {"name": "p_id_proyecto", "value": idProy, "type": "int"},
          {"name": "p_aprendizaje", "value": null, "type": "string"},
          {"name": "p_problema", "value": null, "type": "string"},
          {"name": "p_accion_aprendizaje", "value": null, "type": "string"},
          {"name": "p_id_preguntas_1", "value": null, "type": "int"},
          {"name": "p_respuestas_1", "value": null, "type": "string"},
          {"name": "p_id_preguntas_2", "value": null, "type": "int"},
          {"name": "p_respuestas_2", "value": null, "type": "string"},
          {"name": "p_id_persona_reg", "value": null, "type": "int"},
          {"name": "p_id_proy_elemento", "value": null, "type": "int"},
          {"name": "p_idp_aprendizaje_area", "value": null, "type": "int"},
          {"name": "p_idp_aprendizaje_tipo", "value": null, "type": "int"},
          {"name": "p_fecha", "value": null, "type": "string"},
          {"name": "p_fecha_hora_reg", "value": null, "type": "string"}
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
  // ======= ======= ======= GET METO ELEMENTOS ======= ======= =======
  getMetoElementos(idProy: any): Observable<any> {
    const params = {
      "procedure_name": "sp_aprendizaje",
      "body": {
        "params": [
          {"name": "p_accion", "value": "C3", "type": "string"},
          {"name": "p_id_proy_aprende", "value": null, "type": "int"},
          {"name": "p_id_proyecto", "value": idProy, "type": "int"},
          {"name": "p_aprendizaje", "value": null, "type": "string"},
          {"name": "p_problema", "value": null, "type": "string"},
          {"name": "p_accion_aprendizaje", "value": null, "type": "string"},
          {"name": "p_id_preguntas_1", "value": null, "type": "int"},
          {"name": "p_respuestas_1", "value": null, "type": "string"},
          {"name": "p_id_preguntas_2", "value": null, "type": "int"},
          {"name": "p_respuestas_2", "value": null, "type": "string"},
          {"name": "p_id_persona_reg", "value": null, "type": "int"},
          {"name": "p_id_proy_elemento", "value": null, "type": "int"},
          {"name": "p_idp_aprendizaje_area", "value": null, "type": "int"},
          {"name": "p_idp_aprendizaje_tipo", "value": null, "type": "int"},
          {"name": "p_fecha", "value": null, "type": "string"},
          {"name": "p_fecha_hora_reg", "value": null, "type": "string"}
        ]
      }
    }
    ;

    const ip = localStorage.getItem('ip') || '127.0.0.1';
    const headers = new HttpHeaders({
      'ip': ip
    });

    return this.http.post<any>(this.URL, params, { headers });
  }
  // ======= ======= ======= ======= ======= ======= =======
  // ======= ======= ======= GET PREGUNTAS ======= ======= =======
  getPreguntas(): Observable<any> {
    const params = {
      "procedure_name": "sp_aprendizaje",
      "body": {
        "params": [
          {"name": "p_accion", "value": "C4", "type": "string"},
          {"name": "p_id_proy_aprende", "value": null, "type": "int"},
          {"name": "p_id_proyecto", "value": null, "type": "int"},
          {"name": "p_aprendizaje", "value": null, "type": "string"},
          {"name": "p_problema", "value": null, "type": "string"},
          {"name": "p_accion_aprendizaje", "value": null, "type": "string"},
          {"name": "p_id_preguntas_1", "value": null, "type": "int"},
          {"name": "p_respuestas_1", "value": null, "type": "string"},
          {"name": "p_id_preguntas_2", "value": null, "type": "int"},
          {"name": "p_respuestas_2", "value": null, "type": "string"},
          {"name": "p_id_persona_reg", "value": null, "type": "int"},
          {"name": "p_id_proy_elemento", "value": null, "type": "int"},
          {"name": "p_idp_aprendizaje_area", "value": null, "type": "int"},
          {"name": "p_idp_aprendizaje_tipo", "value": null, "type": "int"},
          {"name": "p_fecha", "value": null, "type": "string"},
          {"name": "p_fecha_hora_reg", "value": null, "type": "string"}
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
  // ======= ======= ======= ADD PERSONA ======= ======= =======
  addAprendizaje(obj: any): Observable<any> {
    const params = {
        "procedure_name": "sp_aprendizaje",
        "body": {
            "params": [
                {"name": "p_accion", "value": "A1", "type": "string"},
                {"name": "p_id_proy_aprende", "value": null, "type": "int"},
                {"name": "p_id_proyecto", "value": obj.p_id_proyecto, "type": "int"},
                {"name": "p_aprendizaje", "value": obj.p_aprendizaje, "type": "string"},
                {"name": "p_problema", "value": obj.p_problema, "type": "string"},
                {"name": "p_accion_aprendizaje", "value": obj.p_accion_aprendizaje, "type": "string"},
                {"name": "p_id_preguntas_1", "value": obj.p_id_preguntas_1, "type": "int"},
                {"name": "p_respuestas_1", "value": obj.p_respuestas_1, "type": "string"},
                {"name": "p_id_preguntas_2", "value": obj.p_id_preguntas_2, "type": "int"},
                {"name": "p_respuestas_2", "value": obj.p_respuestas_2, "type": "string"},
                {"name": "p_id_persona_reg", "value": obj.p_id_persona_reg, "type": "int"},
                {"name": "p_id_proy_elemento", "value": obj.p_id_proy_elemento, "type": "int"},
                {"name": "p_idp_aprendizaje_area", "value": obj.p_idp_aprendizaje_area, "type": "int"},
                {"name": "p_idp_aprendizaje_tipo", "value": obj.p_idp_aprendizaje_tipo, "type": "int"},
                {"name": "p_fecha", "value": obj.p_fecha, "type": "string"},
                {"name": "p_fecha_hora_reg", "value": null, "type": "string"}
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
  // ======= ======= ======= EDIT APRENDIZAJE ======= ======= =======
  editAprendizaje(obj: any): Observable<any> {
    const params = {
      "procedure_name": "sp_aprendizaje",
      "body": {
        "params": [
          {"name": "p_accion", "value": "M1", "type": "string"},
          {"name": "p_id_proy_aprende", "value": obj.p_id_proy_aprende, "type": "int"},
          {"name": "p_id_proyecto", "value": obj.p_id_proyecto, "type": "int"},
          {"name": "p_aprendizaje", "value": obj.p_aprendizaje, "type": "string"},
          {"name": "p_problema", "value": obj.p_problema, "type": "string"},
          {"name": "p_accion_aprendizaje", "value": obj.p_accion_aprendizaje, "type": "string"},
          {"name": "p_id_preguntas_1", "value": obj.p_id_preguntas_1, "type": "int"},
          {"name": "p_respuestas_1", "value": obj.p_respuestas_1, "type": "string"},
          {"name": "p_id_preguntas_2", "value": obj.p_id_preguntas_2, "type": "int"},
          {"name": "p_respuestas_2", "value": obj.p_respuestas_2, "type": "string"},
          {"name": "p_id_persona_reg", "value": obj.p_id_persona_reg, "type": "int"},
          {"name": "p_id_proy_elemento", "value": obj.p_id_proy_elemento, "type": "int"},
          {"name": "p_idp_aprendizaje_area", "value": obj.p_idp_aprendizaje_area, "type": "int"},
          {"name": "p_idp_aprendizaje_tipo", "value": obj.p_idp_aprendizaje_tipo, "type": "int"},
          {"name": "p_fecha", "value": obj.p_fecha, "type": "string"},
          {"name": "p_fecha_hora_reg", "value": obj.p_fecha_hora_reg, "type": "string"}
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
  // ======= ======= ======= DELETE APRENDIZAJE ======= ======= =======
  deleteAprendizaje(idAprende: any, idPersonaReg: number): Observable<any> {
    const params = {
      "procedure_name": "sp_aprendizaje",
      "body": {
        "params": [
          {"name": "p_accion", "value": "D1", "type": "string"},
          {"name": "p_id_proy_aprende", "value": idAprende, "type": "int"},
          {"name": "p_id_proyecto", "value": null, "type": "int"},
          {"name": "p_aprendizaje", "value": null, "type": "string"},
          {"name": "p_problema", "value": null, "type": "string"},
          {"name": "p_accion_aprendizaje", "value": null, "type": "string"},
          {"name": "p_id_preguntas_1", "value": null, "type": "int"},
          {"name": "p_respuestas_1", "value": null, "type": "string"},
          {"name": "p_id_preguntas_2", "value": null, "type": "int"},
          {"name": "p_respuestas_2", "value": null, "type": "string"},
          {"name": "p_id_persona_reg", "value": idPersonaReg, "type": "int"},
          {"name": "p_id_proy_elemento", "value": null, "type": "int"},
          {"name": "p_idp_aprendizaje_area", "value": null, "type": "int"},
          {"name": "p_idp_aprendizaje_tipo", "value": null, "type": "int"},
          {"name": "p_fecha", "value": null, "type": "string"},
          {"name": "p_fecha_hora_reg", "value": null, "type": "string"}
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
