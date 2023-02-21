import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
	selector: 'ktbz-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
	@Output()
	onClose = new EventEmitter<void>();

	constructor(private builder: FormBuilder) {}

	standardLoginForm = this.builder.group({
		username: ['', Validators.required],
		password: ['', Validators.required],
	});

	close() {
		this.onClose.emit();
	}

	ngOnInit(): void {}
}
