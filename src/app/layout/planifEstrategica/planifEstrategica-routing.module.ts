import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlanifEstrategicaComponent } from './planifEstrategica.component';

const routes: Routes = [
  { path: '',
     component: PlanifEstrategicaComponent 
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanifEstrategicaRoutingModule { }
