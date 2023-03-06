import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RootState } from 'src/app/core/store/root.state';
import { MustMatchValidator } from 'src/app/modules/utils/must-match.validator';
import { NameAvailabilityValidator } from 'src/app/modules/utils/name-availability.validator';
import { notEmptyStr } from 'src/app/modules/utils/not-empty-str.validator';
import { Store } from '@ngrx/store';
import { AuthService, RegisterRequest } from '../../services/auth.service';
import { clearRegisterResponse, registerAction } from '../../store/actions/register.actions';
import {
	fileUploadErrorMessage,
	fileUploadSuccessMessage,
	registerErrorMessage,
	registerSuccessMessage,
} from '../../store/selectors/auth.selectors';
import { WebcamImage } from 'ngx-webcam';
import { FileProcess } from 'src/app/core/file-process';
import { filter, map } from 'rxjs';
import { clearFileResponse, uploadFileAction } from '../../store/actions/file.actions';

@Component({
	selector: 'ktbz-register-form',
	templateUrl: './register-form.component.html',
	styleUrls: ['./register-form.component.scss'],
})
export class RegisterFormComponent implements OnInit {
	@Output()
	onFormChange = new EventEmitter<void>();

	registerForm!: FormGroup;

	faceScanActive = false;

	retryFaceScan = false;

	faceImage: WebcamImage | null = null;

	constructor(private store$: Store<RootState>, private builder: FormBuilder, private authService: AuthService) {}

	error$ = this.store$.select(registerErrorMessage);

	warning$ = this.store$.select(fileUploadErrorMessage);

	registerSuccess$ = this.store$.select(registerSuccessMessage);

	fileUploadSuccess$ = this.store$.select(fileUploadSuccessMessage);

	ngOnInit(): void {
		this.initForm();
		this.store$.dispatch(clearRegisterResponse());
		this.store$.dispatch(clearFileResponse());
	}

	toggleScanner() {
		this.faceScanActive = !this.faceScanActive;
	}

	processPhoto(image: WebcamImage) {
		this.toggleScanner();
		this.faceImage = image;
		if (this.retryFaceScan) {
			this.submitFaceImage();
		}
	}

	submitFaceImage() {
		const formData = this.imageData;
		if (formData) {
			this.store$.dispatch(uploadFileAction({ data: formData }));
		}
	}

	getControl(controlName: string): FormControl {
		return this.registerForm.controls[controlName] as FormControl;
	}

	retryFaceImageCapture() {
		this.retryFaceScan = true;
		this.toggleScanner();
	}

	submitForm() {
		const payload = this.registerForm.value as RegisterRequest & { confirmPassword?: string };
		const imageData = this.imageData;
		delete payload.confirmPassword;
		this.store$.dispatch(registerAction({ payload: payload, data: imageData }));
	}

	switchToLoginForm() {
		this.registerForm.reset();
		this.onFormChange.emit();
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
					validators: Validators.compose([Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
					asyncValidators: [NameAvailabilityValidator.createValidator('email', this.authService)],
					updateOn: 'blur',
				},
			],
			password: [null, Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(20)])],
			confirmPassword: [null, Validators.compose([Validators.required, MustMatchValidator.createValidator('password')])],
			firstName: [null, Validators.compose([Validators.required, notEmptyStr()])],
			lastName: [null, Validators.compose([Validators.required, notEmptyStr()])],
			useFaceAsAuthMethod: [false, Validators.required],
		});
	}

	get imageData() {
		return (this.getControl('useFaceAsAuthMethod').value && this.faceImage) || (this.retryFaceScan && this.faceImage)
			? FileProcess.dataURLtoFormData(this.getControl('username').value, this.faceImage.imageAsDataUrl)
			: undefined;
	}
}
