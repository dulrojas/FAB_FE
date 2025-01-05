import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import config from './config';

@Injectable({
  providedIn: 'root'
})
export class ServDashboard {
  private URL = config.URL;

  constructor(private http: HttpClient) {}

  // ======= ======= ======= GET DASHBOARD DATA ======= =======
  getDashboardData(idProyecto: number): Observable<any> {
    const fechaActual = new Date();
    const año = fechaActual.getFullYear();
    const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
    const dia = String(fechaActual.getDate()).padStart(2, '0');
    const fechaFormateada = `${año}-${mes}-${dia}`;
    
    const params = {
      "procedure_name": "sp_dashboards",
      "body": {
        "params": [
          { "name": "p_accion", "value": "C1", "type": "string" },
          { "name": "p_id_proyecto", "value": idProyecto, "type": "int" },
          { "name": "p_fecha_gestion", "value": fechaFormateada, "type": "string" }
        ]
      }
    };

    const ip = sessionStorage.getItem('ip') || '127.0.0.1';
    const headers = new HttpHeaders({ 'ip': ip });

    return this.http.post<any>(this.URL, params, { headers });
  }

  // ======= ======= ======= GET LOGROS DATA ======= =======
  getLogros(idProyecto: number): Observable<any> {
    const params = {
      "procedure_name": "sp_dashboards",
      "body": {
        "params": [
          { "name": "p_accion", "value": "C2", "type": "string" },
          { "name": "p_id_proyecto", "value": idProyecto, "type": "int" },
          { "name": "p_ip", "value": null, "type": "string" }
        ]
      }
    };

    const ip = sessionStorage.getItem('ip') || '127.0.0.1';
    const headers = new HttpHeaders({ 'ip': ip });

    return this.http.post<any>(this.URL, params, { headers });
  }
}
