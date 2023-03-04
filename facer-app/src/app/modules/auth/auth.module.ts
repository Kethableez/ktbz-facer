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
import { WebsocketComponent } from './components/websocket/websocket.component';

@NgModule({
	declarations: [AuthComponent, LoginComponent, RegisterComponent, WebcamComponent, WebsocketComponent],
	imports: [CommonModule, WebcamModule, SharedModule, AuthRoutingModule, ReactiveFormsModule, FormsModule],
})
export class AuthModule {}
