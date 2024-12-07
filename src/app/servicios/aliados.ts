import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import config from './config';
@Injectable({
  providedIn: 'root',
})
export class AliadosService {
    private URL = config.URL;

  constructor(private http: HttpClient) {}

  // Obtener todos los aliados (C1)
  getAliados(): Observable<any> {
    const params = {
        "procedure_name": "sp_proy_aliados",
        "body": {
          "params": [
            { "name": "p_accion", "value": "C1", "type": "string" }
          ]
        }
      };
    const headers = new HttpHeaders({ ip: '127.0.0.1' }); 
    return this.http.post<any>(this.URL, params, { headers });
  }

  // Añadir un aliado (A1)
  addAliado(aliadoData: any): Observable<any> {
    const params =          
        {
        "procedure_name": "sp_proy_aliados",
        "body": {
          "params": [
            { "name": "p_accion", "value": "A1", "type": "string" },
            { "name": "p_id_proy_aliado", "value":null, "type": "int" },
            { "name": "p_id_proyecto", "value": aliadoData.id_proyecto || null, "type": "int" },
            { "name": "p_id_organizacion", "value": aliadoData.institucion || null, "type": "int" },
            { "name": "p_referente", "value": aliadoData.referente || null, "type": "string" },
            { "name": "p_vinculo", "value": aliadoData.vinculo || null, "type": "string" },
            { "name": "p_idp_convenio", "value": aliadoData.convenio || null, "type": "string" },
            { "name": "p_id_persona_reg", "value":  null, "type": "int" },
            { "name": "p_fecha_hora_reg", "value": aliadoData.fecha_hora_reg || new Date().toISOString(), "type": "string" },
            { "name": "p_fecha", "value": aliadoData.fecha || null, "type": "string" }
          ]
        }
      };

 
          
          
      const headers = new HttpHeaders({ ip: '127.0.0.1' }); 
      return this.http.post<any>(this.URL, params, { headers });
  }

  editAliado(aliadoData: any): Observable<any> {
    const params =          
    {
        "procedure_name": "sp_proy_aliados",
        "body": {
          "params": [
            { "name": "p_accion", "value": "M1", "type": "string" },
            { "name": "p_id_proy_aliado", "value":aliadoData.id, "type": "int" },
            { "name": "p_id_proyecto", "value": aliadoData.id_proyecto || null, "type": "int" },
            { "name": "p_id_organizacion", "value": aliadoData.institucion || null, "type": "int" },
            { "name": "p_referente", "value": aliadoData.referente || null, "type": "string" },
            { "name": "p_vinculo", "value": aliadoData.vinculo || null, "type": "string" },
            { "name": "p_idp_convenio", "value": aliadoData.convenio || null, "type": "string" },
            { "name": "p_id_persona_reg", "value":  null, "type": "int" },
            { "name": "p_fecha_hora_reg", "value": aliadoData.fecha_hora_reg || new Date().toISOString(), "type": "string" },
            { "name": "p_fecha", "value": aliadoData.fecha || null, "type": "string" }
          ]
        }
      };
  const headers = new HttpHeaders({ ip: '127.0.0.1' });
return this.http.post<any>(this.URL, params,{ headers });
}
deleteAliado(id: number): Observable<any> {
  const params =          
  {
      "procedure_name": "sp_proy_aliados",
      "body": {
        "params": [
          { "name": "p_accion", "value": "D1", "type": "string" },
          { "name": "p_id_proy_aliado", "value":id, "type": "int" }
        ]
      }
    };
const headers = new HttpHeaders({ ip: '127.0.0.1' });
return this.http.post<any>(this.URL, params,{ headers });
  }

}