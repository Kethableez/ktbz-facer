import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function notEmptyStr(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value) {
      return control.value.trim() === '' ? { emptyStr: true } : null;
    } return null;
  }
}
