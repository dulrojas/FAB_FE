import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProyectoService {
  private proyectoSeleccionado = new Subject<any>();

  proyectoSeleccionado$ = this.proyectoSeleccionado.asObservable();

  seleccionarProyecto(proyecto: any) {
    this.proyectoSeleccionado.next(proyecto);
  }
}
