import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import config from './config';

@Injectable({
  providedIn: 'root'
})
export class servObligaciones{
  private URL = config.URL;

  constructor(private http: HttpClient) {}

  // ======= ======= ======= GET PERSONAS ======= ======= =======
  getObligaciones(idProy: any): Observable<any> {
    const params = {
      "procedure_name": "sp_proy_obligaciones",
      "body": {
        "params": [
          {"name": "p_accion","value": "C2","type": "string"},
          {"name": "p_id_proy_obliga","value": null,"type": "int"},
          {"name": "p_id_proyecto","value": idProy,"type": "int"},
          {"name": "p_id_inst_obligaciones","value": null,"type": "int"},
          {"name": "p_obligacion","value": null,"type": "string"},
          {"name": "p_descripcion","value": null,"type": "string"},
          {"name": "p_fecha_obligacion","value": null,"type": "string"},
          {"name": "p_ruta_plantilla","value": null,"type": "string"},
          {"name": "p_id_institucion_exige","value": null,"type": "int"},
          {"name": "p_idp_estado_entrega","value": null,"type": "int"},
          {"name": "p_ruta_documento","value": null,"type": "string"},
          {"name": "p_fecha_hora_entrega","value": null,"type": "string"},
          {"name": "p_id_persona_entrega","value": null,"type": "int"}
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
  addObligaciones(obj: any): Observable<any> {
    const params = {
      "procedure_name": "sp_proy_obligaciones",
      "body": {
        "params": [
          {"name": "p_accion","value": "A1","type": "string"},
          {"name": "p_id_proy_obliga","value": null,"type": "int"},
          {"name": "p_id_proyecto","value": obj.p_id_proyecto,"type": "int"},
          {"name": "p_id_inst_obligaciones","value": obj.p_id_inst_obligaciones,"type": "int"},
          {"name": "p_obligacion","value": obj.p_obligacion,"type": "string"},
          {"name": "p_descripcion","value": obj.p_descripcion,"type": "string"},
          {"name": "p_fecha_obligacion","value": obj.p_fecha_obligacion,"type": "string"},
          {"name": "p_ruta_plantilla","value": obj.p_ruta_plantilla,"type": "string"},
          {"name": "p_id_institucion_exige","value": obj.p_id_institucion_exige,"type": "int"},
          {"name": "p_idp_estado_entrega","value": obj.p_idp_estado_entrega,"type": "int"},
          {"name": "p_ruta_documento","value": obj.p_ruta_documento,"type": "string"},
          {"name": "p_fecha_hora_entrega","value": obj.p_fecha_hora_entrega,"type": "string"},
          {"name": "p_id_persona_entrega","value": obj.p_id_persona_entrega,"type": "int"}
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
  editObligaciones(obj: any): Observable<any> {
    const params = {
      "procedure_name": "sp_proy_obligaciones",
      "body": {
        "params": [
          {"name": "p_accion","value": "M1","type": "string"},
          {"name": "p_id_proy_obliga","value": obj.p_id_proy_obliga,"type": "int"},
          {"name": "p_id_proyecto","value": obj.p_id_proyecto,"type": "int"},
          {"name": "p_id_inst_obligaciones","value": obj.p_id_inst_obligaciones,"type": "int"},
          {"name": "p_obligacion","value": obj.p_obligacion,"type": "string"},
          {"name": "p_descripcion","value": obj.p_descripcion,"type": "string"},
          {"name": "p_fecha_obligacion","value": obj.p_fecha_obligacion,"type": "string"},
          {"name": "p_ruta_plantilla","value": obj.p_ruta_plantilla,"type": "string"},
          {"name": "p_id_institucion_exige","value": obj.p_id_institucion_exige,"type": "int"},
          {"name": "p_idp_estado_entrega","value": obj.p_idp_estado_entrega,"type": "int"},
          {"name": "p_ruta_documento","value": obj.p_ruta_documento,"type": "string"},
          {"name": "p_fecha_hora_entrega","value": obj.p_fecha_hora_entrega,"type": "string"},
          {"name": "p_id_persona_entrega","value": obj.p_id_persona_entrega,"type": "int"}
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
  deleteObligacion(idObli: any): Observable<any> {
    const params = {
      "procedure_name": "sp_proy_obligaciones",
      "body": {
        "params": [
          {"name": "p_accion","value": "D1","type": "string"},
          {"name": "p_id_proy_obliga","value": idObli,"type": "int"},
          {"name": "p_id_proyecto","value": null,"type": "int"},
          {"name": "p_id_inst_obligaciones","value": null,"type": "int"},
          {"name": "p_obligacion","value": null,"type": "string"},
          {"name": "p_descripcion","value": null,"type": "string"},
          {"name": "p_fecha_obligacion","value": null,"type": "string"},
          {"name": "p_ruta_plantilla","value": null,"type": "string"},
          {"name": "p_id_institucion_exige","value": null,"type": "int"},
          {"name": "p_idp_estado_entrega","value": null,"type": "int"},
          {"name": "p_ruta_documento","value": null,"type": "string"},
          {"name": "p_fecha_hora_entrega","value": null,"type": "string"},
          {"name": "p_id_persona_entrega","value": null,"type": "int"}
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
