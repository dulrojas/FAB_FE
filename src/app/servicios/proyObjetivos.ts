import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import config from './config';

@Injectable({
  providedIn: 'root'
})
export class servProyObjetivos{
  private URL = config.URL;

  constructor(private http: HttpClient) {}

  // ======= ======= ======= GET PROY OBJETIVOS ======= ======= =======
  getProyObjetivosByIdProy(idProy: any): Observable<any> {
    const params = {
      "procedure_name": "sp_proy_objetivos",
      "body": {
        "params": [
          { "name": "p_accion", "value": "C2", "type": "string" },
          { "name": "p_id_proy_objetivos", "value": null, "type": "int" },
          { "name": "p_id_proyecto", "value": idProy, "type": "int" },
          { "name": "p_idp_inst_objetivos", "value": null, "type": "int" },
          { "name": "p_idp_valor_objetivo", "value": null, "type": "int" },
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
  // ======= ======= ======= ADD PROY OBJETIVOS ======= ======= =======
  addProyObjetivos(obj: any): Observable<any> {
    const params = {
      "procedure_name": "sp_proy_objetivos",
      "body": {
        "params": [
          { "name": "p_accion", "value": "A1", "type": "string" },
          { "name": "p_id_proy_objetivos", "value": null, "type": "int" },
          { "name": "p_id_proyecto", "value": obj.p_id_proyecto, "type": "int" },
          { "name": "p_idp_inst_objetivos", "value": obj.p_idp_inst_objetivos, "type": "int" },
          { "name": "p_idp_valor_objetivo", "value": obj.p_idp_valor_objetivo, "type": "int" },
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
  // ======= ======= ======= GET PROY OBJETIVOS ======= ======= =======
  deleteProyObjetivos(idProy: any): Observable<any> {
    const params = {
      "procedure_name": "sp_proy_objetivos",
      "body": {
        "params": [
          { "name": "p_accion", "value": "D2", "type": "string" },
          { "name": "p_id_proy_objetivos", "value": null, "type": "int" },
          { "name": "p_id_proyecto", "value": idProy, "type": "int" },
          { "name": "p_idp_inst_objetivos", "value": null, "type": "int" },
          { "name": "p_idp_valor_objetivo", "value": null, "type": "int" },
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
