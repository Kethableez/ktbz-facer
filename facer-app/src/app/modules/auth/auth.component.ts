import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { tap } from 'rxjs';
import { AuthService } from './services/auth.service';

@Component({
	selector: 'ktbz-auth',
	templateUrl: './auth.component.html',
	styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
	constructor(private authService: AuthService, private builder: FormBuilder) {}

	dummyForm = this.builder.group({
		username: ['', Validators.required],
		password: ['', Validators.required],
	});

	dummyRegisterForm = this.builder.group({
		username: ['', Validators.required],
		email: ['', Validators.required],
		firstName: ['', Validators.required],
		lastName: ['', Validators.required],
		password: ['', Validators.required],
		useFace: ['', Validators.required],
	});

	dummyFaceIdForm = this.builder.group({
		model: [null, Validators.required],
	});

	isFormOpened = true;
	selectedForm = 'login';

	select(action: string) {
		this.isFormOpened = true;
		this.selectedForm = action;
	}

	closeForms() {
		this.isFormOpened = false;
	}
}
