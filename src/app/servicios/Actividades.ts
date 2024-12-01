import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import config from './config';

@Injectable({
  providedIn: 'root'
})
export class ActividadesService {
  private URL = config.URL;

  constructor(private http: HttpClient) {}

  // Obtener actividad por ID
  getActividadById(idActividad: number): Observable<any> {
    const params = {
      "procedure_name": "sp_proy_actividad",
      "body": {
        "params": [
          { "name": "p_accion", "value": "C2", "type": "string" },
          { "name": "p_id_proy_actividad", "value": idActividad, "type": "int" }
        ]
      }
    };
    const headers = new HttpHeaders({ 'ip': "127.0.0.1" });
    return this.http.post<any>(this.URL, params, { headers });
  }
}