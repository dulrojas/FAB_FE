import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PageHeaderModule } from '../../shared';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule, NgbPaginationModule, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';


import { BodyHeaderModule } from '../../shared/modules/bodyHeader/bodyHeader.module';
import { EjecEstrategicaRoutingModule } from './ejecEstrategica-routing.module';
import { EjecEstrategicaComponent } from './ejecEstrategica.component';

@NgModule({
  imports: [
    CommonModule,
    EjecEstrategicaRoutingModule,
    PageHeaderModule, 
    NgbModalModule, 
    NgbPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    BodyHeaderModule
  ],
  declarations: [
    EjecEstrategicaComponent
  ],
})
export class EjecEstrategicaModule {}
