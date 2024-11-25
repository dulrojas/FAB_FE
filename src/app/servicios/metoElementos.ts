import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import config from './config';

@Injectable({
  providedIn: 'root'
})
export class MetoElementosService {
  private URL = config.URL;

  constructor(private http: HttpClient) {}

  // ======= ======= ======= Obtener Todos los Meto Elementos ======= ======= =======
  getAllMetoElementos(): Observable<any> {
    const params = {
      "procedure_name": "sp_meto_elementos",
      "body": {
        "params": [
          {"name": "p_accion", "value": "C1", "type": "string"},
          {"name": "p_id_meto_elemento", "value": null, "type": "int"},
          {"name": "p_id_metodologia", "value": null, "type": "int"},
          {"name": "p_nivel", "value": null, "type": "int"},
          {"name": "p_sigla", "value": null, "type": "string"},
          {"name": "p_color", "value": null, "type": "string"}
        ]
      }
    };

    const headers = new HttpHeaders({
      'ip': "127.0.0.1"
    });

    return this.http.post<any>(this.URL, params, { headers });
  }

  // ======= ======= ======= Obtener Meto Elementos por Metodología ======= ======= =======
  getMetoElementosByMetodologia(idMetodologia: number): Observable<any> {
    const params = {
      "procedure_name": "sp_meto_elementos",
      "body": {
        "params": [
          {"name": "p_accion", "value": "C2", "type": "string"},
          {"name": "p_id_meto_elemento", "value": null, "type": "int"},
          {"name": "p_id_metodologia", "value": idMetodologia, "type": "int"},
          {"name": "p_nivel", "value": null, "type": "int"},
          {"name": "p_sigla", "value": null, "type": "string"},
          {"name": "p_color", "value": null, "type": "string"}
        ]
      }
    };

    const headers = new HttpHeaders({
      'ip': "127.0.0.1"
    });

    return this.http.post<any>(this.URL, params, { headers });
  }

  // ======= ======= ======= Obtener Meto Elemento por ID ======= ======= =======
  getMetoElementoById(idMetoElemento: number): Observable<any> {
    const params = {
      "procedure_name": "sp_meto_elementos",
      "body": {
        "params": [
          {"name": "p_accion", "value": "C3", "type": "string"},
          {"name": "p_id_meto_elemento", "value": idMetoElemento, "type": "int"},
          {"name": "p_id_metodologia", "value": null, "type": "int"},
          {"name": "p_nivel", "value": null, "type": "int"},
          {"name": "p_sigla", "value": null, "type": "string"},
          {"name": "p_color", "value": null, "type": "string"}
        ]
      }
    };

    const headers = new HttpHeaders({
      'ip': "127.0.0.1"
    });

    return this.http.post<any>(this.URL, params, { headers });
  }
}