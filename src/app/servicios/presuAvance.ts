import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import config from './config';

@Injectable({
  providedIn: 'root'
})
export class servPresuAvance{
  private URL = config.URL;

  constructor(private http: HttpClient) {}

  // ======= ======= ======= GET PRESU AVANCE ======= ======= =======
  getPresuAvanceByIdProy(idProy: any): Observable<any> {
    const params = {
      "procedure_name": "sp_proy_presu_avance",
      "body": {
        "params": [
          {"name": "p_accion","value": "C2","type": "string"},
          {"name": "p_id_proy_presu_avance","value": null,"type": "int"},
          {"name": "p_id_proy_presupuesto","value": null,"type": "int"},
          {"name": "p_monto_avance","value": null,"type": "int"}, 
          {"name": "p_id_persona","value": null,"type": "int"}, 
          {"name": "p_fecha_hora","value": null,"type": "string"},
          {"name": "p_p_motivo","value": null,"type": "string"}, 
          {"name": "p_id_proyecto","value": idProy,"type": "int"}
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
  // ======= ======= ======= ADD PRESU AVANCE ======= ======= =======
  addPresuAvance(obj: any): Observable<any> {
    const params = {
      "procedure_name": "sp_proy_presu_avance",
      "body": {
        "params": [
          {"name": "p_accion","value": "A1","type": "string"},
          {"name": "p_id_proy_presu_avance","value": null,"type": "int"},
          {"name": "p_id_proy_presupuesto","value": obj.p_id_proy_presupuesto,"type": "int"},
          {"name": "p_monto_avance","value": obj.p_monto_avance,"type": "int"}, 
          {"name": "p_id_persona","value": obj.p_id_persona,"type": "int"}, 
          {"name": "p_fecha_hora","value": null,"type": "string"},
          {"name": "p_motivo","value": obj.p_motivo,"type": "string"}, 
          {"name": "p_id_proyecto","value": null,"type": "int"}
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
  // ======= ======= ======= EDIT PRESU AVANCE ======= ======= =======
  editPresuAvance(obj: any): Observable<any> {
    const params = {
      "procedure_name": "sp_proy_presu_avance",
      "body": {
        "params": [
          {"name": "p_accion","value": "M1","type": "string"},
          {"name": "p_id_proy_presu_avance","value": obj.p_id_proy_presu_avance,"type": "int"},
          {"name": "p_id_proy_presupuesto","value": obj.p_id_proy_presupuesto,"type": "int"},
          {"name": "p_monto_avance","value": obj.p_monto_avance,"type": "int"}, 
          {"name": "p_id_persona","value": obj.p_id_persona,"type": "int"}, 
          {"name": "p_fecha_hora","value": obj.p_fecha_hora,"type": "string"},
          {"name": "p_motivo","value": obj.p_motivo,"type": "string"}, 
          {"name": "p_id_proyecto","value": obj.p_id_proyecto,"type": "int"}
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
  // ======= ======= ======= DELETE PRESU AVANCE ======= ======= =======
  deletePresuAvance(idPreAva: any): Observable<any> {
    const params = {
      "procedure_name": "sp_proy_presu_avance",
      "body": {
        "params": [
          {"name": "p_accion","value": "D1","type": "string"},
          {"name": "p_id_proy_presu_avance","value": idPreAva,"type": "int"},
          {"name": "p_id_proy_presupuesto","value": null,"type": "int"},
          {"name": "p_monto_avance","value": null,"type": "int"}, 
          {"name": "p_id_persona","value": null,"type": "int"}, 
          {"name": "p_fecha_hora","value": null,"type": "string"},
          {"name": "p_p_motivo","value": null,"type": "string"}, 
          {"name": "p_id_proyecto","value": null,"type": "int"}
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
