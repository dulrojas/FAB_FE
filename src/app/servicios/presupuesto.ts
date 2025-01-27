import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import config from './config';

@Injectable({
  providedIn: 'root'
})
export class servPresupuesto{
  private URL = config.URL;

  constructor(private http: HttpClient) {}

  // ======= ======= ======= GET PRESUPUESTOS ======= ======= =======
  getPresupuestosByIdProy(idProy: any): Observable<any> {
    const params = {
      "procedure_name": "sp_proy_presupuesto",
      "body": {
        "params": [
          {"name": "p_accion","value": "C3","type": "string"},
          {"name": "p_id_proy_presupuesto","value": null,"type": "int"},
          {"name": "p_id_proyecto","value": idProy,"type": "int"},
          {"name": "p_anio","value": null,"type": "string"}, 
          {"name": "p_presup_actividades","value": 0,"type": "int"}, 
          {"name": "p_presup_adicional","value": 0,"type": "int"},
          {"name": "p_ejec_actividades","value": 0,"type": "int"}, 
          {"name": "p_ejec_manual","value": 0,"type": "int"},
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
  // ======= ======= ======= ADD PRESUPUESTO ======= ======= =======
  addPresupuesto(obj: any): Observable<any> {
    const params = {
      "procedure_name": "sp_proy_presupuesto",
      "body": {
        "params": [
          {"name": "p_accion","value": "A1","type": "string"},
          {"name": "p_id_proy_presupuesto","value": null,"type": "int"},
          {"name": "p_id_proyecto","value": obj.p_id_proyecto,"type": "int"},
          {"name": "p_anio","value": obj.p_anio,"type": "string"}, 
          {"name": "p_presup_actividades","value": obj.p_presup_actividades,"type": "int"}, 
          {"name": "p_presup_adicional","value": obj.p_presup_adicional,"type": "int"},
          {"name": "p_ejec_actividades","value": obj.p_ejec_actividades,"type": "int"}, 
          {"name": "p_ejec_manual","value": obj.p_ejec_manual,"type": "int"},
          {"name": "p_id_persona_reg", "value": obj.p_id_persona_reg, "type": "int"}
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
  // ======= ======= ======= EDIT PRESUPUESTO ======= ======= =======
  editPresupuesto(obj: any): Observable<any> {
    const params = {
      "procedure_name": "sp_proy_presupuesto",
      "body": {
        "params": [
          {"name": "p_accion","value": "M1","type": "string"},
          {"name": "p_id_proy_presupuesto","value": obj.p_id_proy_presupuesto,"type": "int"},
          {"name": "p_id_proyecto","value": obj.p_id_proyecto,"type": "int"},
          {"name": "p_anio","value": obj.p_anio,"type": "string"}, 
          {"name": "p_presup_actividades","value": obj.p_presup_actividades,"type": "int"}, 
          {"name": "p_presup_adicional","value": obj.p_presup_adicional,"type": "int"},
          {"name": "p_ejec_actividades","value": obj.p_ejec_actividades,"type": "int"}, 
          {"name": "p_ejec_manual","value": obj.p_ejec_manual,"type": "int"},
          {"name": "p_id_persona_reg", "value": obj.p_id_persona_reg, "type": "int"}
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
  // ======= ======= ======= DELTE PRESUPUESTO ======= ======= =======
  deletePresupuesto(idPresu: any, idPerReg: any): Observable<any> {
    const params = {
      "procedure_name": "sp_proy_presupuesto",
      "body": {
        "params": [
          {"name": "p_accion","value": "D1","type": "string"},
          {"name": "p_id_proy_presupuesto","value": idPresu,"type": "int"},
          {"name": "p_id_proyecto","value": null,"type": "int"},
          {"name": "p_anio","value": null,"type": "string"}, 
          {"name": "p_presup_actividades","value": null,"type": "int"}, 
          {"name": "p_presup_adicional","value": null,"type": "int"},
          {"name": "p_ejec_actividades","value": null,"type": "int"}, 
          {"name": "p_ejec_manual","value": null,"type": "int"},
          {"name": "p_id_persona_reg", "value": idPerReg, "type": "int"}
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
