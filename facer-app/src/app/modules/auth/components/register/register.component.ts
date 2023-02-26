import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
import { untilDestroyed } from '@ngneat/until-destroy';
import { WebcamImage } from 'ngx-webcam';
import { filter, Observable, of, tap } from 'rxjs';
import { FileProcess } from 'src/app/core/file-process';
import { HttpErrorService } from 'src/app/core/services/http-error.service';
import { notUndefined } from 'src/app/core/utils/filter-not-undefined';
import { NameAvailabilityValidator } from 'src/app/modules/utils/name-availability.validator';
import { AuthService, RegisterRequest } from '../../services/auth.service';

@UntilDestroy()
@Component({
	selector: 'ktbz-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
	@Output()
	onClose = new EventEmitter<void>();

	error$: Observable<null | any> = of(null);
	warning$: Observable<null | any> = of(null);
	success$: Observable<null | any> = of(null);

	scanEnabled = false;

	userImage!: WebcamImage;

	isForRetry = false;

	registerForm!: FormGroup;

	get useFace() {
		return this.getControl('useFaceAsAuthMethod').value;
	}

	constructor(private builder: FormBuilder, private authService: AuthService, private errorService: HttpErrorService) {}

	close() {
		this.onClose.emit();
		this.clearAll();
	}

	clearError() {
		this.error$ = of(null);
	}

	clearWarning() {
		this.warning$ = of(null);
	}

	ngOnInit(): void {
		this.initForm();
	}

	toggleScan(value: boolean, isForRetry = false) {
		this.scanEnabled = value;
		this.isForRetry = isForRetry;
	}

	saveImage(image: WebcamImage) {
		this.toggleScan(false, this.isForRetry);
		this.userImage = image;
		if (this.isForRetry) {
			this.retryImage();
		}
	}

	submit() {
		const request = {
			payload: this.registerForm.value as RegisterRequest,
			data: this.formData,
		};
		this.authService
			.register(request)
			.pipe(untilDestroyed(this))
			.subscribe(response => {
				if (response.error && response.status === 404) this.handleWarning(response.error, this.authService.userId);
				else if (response.error) this.handleError(response.error);
				else this.handleSuccess(response);
			});
	}

	retryImage() {
		const fd = this.formData as FormData;
		fd.append('userId', this.authService.userId);
		this.clearAll();
		this.authService
			.uploadFile(fd)
			.pipe(untilDestroyed(this))
			.subscribe(response => {
				if (response.error && response.status === 404) this.handleWarning(response.error, this.authService.userId);
				else if (response.error) this.handleError(response.error);
				else this.handleSuccess(response);
			});
	}

	clearAll() {
		this.clearError();
		this.clearWarning();
		this.clearSuccess();
	}

	clearSuccess() {
		this.success$ = of(null);
	}

	handleWarning(errorResponse: any, userId: string) {
		this.registerForm.reset();
		this.warning$ = of(errorResponse);
	}
	handleError(errorResponse: any) {
		this.error$ = of(errorResponse);
	}
	handleSuccess(response: any) {
		this.registerForm.reset();
		this.success$ = of(response);
	}

	private get formData() {
		return (this.getControl('useFaceAsAuthMethod').value && this.userImage) || (this.isForRetry && this.userImage)
			? FileProcess.dataURLtoFormData(this.getControl('username').value, this.userImage.imageAsDataUrl)
			: undefined;
	}

	private initForm() {
		this.registerForm = this.builder.nonNullable.group({
			username: [
				null,
				{
					validators: [Validators.required],
					asyncValidators: [NameAvailabilityValidator.createValidator('username', this.authService)],
					updateOn: 'blur',
				},
			],
			email: [
				null,
				{
					validators: [Validators.required],
					asyncValidators: [NameAvailabilityValidator.createValidator('email', this.authService)],
					updateOn: 'blur',
				},
			],
			password: [null, Validators.required],
			firstName: [null, Validators.required],
			lastName: [null, Validators.required],
			useFaceAsAuthMethod: [false],
		});
	}

	getControl(prop: string): FormControl {
		return this.registerForm.controls[prop as keyof FormGroup<any>] as FormControl;
	}

	get disabled() {
		return (
			(!this.getControl('useFaceAsAuthMethod').value && !this.registerForm.valid) ||
			(this.getControl('useFaceAsAuthMethod').value && !this.userImage) ||
			this.isForRetry
		);
	}
}
