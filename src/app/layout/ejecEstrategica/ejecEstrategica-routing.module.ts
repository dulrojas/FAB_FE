import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EjecEstrategicaComponent } from './ejecEstrategica.component';

const routes: Routes = [
  {
    path: '',
    component: EjecEstrategicaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EjecEstrategicaRoutingModule {}
