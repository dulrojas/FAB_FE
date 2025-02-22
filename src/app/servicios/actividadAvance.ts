import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import config from './config';

@Injectable({
  providedIn: 'root'
})
export class servActAvance{
  private URL = config.URL;

  constructor(private http: HttpClient) {}

  // ======= ======= ======= GET ACTIVIDADES ======= ======= =======
  getActAvanceByIdAct(idAct: any): Observable<any> {
    const params = {
        "procedure_name": "sp_proy_actividad_avance",
        "body": {
            "params": [
                { "name": "p_accion", "value": "C2", "type": "string" },
                { "name": "p_id_proy_actividad_avance", "value": null, "type": "int" },
                { "name": "p_id_proy_actividad", "value": idAct, "type": "int" },
                { "name": "p_fecha_hora", "value": null, "type": "string" },
                { "name": "p_avance", "value": null, "type": "int" },
                { "name": "p_monto_ejecutado", "value": null, "type": "int" },
                { "name": "p_id_persona_reg", "value": null, "type": "int" }
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
  // ======= ======= ======= ADD ACTIVIDADES ======= ======= =======
  addActAvance(obj: any): Observable<any> {
    const params = {
        "procedure_name": "sp_proy_actividad_avance",
        "body": {
            "params": [
                { "name": "p_accion", "value": "A1", "type": "string" },
                { "name": "p_id_proy_actividad_avance", "value": null, "type": "int" },
                { "name": "p_id_proy_actividad", "value": obj.p_id_proy_actividad, "type": "int" },
                { "name": "p_fecha_hora", "value": obj.p_fecha_hora, "type": "string" },
                { "name": "p_avance", "value": obj.p_avance, "type": "int" },
                { "name": "p_monto_ejecutado", "value": obj.p_monto_ejecutado, "type": "int" },
                { "name": "p_id_persona_reg", "value": obj.p_id_persona_reg, "type": "int" }
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
  // ======= ======= ======= GET ACTIVIDADES ======= ======= =======
  editActividad(obj: any): Observable<any> {
    const params = {
        "procedure_name": "sp_proy_actividad_avance",
        "body": {
            "params": [
                { "name": "p_accion", "value": "M1", "type": "string" },
                { "name": "p_id_proy_actividad_avance", "value": obj.p_id_proy_actividad_avance, "type": "int" },
                { "name": "p_id_proy_actividad", "value": obj.p_id_proy_actividad, "type": "int" },
                { "name": "p_fecha_hora", "value": obj.p_fecha_hora, "type": "string" },
                { "name": "p_avance", "value": obj.p_avance, "type": "int" },
                { "name": "p_monto_ejecutado", "value": obj.p_monto_ejecutado, "type": "int" },
                { "name": "p_id_persona_reg", "value": obj.p_id_persona_reg, "type": "int" }
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
  // ======= ======= ======= GET ACTIVIDADES ======= ======= =======
  deleteActAvance(idActAva: any): Observable<any> {
    const params = {
        "procedure_name": "sp_proy_actividad_avance",
        "body": {
            "params": [
                { "name": "p_accion", "value": "C2", "type": "string" },
                { "name": "p_id_proy_actividad_avance", "value": idActAva, "type": "int" },
                { "name": "p_id_proy_actividad", "value": null, "type": "int" },
                { "name": "p_fecha_hora", "value": null, "type": "string" },
                { "name": "p_avance", "value": null, "type": "int" },
                { "name": "p_monto_ejecutado", "value": null, "type": "int" },
                { "name": "p_id_persona_reg", "value": null, "type": "int" }
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