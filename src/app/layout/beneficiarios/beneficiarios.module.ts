import { BeneficiariosRoutingModule } from "./beneficiarios-routing.module";
import { BeneficiariosComponent } from "./beneficiarios.component";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { PageHeaderModule } from "./../../shared";
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";
import { NgbModalModule, NgbPaginationModule } from "@ng-bootstrap/ng-bootstrap";
import { BodyHeaderComponent } from "../components/bodyHeader/bodyHeader.component";

@NgModule({
  imports: [
    CommonModule,
    BeneficiariosRoutingModule,
    PageHeaderModule,
    NgbModalModule,
    NgbPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    BeneficiariosRoutingModule
  ],
  declarations: [
    BeneficiariosComponent, 
    BodyHeaderComponent
],
})
export class BeneficiariosModule {}