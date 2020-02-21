import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from './login/login.component';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {AuthService} from './auth.service';
import {AppBootstrapModule} from '../bootsrap.module';

@NgModule({
    imports: [
      AppBootstrapModule,
        CommonModule,
        ReactiveFormsModule,
        RouterModule.forChild([{path: '', component: LoginComponent}])
    ],
    declarations: [LoginComponent],
    exports: [LoginComponent]
})
export class AuthModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: AuthModule,
            providers: [
              AuthService
            ]
        }
    }
}
