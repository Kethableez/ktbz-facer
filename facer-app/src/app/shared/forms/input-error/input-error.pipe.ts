import { Pipe, PipeTransform } from '@angular/core';
import { ErrorPair } from './input-error.component';

interface Errors {
	unique?: boolean;
	minlength?: { actualLength: number; requiredLength: number };
	maxlength?: { actualLength: number; requiredLength: number };
	taken: { field: 'username' | 'email' };
	required?: true;
}

@Pipe({
	name: 'inputError',
})
export class InputErrorPipe implements PipeTransform {
	transform(error: ErrorPair): string {
		console.log(error);
		switch (error.name) {
			case 'required':
				return 'This field is required';

			case 'minlength':
				return `Minimum length is ${(error as any).value.requiredLength}`;

			case 'maxlength':
				return `Maximum length is ${(error as any).value.requiredLength}`;

			case 'taken':
				return `This ${(error as any).value.field} is already taken`;

			default:
				return 'Unknown error';
		}
	}
}
