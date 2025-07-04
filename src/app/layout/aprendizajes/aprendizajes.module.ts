import { AprendizajesRoutingModule } from './aprendizajes-routing.module';
import { AprendizajesComponent } from './aprendizajes.component';

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
        AprendizajesRoutingModule, 
        PageHeaderModule, 
        NgbModalModule, 
        NgbPaginationModule,
        FormsModule,
        ReactiveFormsModule,
        BodyHeaderModule
    ],
    declarations: [
        AprendizajesComponent
    ]
})
export class AprendizajesModule {}
