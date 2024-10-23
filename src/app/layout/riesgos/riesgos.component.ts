import { Component, OnInit, TemplateRef } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Definimos la estructura del riesgo
interface Riesgo {
  id: number;
  categoria: string;
  identificacion: string;
  riesgo: string;
  impacto: string;
  probabilidad: string;
  nivelRiesgo: string;
  tomarMedidas: string;
  efectividad: string;
  comentarios: string;
  seleccionado: boolean;
}

@Component({
  selector: 'app-riesgos',
  templateUrl: './riesgos.component.html',
  styleUrls: ['./riesgos.component.scss'],
  animations: [routerTransition()]
})
export class RiesgosComponent implements OnInit {
  riesgos: Riesgo[] = [
    { id: 1, categoria: 'Político', identificacion: '2024-05-02', riesgo: 'Impedimento legal', impacto: 'Alto', probabilidad: 'Bajo', nivelRiesgo: 'Alto', tomarMedidas: 'No', efectividad: 'No efectiva', comentarios: '', seleccionado: false },
    { id: 2, categoria: 'Ambiental', identificacion: '2024-06-02', riesgo: 'Incendio', impacto: 'Medio', probabilidad: 'Medio', nivelRiesgo: 'Medio', tomarMedidas: 'Sí', efectividad: 'De bajo efecto', comentarios: '', seleccionado: false },
    { id: 3, categoria: 'Social', identificacion: '2024-07-02', riesgo: 'Protestas', impacto: 'Bajo', probabilidad: 'Alto', nivelRiesgo: 'Bajo', tomarMedidas: 'Sí', efectividad: 'Efectiva', comentarios: '', seleccionado: false },
    { id: 5, categoria: 'Ambiental', identificacion: '2024-06-02', riesgo: 'Incendio', impacto: 'Medio', probabilidad: 'Medio', nivelRiesgo: 'Medio', tomarMedidas: 'Sí', efectividad: 'De bajo efecto', comentarios: '', seleccionado: false },
    { id: 6, categoria: 'Social', identificacion: '2024-07-02', riesgo: 'Protestas', impacto: 'Bajo', probabilidad: 'Alto', nivelRiesgo: 'Bajo', tomarMedidas: 'Sí', efectividad: 'Efectiva', comentarios: '', seleccionado: false },
    { id: 7, categoria: 'Político', identificacion: '2024-05-02', riesgo: 'Impedimento legal', impacto: 'Alto', probabilidad: 'Bajo', nivelRiesgo: 'Alto', tomarMedidas: 'No', efectividad: 'No efectiva', comentarios: '', seleccionado: false },
    { id: 8, categoria: 'Ambiental', identificacion: '2024-06-02', riesgo: 'Incendio', impacto: 'Medio', probabilidad: 'Medio', nivelRiesgo: 'Medio', tomarMedidas: 'Sí', efectividad: 'De bajo efecto', comentarios: '', seleccionado: false },
    { id: 9, categoria: 'Social', identificacion: '2024-07-02', riesgo: 'Protestas', impacto: 'Bajo', probabilidad: 'Alto', nivelRiesgo: 'Bajo', tomarMedidas: 'Sí', efectividad: 'Efectiva', comentarios: '', seleccionado: false },
    { id: 10, categoria: 'Político', identificacion: '2024-05-02', riesgo: 'Impedimento legal', impacto: 'Alto', probabilidad: 'Bajo', nivelRiesgo: 'Alto', tomarMedidas: 'No', efectividad: 'No efectiva', comentarios: '', seleccionado: false },
    { id: 11, categoria: 'Ambiental', identificacion: '2024-06-02', riesgo: 'Incendio', impacto: 'Medio', probabilidad: 'Medio', nivelRiesgo: 'Medio', tomarMedidas: 'Sí', efectividad: 'De bajo efecto', comentarios: '', seleccionado: false },
    { id: 12, categoria: 'Social', identificacion: '2024-07-02', riesgo: 'Protestas', impacto: 'Bajo', probabilidad: 'Alto', nivelRiesgo: 'Bajo', tomarMedidas: 'Sí', efectividad: 'Efectiva', comentarios: '', seleccionado: false }
  ];

  // Variables
  selectedRiesgo: Riesgo | null = null;
  riesgoForm: FormGroup;
  page = 1;
  pageSize = 9;

  constructor(private modalService: NgbModal, private fb: FormBuilder) {}

  ngOnInit() {
    this.initForm();
  }

  // Inicializamos el formulario con validaciones
  private initForm() {
    this.riesgoForm = this.fb.group({
      categoria: ['', Validators.required],
      identificacion: ['', Validators.required],
      riesgo: ['', Validators.required],
      impacto: ['', Validators.required],
      probabilidad: ['', Validators.required],
      nivelRiesgo: ['', Validators.required],
      tomarMedidas: ['', Validators.required],
      efectividad: ['', Validators.required],
      comentarios: [''] // El campo de comentarios no es obligatorio
    });
  }

  // Método para obtener los riesgos paginados
  get riesgosPaginados() {
    const start = (this.page - 1) * this.pageSize;
    return this.riesgos.slice(start, start + this.pageSize);
  }

  // Método para manejar cambios en el checkbox de selección de riesgo
  checkboxChanged(selectedRiesgo: Riesgo) {
    this.riesgos.forEach(riesgo => {
      riesgo.seleccionado = riesgo.id === selectedRiesgo.id;
    });
  }

  // Método para seleccionar un riesgo y cargarlo en el formulario
  selectRiesgo(riesgo: Riesgo) {
    this.selectedRiesgo = riesgo;
    this.riesgoForm.patchValue(riesgo);
  }

  // Abrir el modal para crear o editar un riesgo
  openModal(modal: TemplateRef<any>, riesgo?: Riesgo) {
    this.selectedRiesgo = riesgo || null;
    if (riesgo) {
      this.riesgoForm.patchValue(riesgo); // Cargamos los datos del riesgo seleccionado
    } else {
      this.riesgoForm.reset(); // Reseteamos el formulario para crear un nuevo riesgo
    }
    this.modalService.open(modal);
  }

  // Guardar o actualizar un riesgo
  onSave(modal: any) {
    if (this.riesgoForm.valid) {
      const riesgoData = { 
        ...this.riesgoForm.value, 
        id: this.selectedRiesgo ? this.selectedRiesgo.id : this.riesgos.length + 1 // Asignamos el ID
      };

      if (this.selectedRiesgo) {
        // Actualizamos un riesgo existente
        const index = this.riesgos.findIndex(r => r.id === this.selectedRiesgo.id);
        if (index !== -1) {
          this.riesgos[index] = riesgoData;
        }
      } else {
        // Añadimos un nuevo riesgo
        this.riesgos.push(riesgoData);
      }
      
      modal.dismiss();
      this.selectedRiesgo = null; 
    } else {
      console.error("Formulario inválido");
    }
  }

  // Eliminar un riesgo
  onDelete() {
    if (this.selectedRiesgo) {
      this.riesgos = this.riesgos.filter(r => r.id !== this.selectedRiesgo.id);
      this.selectedRiesgo = null;
    } else {
      console.warn("No hay riesgo seleccionado para eliminar");
    }
  }
}

