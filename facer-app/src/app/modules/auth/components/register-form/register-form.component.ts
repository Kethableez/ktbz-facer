import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RootState } from 'src/app/core/store/root.state';
import { MustMatchValidator } from 'src/app/modules/utils/must-match.validator';
import { NameAvailabilityValidator } from 'src/app/modules/utils/name-availability.validator';
import { notEmptyStr } from 'src/app/modules/utils/not-empty-str.validator';
import { Store } from '@ngrx/store';
import { AuthService, RegisterRequest } from '../../services/auth.service';
import { clearResponse, registerAction } from '../../store/actions/register.actions';
import { registerErrorMessage, registerSuccessMessage } from '../../store/selectors/auth.selectors';

@Component({
  selector: 'ktbz-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
})
export class RegisterFormComponent implements OnInit {

  @Output()
  onFormChange = new EventEmitter<void>();

  registerForm!: FormGroup;

  faceScanActive = false;

  constructor(
    private store$: Store<RootState>,
    private builder: FormBuilder,
    private authService: AuthService
  ) { }

  error$ = this.store$.select(registerErrorMessage);

  success$ = this.store$.select(registerSuccessMessage);

  ngOnInit(): void {
    this.initForm();
    this.store$.dispatch(clearResponse())
  }

  toggleScanner() {
    this.faceScanActive = !this.faceScanActive;
  }

  private initForm() {
    this.registerForm = this.builder.nonNullable.group({
      username: [null, 				{
        validators: [Validators.required],
        asyncValidators: [NameAvailabilityValidator.createValidator('username', this.authService)],
        updateOn: 'blur',
      }],
      email: [null,				{
        validators: Validators.compose([Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
        asyncValidators: [NameAvailabilityValidator.createValidator('email', this.authService)],
        updateOn: 'blur',
      }],
      password: [null, Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(20)])],
      confirmPassword: [null, Validators.compose([ Validators.required, MustMatchValidator.createValidator('password')])],
      firstName: [null, Validators.compose([Validators.required, notEmptyStr()])],
      lastName: [null, Validators.compose([Validators.required, notEmptyStr()])],
      useFaceAsAuthMethod: [false, Validators.required],
    })
  }

  getControl(controlName: string): FormControl {
    return this.registerForm.controls[controlName] as FormControl;
  }

  submitForm() {
    const payload = this.registerForm.value as RegisterRequest & { confirmPassword?: string }
    delete payload.confirmPassword;
    this.store$.dispatch(registerAction({ payload: payload, data: undefined}))
  }

  switchToLoginForm() {
    this.registerForm.reset();
    this.onFormChange.emit();
  }

}
