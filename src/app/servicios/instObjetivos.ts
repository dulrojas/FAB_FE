import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import config from './config';

@Injectable({
  providedIn: 'root'
})
export class servInstObjetivos{
  private URL = config.URL;

  constructor(private http: HttpClient) {}

  // ======= ======= ======= GET PROY OBJETIVOS ======= ======= =======
  getInstObjetivos(): Observable<any> {
    const params = {
      "procedure_name": "sp_inst_objetivos",
      "body": {
          "params": [
              {"name": "p_accion","value": "C1","type": "string"},
              {"name": "p_id_inst_objetivos","value": null,"type": "int"},
              {"name": "p_id_institucion","value": null,"type": "int"},
              {"name": "p_idp_tipo_objetivo","value": null,"type": "int"},
              {"name": "p_objetivo","value": null,"type": "string"},
              {"name": "p_objetivo_largo","value": null,"type": "string"},
              {"name": "p_objetivo_orden","value": null,"type": "int"},
              {"name": "p_objetivo_imagen","value": null,"type": "string"}
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
