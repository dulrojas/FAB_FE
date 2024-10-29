import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiciosService {
  private URL = 'https://foro-condominios.com/apiFanDev/sp';
  private URLglobal = 'https://foro-condominios.com/apiFanDev/';
  private URLreporte = 'https://foro-condominios.com/apiFanDev/reporte/expensasResponsable';

  constructor(private http: HttpClient) {}

  auth(usr: string, pass: string): Observable<any> {
    const params = {
      procedure_name: 'sp_persona',
      body: {
        params: [
          { name: 'p_accion', value: 'C2', type: 'string' },
          { name: 'p_usuario', value: usr, type: 'string' },
          { name: 'p_password', value: pass, type: 'string' }
        ]
      }
    };

    const headers = new HttpHeaders({
      'ip': sessionStorage.getItem('ip') || ''
    });

    return this.http.post<any>(this.URL, params, { headers });
  }
}
