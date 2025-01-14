import { AuditoriaRoutingModule } from './auditoria-routing.module';
import { AuditoriaComponent } from './auditoria.component';

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
        AuditoriaRoutingModule, 
        PageHeaderModule, 
        NgbModalModule, 
        NgbPaginationModule,
        FormsModule,
        ReactiveFormsModule,
        BodyHeaderModule
    ],
    declarations: [
        AuditoriaComponent
    ]
})
export class AuditoriaModule {}
