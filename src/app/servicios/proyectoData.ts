import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {
  private idProyectoSource = new BehaviorSubject<number | null>(null);
  idProyecto$ = this.idProyectoSource.asObservable();

  setIdProyecto(id: number): void {
    this.idProyectoSource.next(id);
  }

  getIdProyecto(): number | null {
    return this.idProyectoSource.getValue();
  }
}
