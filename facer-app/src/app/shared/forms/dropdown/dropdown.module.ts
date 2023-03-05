import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownComponent } from './dropdown.component';
import { InputErrorModule } from '../input-error/input-error.module';

@NgModule({
	declarations: [DropdownComponent],
	imports: [CommonModule, InputErrorModule],
	exports: [DropdownComponent],
})
export class DropdownModule {}
