import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';

@NgModule({
    imports: [
        CommonModule, 
        TranslateModule, 
        LoginRoutingModule,
        FormsModule 
    ],
    declarations: [LoginComponent]
})
export class LoginModule {}
