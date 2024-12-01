import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class servEjecEstrategica {
  private apiUrl: string = 'http://localhost:3000/api/indicadores'; // URL del backend

  constructor(private http: HttpClient) {}

  /**
   * Obtiene los indicadores estratégicos.
   * @param filtros - Parámetros opcionales para filtrar los datos.
   * @returns Observable con la lista de indicadores
   */
  obtenerIndicadores(filtros: any = {}): Observable<any[]> {
    let params = new HttpParams();
    Object.keys(filtros).forEach((key) => {
      if (filtros[key]) {
        params = params.append(key, filtros[key]);
      }
    });

    return this.http.get<any[]>(this.apiUrl, { params });
  }

  /**
   * Obtiene un indicador específico por su ID.
   * @param id - ID del indicador
   * @returns Observable con los detalles del indicador
   */
  obtenerIndicadorPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  /**
   * Actualiza los datos de un indicador.
   * @param id - ID del indicador
   * @param data - Datos a actualizar
   * @returns Observable con la respuesta del servidor
   */
  actualizarIndicador(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }
}
