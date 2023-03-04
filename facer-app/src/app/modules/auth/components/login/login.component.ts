import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { WebcamImage } from 'ngx-webcam';
import { filter } from 'rxjs/operators';
import { FileProcess } from 'src/app/core/file-process';
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

	faceIdForm!: FormGroup;

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
		this.clearError();
		const payload = this.standardLoginForm.value as LoginRequest;

		this.authService
			.login(payload)
			.pipe(untilDestroyed(this), filter(notUndefined))
			.subscribe(response => {
				this.standardLoginForm.reset();
				this.successMessage = 'Logged with success';
			});
	}

	processRequest(image: WebcamImage) {
		this.clearError();
		const formData = FileProcess.dataURLtoFormData('process', image.imageAsDataUrl);
		formData.append('model', this.faceIdForm.controls['model'].value);

		this.authService
			.faceLogin(formData)
			.pipe(untilDestroyed(this), filter(notUndefined))
			.subscribe(response => {
				this.faceIdForm.reset;
				this.successMessage = 'logged with success';
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

		this.faceIdForm = this.builder.nonNullable.group({
			model: ['dlib', Validators.required],
		});
	}
}
