import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { PlanifEstrategicaRoutingModule } from './planifEstrategica-routing.module';
import { PlanifEstrategicaComponent } from './planifEstrategica.component';

import { BodyHeaderComponent } from '../components/bodyHeader/bodyHeader.component';
import { BodyHeaderModule } from '../../shared/modules/bodyHeader/bodyHeader.module';

@NgModule({
  imports: [
    CommonModule,
    PlanifEstrategicaRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModalModule,
    NgbPaginationModule,
    BodyHeaderModule
  ],
  declarations: [
    PlanifEstrategicaComponent
    ]
})
export class PlanifEstrategicaModule {}
