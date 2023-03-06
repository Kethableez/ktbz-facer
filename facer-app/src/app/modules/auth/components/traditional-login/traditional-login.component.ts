import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { RootState } from 'src/app/core/store/root.state';
import { notEmptyStr } from 'src/app/core/utils/not-empty-str.validator';
import { loginAction } from '../../store/actions/login.actions';

@Component({
	selector: 'ktbz-traditional-login',
	templateUrl: './traditional-login.component.html',
	styleUrls: ['./traditional-login.component.scss'],
})
export class TraditionalLoginComponent implements OnInit {
	loginForm!: FormGroup;

	@Output()
	onChangeForm = new EventEmitter<void>();

	constructor(private builder: FormBuilder, private store$: Store<RootState>) {}

	ngOnInit(): void {
		this.initForm();
	}

	private initForm() {
		this.loginForm = this.builder.nonNullable.group({
			username: [null, Validators.compose([Validators.required, notEmptyStr()])],
			password: [null, Validators.compose([Validators.required, notEmptyStr()])],
		});
	}

	getControl(controlName: string): FormControl {
		return this.loginForm.controls[controlName] as FormControl;
	}

	submitForm() {
		const payload = this.loginForm.value as { username: string; password: string };
		// console.log('submitted', payload)
		this.store$.dispatch(loginAction({ payload }));
	}

	switchToCreateAccount() {
		this.onChangeForm.emit();
	}
}
