import { InfProyectoRoutingModule } from './infProyecto-routing.module';
import { InfProyectoComponent } from './infProyecto.component';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PageHeaderModule } from '../../shared';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule, NgbPaginationModule, NgbModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';


import { BodyHeaderModule } from '../../shared/modules/bodyHeader/bodyHeader.module';
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
        ReactiveFormsModule,
        BodyHeaderModule
    ],
    declarations: [
        InfProyectoComponent,
        NavigationDropdown
    ]
})
export class InfProyectoModule {}
