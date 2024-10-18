import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonaRolesComponent } from './personaRoles.component';

const routes: Routes = [
    {
        path: '',
        component: PersonaRolesComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PersonaRolesRoutingModule {}
