import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import config from './config';

@Injectable({
  providedIn: 'root'
})
export class servAuditoria{
  private URL = config.URL;

  constructor(private http: HttpClient) {}

  // ======= ======= ======= GET LOGROS ======= ======= =======
  getAuditoria(): Observable<any> {
    const params = {
      "procedure_name": "sp_auditoria",
      "body": {
        "params": [
          { "name": "p_accion", "value": "C2", "type": "string" },
          { "name": "p_id_auditoria", "value": null, "type": "int" },
          { "name": "p_datos", "value": null, "type": "string" },
          { "name": "p_id_persona", "value": null, "type": "int" },
          { "name": "p_id_formulario", "value": null, "type": "int" },
          { "name": "p_id_accion_usuario", "value": null, "type": "int" },
          { "name": "p_id_tabla", "value": null, "type": "int" }
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
