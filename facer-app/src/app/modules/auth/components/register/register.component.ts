import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
import { untilDestroyed } from '@ngneat/until-destroy';
import { WebcamImage } from 'ngx-webcam';
import { filter } from 'rxjs';
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

	error$ = this.errorService.getNamespaceError('register');

	successMessage: string | null = null;

	scanEnabled = false;

	userImage!: WebcamImage;

	registerForm!: FormGroup;

	get useFace() {
		return this.getControl('useFaceAsAuthMethod').value;
	}

	constructor(private builder: FormBuilder, private authService: AuthService, private errorService: HttpErrorService) {}

	close() {
		this.onClose.emit();
		this.clearError();
	}

	clearError() {
		this.errorService.removeError('register');
	}

	ngOnInit(): void {
		this.initForm();
	}

	toggleScan(value: boolean) {
		this.scanEnabled = value;
	}

	saveImage(image: WebcamImage) {
		this.toggleScan(false);
		this.userImage = image;
	}

	submit() {
		const payload = this.registerForm.value as RegisterRequest;
		if (payload.useFaceAsAuthMethod && this.userImage) {
			const formData = FileProcess.dataURLtoFormData(payload.username as string, this.userImage.imageAsDataUrl);
		}

		this.authService
			.register({ payload: payload })
			.pipe(untilDestroyed(this), filter(notUndefined))
			.subscribe(response => {
				this.registerForm.reset();
				this.successMessage = 'Registered with success';
			});
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
}
