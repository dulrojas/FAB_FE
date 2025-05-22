import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { SidebarComponent } from './components/sidebar/sidebar.component';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [CommonModule, LayoutRoutingModule, NgbDropdownModule,TranslateModule,FormsModule ],
    declarations: [LayoutComponent, SidebarComponent]

})
export class LayoutModule {}
