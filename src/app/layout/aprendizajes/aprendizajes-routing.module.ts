import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AprendizajesComponent } from './aprendizajes.component';

const routes: Routes = [
    {
        path: '',
        component: AprendizajesComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AprendizajesRoutingModule {}
