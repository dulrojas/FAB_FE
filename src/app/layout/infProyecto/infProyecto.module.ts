import { InfProyectoRoutingModule } from './infProyecto-routing.module';
import { InfProyectoComponent } from './infProyecto.component';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PageHeaderModule } from '../../shared';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule, NgbPaginationModule, NgbModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { BodyHeaderComponent } from '../components/bodyHeader/bodyHeader.component';
import { NavigationDropdown } from '../components/navigationDropdown/navigationDropdown.component';

@NgModule({
    imports: [
        CommonModule, 
        InfProyectoRoutingModule, 
        PageHeaderModule, 
        NgbModalModule, 
        NgbPaginationModule,
        NgbModule,
        NgbDropdownModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        InfProyectoComponent,
        BodyHeaderComponent,
        NavigationDropdown
    ]
})
export class InfProyectoModule {}
