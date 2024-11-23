import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import config from './config';

@Injectable({
  providedIn: 'root'
})
export class servProyectos{
  private URL = config.URL;

  constructor(private http: HttpClient) {}

  // ======= ======= ======= GET PERSONAS ======= ======= =======
  getProyectos(): Observable<any> {
    const params = {
        "procedure_name": "sp_proyecto",
        "body": {
            "params": [
                {"name": "p_accion", "value": "C1", "type": "string"},
                {"name": "p_id_proyecto", "value": null, "type": "int"},
                {"name": "p_proyecto", "value": null, "type": "string"},
                {"name": "p_descripcion", "value": null, "type": "string"},
                {"name": "p_person_resp", "value": null, "type": "int"},
                {"name": "p_fecha_convenio", "value": null, "type": "string"},
                {"name": "p_fecha_desembolso_1", "value": null, "type": "string"},
                {"name": "p_fecha_inicio", "value": null, "type": "string"},
                {"name": "p_fecha_fin", "value": null, "type": "string"},
                {"name": "p_fecha_fin_ampliada", "value": null, "type": "string"},
                {"name": "p_fecha_fin_real", "value": null, "type": "string"},
                {"name": "p_moneda_presupuesto", "value": null, "type": "string"},
                {"name": "p_presupuesto_me", "value": null, "type": "float"},
                {"name": "p_presupuesto_mn", "value": null, "type": "float"},
                {"name": "p_id_institucion_ejecutora", "value": null, "type": "int"},
                {"name": "p_idp_estado_proy", "value": null, "type": "int"},
                {"name": "p_notas", "value": null, "type": "string"},
                {"name": "p_ubica_geo_otros", "value": null, "type": "string"},
                {"name": "p_id_inst_unidad", "value": null, "type": "int"},
                {"name": "p_id_metodologia", "value": null, "type": "int"},
                {"name": "p_id_preguntas_1", "value": null, "type": "int"},
                {"name": "p_id_preguntas_2", "value": null, "type": "int"}
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
  // ======= ======= ======= GET PERSONAS ======= ======= =======
  getProyectoByIdPro(idProy: any): Observable<any> {
    const params = {
        "procedure_name": "sp_proyecto",
        "body": {
            "params": [
                {"name": "p_accion", "value": "R1", "type": "string"},
                {"name": "p_id_proyecto", "value": idProy, "type": "int"},
                {"name": "p_proyecto", "value": null, "type": "string"},
                {"name": "p_descripcion", "value": null, "type": "string"},
                {"name": "p_person_resp", "value": null, "type": "int"},
                {"name": "p_fecha_convenio", "value": null, "type": "string"},
                {"name": "p_fecha_desembolso_1", "value": null, "type": "string"},
                {"name": "p_fecha_inicio", "value": null, "type": "string"},
                {"name": "p_fecha_fin", "value": null, "type": "string"},
                {"name": "p_fecha_fin_ampliada", "value": null, "type": "string"},
                {"name": "p_fecha_fin_real", "value": null, "type": "string"},
                {"name": "p_moneda_presupuesto", "value": null, "type": "string"},
                {"name": "p_presupuesto_me", "value": null, "type": "float"},
                {"name": "p_presupuesto_mn", "value": null, "type": "float"},
                {"name": "p_id_institucion_ejecutora", "value": null, "type": "int"},
                {"name": "p_idp_estado_proy", "value": null, "type": "int"},
                {"name": "p_notas", "value": null, "type": "string"},
                {"name": "p_ubica_geo_otros", "value": null, "type": "string"},
                {"name": "p_id_inst_unidad", "value": null, "type": "int"},
                {"name": "p_id_metodologia", "value": null, "type": "int"},
                {"name": "p_id_preguntas_1", "value": null, "type": "int"},
                {"name": "p_id_preguntas_2", "value": null, "type": "int"}
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
  // ======= ======= ======= GET PERSONAS ======= ======= =======
  getInfoProyectoByIdPro(idProy: any): Observable<any> {
    const params = {
        "procedure_name": "sp_proyecto",
        "body": {
            "params": [
                {"name": "p_accion", "value": "R2", "type": "string"},
                {"name": "p_id_proyecto", "value": idProy, "type": "int"},
                {"name": "p_proyecto", "value": null, "type": "string"},
                {"name": "p_descripcion", "value": null, "type": "string"},
                {"name": "p_person_resp", "value": null, "type": "int"},
                {"name": "p_fecha_convenio", "value": null, "type": "string"},
                {"name": "p_fecha_desembolso_1", "value": null, "type": "string"},
                {"name": "p_fecha_inicio", "value": null, "type": "string"},
                {"name": "p_fecha_fin", "value": null, "type": "string"},
                {"name": "p_fecha_fin_ampliada", "value": null, "type": "string"},
                {"name": "p_fecha_fin_real", "value": null, "type": "string"},
                {"name": "p_moneda_presupuesto", "value": null, "type": "string"},
                {"name": "p_presupuesto_me", "value": null, "type": "float"},
                {"name": "p_presupuesto_mn", "value": null, "type": "float"},
                {"name": "p_id_institucion_ejecutora", "value": null, "type": "int"},
                {"name": "p_idp_estado_proy", "value": null, "type": "int"},
                {"name": "p_notas", "value": null, "type": "string"},
                {"name": "p_ubica_geo_otros", "value": null, "type": "string"},
                {"name": "p_id_inst_unidad", "value": null, "type": "int"},
                {"name": "p_id_metodologia", "value": null, "type": "int"},
                {"name": "p_id_preguntas_1", "value": null, "type": "int"},
                {"name": "p_id_preguntas_2", "value": null, "type": "int"}
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
