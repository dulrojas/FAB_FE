import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import config from './config';

@Injectable({
  providedIn: 'root',
})
export class Params_generales{

  private URL = config.URL;
  constructor(private http: HttpClient) {}

  // ======= ======= ======= ======= ======= ======= ========== =======
  //        GET CATEGORIA -- LLAMA A TODA LA TABLA INST_CATEGORIAS 
  // ======= ======= ======= ======= ======= ======= ========== =======
    getAllParams_generales(): Observable<any> {
      const params =   {
        "procedure_name": "sp_param_generales",
        "body": {
          "params": [
            { "name": "p_accion", "value": "C1", "type": "string" }
          ]
        }
      };
      const ip = localStorage.getItem('ip') || '127.0.0.1';
      const headers = new HttpHeaders({
        'ip': ip
      });
  
      return this.http.post<any>(this.URL, params, { headers });
    }
}