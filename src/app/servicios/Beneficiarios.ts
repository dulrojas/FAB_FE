import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import config from './config';

@Injectable({
  providedIn: 'root'
})
export class BeneficiariosService {
  private URL = config.URL;

  constructor(private http: HttpClient) {}

  // Obtener todos los beneficiarios
  getBeneficiarios(id_proyecto): Observable<any> {
    console.log( ' este es el id del proyecto :', id_proyecto)
    const params = {
      "procedure_name": "sp_proy_beneficiarios",
      "body": {
        "params": [
          { "name": "p_accion", "value": "C1", "type": "string" },
          { "name": "p_id_proy_beneficiario", "value": null, "type": "int" },
          { "name": "", "value":id_proyecto, "type": "int" },
          { "name": "p_idp_organizacion_tipo", "value": null, "type": "int" }, 
          { "name": "p_id_organizacion", "value":null, "type": "int" },
          { "name": "p_id_tipo_geo_n3", "value": null, "type": "int" },
          { "name": "p_mujeres", "value":null, "type": "int" },
          { "name": "p_hombres", "value":null, "type": "int" },
          { "name": "p_id_persona_reg", "value":  null, "type": "int" },
          { "name": "p_fecha_hora_reg", "value": null, "type": "string" },
          { "name": "p_titulo_evento", "value": null, "type": "string" },
          { "name": "p_evento_detalle", "value":null, "type": "string" },
          { "name": "p_id_tipo_geo_n2", "value": null, "type": "int" },
          { "name": "p_id_proy_actividad", "value":  null, "type": "int" },
          { "name": "p_fecha", "value":  null, "type": "string" }
        ]
      }
    };
    const headers = new HttpHeaders({ 'ip': "127.0.0.1" });
    return this.http.post<any>(this.URL, params, { headers });
  }

  // Obtener beneficiarios por proyecto
  getBeneficiariosPorProyecto(idProyecto: number): Observable<any> {
    
    const params = {
        "procedure_name": "sp_proy_beneficiarios",
        "body": {
          "params": [
            { "name": "p_accion", "value": "C2", "type": "string" },
              { "name": "p_id_proy_beneficiario", "value":null, "type": "int" },
            { "name": "p_id_proyecto", "value": idProyecto, "type": "int" }
          ]
        }
      };
    const headers = new HttpHeaders({ 'ip': "127.0.0.1" });
    return this.http.post<any>(this.URL, params, { headers });
  }

/// obtener organizaciones por tipo
getOrganizacionesPorTipo(idTipo: number): Observable<any> {
    const params = {
        "procedure_name": "sp_organizaciones",
        "body": {
          "params": [
      
            { "name": "p_accion", "value": "C2", "type": "string" },
            { "name": "p_id_organizacion", "value": idTipo, "type": "int" }
      
          ]
        }
      };
    const headers = new HttpHeaders({ 'ip': "127.0.0.1" });
    return this.http.post<any>(this.URL, params, { headers });
    }


// ======= ======= ======= ADD Beneficiario ======= ======= =======
addBeneficiario(data: any): Observable<any> {

  console.log(' los datos a enviar de beneficiarios : ', data)
  const params = {
    "procedure_name": "sp_proy_beneficiarios",
    "body": {
      "params": [
        { "name": "p_accion", "value": "A1", "type": "string" },
        { "name": "p_id_proy_beneficiario", "value": null, "type": "int" },
        { "name": "p_id_proyecto", "value":data.id_proyecto, "type": "int" },
        { "name": "p_idp_organizacion_tipo", "value":data.tipoOrganizacion, "type": "int" }, 
        { "name": "p_id_organizacion", "value":data.organizacion, "type": "int" },
        { "name": "p_id_tipo_geo_n3", "value": data.comunidad, "type": "int" },
        { "name": "p_mujeres", "value":data.mujeres ,"type": "int" },
        { "name": "p_hombres", "value": data.hombres, "type": "int" },
        { "name": "p_id_persona_reg", "value": data.registeredBy, "type": "int" },
        { "name": "p_fecha_hora_reg", "value":new Date().toISOString(), "type": "string" },
        { "name": "p_titulo_evento", "value": data.evento, "type": "string" },
        { "name": "p_evento_detalle", "value":data.details, "type": "string" },
        { "name": "p_id_tipo_geo_n2", "value": data.municipio, "type": "int" },
        { "name": "p_id_proy_actividad", "value":data.actividad, "type": "int" },
        { "name": "p_fecha", "value": data.fecha, "type": "string" }
      ]
    }
  };
  console.log(' el params de beneficiarios : ',params)

  const headers = new HttpHeaders({ 'ip': '127.0.0.1' });
  return this.http.post<any>(this.URL, params, { headers });
}
// ======= ======= ======= edit Beneficiario ======= ======= =======
editBeneficiario(data: any): Observable<any> {
  const params = {
    "procedure_name": "sp_proy_beneficiarios",
    "body": {
      "params": [
        { "name": "p_accion", "value": "M1", "type": "string" },
        { "name": "p_id_proy_beneficiario", "value": data.id, "type": "int" },
        { "name": "p_id_proyecto", "value": data.id_proyecto || null, "type": "int" },
        { "name": "p_idp_organizacion_tipo", "value": data.tipoOrganizacion || null, "type": "int" }, 
        { "name": "p_id_organizacion", "value":data.organizacion||null, "type": "int" },
        { "name": "p_id_tipo_geo_n3", "value": data.comunidad || null, "type": "int" },
        { "name": "p_mujeres", "value": data.mujeres || 0, "type": "int" },
        { "name": "p_hombres", "value": data.hombres || 0, "type": "int" },
        { "name": "p_id_persona_reg", "value": data.registeredBy || null, "type": "int" },
        { "name": "p_fecha_hora_reg", "value": data.fecha_hora_reg || new Date().toISOString(), "type": "string" },
        { "name": "p_titulo_evento", "value": data.evento || '', "type": "string" },
        { "name": "p_evento_detalle", "value": data.details || '', "type": "string" },
        { "name": "p_id_tipo_geo_n2", "value": data.municipio || null, "type": "int" },
        { "name": "p_id_proy_actividad", "value": data.actividad || null, "type": "int" },
        { "name": "p_fecha", "value": data.fecha || null, "type": "string" },
      ]
    }
  };

  const headers = new HttpHeaders({ 'ip': '127.0.0.1' });
  return this.http.post<any>(this.URL, params, { headers });
}
  // Eliminar beneficiario
  deleteBeneficiario(id: number): Observable<any> {
    const params ={
      "procedure_name": "sp_proy_beneficiarios",
      "body": {
        "params": [
           { "name": "p_accion", "value": "D1", "type": "string" },
                { "name": "p_id_proy_beneficiario", "value": id, "type": "int" }
        ]
      }
    };
    const headers = new HttpHeaders({ 'ip': "127.0.0.1" });

  return this.http.post<any>(this.URL, params, { headers });
}

// ============== obtener las actividades 
getActividades( ): Observable<any> {
 
  const params = 
    {
      "procedure_name": "sp_proy_actividad",
      "body": {
        "params": [
          { "name": "p_accion", "value": "C1", "type": "string" }
      
        ]
      }
    };
    const headers = new HttpHeaders({ 'ip': "127.0.0.1" });
    return this.http.post<any>(this.URL, params, { headers });
    }
}