import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

export class NameAvailabilityValidator {
	static createValidator(type: 'username' | 'email', authService: AuthService): AsyncValidatorFn {
		return (control: AbstractControl): Observable<ValidationErrors | null> => {
			return authService
				.checkAvailability(control.value, type)
				.pipe(map(response => (!response.available ? { taken: { field: type } } : null)));
		};
	}
}
