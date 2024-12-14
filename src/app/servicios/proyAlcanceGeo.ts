import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import config from './config';

@Injectable({
  providedIn: 'root'
})
export class servProyAlcanceGeo{
  private URL = config.URL;

  constructor(private http: HttpClient) {}

  // ======= ======= ======= GET PROY ALCANCE GEO ======= ======= =======
  getProyAlcanceGeoByIdProy(idProy: any): Observable<any> {
    const params = {
      "procedure_name": "sp_proy_alcance_geo",
      "body": {
        "params": [
          { "name": "p_accion", "value": "C2", "type": "string" },
          { "name": "p_id_proy_alcance", "value": null, "type": "int" },
          { "name": "p_id_proyecto", "value": idProy, "type": "int" },
          { "name": "p_id_ubica_geo", "value": null, "type": "int" }
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
  // ======= ======= ======= ADD PROY ALCANCE GEO ======= ======= =======
  addProyAlcanceGeo(obj: any): Observable<any> {
    const params = {
      "procedure_name": "sp_proy_alcance_geo",
      "body": {
        "params": [
          { "name": "p_accion", "value": "A1", "type": "string" },
          { "name": "p_id_proy_alcance", "value": null, "type": "int" },
          { "name": "p_id_proyecto", "value": obj.p_id_proyecto, "type": "int" },
          { "name": "p_id_ubica_geo", "value": obj.p_id_ubica_geo, "type": "int" }
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
  // ======= ======= ======= GET PROY ALCANCE GEO ======= ======= =======
  deleteAlcanceGeo(idProy: any): Observable<any> {
    const params = {
      "procedure_name": "sp_proy_alcance_geo",
      "body": {
        "params": [
          { "name": "p_accion", "value": "D2", "type": "string" },
          { "name": "p_id_proy_alcance", "value": null, "type": "int" },
          { "name": "p_id_proyecto", "value": idProy, "type": "int" },
          { "name": "p_id_ubica_geo", "value": null, "type": "int" }
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
