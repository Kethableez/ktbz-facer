import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter } from 'rxjs/operators';
import { HttpErrorService } from 'src/app/core/services/http-error.service';
import { notUndefined } from 'src/app/core/utils/filter-not-undefined';
import { AuthService, LoginRequest } from '../../services/auth.service';

enum LoginMethods {
	TRADITIONAL = 'traditional',
	FACE_ID = 'faceId',
	LIVE_FACE_ID = 'liveFaceId',
}
@UntilDestroy()
@Component({
	selector: 'ktbz-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
	@Output()
	onClose = new EventEmitter<void>();

	error$ = this.errorService.getNamespaceError('login');

	LoginMethods = LoginMethods;

	successMessage: string | null = null;

	selectedMethod: LoginMethods = LoginMethods.TRADITIONAL;

	standardLoginForm!: FormGroup;

	constructor(private builder: FormBuilder, private authService: AuthService, private errorService: HttpErrorService) {}

	ngOnInit(): void {
		this.initForm();
	}

	close() {
		this.onClose.emit();
		this.clearError();
	}

	clearError() {
		this.errorService.removeError('login');
	}

	isActive(method: LoginMethods) {
		return method === this.selectedMethod;
	}

	selectMethod(method: LoginMethods) {
		this.selectedMethod = method;
	}

	submit() {
		const payload = this.standardLoginForm.value as LoginRequest;

		this.authService
			.login(payload)
			.pipe(untilDestroyed(this), filter(notUndefined))
			.subscribe(response => {
				this.standardLoginForm.reset();
				this.successMessage = 'Logged with success';
			});
	}

	getControl(prop: string): FormControl {
		return this.standardLoginForm.controls[prop as keyof FormGroup<any>] as FormControl;
	}

	private initForm() {
		this.standardLoginForm = this.builder.nonNullable.group({
			username: [null, Validators.required],
			password: [null, Validators.required],
		});
	}
}
