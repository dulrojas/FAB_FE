import { NgModule } from '@angular/core';
import { FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PageHeaderModule } from './../../shared';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { BodyHeaderComponent } from '../components/bodyHeader/bodyHeader.component';

//llamado a los componentes de Riesgos
import { RiesgosComponent } from './riesgos.component';
import { RiesgosRoutingModule } from './riesgos-routing.module';

@NgModule({
  imports: [
    CommonModule,
    RiesgosRoutingModule,
    PageHeaderModule,
    NgbModalModule,
    NgbPaginationModule, 
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    RiesgosComponent,
    BodyHeaderComponent
]
})
export class RiesgosModule { }

