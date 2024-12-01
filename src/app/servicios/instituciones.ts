import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import config from './config';

@Injectable({
  providedIn: 'root'
})
export class servInstituciones{
  private URL = config.URL;

  constructor(private http: HttpClient) {}

  // ======= ======= ======= GET PERSONAS ======= ======= =======
  getInstituciones(): Observable<any> {
    const params = {
      "procedure_name": "sp_instituciones",
      "body": {
        "params": [
          {"name": "p_accion","value": "C1","type": "string"},
          {"name": "p_id_institucion","value": null,"type": "int"},
          {"name": "p_institucion","value": null,"type": "string"},
          {"name": "p_id_persona_resp","value": null,"type": "int"},
          {"name": "p_id_persona_autoriza","value": null,"type": "int"},
          {"name": "p_idp_tipo_inst","value": null,"type": "int"},
          {"name": "p_idp_estado","value": null,"type": "int"},
          {"name": "p_sigla","value": null,"type": "string"},
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
