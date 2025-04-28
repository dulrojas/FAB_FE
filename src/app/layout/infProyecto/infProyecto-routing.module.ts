import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InfProyectoComponent } from './infProyecto.component';

const routes: Routes = [
    {
        path: '',
        component: InfProyectoComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InfProyectoRoutingModule {}
