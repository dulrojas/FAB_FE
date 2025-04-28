import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import config from './config';

@Injectable({
  providedIn: 'root'
})
export class servFinanciadores{
  private URL = config.URL;

  constructor(private http: HttpClient) {}

  // ======= ======= ======= GET PERSONAS ======= ======= =======
  getFinanciadores(idProy: any): Observable<any> {
    const params = {
      "procedure_name": "sp_proy_financiadores",
      "body": {
        "params": [
          {"name": "p_accion","value": "C2","type": "string"},
          {"name": "p_id_proy_finan","value": null,"type": "int"},
          {"name": "p_porcentaje","value": null,"type": "int"},
          {"name": "p_id_proyecto","value": idProy,"type": "int"},
          {"name": "p_monto","value": null,"type": "int"},
          {"name": "p_id_institucion_fin","value": null,"type": "int"},
          {"name": "p_idp_tipo_finan","value": null,"type": "int"},
          {"name": "p_idp_estado","value": null,"type": "int"},
          {"name": "p_orden","value": null,"type": "int"},
          {"name": "p_id_persona_reg","value": null,"type": "int"}
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
  // ======= ======= ======= GET PERSONAS ======= ======= =======
  addFinanciador(obj: any): Observable<any> {
    const params = {
      "procedure_name": "sp_proy_financiadores",
      "body": {
        "params": [
          {"name": "p_accion","value": "A1","type": "string"},
          {"name": "p_id_proy_finan","value": null,"type": "int"},
          {"name": "p_porcentaje","value": obj.p_porcentaje,"type": "int"},
          {"name": "p_id_proyecto","value": obj.p_id_proyecto,"type": "int"},
          {"name": "p_monto","value": obj.p_monto,"type": "int"},
          {"name": "p_id_institucion_fin","value": obj.p_id_institucion_fin,"type": "int"},
          {"name": "p_idp_tipo_finan","value": obj.p_idp_tipo_finan,"type": "int"},
          {"name": "p_idp_estado","value": obj.p_idp_estado,"type": "int"},
          {"name": "p_orden","value": obj.p_orden,"type": "int"},
          {"name": "p_id_persona_reg","value": obj.p_id_persona_reg,"type": "int"}
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
  // ======= ======= ======= GET PERSONAS ======= ======= =======
  editFinanciador(obj: any): Observable<any> {
    const params = {
      "procedure_name": "sp_proy_financiadores",
      "body": {
        "params": [
          {"name": "p_accion","value": "M1","type": "string"},
          {"name": "p_id_proy_finan","value": obj.p_id_proy_finan,"type": "int"},
          {"name": "p_porcentaje","value": obj.p_porcentaje,"type": "int"},
          {"name": "p_id_proyecto","value": obj.p_id_proyecto,"type": "int"},
          {"name": "p_monto","value": obj.p_monto,"type": "int"},
          {"name": "p_id_institucion_fin","value": obj.p_id_institucion_fin,"type": "int"},
          {"name": "p_idp_tipo_finan","value": obj.p_idp_tipo_finan,"type": "int"},
          {"name": "p_idp_estado","value": obj.p_idp_estado,"type": "int"},
          {"name": "p_orden","value": obj.p_orden,"type": "int"},
          {"name": "p_id_persona_reg","value": obj.p_id_persona_reg,"type": "int"}
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
