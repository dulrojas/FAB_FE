import { Component, OnInit, TemplateRef } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
    { id: 3, categoria: 'Social', identificacion: '2024-07-02', riesgo: 'Protestas', impacto: 'Bajo', probabilidad: 'Alto', nivelRiesgo: 'Bajo', tomarMedidas: 'Sí', efectividad: 'Efectiva', comentarios: '', seleccionado: false }
  ];

  selectedRiesgo: Riesgo | null = null;
  riesgoForm: FormGroup;
  page = 1;
  pageSize = 5;

  constructor(private modalService: NgbModal, private fb: FormBuilder) {}

  ngOnInit() {
    this.riesgoForm = this.fb.group({
      categoria: ['', Validators.required],
      identificacion: ['', Validators.required],
      riesgo: ['', Validators.required],
      impacto: ['', Validators.required],
      probabilidad: ['', Validators.required],
      nivelRiesgo: ['', Validators.required],
      tomarMedidas: ['', Validators.required],
      efectividad: ['', Validators.required],
      comentarios: ['']
    });
  }

  get riesgosPaginados() {
    const start = (this.page - 1) * this.pageSize;
    return this.riesgos.slice(start, start + this.pageSize);
  }

  selectRiesgo(riesgo: Riesgo) {
    this.selectedRiesgo = riesgo;
  }

  openModal(modal: TemplateRef<any>, riesgo?: Riesgo) {
    this.selectedRiesgo = riesgo || null;
    if (riesgo) {
      this.riesgoForm.patchValue(riesgo);
    } else {
      this.riesgoForm.reset();
    }
    this.modalService.open(modal);
  }

  onSave(modal: any) {
    if (this.riesgoForm.valid) {
      const riesgoData = { ...this.riesgoForm.value, id: this.selectedRiesgo ? this.selectedRiesgo.id : this.riesgos.length + 1 };
      if (this.selectedRiesgo) {
        const index = this.riesgos.findIndex(r => r.id === this.selectedRiesgo.id);
        this.riesgos[index] = riesgoData;
      } else {
        this.riesgos.push(riesgoData);
      }
      modal.dismiss();
      this.selectedRiesgo = null; 
    }
  }

  onDelete() {
    if (this.selectedRiesgo) {
      this.riesgos = this.riesgos.filter(r => r.id !== this.selectedRiesgo.id);
      this.selectedRiesgo = null; 
    }
  }
}
