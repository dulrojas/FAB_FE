import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PageHeaderModule } from '../../shared';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule, NgbPaginationModule, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { BodyHeaderComponent } from '../components/bodyHeader/bodyHeader.component';

import { Dashboard2RoutingModule } from './dashboard2-routing.module';
import { Dashboard2Component } from './dashboard2.component';
import { BodyHeaderModule } from '../../shared/modules/bodyHeader/bodyHeader.module';

@NgModule({
  imports: [
    CommonModule,
    Dashboard2RoutingModule,
    PageHeaderModule, 
    NgbModalModule, 
    NgbPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    BodyHeaderModule
  ],
  declarations: [
    Dashboard2Component
  ],
})
export class Dashboard2Module {}