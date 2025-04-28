import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BodyHeaderComponent } from './bodyHeader.component';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [BodyHeaderComponent],
    exports: [BodyHeaderComponent]
})
export class BodyHeaderModule {}
