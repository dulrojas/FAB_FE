import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import config from './config';
import { log } from 'console';

@Injectable({
  providedIn: 'root',
})

export class servBeneficiarios {
    private URL = config.URL;
    private URLimportar = config.URLimportar;
    private URLexportar = config.URLexportar;
    constructor(private http: HttpClient) {}

    // ======= ======= ======= ======= ======= ======= =======
    // ======= =======    GET BENEFICIARIOS    ======= =======
    // ======= ======= ======= ======= ======= ======= =======
        getBeneficiarios(): Observable<any> {
            const params = {
                "procedure_name": "sp_beneficiarios",
                "body": {
                "params": [
                    { "name": "p_accion", "value": "C1", "type": "string" },
                    { "name": "p_id_proy_beneficiario", "value": null, "type": "int" },
                    { "name": "p_id_proyecto", "value": null, "type": "int" },
                    { "name": "p_mujeres", "value": null, "type": "int" },
                    { "name": "p_hombres", "value": null, "type": "int" },
                    { "name": "p_titulo_evento", "value": null, "type": "string" },
                    { "name": "p_evento_detalle", "value": null, "type": "string" },
                    { "name": "p_id_ubica_geo_depto", "value": null, "type": "int" },
                    { "name": "p_id_ubica_geo_muni", "value": null, "type": "int" },
                    { "name": "p_id_ubica_geo_comu", "value": null, "type": "int" },
                    { "name": "p_id_proy_actividad", "value": null, "type": "int" },
                    { "name": "p_idp_tipo_evento", "value": null, "type": "int" },
                    { "name": "p_ruta_documento", "value": null, "type": "string" },
                    { "name": "p_id_persona_reg", "value": null, "type": "int" },
                    { "name": "p_fecha", "value": null, "type": "string" },
                    { "name": "p_fecha_hora_reg", "value": null, "type": "string" }
                ]
                }
            };        
                const ip = localStorage.getItem('ip') || '127.0.0.1';
                const headers = new HttpHeaders({
                    'ip': ip
                });       
            return this.http.post<any>(this.URL, params, { headers });
        }
    // ======= ======= ======= ======= ======= ======= =======
    // ======= == GET BENEFICIARIOS POR ID PROYECTO == =======
    // ======= ======= ======= ======= ======= ======= =======
        getBeneficiariosByIdProy(idProy: any): Observable<any>{
            const params = {
                "procedure_name": "sp_beneficiarios",
                "body": {
                "params": [
                    { "name": "p_accion", "value": "C3", "type": "string" },
                    { "name": "p_id_proy_beneficiario", "value": null, "type": "int" },
                    { "name": "p_id_proyecto", "value": idProy, "type": "int" },
                    { "name": "p_mujeres", "value": null, "type": "int" },
                    { "name": "p_hombres", "value": null, "type": "int" },
                    { "name": "p_titulo_evento", "value": null, "type": "string" },
                    { "name": "p_evento_detalle", "value": null, "type": "string" },
                    { "name": "p_id_ubica_geo_depto", "value": null, "type": "int" },
                    { "name": "p_id_ubica_geo_muni", "value": null, "type": "int" },
                    { "name": "p_id_ubica_geo_comu", "value": null, "type": "int" },
                    { "name": "p_id_proy_actividad", "value": null, "type": "int" },
                    { "name": "p_idp_tipo_evento", "value": null, "type": "int" },
                    { "name": "p_ruta_documento", "value": null, "type": "string" },
                    { "name": "p_id_persona_reg", "value": null, "type": "int" },
                    { "name": "p_fecha", "value": null, "type": "string" },
                    { "name": "p_fecha_hora_reg", "value": null, "type": "string" }
                ]
                }
            };
                const ip = localStorage.getItem('ip') || '127.0.0.1';
                const headers = new HttpHeaders({
                    'ip': ip
                });
            return this.http.post<any>(this.URL, params, { headers });
        }
    // ======= ======= ======= ======= ======= ======= =======
    // ======= == GET BENEFICIARIOS POR ID PROYECTO == =======
    // ======= ======= ======= ======= ======= ======= =======
    getBeneficiariosListaPorIdProy(idProy: any): Observable<any>{
        const params = {
            "procedure_name": "sp_beneficiarios",
            "body": {
            "params": [
                { "name": "p_accion", "value": "C4", "type": "string" },
                { "name": "p_id_proy_beneficiario", "value": null, "type": "int" },
                { "name": "p_id_proyecto", "value": idProy, "type": "int" },
                { "name": "p_mujeres", "value": null, "type": "int" },
                { "name": "p_hombres", "value": null, "type": "int" },
                { "name": "p_titulo_evento", "value": null, "type": "string" },
                { "name": "p_evento_detalle", "value": null, "type": "string" },
                { "name": "p_id_ubica_geo_depto", "value": null, "type": "int" },
                { "name": "p_id_ubica_geo_muni", "value": null, "type": "int" },
                { "name": "p_id_ubica_geo_comu", "value": null, "type": "int" },
                { "name": "p_id_proy_actividad", "value": null, "type": "int" },
                { "name": "p_idp_tipo_evento", "value": null, "type": "int" },
                { "name": "p_ruta_documento", "value": null, "type": "string" },
                { "name": "p_id_persona_reg", "value": null, "type": "int" },
                { "name": "p_fecha", "value": null, "type": "string" },
                { "name": "p_fecha_hora_reg", "value": null, "type": "string" }
            ]
            }
        };
            const ip = localStorage.getItem('ip') || '127.0.0.1';
            const headers = new HttpHeaders({
                'ip': ip
            });
        return this.http.post<any>(this.URL, params, { headers });
    }
    // ======= ======= ======= ======= ======= ======= =======
    // ======= =======     ADD BENEFICIARIO    ======= =======
    // ======= ======= ======= ======= ======= ======= ======= 
        addBeneficiario(obj: any): Observable<any> {
            const params = {                
                "procedure_name": "sp_beneficiarios",
                "body": {
                "params": [
                    { "name": "p_accion", "value": "A1", "type": "string" },
                    { "name": "p_id_proy_beneficiario", "value": null, "type": "int" },
                    { "name": "p_id_proyecto", "value": obj.p_id_proyecto, "type": "int" },
                    { "name": "p_mujeres", "value": obj.p_mujeres, "type": "int" },
                    { "name": "p_hombres", "value": obj.p_hombres, "type": "int" },
                    { "name": "p_titulo_evento", "value": obj.p_titulo_evento, "type": "string" },
                    { "name": "p_evento_detalle", "value": obj.p_evento_detalle, "type": "string" },
                    { "name": "p_id_ubica_geo_depto", "value": obj.p_id_ubica_geo_depto, "type": "int" },
                    { "name": "p_id_ubica_geo_muni", "value": obj.p_id_ubica_geo_muni, "type": "int" },
                    { "name": "p_id_ubica_geo_comu", "value": obj.p_id_ubica_geo_comu, "type": "int" },
                    { "name": "p_id_proy_actividad", "value": obj.p_id_proy_actividad, "type": "int" },
                    { "name": "p_idp_tipo_evento", "value": obj.p_idp_tipo_evento, "type": "int" },
                    { "name": "p_ruta_documento", "value": obj.p_ruta_documento, "type": "string" },
                    { "name": "p_id_persona_reg", "value": obj.p_id_persona_reg, "type": "int" },
                    { "name": "p_fecha", "value": obj.p_fecha, "type": "string" },
                    { "name": "p_fecha_hora_reg", "value": null, "type": "string" }
                ]
                }
            };
                const ip = localStorage.getItem('ip') || '127.0.0.1';
                const headers = new HttpHeaders({
                'ip': ip
                });
            return this.http.post<any>(this.URL, params, { headers });
        }
    // ======= ======= ======= ======= ======= ======= =======
    // ======= =======    EDIT BENEFICIARIO    ======= =======
    // ======= ======= ======= ======= ======= ======= =======
        editBeneficiario(obj: any): Observable<any> {
            const params = {
                "procedure_name": "sp_beneficiarios",
                "body": {
                "params": [
                    { "name": "p_accion", "value": "M1", "type": "string" },
                    { "name": "p_id_proy_beneficiario", "value": obj.p_id_proy_beneficiario, "type": "int" },
                    { "name": "p_id_proyecto", "value": obj.p_id_proyecto, "type": "int" },
                    { "name": "p_mujeres", "value": obj.p_mujeres, "type": "int" },
                    { "name": "p_hombres", "value": obj.p_hombres, "type": "int" },
                    { "name": "p_titulo_evento", "value": obj.p_titulo_evento, "type": "string" },
                    { "name": "p_evento_detalle", "value": obj.p_evento_detalle, "type": "string" },
                    { "name": "p_id_ubica_geo_depto", "value": obj.p_id_ubica_geo_depto, "type": "int" },
                    { "name": "p_id_ubica_geo_muni", "value": obj.p_id_ubica_geo_muni, "type": "int" },
                    { "name": "p_id_ubica_geo_comu", "value": obj.p_id_ubica_geo_comu, "type": "int" },
                    { "name": "p_id_proy_actividad", "value": obj.p_id_proy_actividad, "type": "int" },
                    { "name": "p_idp_tipo_evento", "value": obj.p_idp_tipo_evento, "type": "int" },
                    { "name": "p_ruta_documento", "value": obj.p_ruta_documento, "type": "string" },
                    { "name": "p_id_persona_reg", "value": obj.p_id_persona_reg, "type": "int" },
                    { "name": "p_fecha", "value": obj.p_fecha, "type": "string" },
                    { "name": "p_fecha_hora_reg", "value": obj.p_fecha_hora_reg, "type": "string" }
                ]
                }
            };
                const ip = localStorage.getItem('ip') || '127.0.0.1';
                const headers = new HttpHeaders({
                    'ip': ip
                });
            return this.http.post<any>(this.URL, params, { headers });
        }
    // ======= ======= ======= ======= ======= ======= =======
    // ======= =======   DELETE BENEFICIARIO   ======= =======
    // ======= ======= ======= ======= ======= ======= =======
    deleteBeneficiario(idBeneficiario: number): Observable<any> {
        const params = {
            "procedure_name": "sp_beneficiarios",
            "body": {
            "params": [
                { "name": "p_accion", "value": "D1", "type": "string" },
                { "name": "p_id_proy_beneficiario", "value": idBeneficiario, "type": "int" },
                { "name": "p_id_proyecto", "value": null, "type": "int" },
                { "name": "p_mujeres", "value": null, "type": "int" },
                { "name": "p_hombres", "value": null, "type": "int" },
                { "name": "p_titulo_evento", "value": null, "type": "string" },
                { "name": "p_evento_detalle", "value": null, "type": "string" },
                { "name": "p_id_ubica_geo_depto", "value": null, "type": "int" },                    
                { "name": "p_id_ubica_geo_muni", "value": null, "type": "int" },
                { "name": "p_id_ubica_geo_comu", "value": null, "type": "int" },
                { "name": "p_id_proy_actividad", "value": null, "type": "int" },
                { "name": "p_idp_tipo_evento", "value": null, "type": "int" },
                { "name": "p_ruta_documento", "value": null, "type": "string" },
                { "name": "p_id_persona_reg", "value": null, "type": "int" },
                { "name": "p_fecha", "value": null, "type": "string" },
                { "name": "p_fecha_hora_reg", "value": null, "type": "string" }
            ]
            }
        };
            const ip = localStorage.getItem('ip') || '127.0.0.1';
            const headers = new HttpHeaders({
                'ip': ip
            });
        return this.http.post<any>(this.URL, params, { headers });
    }

