import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { RootState } from 'src/app/core/store/root.state';
import { clearLoginResponse } from '../../store/actions/login.actions';
import { isLoginInProgress, loginErrorMessage, loginSuccessMessage } from '../../store/selectors/auth.selectors';

@Component({
	selector: 'ktbz-login-wrapper',
	templateUrl: './login-wrapper.component.html',
	styleUrls: ['./login-wrapper.component.scss'],
})
export class LoginWrapperComponent implements OnInit {
	@Output()
	onChangeForm = new EventEmitter<void>();

	tabs = [
		{
			value: 'traditional',
			displayValue: 'Traditional',
		},
		{
			value: 'faceId',
			displayValue: 'Face ID',
		},
	];

	error$ = this.store$.pipe(select(loginErrorMessage));
	success$ = this.store$.pipe(select(loginSuccessMessage));
	inProgress$ = this.store$.pipe(select(isLoginInProgress));

	selectedLoginMethod = this.tabs[0].value;

	selectLoginMethod(method: string) {
		this.selectedLoginMethod = method;
		this.store$.dispatch(clearLoginResponse());
	}

	constructor(private store$: Store<RootState>) {}

	ngOnInit(): void {
		this.store$.dispatch(clearLoginResponse());
	}

	switchToRegisterForm() {
		this.onChangeForm.emit();
	}
}
