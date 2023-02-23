import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { WebcamImage } from 'ngx-webcam';
import { FileProcess } from 'src/app/core/file-process';
import { NameAvailabilityValidator } from 'src/app/modules/utils/name-availability.validator';
import { AuthService } from '../../services/auth.service';

@Component({
	selector: 'ktbz-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
	@Output()
	onClose = new EventEmitter<void>();

	constructor(private builder: FormBuilder, private authService: AuthService) {}

	scanEnabled = false;

	userImage!: WebcamImage;

	registerForm = this.builder.nonNullable.group({
		username: [
			'',
			{
				validators: [Validators.required],
				asyncValidators: [NameAvailabilityValidator.createValidator('username', this.authService)],
				updateOn: 'blur',
			},
		],
		email: [
			'',
			{
				validators: [Validators.required],
				asyncValidators: [NameAvailabilityValidator.createValidator('email', this.authService)],
				updateOn: 'blur',
			},
		],
		password: ['', Validators.required],
		firstName: ['', Validators.required],
		lastName: ['', Validators.required],
		useFace: [false],
	});

	close() {
		this.onClose.emit();
	}

	get useFace() {
		return this.registerForm.controls.useFace.value;
	}

	ngOnInit(): void {}

	toggleScan(value: boolean) {
		this.scanEnabled = value;
	}

	saveImage(image: WebcamImage) {
		this.toggleScan(false);
		this.userImage = image;
	}

	submit() {
		const payload = { ...this.registerForm.value };
		if (payload.useFace && this.userImage) {
			const formData = FileProcess.dataURLtoFormData(payload.username as string, this.userImage.imageAsDataUrl);
			console.log({ payload: payload, imageData: formData });
		}

		console.log({ payload: payload });
	}
}
