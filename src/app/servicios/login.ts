import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import config from './config';

@Injectable({
  providedIn: 'root'
})
export class servLogin {
  private URL = config.URL;

  constructor(private http: HttpClient) {}

  // ======= ======= ======= GET APRENDIZAJES ======= ======= =======
  authUser(user: string, pass: string): Observable<any> {
    const params = {
      "procedure_name": "sp_login",
      "body": {
        "params": [
          { "name": "p_accion", "value": "C1", "type": "string" },
          { "name": "p_user", "value": user, "type": "string" },
          { "name": "p_password", "value": pass, "type": "string" }
        ]
      }
    };

    const ip = sessionStorage.getItem('ip') || '';
    const headers = new HttpHeaders({
      'ip':"127.0.0.1"
    });

    return this.http.post<any>(this.URL, params, { headers });
  }
  // ======= ======= ======= ======= ======= ======= =======
}
