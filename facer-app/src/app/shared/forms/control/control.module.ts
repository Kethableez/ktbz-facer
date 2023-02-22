import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlComponent } from './control.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InputErrorModule } from '../input-error/input-error.module';
import { DisableAutofillDirective } from './disable-autofill.directive';

@NgModule({
	declarations: [ControlComponent, DisableAutofillDirective],
	imports: [CommonModule, ReactiveFormsModule, InputErrorModule],
	exports: [ControlComponent],
})
export class ControlModule {}
