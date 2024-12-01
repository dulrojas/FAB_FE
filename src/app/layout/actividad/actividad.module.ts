import { ActividadRoutingModule } from './actividad-routing.module';
import { ActividadComponent } from './actividad.component';

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
        ActividadRoutingModule, 
        PageHeaderModule, 
        NgbModalModule, 
        NgbPaginationModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        ActividadComponent,
        BodyHeaderComponent
    ]
})
export class ActividadModule {}
