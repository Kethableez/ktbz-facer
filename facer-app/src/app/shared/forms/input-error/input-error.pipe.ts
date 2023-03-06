import { Pipe, PipeTransform } from '@angular/core';
import { ErrorPair } from './input-error.component';

@Pipe({
	name: 'inputError',
})
export class InputErrorPipe implements PipeTransform {
	transform(error: ErrorPair): string {
    console.log(error);
		switch (error.name) {
			case 'required':
      case 'emptyStr':

				return 'This field is required';

			case 'minlength':
				return `Minimum length is ${(error as any).value.requiredLength}`;

			case 'maxlength':
				return `Maximum length is ${(error as any).value.requiredLength}`;

			case 'taken':
				return `This ${(error as any).value.field} is already taken`;

      case 'match':
        return `Fields are different (${(error as any).value.field})`;

      case 'pattern':
        return 'This is not a valid email';

			default:
				return 'Unknown error';
		}
	}
}
