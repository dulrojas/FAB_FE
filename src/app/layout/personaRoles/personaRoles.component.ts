import { Component, OnInit, TemplateRef } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormsModule, Validators } from '@angular/forms';

@Component({
    selector: 'app-personaRoles',
    templateUrl: './personaRoles.component.html',
    styleUrls: ['./personaRoles.component.scss'],
    animations: [routerTransition()]
})
export class PersonaRolesComponent implements OnInit {
    // ======= ======= VARIABLES SECTION ======= =======
    personasRoles: any[] = [];
    page = 1;
    pageSize = 5;
    totalLength = 0;
    constructor(private modalService: NgbModal) {}
    personaRolesForm: FormGroup;

    roles: Array<{ id: number, name: string }> = [
      { id: 1, name: 'Administrador' },
      { id: 2, name: 'Usuario' },
      { id: 3, name: 'Invitado' }
    ];

    unidades: Array<{ id: number, name: string }> = [
      { id: 1, name: 'Unidad 1' },
      { id: 2, name: 'Unidad 2' },
      { id: 3, name: 'Unidad 3' }
    ];
    // ======= ======= ======= ======= =======
    // ======= ======= INIT VIEW FUN ======= =======
    ngOnInit(): void{
        this.loadPeople();
    }
    // ======= ======= ======= ======= =======
    // ======= ======= OPEN MODALS FUN ======= =======
    openModal(content: TemplateRef<any>) {
      this.modalService.open(content, { size: 'xl' });
    }
    // ======= ======= ======= ======= =======
    // ======= ======= TABLE PAGINATION ======= =======
    get personasRolesTable() {
      const start = (this.page - 1) * this.pageSize;
      return this.personasRoles.slice(start, start + this.pageSize);
    }
    // ======= ======= ======= ======= =======
    personaRolesSelected: any = null;
    // ======= ======= CHECKBOX CHANGED ======= =======
    checkboxChanged(person: any) {
      
      this.personaRolesSelected = person
      console.log(person);
    }
    // ======= ======= ======= ======= =======
    // ======= ======= GET PERSONAS ======= =======
    loadPeople(): void {
      this.personasRoles = [
        { name: 'John Doe', job: 'Developer' },
        { name: 'Jane Doe', job: 'Designer' },
        { name: 'James Smith', job: 'Manager' },
        { name: 'Emily Davis', job: 'Developer' },
        { name: 'Michael Brown', job: 'HR' },
        { name: 'Sarah Wilson', job: 'Marketing' },
        { name: 'David Lee', job: 'Support' },
        { name: 'Laura Moore', job: 'CEO' },
        { name: 'Paul Harris', job: 'Sales' },
        { name: 'Anna Scott', job: 'Product Owner' },
      ];
      this.totalLength = this.personasRoles.length;
    }
    // ======= ======= ======= ======= =======
    // ======= ======= SUBMIT FORM ======= =======
    onSubmit(): void {
      if (this.personaRolesForm.valid) {
        console.log(this.personaRolesForm.value);
      }
    }
    // ======= ======= ======= ======= =======
}
