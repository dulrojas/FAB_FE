import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import config from './config';

@Injectable({
  providedIn: 'root'
})
export class servDashboard {
  private URL = config.URL;

  constructor(private http: HttpClient) {}

  // ======= ======= ======= GET DASHBOARD DATA ======= ======= =======
  getDashboardData(idProy: any, dateScope: any): Observable<any> {
    const params = {
      "procedure_name": "sp_dashboards",
      "body": {
        "params": [
          {"name": "p_accion","value": "C1","type": "string"},
          {"name": "p_id_proyecto","value": idProy,"type": "int"},
          {"name": "p_fecha_gestion","value": dateScope,"type": "string"}
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