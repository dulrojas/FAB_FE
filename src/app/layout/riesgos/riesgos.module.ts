import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderModule } from './../../shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RiesgosComponent } from './riesgos.component';
import { RiesgosRoutingModule } from './riesgos-routing.module';
import { NgbModalModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { BodyHeaderComponent } from '../components/bodyHeader/bodyHeader.component';

@NgModule({
  imports: [
    CommonModule,
    RiesgosRoutingModule,
    PageHeaderModule,
    NgbModalModule,
    NgbPaginationModule, 
    FormsModule,
    ReactiveFormsModule,
    RiesgosRoutingModule
  ],
  declarations: [
    RiesgosComponent,
    BodyHeaderComponent
]
})
export class RiesgosModule { }

