import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import config from './config';

@Injectable({
  providedIn: 'root'
})
export class servUbicaGeografica{
  private URL = config.URL;

  constructor(private http: HttpClient) {}

  // ======= ======= ======= GET UBICA GEOGRAFICA ======= ======= =======
  getUbicaGeografica(): Observable<any> {
    const params = {
        "procedure_name": "sp_ubica_geografica",
        "body": {
            "params": [
                {"name": "p_accion", "value": "C2", "type": "string"},
                {"name": "p_id_ubica_geo", "value": null, "type": "int"},
                {"name": "p_idp_tipo_ubica_geo", "value": null, "type": "string"},
                {"name": "p_id_ubica_geo_padre", "value": null, "type": "int"},
                {"name": "p_codigo", "value": null, "type": "string"},
                {"name": "p_orden", "value": null, "type": "int"},
                {"name": "p_latitud", "value": null, "type": "string"},
                {"name": "p_longitud", "value": null, "type": "string"},
                {"name": "p_nivel", "value": null, "type": "int"},
                {"name": "p_idp_estado", "value": null, "type": "int"},
                {"name": "p_rama", "value": null, "type": "int"}
            ]
        }
    };

    const ip = sessionStorage.getItem('ip') || '127.0.0.1';
    const headers = new HttpHeaders({
      'ip': ip
    });

    return this.http.post<any>(this.URL, params, { headers });
  }
  // ======= ======= ======= ======= ======= ======= =======
  // ======= ======= ======= traer departamentos ======= ======= ======= =======
  getUbicaciones(nivel: number, rama: number,ubica_geo_padre: number): Observable<any> {
    const params ={
      "procedure_name": "sp_prot_geografiaca_ubi",
      "body": {
        "params": [
    
          { "name": "p_accion", "value": "C2", "type": "string" },
          { "name": "p_id_ubica_geo", "value": null, "type": "int" },
          { "name": "p_idp_tipo_ubica_geo", "value": null, "type": "string" },
          { "name": "p_id_ubica_geo_padre", "value": ubica_geo_padre, "type": "int" },
          { "name": "p_codigo", "value": null, "type": "string" },
          { "name": "p_orden", "value": null, "type": "int" },
          { "name": "p_latitud", "value": null, "type": "string" },
          { "name": "p_longitud", "value": null, "type": "string" },
          { "name": "p_nivel", "value": nivel, "type": "int" },
          { "name": "p_idp_estado", "value": null, "type": "int" },
          { "name": "p_rama", "value": rama, "type": "int" }
        ]
      }
    };

    const ip = sessionStorage.getItem('ip') || '127.0.0.1';
    const headers = new HttpHeaders({
      'ip': ip
    });

    return this.http.post<any>(this.URL, params, { headers });
  }
  // ======= ======= ======= traer provincias ======= ======= ======= =======
  getUbicacionesProvincias(nivel: number, rama: number): Observable<any> {
    const params ={
      "procedure_name": "sp_prot_geografiaca_ubi",
      "body": {
        "params": [
    
          { "name": "p_accion", "value": "C1", "type": "string" },
          { "name": "p_id_ubica_geo", "value": null, "type": "int" },
          { "name": "p_idp_tipo_ubica_geo", "value": null, "type": "string" },
          { "name": "p_id_ubica_geo_padre", "value": null, "type": "int" },
          { "name": "p_codigo", "value": null, "type": "string" },
          { "name": "p_orden", "value": null, "type": "int" },
          { "name": "p_latitud", "value": null, "type": "string" },
          { "name": "p_longitud", "value": null, "type": "string" },
          { "name": "p_nivel", "value": nivel, "type": "int" },
          { "name": "p_idp_estado", "value": null, "type": "int" },
          { "name": "p_rama", "value": rama, "type": "int" }
        ]
      }
    };

    const ip = sessionStorage.getItem('ip') || '127.0.0.1';
    const headers = new HttpHeaders({
      'ip': ip
    });
    return this.http.post<any>(this.URL, params, { headers });
  }

  // ======= ======= ======= ======= ======= ======= =======
  // ======= ===== GET LISTA DE DEPARTAMENTOS  ===== =======
  // ======= ======= ======= ======= ======= ======= =======
      getUbiDepartamentos(dep: any): Observable<any> {
        const params = {
            "procedure_name": "sp_ubica_geografica",
            "body": {
                "params": [
                    {"name": "p_accion", "value": "C3", "type": "string"},
                    {"name": "p_id_ubica_geo", "value": null, "type": "int"},
                    {"name": "p_idp_tipo_ubica_geo", "value": dep, "type": "string"},
                    {"name": "p_id_ubica_geo_padre", "value": null, "type": "int"},
                    {"name": "p_codigo", "value": null, "type": "string"},
                    {"name": "p_orden", "value": null, "type": "int"},
                    {"name": "p_latitud", "value": null, "type": "string"},
                    {"name": "p_longitud", "value": null, "type": "string"},
                    {"name": "p_nivel", "value": null, "type": "int"},
                    {"name": "p_idp_estado", "value": null, "type": "int"},
                    {"name": "p_rama", "value": null, "type": "int"}
                ]
            }
        };
          const ip = sessionStorage.getItem('ip') || '127.0.0.1';
          const headers = new HttpHeaders({
            'ip': ip
          });
        return this.http.post<any>(this.URL, params, { headers });
      }
  // ======= ======= ======= ======= ======= ======= =======
  // ======= ======= GET LISTA DE MUNICIPIO  ======= =======
  // ======= ======= ======= ======= ======= ======= =======
      getUbiMunicipios(mun: any): Observable<any> {
        const params = {
            "procedure_name": "sp_ubica_geografica",
            "body": {
                "params": [
                    {"name": "p_accion", "value": "C4", "type": "string"},
                    {"name": "p_id_ubica_geo", "value": null, "type": "int"},
                    {"name": "p_idp_tipo_ubica_geo", "value": null, "type": "string"},
                    {"name": "p_id_ubica_geo_padre", "value": mun, "type": "int"},
                    {"name": "p_codigo", "value": null, "type": "string"},
                    {"name": "p_orden", "value": null, "type": "int"},
                    {"name": "p_latitud", "value": null, "type": "string"},
                    {"name": "p_longitud", "value": null, "type": "string"},
                    {"name": "p_nivel", "value": null, "type": "int"},
                    {"name": "p_idp_estado", "value": null, "type": "int"},
                    {"name": "p_rama", "value": null, "type": "int"}
                ]
            }
        };
        const ip = sessionStorage.getItem('ip') || '127.0.0.1';
        const headers = new HttpHeaders({
          'ip': ip
        });
      return this.http.post<any>(this.URL, params, { headers });
    }
}
