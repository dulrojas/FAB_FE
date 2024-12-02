import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'prefix' },
            { path: 'dashboard', loadChildren: () => import('./dashboard2/dashboard2.module').then((m) => m.Dashboard2Module) },
            { path: 'infProyecto', loadChildren: () => import('./infProyecto/infProyecto.module').then((m) => m.InfProyectoModule) },
            { path: 'riesgos', loadChildren: () => import('./riesgos/riesgos.module').then((m) => m.RiesgosModule) },
            { path: 'planifEstrategica', loadChildren: () => import('./planifEstrategica/planifEstrategica.module').then((m) => m.PlanifEstrategicaModule) },
            { path: 'ejecEstrategica', loadChildren: () => import('./ejecEstrategica/ejecEstrategica.module').then((m) => m.EjecEstrategicaModule) },
            { path: 'actividad', loadChildren: () => import('./actividad/actividad.module').then((m) => m.ActividadModule) },
            { path: 'beneficiarios', loadChildren: () => import('./beneficiarios/beneficiarios.module').then((m) => m.BeneficiariosModule) },
            { path: 'logros', loadChildren: () => import('./logros/logros.module').then((m) => m.LogrosModule) },
            { path: 'aprendizajes', loadChildren: () => import('./aprendizajes/aprendizajes.module').then((m) => m.AprendizajesModule) },
            { path: 'personaRoles', loadChildren: () => import('./personaRoles/personaRoles.module').then((m) => m.PersonaRolesModule) }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule {}
