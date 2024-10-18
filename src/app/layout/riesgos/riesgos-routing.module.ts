import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RiesgosComponent } from './riesgos.component';

const routes: Routes = [
  { 
    path: '', 
    component: RiesgosComponent
   }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RiesgosRoutingModule { }

