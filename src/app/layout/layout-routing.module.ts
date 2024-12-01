import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'prefix' },
            {
                path: 'dashboard',
                loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule)
            },
            { path: 'dashboard2', loadChildren: () => import('./dashboard2/dashboard2.module').then((m) => m.Dashboard2Module) },
            { path: 'infProyecto', loadChildren: () => import('./infProyecto/infProyecto.module').then((m) => m.InfProyectoModule) },
            { path: 'riesgos', loadChildren: () => import('./riesgos/riesgos.module').then((m) => m.RiesgosModule) },
            { path: 'planifEstrategica', loadChildren: () => import('./planifEstrategica/planifEstrategica.module').then((m) => m.PlanifEstrategicaModule) },
            { path: 'ejecEstrategica', loadChildren: () => import('./ejecEstrategica/ejecEstrategica.module').then((m) => m.EjecEstrategicaModule) },
            { path: 'actividad', loadChildren: () => import('./actividad/actividad.module').then((m) => m.ActividadModule) },
            { path: 'beneficiarios', loadChildren: () => import('./beneficiarios/beneficiarios.module').then((m) => m.BeneficiariosModule) },
            { path: 'logros', loadChildren: () => import('./logros/logros.module').then((m) => m.LogrosModule) },
            { path: 'aprendizajes', loadChildren: () => import('./aprendizajes/aprendizajes.module').then((m) => m.AprendizajesModule) },
            { path: 'personaRoles', loadChildren: () => import('./personaRoles/personaRoles.module').then((m) => m.PersonaRolesModule) },
            { path: 'charts', loadChildren: () => import('./charts/charts.module').then((m) => m.ChartsModule) },
            { path: 'tables', loadChildren: () => import('./tables/tables.module').then((m) => m.TablesModule) },
            { path: 'forms', loadChildren: () => import('./form/form.module').then((m) => m.FormModule) },
            {
                path: 'bs-element',
                loadChildren: () => import('./bs-element/bs-element.module').then((m) => m.BsElementModule)
            },
            { path: 'grid', loadChildren: () => import('./grid/grid.module').then((m) => m.GridModule) },
            {
                path: 'components',
                loadChildren: () => import('./bs-component/bs-component.module').then((m) => m.BsComponentModule)
            },
            {
                path: 'blank-page',
                loadChildren: () => import('./blank-page/blank-page.module').then((m) => m.BlankPageModule)
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule {}
