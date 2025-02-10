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

  // ======= ======= ======= GET PROYECTOS ======= ======= =======
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
                {"name": "p_id_preguntas_2", "value": null, "type": "int"},
                {"name": "p_idp_periodo_evaluacion", "value": null, "type": "int"},
                {"name": "p_fecha_evaluacion_1", "value": null, "type": "string"},
                {"name": "p_id_persona_reg", "value": null, "type": "int"}
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
  // ======= ======= ======= GET PROYECTO ======= ======= =======
  getProyectosActivos(): Observable<any> {
    const params = {
        "procedure_name": "sp_proyecto",
        "body": {
            "params": [
                {"name": "p_accion", "value": "C2", "type": "string"},
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
                {"name": "p_id_preguntas_2", "value": null, "type": "int"},
                {"name": "p_idp_periodo_evaluacion", "value": null, "type": "int"},
                {"name": "p_fecha_evaluacion_1", "value": null, "type": "string"},
                {"name": "p_id_persona_reg", "value": null, "type": "int"}
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
  // ======= ======= ======= GET PROYECTO ======= ======= =======
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
                {"name": "p_id_preguntas_2", "value": null, "type": "int"},
                {"name": "p_idp_periodo_evaluacion", "value": null, "type": "int"},
                {"name": "p_fecha_evaluacion_1", "value": null, "type": "string"},
                {"name": "p_id_persona_reg", "value": null, "type": "int"}
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
  // ======= ======= ======= GET PROYECTO ======= ======= =======
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
                {"name": "p_id_preguntas_2", "value": null, "type": "int"},
                {"name": "p_idp_periodo_evaluacion", "value": null, "type": "int"},
                {"name": "p_fecha_evaluacion_1", "value": null, "type": "string"},
                {"name": "p_id_persona_reg", "value": null, "type": "int"}
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
  // ======= ======= ======= ADD PROYECTO ======= ======= =======
  addProyecto(obj: any): Observable<any> {
    const params = {
      "procedure_name": "sp_proyecto",
      "body": {
        "params": [
          {"name": "p_accion", "value": "A1", "type": "string"},
          {"name": "p_id_proyecto", "value": null, "type": "int"},
          {"name": "p_proyecto", "value": obj.proyecto, "type": "string"},
          {"name": "p_descripcion", "value": obj.descrpcion, "type": "string"},
          {"name": "p_id_person_resp", "value": obj.id_person_resp, "type": "int"},
          {"name": "p_fecha_convenio", "value": obj.fecha_convenio, "type": "string"},
          {"name": "p_fecha_desembolso_1", "value": obj.fecha_desembolso_1, "type": "string"},
          {"name": "p_fecha_inicio", "value": obj.fecha_inicio, "type": "string"},
          {"name": "p_fecha_fin", "value": obj.fecha_fin, "type": "string"},
          {"name": "p_fecha_fin_ampliada", "value": obj.fecha_fin_ampliada, "type": "string"},
          {"name": "p_fecha_fin_real", "value": obj.fecha_fin_real, "type": "string"},
          {"name": "p_moneda_presupuesto", "value": obj.moneda_presupuesto, "type": "string"},
          {"name": "p_presupuesto_me", "value": obj.presupuesto_me, "type": "float"},
          {"name": "p_presupuesto_mn", "value": obj.presupuesto_mn, "type": "float"},
          {"name": "p_id_institucion_ejecutora", "value": obj.id_institucion_ejecutora, "type": "int"},
          {"name": "p_idp_estado_proy", "value": obj.idp_estado_proy, "type": "int"},
          {"name": "p_notas", "value": obj.notas, "type": "string"},
          {"name": "p_ubica_geo_otros", "value": obj.ubica_geo_otros, "type": "string"},
          {"name": "p_id_inst_unidad", "value": obj.id_inst_unidad, "type": "int"},
          {"name": "p_id_metodologia", "value": obj.id_metodologia, "type": "int"},
          {"name": "p_id_preguntas_1", "value": obj.id_preguntas_1, "type": "int"},
          {"name": "p_id_preguntas_2", "value": obj.id_preguntas_2, "type": "int"},
          {"name": "p_idp_periodo_evaluacion", "value": obj.idp_periodo_evaluacion, "type": "int"},
          {"name": "p_fecha_evaluacion_1", "value": obj.fecha_evaluacion_1, "type": "string"},
          {"name": "p_id_persona_reg", "value": obj.id_persona_reg, "type": "int"}
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
  editProyecto(obj: any): Observable<any> {
    const params = {
      "procedure_name": "sp_proyecto",
      "body": {
        "params": [
          {"name": "p_accion", "value": "M1", "type": "string"},
          {"name": "p_id_proyecto", "value": obj.id_proyecto, "type": "int"},
          {"name": "p_proyecto", "value": obj.proyecto, "type": "string"},
          {"name": "p_descripcion", "value": obj.descrpcion, "type": "string"},
          {"name": "p_id_person_resp", "value": obj.id_person_resp, "type": "int"},
          {"name": "p_fecha_convenio", "value": obj.fecha_convenio, "type": "string"},
          {"name": "p_fecha_desembolso_1", "value": obj.fecha_desembolso_1, "type": "string"},
          {"name": "p_fecha_inicio", "value": obj.fecha_inicio, "type": "string"},
          {"name": "p_fecha_fin", "value": obj.fecha_fin, "type": "string"},
          {"name": "p_fecha_fin_ampliada", "value": obj.fecha_fin_ampliada, "type": "string"},
          {"name": "p_fecha_fin_real", "value": obj.fecha_fin_real, "type": "string"},
          {"name": "p_moneda_presupuesto", "value": obj.moneda_presupuesto, "type": "string"},
          {"name": "p_presupuesto_me", "value": obj.presupuesto_me, "type": "float"},
          {"name": "p_presupuesto_mn", "value": obj.presupuesto_mn, "type": "float"},
          {"name": "p_id_institucion_ejecutora", "value": obj.id_institucion_ejecutora, "type": "int"},
          {"name": "p_idp_estado_proy", "value": obj.idp_estado_proy, "type": "int"},
          {"name": "p_notas", "value": obj.notas, "type": "string"},
          {"name": "p_ubica_geo_otros", "value": obj.ubica_geo_otros, "type": "string"},
          {"name": "p_id_inst_unidad", "value": obj.id_inst_unidad, "type": "int"},
          {"name": "p_id_metodologia", "value": obj.id_metodologia, "type": "int"},
          {"name": "p_id_preguntas_1", "value": obj.id_preguntas_1, "type": "int"},
          {"name": "p_id_preguntas_2", "value": obj.id_preguntas_2, "type": "int"},
          {"name": "p_idp_periodo_evaluacion", "value": obj.idp_periodo_evaluacion, "type": "int"},
          {"name": "p_fecha_evaluacion_1", "value": obj.fecha_evaluacion_1, "type": "string"},
          {"name": "p_id_persona_reg", "value": obj.id_persona_reg, "type": "int"}
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
  deleteProyectoByIdPro(idProy: any): Observable<any> {
    const params = {
        "procedure_name": "sp_proyecto",
        "body": {
            "params": [
                {"name": "p_accion", "value": "D1", "type": "string"},
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
                {"name": "p_id_preguntas_2", "value": null, "type": "int"},
                {"name": "p_idp_periodo_evaluacion", "value": null, "type": "int"},
                {"name": "p_fecha_evaluacion_1", "value": null, "type": "string"},
                {"name": "p_id_persona_reg", "value": null, "type": "int"}
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
