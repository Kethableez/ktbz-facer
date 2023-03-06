import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { SharedModule } from '../../shared/shared.module';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WebcamModule } from 'ngx-webcam';
import { WebcamComponent } from './components/webcam/webcam.component';
import { TraditionalLoginComponent } from './components/traditional-login/traditional-login.component';
import { FaceLoginComponent } from './components/face-login/face-login.component';
import { LoginWrapperComponent } from './components/login-wrapper/login-wrapper.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { RegisterFaceScannerComponent } from './components/register-face-scanner/register-face-scanner.component';
import { LoginFaceScannerComponent } from './components/login-face-scanner/login-face-scanner.component';

@NgModule({
	declarations: [AuthComponent, LoginComponent, RegisterComponent, WebcamComponent, TraditionalLoginComponent, FaceLoginComponent, LoginWrapperComponent, RegisterFormComponent, RegisterFaceScannerComponent, LoginFaceScannerComponent],
	imports: [CommonModule, WebcamModule, SharedModule, AuthRoutingModule, ReactiveFormsModule, FormsModule],
})
export class AuthModule {}
