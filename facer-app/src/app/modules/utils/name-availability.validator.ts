import { AbstractControl, AsyncValidatorFn, FormControl, ValidationErrors } from '@angular/forms';
import { Observable, of, map, delay } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';

export class NameAvailabilityValidator {
	static createValidator(type: 'username' | 'email', authService: AuthService): AsyncValidatorFn {
		return (control: AbstractControl): Observable<ValidationErrors | null> => {
			return authService
				.checkAvailability(control.value, type)
				.pipe(map(response => (!response.available ? { taken: { field: type } } : null)));
		};
	}
}

// export function nameAvailability(control: FormControl): Observable<{available: boolean} | null> {
//   const taken = ['useruser', 'admin123', 'rootroot'];
//   // return of(taken.includes(control.value)).pipe(
//   //   map((value) => (value ? { unique: value } : null)),
//   //   delay(2000)
//   // )
// }
