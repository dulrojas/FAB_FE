import { Component, OnInit, TemplateRef } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Beneficiario {
  id: number;
  fecha: string;
  municipio: string;
  comunidad: string;
  tipoOrganizacion: string;
  organizacion: string;
  actividad: string;
  evento: string;
  mujeres: number;
  hombres: number;
  total: number;
  selected?: boolean;
}

interface Aliado {
  id: number;
  fecha: string;
  institucion: string;
  referente: string;
  vinculo: string;
  convenio: string;
  selected?: boolean; // Para manejar la selección en la tabla
}

@Component({
  selector: 'app-beneficiarios',
  templateUrl: './beneficiarios.component.html',
  styleUrls: ['./beneficiarios.component.scss'],
  animations: [routerTransition()]
})
export class BeneficiariosComponent implements OnInit {
  beneficiariosTable: Beneficiario[] = [
    { id: 1, fecha: '2024-10-21', municipio: 'Municipio 1', comunidad: 'Comunidad 1', tipoOrganizacion: 'Organización A', organizacion: 'Organización 1', actividad: 'Actividad 1', evento: 'Evento 1', mujeres: 25, hombres: 30, total: 55 },
    // Agregar más beneficiarios si es necesario
  ];

  aliadosTable: Aliado[] = [
    { id: 1, fecha: '2024-10-21', institucion: 'Institución 1', referente: 'Referente 1', vinculo: 'Vínculo 1', convenio: 'Convenio 1' },
    // Agregar más aliados si es necesario
  ];

  selectedBeneficiarios: Beneficiario | null = null;
  selectedAliado: Aliado | null = null; // Para almacenar el aliado seleccionado
  beneficiariesForm: FormGroup;
  aliadosForm: FormGroup; // Formulario para Aliados
  mainPage = 1;
  mainPageSize = 9;
  totalLength = this.beneficiariosTable.length;
  totalLengthAliados = this.aliadosTable.length; // Longitud total para la tabla de aliados

  constructor(private modalService: NgbModal, private fb: FormBuilder) {}

  ngOnInit() {
    this.initForm();
    this.initAliadosForm(); // Inicializamos el formulario para Aliados
  }

  // Inicializamos el formulario de beneficiarios
  private initForm() {
    this.beneficiariesForm = this.fb.group({
      id: [{ value: '', disabled: true }],
      eventDate: ['', Validators.required],
      activity: ['', Validators.required],
      event: ['', Validators.required],
      department: ['', Validators.required],
      municipality: ['', Validators.required],
      community: ['', Validators.required],
      organizationType: ['', Validators.required],
      organizationName: ['', Validators.required],
      details: [''],
      numWomen: [0, Validators.required],
      numMen: [0, Validators.required],
      total: [0, Validators.required],
      registeredBy: ['', Validators.required]
    });
  }

  // Inicializamos el formulario de aliados
  private initAliadosForm() {
    this.aliadosForm = this.fb.group({
      id: [{ value: '', disabled: true }],
      identificationDate: ['', Validators.required],
      institution: ['', Validators.required],
      referentName: ['', Validators.required],
      resultsLink: ['', Validators.required],
      convenio: ['', Validators.required],
      registeredBy: ['', Validators.required]
    });
  }

  // Manejo de selección en la tabla de beneficiarios
  checkboxChanged(selectedBeneficiario: Beneficiario) {
    this.beneficiariosTable.forEach(beneficiario => {
      beneficiario.selected = beneficiario.id === selectedBeneficiario.id;
    });
    this.selectedBeneficiarios = selectedBeneficiario.selected ? selectedBeneficiario : null;
  }

  // Manejo de selección en la tabla de aliados
  checkboxChangedAliado(selectedAliado: Aliado) {
    this.aliadosTable.forEach(aliado => {
      aliado.selected = aliado.id === selectedAliado.id;
    });
    this.selectedAliado = selectedAliado.selected ? selectedAliado : null;
  }

  // Abrir el modal para crear o editar un beneficiario
  openModal(modal: TemplateRef<any>, beneficiario?: Beneficiario) {
    this.selectedBeneficiarios = beneficiario || null;
    if (beneficiario) {
      this.beneficiariesForm.patchValue(beneficiario);
    } else {
      this.beneficiariesForm.reset();
    }
    this.modalService.open(modal);
  }

  // Guardar o actualizar un beneficiario
  onSubmit(form: FormGroup) {
    if (form.valid) {
      const beneficiarioData: Beneficiario = { 
        ...form.value, 
        id: this.selectedBeneficiarios ? this.selectedBeneficiarios.id : this.beneficiariosTable.length + 1 
      };

      if (this.selectedBeneficiarios) {
        const index = this.beneficiariosTable.findIndex(b => b.id === this.selectedBeneficiarios.id);
        if (index !== -1) {
          this.beneficiariosTable[index] = beneficiarioData;
        }
      } else {
        this.beneficiariosTable.push(beneficiarioData);
      }

      this.modalService.dismissAll();
      this.selectedBeneficiarios = null;
    } else {
      console.error("Formulario inválido");
    }
  }

  // Eliminar un beneficiario
  onDelete() {
    if (this.selectedBeneficiarios) {
      this.beneficiariosTable = this.beneficiariosTable.filter(b => b.id !== this.selectedBeneficiarios.id);
      this.selectedBeneficiarios = null;
    } else {
      console.warn("No hay beneficiario seleccionado para eliminar");
    }
  }

  // Abrir el modal para crear o editar un aliado
  openAliadoModal(modal: TemplateRef<any>, aliado?: Aliado) {
    this.selectedAliado = aliado || null;
    if (aliado) {
      this.aliadosForm.patchValue(aliado);
    } else {
      this.aliadosForm.reset();
    }
    this.modalService.open(modal);
  }

  // Guardar o actualizar un aliado
  onSubmitAliadosForm(form: FormGroup) {
    if (form.valid) {
      const aliadoData: Aliado = { 
        ...form.value, 
        id: this.selectedAliado ? this.selectedAliado.id : this.aliadosTable.length + 1 
      };

      if (this.selectedAliado) {
        const index = this.aliadosTable.findIndex(a => a.id === this.selectedAliado.id);
        if (index !== -1) {
          this.aliadosTable[index] = aliadoData;
        }
      } else {
        this.aliadosTable.push(aliadoData);
      }

      this.modalService.dismissAll();
      this.selectedAliado = null;
    } else {
      console.error("Formulario inválido");
    }
  }

  // Eliminar un aliado
  onDeleteAliado() {
    if (this.selectedAliado) {
      this.aliadosTable = this.aliadosTable.filter(a => a.id !== this.selectedAliado.id);
      this.selectedAliado = null;
    } else {
      console.warn("No hay aliado seleccionado para eliminar");
    }
  }
}
