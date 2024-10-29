import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import config from './config';

@Injectable({
  providedIn: 'root'
})
export class servPersonaRoles {
  private URL = config.URL;

  constructor(private http: HttpClient) {}

  // ======= ======= ======= GET PERSONAS ======= ======= =======
  getPersonaRoles(): Observable<any> {
    const params = {
      "procedure_name": "sp_persona_proyecto",
      "body": {
        "params": [
          {"name": "p_accion","value": "C2","type": "string"},
          {"name": "p_id_persona_proyecto","value": null,"type": "int"},
          {"name": "p_id_persona","value": null,"type": "int"},
          {"name": "p_id_institucion","value": null,"type": "int"},
          {"name": "p_id_proyecto","value": null,"type": "int"},
          {"name": "p_rol","value": null,"type": "string"}
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
