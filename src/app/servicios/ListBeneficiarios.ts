import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import config from './config';

@Injectable({
  providedIn: 'root'
})
export class servListBenef{
  private URL = config.URL;

  constructor(private http: HttpClient) {}

  // ======= ======= ======= GET PERSONAS ======= ======= =======
  getlistBeneficiariosByBene(idBeneficiario:any): Observable<any> {
    const params =  {
        "procedure_name": "sp_proy_bene_lista",
        "body": {
            "params": [
           
                {"name": "p_accion","value": "C2","type": "string"},
                {"name": "p_id_proy_bene_lista","value": null,"type": "int"},
                {"name": "p_id_proy_beneficiario","value":idBeneficiario,"type": "int"}
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