     // ======= ======= ======= ======= ======= ======= =======
    // ======= =======   DELETE BENEFICIARIO   ======= =======
    // ======= ======= ======= ======= ======= ======= =======
    importarData(file:File,id_proy_beneficiario: string): Observable<any> {
        console.log(id_proy_beneficiario);
        const formData: FormData = new FormData();
        formData.append('file', file); 
        formData.append('id_proy_beneficiario', id_proy_beneficiario); 
        console.log(formData);
        return this.http.post(`${this.URLimportar}`, formData).pipe(
            catchError((error) => {
              // Aquí manejas el error
              console.error('Error al importar datos:', error);
      
              // Puedes personalizar el mensaje de error según el tipo de error
              let errorMessage = 'Ocurrió un error al importar los datos.';
              if (error.status === 400) {
                errorMessage = 'Error en los datos enviados. Verifica el archivo e intenta nuevamente.';
              } else if (error.status === 500) {
                console.log(error);
                errorMessage = error.error;
              }
      
              // Relanza el error para que el componente que llama a este servicio pueda manejarlo si es necesario
              return throwError(() => new Error(errorMessage));
            })
          );
    }

    exportarData(id_proy_beneficiario: string): Observable<Blob> {
        //const headers = new HttpHeaders().set('ip', '127.0.0.1');
        var jsonData = {"id_proy_beneficiario": id_proy_beneficiario};
        return this.http.post(`${this.URLexportar}`, jsonData,{ responseType: 'blob' });
    }
}  