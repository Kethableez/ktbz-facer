import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputErrorComponent } from './input-error.component';
import { InputErrorPipe } from './input-error.pipe';

@NgModule({
	declarations: [InputErrorComponent, InputErrorPipe],
	imports: [CommonModule],
	exports: [InputErrorComponent],
})
export class InputErrorModule {}
