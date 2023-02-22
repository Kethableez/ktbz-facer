import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { WebcamImage } from 'ngx-webcam';

@Component({
	selector: 'ktbz-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
	@Output()
	onClose = new EventEmitter<void>();

	constructor(private builder: FormBuilder) {}

	scanEnabled = false;

	userImage!: WebcamImage;

	registerForm = this.builder.group({
		username: ['', Validators.required],
		email: ['', Validators.required],
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
}
