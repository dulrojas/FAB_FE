import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogrosComponent } from './logros.component';

const routes: Routes = [
    {
        path: '',
        component: LogrosComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LogrosRoutingModule {}
