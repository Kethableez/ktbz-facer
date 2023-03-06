import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export class MustMatchValidator {
  static createValidator(matchTo: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const parent = control.parent as FormGroup;
      const matchToControl = parent?.controls[matchTo];
      if (matchToControl) {
        return matchToControl.value === control.value ? null : { match: {
          field: matchTo
        } }
      }
      return null;
    }
  }
}
