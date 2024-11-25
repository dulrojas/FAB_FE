import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import config from './config';

@Injectable({
  providedIn: 'root'
})
export class BeneficiariosService {
  private URL = config.URL;

  constructor(private http: HttpClient) {}

  // Obtener todos los beneficiarios
  getBeneficiarios(): Observable<any> {
    const params = {
      "procedure_name": "sp_proy_beneficiarios",
      "body": {
        "params": [
          { "name": "p_accion", "value": "C1", "type": "string" }
        ]
      }
    };
    const headers = new HttpHeaders({ 'ip': "127.0.0.1" });
    return this.http.post<any>(this.URL, params, { headers });
  }

  // Obtener beneficiarios por proyecto
  getBeneficiariosPorProyecto(idProyecto: number): Observable<any> {
    const params = {
        "procedure_name": "sp_proy_beneficiarios",
        "body": {
          "params": [
            { "name": "p_accion", "value": "C2", "type": "string" },
              { "name": "p_id_proy_beneficiario", "value":null, "type": "int" },
            { "name": "p_id_proyecto", "value": idProyecto, "type": "int" }
          ]
        }
      };
    const headers = new HttpHeaders({ 'ip': "127.0.0.1" });
    return this.http.post<any>(this.URL, params, { headers });
  }
}