import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WebcamModule } from 'ngx-webcam';
import { WebcamComponent } from './components/webcam/webcam.component';
import { TraditionalLoginComponent } from './components/traditional-login/traditional-login.component';
import { FaceLoginComponent } from './components/face-login/face-login.component';
import { LoginWrapperComponent } from './components/login-wrapper/login-wrapper.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { FaceScannerComponent } from './components/face-scanner/face-scanner.component';
import { AuthStateModule } from './store/auth-state.module';

@NgModule({
	declarations: [
		AuthComponent,
		WebcamComponent,
		TraditionalLoginComponent,
		FaceLoginComponent,
		LoginWrapperComponent,
		RegisterFormComponent,
		FaceScannerComponent,
	],
	imports: [CommonModule, WebcamModule, SharedModule, AuthRoutingModule, ReactiveFormsModule, FormsModule, AuthStateModule],
})
export class AuthModule {}
