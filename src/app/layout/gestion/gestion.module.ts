import { GestionRoutingModule } from './gestion-routing.module';
import { GestionComponent } from './gestion.component';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PageHeaderModule } from '../../shared';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { BodyHeaderModule } from '../../shared/modules/bodyHeader/bodyHeader.module';

@NgModule({
    imports: [
        CommonModule, 
        GestionRoutingModule, 
        PageHeaderModule, 
        NgbModalModule, 
        NgbPaginationModule,
        FormsModule,
        ReactiveFormsModule,
        BodyHeaderModule
    ],
    declarations: [
        GestionComponent
    ]
})
export class GestionModule {}
