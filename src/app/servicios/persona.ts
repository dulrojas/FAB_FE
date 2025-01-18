import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import config from './config';

@Injectable({
  providedIn: 'root'
})
export class servPersona{
  private URL = config.URL;

  constructor(private http: HttpClient) {}

  // ======= ======= ======= GET PERSONAS ======= ======= =======
  getPersonas(): Observable<any> {
    const params = {
        "procedure_name": "sp_persona",
        "body": {
            "params": [
                {"name": "p_accion","value": "C2","type": "string"},
                {"name": "p_id_persona","value": null,"type": "int"},
                {"name": "p_nombres","value": null,"type": "string"},
                {"name": "p_apellido_1","value": null,"type": "string"},
                {"name": "p_apellido_2","value": null,"type": "string"},
                {"name": "p_nro_documento","value": null,"type": "string"},
                {"name": "p_correo","value": null,"type": "string"},
                {"name": "p_telefono","value": null,"type": "string"},
                {"name": "p_fecha_registro","value": null,"type": "string"},
                {"name": "p_usuario","value": null,"type": "string"},
                {"name": "p_contrasenia","value": null,"type": "string"},
                {"name": "p_ruta_foto","value": null,"type": "string"},
                {"name": "p_idp_tipo_documento","value": null,"type": "int"},
                {"name": "p_idp_estado","value": null,"type": "int"},
                {"name": "p_idp_tipo_red_social","value": null,"type": "int"},
                {"name": "p_firebase","value": null,"type": "string"},
                {"name": "p_id_tipo_institucion","value": null,"type": "int"},
                {"name": "p_id_inst_unidad","value": null,"type": "int"},
                {"name": "p_cargo","value": null,"type": "string"},
                {"name": "p_admi_sistema","value": null,"type": "boolean"},
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
  // ======= ======= ======= ADD PERSONA ======= ======= =======
  addPersona(obj: any): Observable<any> {
    const params = {
        "procedure_name": "sp_persona",
        "body": {
            "params": [
                {"name": "p_accion","value": "A1","type": "string"},
                {"name": "p_id_persona","value": null,"type": "int"},
                {"name": "p_nombres","value": obj.p_nombres,"type": "string"},
                {"name": "p_apellido_1","value": obj.p_apellido_1,"type": "string"},
                {"name": "p_apellido_2","value": obj.p_apellido_2,"type": "string"},
                {"name": "p_nro_documento","value": obj.p_nro_documento,"type": "string"},
                {"name": "p_correo","value": obj.p_correo,"type": "string"},
                {"name": "p_telefono","value": obj.p_telefono,"type": "string"},
                {"name": "p_fecha_registro","value": obj.p_fecha_registro,"type": "string"},
                {"name": "p_usuario","value": obj.p_usuario,"type": "string"},
                {"name": "p_contrasenia","value": obj.p_contrasenia,"type": "string"},
                {"name": "p_ruta_foto","value": obj.p_ruta_foto,"type": "string"},
                {"name": "p_idp_tipo_documento","value": obj.p_idp_tipo_documento,"type": "int"},
                {"name": "p_idp_estado","value": obj.p_idp_estado,"type": "int"},
                {"name": "p_idp_tipo_red_social","value": obj.p_idp_tipo_red_social,"type": "int"},
                {"name": "p_firebase","value": obj.p_firebase,"type": "string"},
                {"name": "p_id_tipo_institucion","value": obj.p_id_tipo_institucion,"type": "int"},
                {"name": "p_id_inst_unidad","value": obj.p_id_inst_unidad,"type": "int"},
                {"name": "p_cargo","value": obj.p_cargo,"type": "string"},
                {"name": "p_admi_sistema","value": obj.p_admi_sistema,"type": "boolean"},
                {"name": "p_id_persona_reg","value": obj.p_id_persona_reg,"type": "int"}
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
  // ======= ======= ======= EDIT PERSONA ======= ======= =======
  editPersona(obj: any): Observable<any> {
    const params = {
        "procedure_name": "sp_persona",
        "body": {
            "params": [
                {"name": "p_accion","value": "M1","type": "string"},
                {"name": "p_id_persona","value": obj.p_id_persona,"type": "int"},
                {"name": "p_nombres","value": obj.p_nombres,"type": "string"},
                {"name": "p_apellido_1","value": obj.p_apellido_1,"type": "string"},
                {"name": "p_apellido_2","value": obj.p_apellido_2,"type": "string"},
                {"name": "p_nro_documento","value": obj.p_nro_documento,"type": "string"},
                {"name": "p_correo","value": obj.p_correo,"type": "string"},
                {"name": "p_telefono","value": obj.p_telefono,"type": "string"},
                {"name": "p_fecha_registro","value": obj.p_fecha_registro,"type": "string"},
                {"name": "p_usuario","value": obj.p_usuario,"type": "string"},
                {"name": "p_contrasenia","value": obj.p_contrasenia,"type": "string"},
                {"name": "p_ruta_foto","value": obj.p_ruta_foto,"type": "string"},
                {"name": "p_idp_tipo_documento","value": obj.p_idp_tipo_documento,"type": "int"},
                {"name": "p_idp_estado","value": obj.p_idp_estado,"type": "int"},
                {"name": "p_idp_tipo_red_social","value": obj.p_idp_tipo_red_social,"type": "int"},
                {"name": "p_firebase","value": obj.p_firebase,"type": "string"},
                {"name": "p_id_tipo_institucion","value": obj.p_id_tipo_institucion,"type": "int"},
                {"name": "p_id_inst_unidad","value": obj.p_id_inst_unidad,"type": "int"},
                {"name": "p_cargo","value": obj.p_cargo,"type": "string"},
                {"name": "p_admi_sistema","value": obj.p_admi_sistema,"type": "boolean"},
                {"name": "p_id_persona_reg","value": obj.p_id_persona_reg,"type": "int"}
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
