import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoxModule } from './components/box/box.module';
import { ControlModule } from './forms/control/control.module';
import { AlertComponent } from './components/alert/alert.component';
import { AlertModule } from './components/alert/alert.module';
import { CheckboxModule } from './forms/checkbox/checkbox.module';
import { TabsModule } from './components/tabs/tabs.module';
import { DropdownModule } from './forms/dropdown/dropdown.module';

const COMPONENTS = [BoxModule, AlertModule, TabsModule];
const FORMS = [ControlModule, CheckboxModule, DropdownModule];

@NgModule({
	declarations: [],
	imports: [CommonModule, ...COMPONENTS, ...FORMS],
	exports: [...COMPONENTS, ...FORMS],
})
export class SharedModule {}
