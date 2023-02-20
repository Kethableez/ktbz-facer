import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlComponent } from './control.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InputErrorModule } from '../input-error/input-error.module';

@NgModule({
	declarations: [ControlComponent],
	imports: [CommonModule, ReactiveFormsModule, InputErrorModule],
	exports: [ControlComponent],
})
export class ControlModule {}
