import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import config from './config';

@Injectable({
  providedIn: 'root'
})
export class servicios{
  private URL = config.URL;

  constructor(private http: HttpClient) {}

  // ======= ======= ======= GET PERSONAS ======= ======= =======
  getParametricaByIdTipo(idTipo: any): Observable<any> {
    const params = {
      "procedure_name": "sp_parametrica",
      "body": {
        "params": [
          {"name": "p_accion","value": "C2","type": "string"},
          {"name": "p_idp","value": null,"type": "int"},
          {"name": "p_id_tipo","value": idTipo,"type": "int"},
          {"name": "p_descripcion_tipo","value": null,"type": "string"},
          {"name": "p_id_subtipo","value": null,"type": "int"},
          {"name": "p_descripcion_subtipo","value": null,"type": "string"},
          {"name": "p_id_estado","value": null,"type": "int"},
          {"name": "p_id_padre","value": null,"type": "int"},
          {"name": "p_valor_subtipo","value": null,"type": "int"}
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
  // ======= ======= ======= GET UNIDADES ======= ======= =======
  getUnidades(): Observable<any> {
    const params = {
      "procedure_name": "sp_ins_unidades",
      "body": {
        "params": [
          {"name": "p_accion","value": "C1","type": "string"},
          {"name": "p_id_inst_unidad","value": null,"type": "int"},
          {"name": "p_id_institucion","value": null,"type": "int"},
          {"name": "p_unidad","value": null,"type": "string"},
          {"name": "p_descripcion","value": null,"type": "string"},
          {"name": "p_id_persona_resp","value": null,"type": "int"},
          {"name": "p_id_estado","value": null,"type": "int"},
          {"name": "p_orden","value": null,"type": "int"}
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
  // ======= ======= ======= UPLOAD FILE ======= ======= =======
  uploadFile(formData: FormData): Observable<any> {

    const ip = sessionStorage.getItem('ip') || '';
    const headers = new HttpHeaders({
      'ip': "127.0.0.1"
    });
    return this.http.post<any>(this.URL, formData, { headers });
  }
  // ======= ======= ======= ======= ======= ======= =======
}
