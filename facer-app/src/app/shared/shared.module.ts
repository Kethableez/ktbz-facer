import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoxModule } from './components/box/box.module';
import { ControlModule } from './forms/control/control.module';
import { ButtonModule } from './components/button/button.module';
import { AlertComponent } from './components/alert/alert.component';
import { AlertModule } from './components/alert/alert.module';

const COMPONENTS = [BoxModule, ButtonModule, AlertModule];
const FORMS = [ControlModule];

@NgModule({
	declarations: [],
	imports: [CommonModule, ...COMPONENTS, ...FORMS],
	exports: [...COMPONENTS, ...FORMS],
})
export class SharedModule {}
