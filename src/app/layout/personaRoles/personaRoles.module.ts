import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PageHeaderModule } from './../../shared';

import { PersonaRolesRoutingModule } from './personaRoles-routing.module';
import { PersonaRolesComponent } from './personaRoles.component';
import { NgbModalModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [
        CommonModule, 
        PersonaRolesRoutingModule, 
        PageHeaderModule, 
        NgbModalModule, 
        NgbPaginationModule
    ],
    declarations: [PersonaRolesComponent]
})
export class PersonaRolesModule {}
