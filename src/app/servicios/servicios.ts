import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class servicios{
  private URL = environment.URL;
  private URLUpload = environment.URLUploadFile;
  private URLDownload = environment.URLDownloadFile;

  constructor(private http: HttpClient) {}

  // ======= ======= ======= GET PERSONAS ======= ======= =======
  getParametricaByIdTipo(idTipo: any): Observable<any> {
    const params = {
      "procedure_name": "sp_parametrica",
      "body": {
        "params": [
          {"name": "p_accion","value": "C2","type": "string"},
          {"name": "p_idp","value": null,"type": "int"},
          {"name": "p_id_tipo","value": idTipo,"type": "int"},
          {"name": "p_descripcion_tipo","value": null,"type": "string"},
          {"name": "p_id_subtipo","value": null,"type": "int"},
          {"name": "p_descripcion_subtipo","value": null,"type": "string"},
          {"name": "p_id_estado","value": null,"type": "int"},
          {"name": "p_id_padre","value": null,"type": "int"},
          {"name": "p_valor_subtipo","value": null,"type": "int"}
        ]
      }
    };

    const ip = sessionStorage.getItem('ip') || '';
    const headers = new HttpHeaders({
      'ip': "127.0.0.1"
    });

    return this.http.post<any>(this.URL, params, { headers });
  }
  // ======= ======= ======= GET PADRE======= ======= =======
  getParametricaByIdPadre(idPadre: any): Observable<any> {
    const params = {
      "procedure_name": "sp_parametrica",
      "body": {
        "params": [
          {"name": "p_accion","value": "C3","type": "string"},
          {"name": "p_idp","value": null,"type": "int"},
          {"name": "p_id_tipo","value": null,"type": "int"},
          {"name": "p_descripcion_tipo","value": null,"type": "string"},
          {"name": "p_id_subtipo","value": null,"type": "int"},
          {"name": "p_descripcion_subtipo","value": null,"type": "string"},
          {"name": "p_id_estado","value": null,"type": "int"},
          {"name": "p_id_padre","value": idPadre,"type": "int"},
          {"name": "p_valor_subtipo","value": null,"type": "int"}
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
  // ======= ======= ======= GET PRESUPUESTO EJECUTADO ======= ======= =======
  getPresupuestoEjecutadoByIdProy(idProy: any): Observable<any> {
    const params = {
      "procedure_name": "sp_proy_presupuesto_ejecutado",
      "body": {
        "params": [
          {"name": "p_accion","value": "C1","type": "string"},
          {"name": "p_id_proyecto","value": idProy,"type": "int"},
          {"name": "p_fecha_gestion","value": null,"type": "string"}
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
  // ======= ======= ======= GET PRESUPUESTO EJECUTADO BY IDPROY AND YEAR ======= ======= =======
  getPresupuestoEjecutadoByIdProyAndYear(idProy: number, gesYear: string): Observable<any> {
    const params = {
      "procedure_name": "sp_proy_presupuesto_ejecutado",
      "body": {
        "params": [
          {"name": "p_accion","value": "C2","type": "string"},
          {"name": "p_id_proyecto","value": idProy,"type": "int"},
          {"name": "p_fecha_gestion","value": gesYear,"type": "string"}
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
  // ======= ======= ======= GET UNIDADES ======= ======= =======
  getUnidades(): Observable<any> {
    const params = {
      "procedure_name": "sp_inst_unidades",
      "body": {
        "params": [
          {"name": "p_accion","value": "C1","type": "string"},
          {"name": "p_id_inst_unidad","value": null,"type": "int"},
          {"name": "p_id_institucion","value": null,"type": "int"},
          {"name": "p_unidad","value": null,"type": "string"},
          {"name": "p_descripcion","value": null,"type": "string"},
          {"name": "p_id_persona_resp","value": null,"type": "int"},
          {"name": "p_idp_estado","value": null,"type": "int"},
          {"name": "p_orden","value": null,"type": "int"}
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
  // ======= ======= ======= EDIT UNIDADES ======= ======= =======
  editUnidades(obj: any): Observable<any> {
    const params = {
      "procedure_name": "sp_inst_unidades",
      "body": {
        "params": [
          {"name": "p_accion","value": "M1","type": "string"},
          {"name": "p_id_inst_unidad","value": obj.id_inst_unidad,"type": "int"},
          {"name": "p_id_institucion","value": obj.id_institucion,"type": "int"},
          {"name": "p_unidad","value": obj.unidad,"type": "string"},
          {"name": "p_descripcion","value": obj.descripcion,"type": "string"},
          {"name": "p_id_persona_resp","value": obj.id_persona_resp,"type": "int"},
          {"name": "p_idp_estado","value": obj.idp_estado,"type": "int"},
          {"name": "p_orden","value": obj.orden,"type": "int"}
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
  // ======= ======= ======= GET GESTION ======= ======= =======
  getGestion(): Observable<any> {
    const params = {
      "procedure_name": "sp_gestion",
      "body": {
        "params": [
          {"name": "p_accion","value": "C1","type": "string"},
          {"name": "p_gestion_actual","value": null,"type": "int"},
          {"name": "p_id_persona_reg","value": null,"type": "int"}
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
  // ======= ======= ======= EDIT GESTION ======= ======= =======
  editGestion(gesAct: string, idPerReg: number): Observable<any> {
    const params = {
      "procedure_name": "sp_gestion",
      "body": {
        "params": [
          {"name": "p_accion","value": "M1","type": "string"},
          {"name": "p_gestion_actual","value": gesAct,"type": "string"},
          {"name": "p_id_persona_reg","value": idPerReg,"type": "int"}
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
  // ======= ======= ======= UPLOAD FILE ======= ======= =======
  uploadFile(file: any, nombreTabla: any, campoTabla: any, idEnTabla: any, nombreRegistro: any, idRegistro: any): Observable<any> {
    let formData = new FormData();
    formData.append('file', file);
    formData.append('nombre_tabla', nombreTabla);
    formData.append('campo_tabla', campoTabla);
    formData.append('id_en_tabla', idEnTabla);
    formData.append('nombre_registro', nombreRegistro);
    formData.append('id_registro', idRegistro);

    const ip = sessionStorage.getItem('ip') || '';
    const headers = new HttpHeaders({
      'ip': "127.0.0.1"
    });
    return this.http.post<any>(this.URLUpload, formData, { headers });
  }
  // ======= ======= ======= ======= ======= ======= =======
  // ======= ======= ======= DOWNLOAD FILE ======= ======= =======
  downloadFile(nombreTabla: any, campoTabla: any, idEnTabla: any, idRegistro: any): Observable<any> {
    let formData = new FormData();
    formData.append('nombre_tabla', nombreTabla);
    formData.append('campo_tabla', campoTabla);
    formData.append('id_en_tabla', idEnTabla);
    formData.append('id_registro', idRegistro);

    const ip = sessionStorage.getItem('ip') || '';
    const headers = new HttpHeaders({
      'ip': "127.0.0.1"
    });
    return this.http.post<any>(this.URLDownload, formData, { headers, responseType: 'blob' as 'json' });
  }
  // ======= ======= ======= ======= ======= ======= =======
}
