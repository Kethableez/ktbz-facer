import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { SharedModule } from '../../shared/shared.module';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { WebcamModule } from 'ngx-webcam';
import { WebcamComponent } from './components/webcam/webcam.component';

@NgModule({
	declarations: [AuthComponent, LoginComponent, RegisterComponent, WebcamComponent],
	imports: [CommonModule, WebcamModule, SharedModule, AuthRoutingModule, ReactiveFormsModule],
})
export class AuthModule {}
