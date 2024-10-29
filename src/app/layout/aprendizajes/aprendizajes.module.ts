import { AprendizajesRoutingModule } from './aprendizajes-routing.module';
import { AprendizajesComponent } from './aprendizajes.component';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PageHeaderModule } from '../../shared';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { BodyHeaderComponent } from '../components/bodyHeader/bodyHeader.component';

@NgModule({
    imports: [
        CommonModule, 
        AprendizajesRoutingModule, 
        PageHeaderModule, 
        NgbModalModule, 
        NgbPaginationModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        AprendizajesComponent,
        BodyHeaderComponent
    ]
})
export class AprendizajesModule {}
